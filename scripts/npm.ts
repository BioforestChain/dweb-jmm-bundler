import { build, emptyDir, EntryPoint, LibName, type BuildOptions } from "https://deno.land/x/dnt@0.31.0/mod.ts";
import npmConfig from "./npm.json" assert { type: "json" };

const entryPoints: EntryPoint[] = [];
// 适配入口不是index的情况
let entry = `${npmConfig.buildFromRootDir}/index.ts`;
if (npmConfig.buildFromRootDir.includes(".ts")) {
  entry = npmConfig.buildFromRootDir;
}
entryPoints.push({
  name: npmConfig.mainExports,
  path: entry,
});

export const buildOptions: BuildOptions = {
  entryPoints: [
    {
      kind: "bin",
      name: "bfex",
      path: "./bin/bfsa.cmd.ts",
    },
  ],
  entryPoints: entryPoints,
  outDir: npmConfig.buildToRootDir,
  typeCheck: true,
  scriptModule: false,
  shims: {
    deno: "dev",
  },
  compilerOptions: {
    target: "Latest",
    importHelpers: true,
    // isolatedModules: false,
  },
  packageManager: "yarn",
  package: {
    name: npmConfig.name,
    version: npmConfig.version,
    description: npmConfig.description,
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/BioforestChain/dweb_bundle.git",
    },
    bugs: {
      url: "https://github.com/BioforestChain/dweb_bundle/issues",
    },
    devDependencies: {
      // "@types/node": "latest",
      "@types/tar": "^6.1.3",
      "@types/inquirer": "^9.0.2",
    },
  },
};

if (import.meta.main) {
  emptyDir("./.npm");
  await build(buildOptions);
  await Deno.copyFile("./LICENSE", "./.npm/LICENSE");
  await Deno.copyFile("./README.md", "./.npm/README.md");
}
