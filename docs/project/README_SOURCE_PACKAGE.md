# 御水飞行源码与静态资源交接包

这个包用于交给开发者继续处理，包含项目源码、配置文件、资料文档，以及已经展开到 `public/` 下的静态资源。

## 包含内容

- `src/`：Next.js 页面、本地复刻组件、SEO 内容和素材代理
- `public/`：运行页面需要的静态文件，包含本地图片视频模型、OSS 缓存素材、Draco 3D 解码资源
- `docs/references/`：项目资料文档和已采集资源 URL 记录
- `package.json` / `package-lock.json`：依赖与脚本
- `next.config.ts` / `tsconfig.json` / `eslint.config.mjs`：项目配置

## 未包含内容

- `.git/`
- `node_modules/`
- `.next/`
- `release/`
- 浏览器验证截图目录

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

默认访问：

```text
http://localhost:3000
```

生产构建：

```bash
npm run build
npm run start
```

## 静态资源说明

当前页面由 `src/components/fly-h2o-site.tsx` 本地渲染，不再加载原官网前端包。首页按官网公开页面的模块结构本地复刻：首屏视频、Y-5 视频段、智能方向盘段、实拍航行卡片、产品卡和 App 图库均由本地 React/CSS 生成。

`/fly-h2o-oss/*` 会先读取 `public/fly-h2o-oss`，本地没有时再尝试读取 OSS 素材；`/app-api/*` 暂时关闭，不连接登录或业务接口。

GitHub 仓库不提交 `public/fly-h2o-assets`、`public/fly-h2o-oss` 和官网参考抓取缓存。运行时会通过同源路由代理回源到 `https://www.fly-h2o.cn/assets/*` 与 `https://oss.fly-h2o.cn/*`，本地缓存目录仍可按需放回用于离线开发。

最新参考入口抓取在 `docs/references/fly-h2o-official-reference-20260523/`，仅作为视觉对照资料，不作为运行入口。
