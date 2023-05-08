import { path } from "../../deps.ts";
import { compressToSuffixesBfsa } from "../utils/compress.ts";

import { BFSMetaData } from "../types/metadata.type.ts";
import type { IProblemConfig } from "../types/problem.type.ts";
import { copyDir, createBfsaDir } from "../utils/file.ts";
import { appendForwardSlash } from "../utils/path.ts";


/**
 * 打包入口
 * @param options
 */
export async function bundle(options: IProblemConfig) {
  const { manifest } = options;
  const bfsAppId = `${manifest.name}.${manifest.host}.dweb`

  const destPath = await createBfsaDir(bfsAppId);

  // 将前端项目移动到sys目录 (无界面应用不包含前端)
  const sysPath = path.join(destPath, "sys");
  let frontPath = options.frontPath;
  if (frontPath) {
    frontPath = appendForwardSlash(path.resolve(Deno.cwd(), frontPath));
    await copyDir(frontPath, sysPath);
  }

  // TODO 将后端项目编译到sys目录
  // const backPath = appendForwardSlash(
  //   path.resolve(Deno.cwd(), options.backPath)
  // );
  const metadata =  createBfsaMetaData();
  // 配置文件写入boot目录
  const bootPath = path.join(destPath, "boot");
  await writeConfigJson(bootPath, metadata);

  // 对文件进行压缩
  await compressToSuffixesBfsa(destPath, bfsAppId);

  // 压缩完成，删除目录
  await Deno.remove(destPath, { recursive: true });

  // 生成bfs-metadata.json


  console.log("bundle bfsa application done!!!");
}




/**
 * 获取bfsa-metadata.json文件的数据
 * @param bootPath boot目录
 * @returns
 */
 function createBfsaMetaData(
) {
  const root = Deno.cwd();



  const _metadata: BFSMetaData = {
    id: "",
    server: {
      root: "file:///bundle",
      entry: "/cotDemo.worker.js" // 后端未开放先固定
    },
    title: "",
    subtitle: "",
    icon: "",
    downloadUrl: "",
    images: [],
    introduction: "",
    splashScreen: {
      entry:""
    },
    author: [],
    version: "",
    keywords: [],
    home: "",
    size: "",
    fileHash: "",
    plugins: [],
    releaseDate: "",
    staticWebServers: [],
    openWebViewList: []
};
  return _metadata;
}

/**
 * 在boot目录写入bfs-metadata.json和link.json
 * @param bootPath boot目录
 * @param bfsAppId 应用id
 * @param metadata bfs-metadata数据
 * @returns
 */
async function writeConfigJson(
  bootPath: string,
  metadata: BFSMetaData
) {
  // bfsa-metadata.json

  // // 文件列表生成校验码
  // const destPath = path.resolve(bootPath, "../");
  // const filesList = await fileListHash(
  //   destPath,
  //   bfsAppId,
  //   [] 
  // );

  // // link.json
  // const linkJson = await genLinkJson(bfsAppId, metadata, filesList);
  // await writeFile(
  //   path.join(bootPath, "link.json"),
  //   JSON.stringify(linkJson),
  //   "utf-8"
  // );

  // return;
}

// /**
//  * 生成link.json
//  * @param bfsAppId  应用id
//  * @param metadata  bfs-metadata数据
//  * @param filesList 文件列表
//  * @returns
//  */
// function genLinkJson(
//   bfsAppId: string,
//   metadata: BFSMetaData,
//   filesList: Files[]
// ): LinkMetadata {
//   const { manifest } = metadata;

//   // 最大缓存时间，一般6小时更新一次。最快不能快于1分钟，否则按1分钟算。
//   const maxAge = manifest.maxAge
//     ? manifest.maxAge < 1
//       ? 1
//       : manifest.maxAge
//     : 6 * 60;

