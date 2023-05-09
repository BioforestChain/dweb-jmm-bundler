import { EntryPoint, LibName, build, emptyDir, type BuildOptions } from "https://deno.land/x/dnt@0.34.0/mod.ts";
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
  entryPoints: entryPoints,
  outDir: npmConfig.buildToRootDir,
  typeCheck: true,
  scriptModule: false,
  shims: {
    deno: true,
    blob:true
  },
  compilerOptions: {
    target: "ES2020",
    importHelpers: true,
    emitDecoratorMetadata: true,
    lib: npmConfig.lib as LibName[],
  },
  packageManager: "npm",
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
    },
  },
};

if (import.meta.main) {
  emptyDir(npmConfig.buildToRootDir);
  await build(buildOptions);
  await Deno.copyFile("./LICENSE", `${npmConfig.buildToRootDir}/LICENSE`);
  await Deno.copyFile("./README.md", `${npmConfig.buildToRootDir}/README.md`);
}
