import { fs, path } from "../../deps.ts";
import { $BFSMetaData } from "../types/metadata.type.ts";

export async function createFile(fileName: string, obj: $BFSMetaData) {
  const file = await Deno.open(fileName, {
    create: true,
    write: true,
    truncate: true,
  });
  await file.write(new TextEncoder().encode(JSON.stringify(obj, null, 2)));
  file.close();
}

/**
 * 创建打包目录
 * @param bfsAppId 应用appid，必须在当前的https域名下
 *  * @returns {boolean}
 */
export async function createBfsaDir(
  destPath: string,
  bfsAppId: string
): Promise<string> {
  try {
    const temporaryPath = path.join(destPath, bfsAppId);
    await fs.emptyDir(temporaryPath);

    const mkdir = Deno.mkdir;
    // 创建bfsApp目录
    await mkdir(temporaryPath, { recursive: true });
    await mkdir(path.join(temporaryPath, "boot"));
    await mkdir(path.join(temporaryPath, "sys/bfs_worker"), { recursive: true });
    await mkdir(path.join(temporaryPath, "tmp"));
    await mkdir(path.join(temporaryPath, "home"));
    await mkdir(path.join(temporaryPath, "usr"));

    return temporaryPath;
  } catch (ex) {
    throw Error(ex.message);
  }
}

/**
 * 搜索文件获取地址
 * @param src     搜索文件路径
 * @param nameReg 搜索文件正则
 * @returns
 */
export async function searchFile(
  src: string,
  nameReg: RegExp
): Promise<string> {
  let searchPath = "";
  await catchFunctionType(loopSearchFile, src, nameReg);
  async function loopSearchFile(src: string, nameReg: RegExp) {
    const entries = Deno.readDir(src);
    for await (const entry of entries) {
      const filePath = path.join(src, entry.name!);
      if (nameReg.test(entry.name!) && entry.isFile) {
        searchPath = filePath;
        return searchPath;
      } else if (entry.isDirectory && entry.name !== "node_modules") {
        await loopSearchFile(filePath, nameReg);
      }
    }
  }

  return searchPath;
}

/**
 * 复制目录
 * @param src  源目录
 * @param dest 目标目录
 */
export async function copyDir(src: string, dest: string) {
  await fs.copy(src, dest,{overwrite:true});
}

/**
 * 捕获文件不存在的错误
 * @param fun
 * @param args
 * @returns
 */
export const catchFunctionType = async <R>(
  // deno-lint-ignore no-explicit-any
  fun: (...args: any) => R,
  // deno-lint-ignore no-explicit-any
  ...args: any
) => {
  try {
    return await fun(...args);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw `传递的文件夹不存在，请检查路径：${error.message}`;
    }
    throw error;
  }
};

/**
 * file/// 路径转化为
 * @param filePath 
 */
export const filePathToUrl = (url:string) => {
  const isWindows = Deno.build.os === "windows";
  const fileUrl = new URL(url);
  let filePath = isWindows
    ? fileUrl.pathname.substring(1).replace(/\//g, "\\")
    : fileUrl.pathname;
  if (isWindows && filePath.indexOf(":") !== -1) {
    // Remove leading slash on Windows drive letter paths
    filePath = filePath.substring(1);
  }
  return decodeURIComponent(filePath);
}