//   const linkJson: LinkMetadata = {
//     version: manifest.version,
//     bfsAppId: bfsAppId,
//     name: manifest.name,
//     icon: manifest.icon,
//     author: manifest.author || [],
//     autoUpdate: {
//       maxAge: maxAge,
//       provider: 1,
//       url: `https://shop.plaoc.com/${bfsAppId}/appversion.json`,
//       version: manifest.version,
//       files: filesList,
//       releaseNotes: manifest.releaseNotes || "",
//       releaseName: manifest.releaseName || "",
//       releaseDate: manifest.releaseDate || "",
//     },
//   };

//   return linkJson;
// }

// /**
//  * 生成appversion.json
//  * @param bfsAppId 应用id
//  * @param metadata 应用配置信息
//  * @param destPath 应用目录
//  * @returns
//  */
// async function genAppVersionJson(
//   bfsAppId: string,
//   metadata: BFSMetaData,
//   destPath: string
// ) {
//   const { manifest } = metadata;
//   const compressFile = path.resolve(destPath, `../${bfsAppId}.bfsa`);
//   const fileStat = await stat(compressFile);
//   const fileHash = await checksumFile(compressFile, "sha512", "hex");

//   const appVersionJson: IAppversion = {
//     data: {
//       version: manifest.version,
//       name: manifest.name,
//       icon: manifest.icon,
//       files: [
//         {
//           url: `https://shop.plaoc.com/${bfsAppId}/${bfsAppId}.bfsa`,
//           size: fileStat.size,
//           sha512: fileHash,
//         },
//       ],
//       releaseNotes: manifest.releaseNotes || "",
//       releaseName: manifest.releaseName || "",
//       releaseDate: manifest.releaseDate || "",
//     },
//     errorCode: 0,
//     errorMsg: "success",
//   };

//   await writeFile(
//     path.resolve(destPath, "../appversion.json"),
//     JSON.stringify(appVersionJson, null, 2),
//     "utf-8"
//   );

//   return;
// }

// /**
//  * 为文件列表生成sha512校验码
//  * @param dest        查找目录
//  * @param bfsAppId    应用id
//  * @param filesList   文件列表hash
//  * @returns
//  */
// async function fileListHash(
//   dest: string,
//   bfsAppId: string,
//   filesList: Files[]
// ): Promise<Files[]> {
//   const entries =  readDir(dest);

//   for await (const entry of entries) {
//     const filePath = path.join(dest, entry.name!);

//     if (entry.isFile) {
//       const fileStat = await stat(filePath);
//       const fileHash = await checksumFile(filePath, "sha512", "hex");
//       const file = {
//         url: `https://shop.plaoc.com/${bfsAppId}${slash(
//           filePath.slice(filePath.lastIndexOf(bfsAppId) + bfsAppId.length)
//         )}`,
//         size: fileStat.size,
//         sha512: fileHash,
//       };

//       filesList.push(file);
//     } else if (entry.isDirectory) {
//       await fileListHash(filePath, bfsAppId, filesList);
//     }
//   }

//   return filesList;
// }

// /**
//  * 查找后端项目路口文件
//  * @param backPath 后端项目地址
//  * @returns
//  */
// async function findBackEntryFile(backPath: string) {
//   const packageJsonPath = await searchFile(backPath, /package.json/);
//   const jsonPath = pathToFileURL(packageJsonPath);
//   const jsonConfig = (await import(jsonPath.href, { assert: { type: "json" } }))
//     .default;
//   const backDir = path.dirname(packageJsonPath);
//   const rootPath = path.resolve(backPath, "../");
//   let entryFile = "";

//   if (jsonConfig.main) {
//     entryFile = path.resolve(rootPath, path.resolve(backDir, jsonConfig.main));
//   } else if (jsonConfig.module) {
//     entryFile = path.resolve(
//       rootPath,
//       path.resolve(backDir, jsonConfig.module)
//     );
//   } else if (jsonConfig.exports?.["."]?.import) {
//     const entry =
//       typeof jsonConfig.exports["."].import === "string"
//         ? jsonConfig.exports["."].import
//         : jsonConfig.exports["."].import.default;
//     entryFile = path.resolve(rootPath, path.resolve(backDir, entry));
//   }

//   return entryFile;
// }

