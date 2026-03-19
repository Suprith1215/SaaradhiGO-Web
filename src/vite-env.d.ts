/// <reference types="vite/client" />

declare module "*.png" {
  const v1: any;
  export default v1;
}
declare module "*.jpg" {
  const v2: any;
  export default v2;
}
declare module "*.svg" {
  const v3: any;
  export default v3;
}
declare module "figma:asset/*" {
  const v4: any;
  export default v4;
}
