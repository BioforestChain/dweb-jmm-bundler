import { path, tar } from "../../deps.ts";

/**
 * 压缩目录为bfsa后缀
 * @param dest     压缩文件目录
 * @param bfsAppId 应用id
 */
export async function compressToSuffixesBfsa(dest: string, bfsAppId: string) {
  const cwd = path.resolve(dest, "../");

  await tar.compress(cwd,`${bfsAppId}.bfsa`,);
}

/**
 * 解压
 * @param file 压缩包名
 * @param dest 目标地址
 */
export async function uncompressBfsa(file: string, dest: string) {
  await tar.uncompress(file,dest);
}
