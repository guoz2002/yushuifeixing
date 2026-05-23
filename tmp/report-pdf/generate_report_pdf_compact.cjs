const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../..');
const inputMd = path.join(root, '人写终版_精简无标题版.md');
const outputHtml = path.join(__dirname, '人写终版_精简无标题版.html');
const outputPdf = path.join(root, '人写终版_精简无标题版.pdf');

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function imageToFigure(tokenOrHref, title, text) {
  const token = typeof tokenOrHref === 'object'
    ? tokenOrHref
    : { href: tokenOrHref, title, text };
  const href = token.href || '';
  const alt = token.text || token.title || '';
  const absolute = path.isAbsolute(href) ? href : path.join(root, href);
  if (!fs.existsSync(absolute)) throw new Error(`Missing image: ${href}`);
  const src = pathToFileURL(absolute).href;
  const caption = alt && alt !== 'alt text' ? alt : path.basename(href);
  return `<figure class="figure"><img src="${src}" alt="${escapeHtml(alt)}"><figcaption>${escapeHtml(caption)}</figcaption></figure>`;
}

(async () => {
  const { marked } = await import(pathToFileURL(require.resolve('marked')).href);
  const renderer = new marked.Renderer();
  renderer.image = (...args) => imageToFigure(...args);
  marked.setOptions({ gfm: true, breaks: false, renderer });

  const markdown = fs.readFileSync(inputMd, 'utf8');
  const htmlBody = marked.parse(markdown);
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>精简无标题版</title>
<style>
:root {
  --ink: #183039;
  --muted: #62747a;
  --paper: #fffdf8;
  --line: #d8e5e2;
  --accent: #0d7f8b;
  --accent-soft: #eff8f6;
  --deep: #082a31;
}
* { box-sizing: border-box; }
html { font-size: 16px; }
body {
  margin: 0;
  color: var(--ink);
  background: #fffdf8;
  font-family: "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
  line-height: 1.76;
}
.report {
  max-width: 920px;
  margin: 0 auto;
  padding: 22px 38px 58px;
  background: var(--paper);
}
h1, h2, h3 {
  color: var(--deep);
  line-height: 1.32;
  letter-spacing: -0.01em;
}
h2 {
  margin: 1rem 0 1rem;
  padding: 0.46rem 0 0.56rem 0.72rem;
  border-left: 5px solid var(--accent);
  border-bottom: 1px solid var(--line);
  font-size: 1.42rem;
}
h3 {
  margin: 1.65rem 0 0.55rem;
  font-size: 1.04rem;
  color: #12545d;
}
p { margin: 0.55rem 0; }
strong { color: #07343b; font-weight: 800; }
ul, ol { padding-left: 1.35rem; margin: 0.65rem 0 1rem; }
li { margin: 0.28rem 0; }
code {
  padding: 0.1rem 0.3rem;
  border-radius: 6px;
  background: #eaf3f1;
  color: #0f555f;
  font-family: "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.9em;
}
pre {
  margin: 0.85rem 0 1.1rem;
  padding: 0.9rem 1rem;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  color: #e8fbf8;
  background: #0b2c32;
  border-radius: 12px;
}
pre code { padding: 0; color: inherit; background: transparent; }
table {
  width: 100%;
  margin: 0.85rem 0 1.2rem;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: #fffefa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--line);
}
th, td {
  padding: 0.62rem 0.68rem;
  border: 1px solid var(--line);
  vertical-align: top;
}
th {
  color: #fff;
  text-align: left;
  background: #0d626c;
}
tr:nth-child(even) td { background: var(--accent-soft); }
.figure {
  margin: 0.9rem 0 1.25rem;
  padding: 0.62rem;
  background: #fff;
  border: 1px solid rgba(13, 127, 139, 0.2);
  border-radius: 14px;
  break-inside: avoid;
  page-break-inside: avoid;
}
.figure img {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: 184mm;
  margin: 0 auto;
  object-fit: contain;
  border-radius: 9px;
}
figcaption {
  margin-top: 0.45rem;
  color: var(--muted);
  font-size: 0.78rem;
  text-align: center;
}
a { color: #096a76; }
@media print {
  body { background: #fff; }
  .report { max-width: none; padding: 0; background: #fff; }
  h2, h3 { break-after: avoid; page-break-after: avoid; }
  table, pre, .figure { break-inside: avoid; page-break-inside: avoid; }
  p, li { orphans: 2; widows: 2; }
}
</style>
</head>
<body>
<main class="report">
${htmlBody}
</main>
</body>
</html>`;

  fs.writeFileSync(outputHtml, html, 'utf8');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(outputHtml).href, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images).map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error(`Image failed to load: ${img.src}`));
      });
    }));
  });
  const missingImages = await page.evaluate(() => Array.from(document.images)
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map((img) => img.src));
  if (missingImages.length) throw new Error(`Images failed to load:\n${missingImages.join('\n')}`);

  await page.pdf({
    path: outputPdf,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width:100%;font-size:8px;color:#6b7f84;text-align:center;padding-bottom:4px;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    margin: { top: '14mm', right: '14mm', bottom: '18mm', left: '14mm' },
  });
  await browser.close();
  console.log(outputPdf);
})();
