import { Command } from "../../deps.ts";
import npmConfig from "../../scripts/npm.json" assert { type: "json" };
import { bundle } from '../cmd/bundle.ts';
import { bundleProblemsFlow } from "../utils/problem.ts";

const program = new Command();
// 打包application为.bfsa到指定位置
program
  .command("bundle")
  .description(npmConfig.description)
  .version(npmConfig.version)
  // 无界面应用必须包含后端
  // .requiredOption("-b, --back-path <string>", "backend application path.")
  .option("-f, --front-path <string>", "frontend application path.")
  .option(
    "-p, --path <string>",
    "path: configuration file bfs-metadata.json address."
  )
  .action(async (options, ..._args) => {
    const frontPath = options.frontPath ?? Deno.cwd();
    await bundle({
      frontPath:frontPath,
      metaPath:options.path
    })
  })

// 使用交互模式
program
  .command("interactive")
  .description("bfsa bundle project to .bfsa by interactive command line")
  .action(async () => {
    const problemConfig = await bundleProblemsFlow();
    await bundle(problemConfig);
  }).parse(Deno.args);
