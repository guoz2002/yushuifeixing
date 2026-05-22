# Fly H2O 官网素材采集

来源：[https://www.fly-h2o.cn/](https://www.fly-h2o.cn/)  
采集时间：2026-05-21/22，公开静态资源采集；未绕过登录、权限或接口限制。

## 目录

- `mirror/`：`www.fly-h2o.cn` 同源资源镜像，包含图片、视频、CSS、JS、字体、模型贴图。
- `external/oss.fly-h2o.cn/`：官网代码引用的公开 OSS 资源，包含大视频和 GLB 模型。
- `external/oss.test.fly-h2o.cn/`：官网代码里保留的测试 OSS 示例图。
- `raw/`：入口 HTML/CSS/JS 的首轮原始下载。
- `screenshots/`：官网视觉截图。
- `manifests/asset-manifest.json`：资源发现结果，包含有效、无效、已存在的地址状态。
- `manifests/local-file-index.json`：本地真实文件索引。
- `invalid/html-fallback/`：官网返回 HTML 兜底页的伪资源，已从有效素材区隔离。
- `tools/scrape-assets.mjs`：可重跑的公开资源采集脚本。

## 本地素材概览

有效落盘文件：589 个，约 996 MB。

- 视频：42 个 `.mp4`
- 3D/模型：4 个 `.glb`、1 个 `.obj`
- 环境/材质：8 个 `.exr`、1 个 `.hdr`
- 图片：171 个 `.jpeg`、62 个 `.jpg/JPG`、166 个 `.png`、1 个 `.gif`、2 个 `.svg`
- 样式/前端：38 个 `.css`、86 个 `.js`
- 字体：MiSans、Inter/Tinos、Boxicons 相关字体文件

## 关键 3D 资产

- `external/oss.fly-h2o.cn/20260408/model_1775638905967.glb`：14.5 MB
- `mirror/assets/models/model-C4L7tzYu.glb`：14.5 MB
- `mirror/assets/models/model_h1-Bc4HsqGF.glb`：49.7 MB
- `mirror/assets/models/stage-5zHomEVe.glb`：1.2 MB
- `mirror/assets/1234-ghjrWyB-.obj`：115 MB
- `mirror/assets/models/T_CarbonFiber_*.EXR`：碳纤维材质贴图
- `mirror/assets/models/*interior*/*.exr`、`mirror/assets/t_env_light-r6ZBsESp.hdr`：环境光/室内环境贴图

## 关键视频

最大的视频包括：

- `external/oss.fly-h2o.cn/20260325/HE.0000_2~1_1774370087729.mp4`：97.3 MB，1920x1080，约 163 秒
- `mirror/assets/video/2-4_compressed-BcENpFZu.mp4`：55.0 MB，1920x1080，约 47 秒
- `mirror/assets/video/video-8-1-Byl5yOJ_.mp4`：33.7 MB，1920x1080，约 28 秒
- `mirror/assets/video/1-1_compressed-Bcn8sccI.mp4`：26.3 MB，1920x1080，约 20 秒
- `mirror/assets/video/video-7-Bp2xvIb6.mp4`：12.6 MB，3840x2160，约 19 秒
- `mirror/assets/video/color-*.mp4`、`fx*.mp4`：配置器颜色/动效视频
- `mirror/assets/video/menu-*.mp4`：菜单预览视频

## 截图

- `screenshots/01-home-viewport.png`：首页首屏
- `screenshots/05-menu-open.png`：菜单打开态，能看到产品卡和左侧信息架构
- `screenshots/02-2d-configurator.png`、`03-model-h1.png`、`04-contact.png`：路由访问时的地理权限拦截态
- `screenshots/*-cdp.png`：授予地理权限后的补充截图

## 样式拆解

整体风格是“黑底全屏媒体 + 高反差白字 + 科技青强调色 + 红色产品灯光”的高端交通工具视觉。

- 首屏：全屏视频/3D 产品背景，顶部固定透明导航，中心 `ALAQUA` 标识，主体叠加大号手写体品牌 Logo。
- 导航：左侧 `MENU` 汉堡，右侧 `STORE` 和账号图标，中间品牌字标，下划线极细。
- 菜单：大面积玻璃态暗色面板，背景仍保留模糊产品视频；左侧是 uppercase 分类导航，右侧是 Y-3/Y-5 产品大卡。
- 字体：英文主体使用 `Tinos/Times New Roman/Georgia` 衬线体系；中文切换为 `MiSans-Normal`；图标字体为 `Boxicons`。
- 颜色：`#000`、`#1a1a1a`、`#2d2d2d`、`#fff`、银灰、科技青 `#00FFF7`，再用产品视频里的红/橙灯光做情绪色。
- 动效：GSAP、ScrollTrigger、Swiper、Three.js/GLTFLoader；大量视频懒加载和模型资源异步加载。
- UI 语言：圆角较克制，按钮多为细白描边胶囊；输入/弹窗使用深灰玻璃态和白色低透明边框。

## 注意

- 官网代码里出现了少量小米汽车外链素材引用，我没有混入本地 Fly H2O 素材库。
- `invalid/html-fallback/` 内的文件不是有效视频，是官网对不存在静态地址返回的 SPA HTML。
- 如果官网更新，重新运行：`node 资料/fly-h2o官网素材/tools/scrape-assets.mjs`。
