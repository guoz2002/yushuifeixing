# 御水飞行（yushuifeixing）

基于 Next.js 16 的站点项目，包含主站源码、静态资源、交付报告与历史归档文件。

## 目录结构

```text
.
├── src/                          # 业务源码（App Router、功能模块、组件、i18n）
├── public/                       # 运行时静态资源
├── scripts/                      # 线上运维脚本（如 IndexNow）
├── docs/
│   ├── project/                  # 项目说明与修改记录
│   ├── references/               # 参考资料与外部素材记录
│   └── reports/
│       ├── final/                # 最终交付报告
│       ├── drafts/               # 历史草稿与中间版本
│       └── assets/screenshots/   # 报告配图
├── tools/report-pdf/             # 报告 Markdown -> PDF 生成工具与预览产物
└── archive/workspace-artifacts/  # 历史抓取/快照/调试归档
```

## 本地开发

要求 Node.js >= 20.9。

```bash
npm install
npm run dev
```

默认访问：`http://localhost:3000`

## 常用命令

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run indexnow
```

## 报告生成

```bash
node tools/report-pdf/generate_report_pdf.cjs
node tools/report-pdf/generate_report_pdf_compact.cjs
node tools/report-pdf/generate_named_report_pdf.cjs
```

## 说明

- `archive/workspace-artifacts/` 为历史工程中间产物归档，不参与线上运行。
- `docs/reports/assets/screenshots/` 是报告插图资源池，避免根目录散落素材文件。
- 项目运行所需核心内容集中在 `src/` 与 `public/`。
