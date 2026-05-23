# Report PDF 工具

用于将 `docs/reports/` 下的 Markdown 报告转换为 PDF。

## 脚本

- `generate_report_pdf.cjs`：生成 `docs/reports/drafts/人写终版_润色版.pdf`
- `generate_report_pdf_compact.cjs`：生成 `docs/reports/drafts/人写终版_精简无标题版.pdf`
- `generate_named_report_pdf.cjs`：生成 `docs/reports/final/御水飞行 郭政 任务报告.pdf`

## 说明

- 依赖 `playwright` 与本机 Chrome。
- 生成过程会校验图片是否可读，图片路径按 Markdown 文件相对路径解析。
