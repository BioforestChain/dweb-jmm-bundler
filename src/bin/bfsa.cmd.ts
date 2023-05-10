import { Input, Toggle, path } from "../../deps.ts";
import { bundle } from "../cmd/bundle.ts";

// const program = new Command();
//TODO 命令行模式 打包application为.bfsa到指定位置
// program
//   .command("bfex")
//   .description(npmConfig.description)
//   .version(npmConfig.version)
//   // 无界面应用必须包含后端
//   // .requiredOption("-b, --back-path <string>", "backend application path.")
//   .option("-f, --front-path <string>", "frontend application path.")
//   .option(
//     "-p, --path <string>",
//     "path: configuration file bfs-metadata.json address."
//   )
//   .action(async (options, ..._args) => {
//     const frontPath = options.frontPath ?? Deno.cwd();
//     await bundle({
//       frontPath:frontPath,
//       metaPath:options.path
//     })
//   }).parse(Deno.args);

// 使用交互模式
const interactFactory = async () => {
  const isCwd = await Toggle.prompt("项目是否在当前地址?");
  let destPath = Deno.cwd();
  // 如果不在当前地址，需要让用户输入地址
  if (!isCwd) {
    destPath =  await Input.prompt("请输入项目地址: ");
  }

  let frontBuildPath =  await Input.prompt("请输入前端打包目录：");
  frontBuildPath = path.resolve(destPath,frontBuildPath);
  await bundle({
    destPath,
    frontBuildPath
  })
}

interactFactory()
