export const doPub = async (cwd: string) => {
  const command = new Deno.Command("npm publish --access public", {
    cwd,
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });
  const child = command.spawn();

  // open a file and pipe the subprocess output to it.
  child.stdout.pipeTo(Deno.openSync("output").writable);

  // manually close stdin
  child.stdin.close();
  const status = await child.status;
  return status.success;
};

export const doPubFromJson = async (inputConfigFile: string) => {
  const npmConfigs = (
    await import(inputConfigFile, { assert: { type: "json" } })
  ).default;

  await doPub(npmConfigs.outDir);
};

if (import.meta.main) {
  await doPubFromJson(import.meta.resolve("./npm.json"));
}
