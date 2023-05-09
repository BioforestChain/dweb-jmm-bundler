
import { JsonStringifyStream, fs, path, readableStreamFromIterable } from "../../deps.ts";
import { $BFSMetaData } from "../types/metadata.type.ts";
const { existsSync }  = fs;


export async function createFile(fileName:string,obj:$BFSMetaData){
  const file = await Deno.open(fileName, { create: true, write: true });

readableStreamFromIterable([obj])
  .pipeThrough(new JsonStringifyStream()) // convert to JSON lines (ndjson)
  .pipeThrough(new TextEncoderStream()) // convert a string to a Uint8Array
  .pipeTo(file.writable)
  .then(() => console.log("write success"));
}

/**
 * 创建打包目录
 * @param bfsAppId 应用appid，未来该数据需要从链上申请，所以格式需要保持一致：
 *                 长度为7+1（校验位）的大写英文字母或数字（链就是系统的“证书颁发机构”，
 *                 资深用户可以配置不同的的链来安装那些未知来源的应用）
 * @returns {boolean}
 */
export async function createBfsaDir(bfsAppId: string): Promise<string> {
  const root = Deno.cwd();

  try {
    const destPath = path.join(root, bfsAppId);

    if (existsSync(destPath)) {
      await Deno.remove(destPath, { recursive: true });
    }
    const mkdir = Deno.mkdir;
    // 创建bfsAppId目录
    await mkdir(destPath, { recursive: true });
    await mkdir(path.join(destPath, "boot"));
    await mkdir(path.join(destPath, "sys"));
    await mkdir(path.join(destPath, "tmp"));
    await mkdir(path.join(destPath, "home"));
    await mkdir(path.join(destPath, "usr"));

    return destPath;
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
  await loopSearchFile(src, nameReg);

  async function loopSearchFile(src: string, nameReg: RegExp) {
    if (!searchPath) {
      const entries = Deno.readDir(src);

      for await (const entry of entries) {
        const filePath = path.join(src, entry.name!);
        if (nameReg.test(entry.name!) && entry.isFile) {
          searchPath = filePath;
          break;
        } else if (entry.isDirectory && entry.name === "node_modules") {
          await loopSearchFile(filePath, nameReg);
        }
      }
    }

    return;
  }

  return searchPath;
}

/**
 * 复制目录
 * @param src  源目录
 * @param dest 目标目录
 */
export async function copyDir(src: string, dest: string) {
  const entries = Deno.readDir(src);

  if (!existsSync(dest)) {
    await Deno.mkdir(dest);
  }

  for await (const entry of entries) {
    const srcPath = path.join(src, entry.name!);
    const destPath = path.join(dest, entry.name!);

    if (entry.isDirectory) {
      // 排除node_modules
      if (entry.name !== "node_modules") {
        await copyDir(srcPath, destPath);
      }
    } else {
      await Deno.copyFile(srcPath, destPath);
    }
  }
}
