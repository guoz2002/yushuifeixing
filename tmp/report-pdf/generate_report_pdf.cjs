const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../..');
const inputMd = path.join(root, '人写终版_润色版.md');
const outputHtml = path.join(__dirname, '人写终版_润色版.html');
const outputPdf = path.join(root, '人写终版_润色版.pdf');

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
  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing image: ${href}`);
  }
  const src = pathToFileURL(absolute).href;
  const caption = alt && alt !== 'alt text' ? alt : path.basename(href);
  return `<figure class="figure"><img src="${src}" alt="${escapeHtml(alt)}"><figcaption>${escapeHtml(caption)}</figcaption></figure>`;
}

(async () => {
  const markedPath = require.resolve('marked');
  const { marked } = await import(pathToFileURL(markedPath).href);

  const renderer = new marked.Renderer();
  renderer.image = function (...args) {
    return imageToFigure(...args);
  };
  marked.setOptions({
    gfm: true,
    breaks: false,
    renderer,
  });

  const markdown = fs.readFileSync(inputMd, 'utf8');
  const htmlBody = marked.parse(markdown);
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>御水飞行独立站 SEO 与体验优化报告</title>
<style>
:root {
  --ink: #173037;
  --muted: #61777e;
  --paper: #fffdf7;
  --soft: #edf7f5;
  --soft-2: #f7f1e4;
  --line: #cddfda;
  --accent: #0d7f8b;
  --accent-2: #f2a23a;
  --deep: #08262c;
}
* { box-sizing: border-box; }
html { font-size: 16px; }
body {
  margin: 0;
  color: var(--ink);
  background:
    radial-gradient(circle at top left, rgba(13, 127, 139, 0.14), transparent 34rem),
    linear-gradient(135deg, #f8fbf7 0%, #f1f7f6 42%, #fff9ec 100%);
  font-family: "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
  line-height: 1.78;
}
.report {
  max-width: 940px;
  margin: 0 auto;
  padding: 38px 42px 64px;
  background: rgba(255, 253, 247, 0.92);
  box-shadow: 0 24px 80px rgba(8, 38, 44, 0.12);
}
.report > h1:first-child {
  margin: -38px -42px 30px;
  padding: 58px 48px 52px;
  color: #fff;
  font-size: 2.6rem;
  line-height: 1.18;
  letter-spacing: -0.03em;
  background:
    linear-gradient(135deg, rgba(8, 38, 44, 0.95), rgba(11, 94, 104, 0.92)),
    radial-gradient(circle at 82% 24%, rgba(242, 162, 58, 0.5), transparent 18rem);
  border-bottom: 8px solid var(--accent-2);
}
h1, h2, h3 {
  color: var(--deep);
  line-height: 1.32;
  letter-spacing: -0.01em;
}
h1 { font-size: 2.15rem; margin: 2.2rem 0 1rem; }
h2 {
  margin: 2.55rem 0 1rem;
  padding: 0.45rem 0 0.55rem 0.8rem;
  border-left: 6px solid var(--accent);
  border-bottom: 1px solid var(--line);
  font-size: 1.48rem;
}
h3 {
  margin: 2rem 0 0.65rem;
  font-size: 1.08rem;
  color: #104f58;
}
p { margin: 0.65rem 0; }
blockquote {
  margin: 0 0 1.35rem;
  padding: 1rem 1.15rem;
  color: #25494f;
  background: linear-gradient(90deg, rgba(13, 127, 139, 0.12), rgba(242, 162, 58, 0.12));
  border-left: 5px solid var(--accent-2);
  border-radius: 14px;
}
strong { color: #07343b; font-weight: 800; }
ul, ol { padding-left: 1.4rem; margin: 0.8rem 0 1.1rem; }
li { margin: 0.35rem 0; }
code {
  padding: 0.12rem 0.34rem;
  border-radius: 6px;
  background: #e9f2f0;
  color: #0f555f;
  font-family: "SFMono-Regular", "Cascadia Mono", Menlo, Consolas, monospace;
  font-size: 0.92em;
}
pre {
  margin: 1rem 0 1.25rem;
  padding: 1rem 1.1rem;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  color: #e8fbf8;
  background: #0b2c32;
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}
pre code { padding: 0; color: inherit; background: transparent; }
table {
  width: 100%;
  margin: 1rem 0 1.35rem;
  border-collapse: collapse;
  font-size: 0.92rem;
  background: #fffefa;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--line);
}
th, td {
  padding: 0.72rem 0.78rem;
  border: 1px solid var(--line);
  vertical-align: top;
}
th {
  color: #fff;
  text-align: left;
  background: #0d626c;
}
tr:nth-child(even) td { background: #f3faf8; }
.figure {
  margin: 1.05rem 0 1.45rem;
  padding: 0.72rem;
  background: #ffffff;
  border: 1px solid rgba(13, 127, 139, 0.22);
  border-radius: 18px;
  box-shadow: 0 14px 34px rgba(8, 38, 44, 0.09);
  break-inside: avoid;
  page-break-inside: avoid;
}
.figure img {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: 180mm;
  margin: 0 auto;
  object-fit: contain;
  border-radius: 12px;
}
figcaption {
  margin-top: 0.55rem;
  color: var(--muted);
  font-size: 0.82rem;
  text-align: center;
}
a { color: #096a76; text-decoration-color: rgba(9, 106, 118, 0.35); }
@media print {
  body { background: #fff; }
  .report {
    max-width: none;
    padding: 0;
    box-shadow: none;
    background: #fff;
  }
  .report > h1:first-child {
    margin: 0 0 24px;
    padding: 46px 40px 42px;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  h2, h3 { break-after: avoid; page-break-after: avoid; }
  table, blockquote, pre, .figure { break-inside: avoid; page-break-inside: avoid; }
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
  if (missingImages.length) {
    throw new Error(`Images failed to load:\n${missingImages.join('\n')}`);
  }

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
