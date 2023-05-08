export interface IProblemConfig {
  frontPath: string; // 前端路径
  // backPath: string; // 后端路径 未开放
  manifest: IManifest
}

export type $HTTPS = `https://${string}`;
export type $MMID = `${string}.dweb`;

export interface IManifest {
  host: string, // 域名地址，要求https
  name: string // app名称
}