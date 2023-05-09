import { Tar, Untar, copy, fs, path } from "../../deps.ts";

/**
 * 压缩目录为bfsa后缀
 * @param dest     压缩文件目录
 * @param bfsAppId 应用id
 */
export async function compressToSuffixesBfsa(dest: string, bfsAppId: string) {
const cwd = path.resolve(dest, "../");
const tar = new Tar();
loopTarFile(cwd)
async function loopTarFile(src: string) {
    const entries = Deno.readDir(cwd);
    for await (const entry of entries) {
      const filePath = path.join(src, entry.name!);
      if (entry.isFile) {
        tar.append(entry.name,{
          filePath:`${src}/${entry.isFile}`
        })
        break;
      } 
      if (entry.isDirectory) {
        await loopTarFile(filePath);
      }
    }
}
  // use tar.getReader() to read the contents.
const writer = await Deno.open(`${bfsAppId}.bfsa`, { write: true, create: true });
await copy(tar.getReader(), writer);
writer.close();
return path.resolve(cwd,`${bfsAppId}.bfsa`)
}

/**
 * 解压
 * @param file 压缩包名
 * @param dest 目标地址
 */
export async function uncompressBfsa(file: string) {
  const reader = await Deno.open(file, { read: true });
  const untar = new Untar(reader);
  
  for await (const entry of untar) {
    console.log(entry); // metadata
  
    if (entry.type === "directory") {
      await fs.ensureDir(entry.fileName);
      continue;
    }
  
    await fs.ensureFile(entry.fileName);
    const file = await Deno.open(entry.fileName, { write: true });
    // <entry> is a reader.
    await copy(entry, file);
  }
  reader.close();
}
