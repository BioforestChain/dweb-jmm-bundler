import { EntryPoint, LibName, build, emptyDir, type BuildOptions } from "https://deno.land/x/dnt@0.34.0/mod.ts";
import npmConfig from "./npm.json" assert { type: "json" };

const entryPoints: EntryPoint[] = [];

entryPoints.push({
  kind: "bin",
  name: npmConfig.commandName,
  path:npmConfig.buildFromRootDir
});

export const buildOptions: BuildOptions = {
  entryPoints: entryPoints,
  outDir: npmConfig.buildToRootDir,
  typeCheck: true,
  scriptModule: false,
  shims: {
    deno: true,
    // custom: [{
    //   module: "./shims/stdout.ts",
    //   globalNames: ["Deno.stdout"],
    // }]
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
      // "@types/tar": "^6.1.3",
    },
  },
};

if (import.meta.main) {
  emptyDir(npmConfig.buildToRootDir);
  await build(buildOptions);
  await Deno.copyFile("./LICENSE", `${npmConfig.buildToRootDir}/LICENSE`);
  await Deno.copyFile("./README.md", `${npmConfig.buildToRootDir}/README.md`);
}
