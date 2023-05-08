import { Command, path } from "../../deps.ts";
import npmConfig from "../../scripts/npm.json" assert { type: "json" };
import { cmdOptions } from '../types/cmd.type.ts';
import { bundleProblemsFlow } from "../utils/problem.ts";

const program = new Command();
program
  .name("bfex")
  .description(npmConfig.description)
  .version(npmConfig.version);

// 打包application为.bfsa到指定位置
program
  .command("bundle")
  .description("bfex bundle project to .bfsa")
  // 无界面应用必须包含后端
  .requiredOption("-b, --back-path <string>", "backend application path.")
  .option("-f, --front-path <string>", "frontend application path.")
  .option(
    "-i, --bfs-appid <string>",
    "bfsAppId: app unique identification，new app ignore."
  )
  .action(async (options: cmdOptions) => {
    
  });

// 使用交互模式
program
  .command("interactive")
  .description("bfsa bundle project to .bfsa by interactive command line")
  .action(async () => {
    const problemConfig = await bundleProblemsFlow();
    // await bundle(problemConfig);
  });

  const argv = [
    Deno.execPath(),
    path.fromFileUrl(Deno.mainModule),
    ...Deno.args,
 ]

program.parse(argv);
