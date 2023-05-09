import { fs, prompt,Checkbox,Input, path } from "../../deps.ts";

const { existsSync } = fs;

/**
 * 打包项目问题流程
 * @returns
 */
export async function bundleProblemsFlow() {
  const selectAnswer = await prompt([
    {
      type: Checkbox,
      name: "options",
      message: "请选择创建类型",
      options:["直接读取我创建的配置文件","手动输入"],
    },
  ]);

  let frontPath = "";
  if (selectAnswer.options) {
    frontPath = await promptInputFrontPath();
  }

  // const backPath = await promptInputBackPath();
  return {
    frontPath,
    // backPath,
    // bfsAppId,
  };
}

/**
 * 交互获取前端项目地址
 * @returns
 */
async function promptInputFrontPath() {
  let frontPath = "";
  do {
    const frontAnswer = await prompt([
      {
        type: Input,
        name: "frontPath",
        message: `请输入前端项目地址: `,
      },
    ]);

    if (!frontAnswer.frontPath) {
      console.error(`未输入前端项目地址`);
      continue;
    }

    const _frontPath = path.resolve(Deno.cwd(), frontAnswer.frontPath);
    if (!existsSync(_frontPath)) {
      console.error(`输入的前端项目地址未找到: ${_frontPath}`);
      continue;
    }

    frontPath = _frontPath;
  } while (!frontPath);

  return frontPath;
}

// /**
//  * 交互获取后端项目地址
//  * @returns
//  */
// async function promptInputBackPath() {
//   let backPath = "";
//   do {
//     const backAnswer = await inquirer.prompt([
//       {
//         type: "input",
//         name: "backPath",
//         message: `请输入后端项目地址: `,
//       },
//     ]);

//     if (!backAnswer.backPath) {
//       console.error(`未输入后端项目地址`);
//       continue;
//     }

//     const _backPath = path.resolve(Deno.cwd(), backAnswer.backPath);
//     if (!existsSync(_backPath)) {
//       console.error(`输入的后端项目地址未找到: ${_backPath}`);
//       continue;
//     }

//     backPath = _backPath;
//   } while (!backPath);

//   return backPath;
// }

