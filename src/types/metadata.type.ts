import { $MMID } from "./problem.type.ts";

export interface $IAppversion {
  data: {
    version: string;
    icon: string;
    name: string;
    files: File[];
    releaseNotes: string;
    releaseName: string;
    releaseDate: string;
  };
  errorCode: number;
  errorMsg: string;
}

export interface $UserMetadata {
  name:string;
  subName:string; 
  version: string; // 应用版本
  introduction: string; // 应用描述
  author: string[]; // 开发者，作者
  icon: string; // 应用图标
  images: string[]; // 应用截图
  keywords: string[]; // 关键词
  home: string; // 首页地址
  downloadUrl:string; // 下载应用地址
}



export interface $BFSMetaData {
  id: $MMID;
  server: $MainServer; // 打开应用地址
  title: string; // 应用名称
  subtitle: string; // 应用副标题
  icon: string; // 应用图标
  downloadUrl: string; // 下载应用地址
  images: string[]; // 应用截图
  introduction: string; // 应用描述
  splashScreen: $SplashScreen;
  author: string[]; // 开发者，作者
  version: string; // 应用版本
  keywords: string[]; // 关键词
  home: string; // 首页地址
  size: number; // 应用大小
  fileHash: string;
  plugins: string[];
  releaseDate: Date | null; // 发布时间
  /**
   * 静态网络服务
   */
  staticWebServers: $StaticWebServer[];
  /**
   * 应用启动时会打开的网页
   * 要求 http/https 协议。
   * 它们会依此打开，越往后的层级越高
   *
   * TODO httpNMM 网关那边，遇到未知的请求，会等待一段时间，如果这段时间内这个域名被监听了，那么会将请求分发过去
   * 所以如果是 staticWebServers 定义的链接，那么自然而然地，页面会等到 staticWebServer 启动后得到响应，不会错过请求。
   */
  openWebViewList: $OpenWebView[];
}

interface $MainServer {
  /**
   * 应用文件夹的目录
   */
  root: string;
  /**
   * 入口文件
   */
  entry: string;
}

interface $StaticWebServer {
  /**
   * 应用文件夹的目录
   */
  root: string;
  /**
   * 入口文件
   */
  entry: string;
  subdomain: string;
  port: number;
}

interface $OpenWebView {
  url: string;
}
interface $SplashScreen {
  entry: string;
}

// {
//   "data": {
//     "version": "",
//     "icon": "",
//     "name": "",
//     "files": [
//       {
//         "url": "",
//         "size": 0,
//         "sha512": ""
//       }
//     ],
//     "releaseNotes": "",
//     "releaseName": "",
//     "releaseDate": ""
//   },
//   "errorCode": 0,
//   "errorMsg": "success"
// }
