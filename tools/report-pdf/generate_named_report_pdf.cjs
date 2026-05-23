const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../..');
const reportsDir = path.join(root, 'docs', 'reports');
const inputMd = path.join(reportsDir, 'final', '御水飞行 郭政 任务报告.md');
const inputDir = path.dirname(inputMd);
const outputHtml = path.join(__dirname, '御水飞行 郭政 任务报告.html');
const outputPdf = path.join(reportsDir, 'final', '御水飞行 郭政 任务报告.pdf');

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
  const absolute = path.isAbsolute(href) ? href : path.resolve(inputDir, href);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing image: ${href}`);
  }
  const src = pathToFileURL(absolute).href;
  const caption = alt && alt !== 'alt text' ? alt : path.basename(href);
  return `<figure class="figure"><img src="${src}" alt="${escapeHtml(alt)}"><figcaption>${escapeHtml(caption)}</figcaption></figure>`;
}

function emphasizeHtml(html) {
  const phrases = [
    'SEO', 'Next.js', 'Vue', 'three.js', 'robots.txt', 'sitemap.xml', 'canonical', 'robots meta',
    'JSON-LD', 'Bing IndexNow', 'Google Search Console', 'http://', 'https://', 'Mixed Content',
    'Referer 白名单/黑名单', 'Sentry', 'hover', 'i18n', 'ToB入口', 'ToC入口', 'noindex, follow',
    'index, follow', '1-7天左右', '危险感'
  ];
  const pattern = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = html.split(/(<[^>]+>)/g);
  let inStrong = false;
  let inCode = false;
  let inPre = false;
  return parts.map((part) => {
    if (part.startsWith('<')) {
      if (/^<strong\b/i.test(part)) inStrong = true;
      if (/^<\/strong/i.test(part)) inStrong = false;
      if (/^<code\b/i.test(part)) inCode = true;
      if (/^<\/code/i.test(part)) inCode = false;
      if (/^<pre\b/i.test(part)) inPre = true;
      if (/^<\/pre/i.test(part)) inPre = false;
      return part;
    }
    if (inStrong || inCode || inPre) return part;
    return part.replace(pattern, '<strong>$1</strong>');
  }).join('');
}

(async () => {
  const { marked } = await import(pathToFileURL(require.resolve('marked')).href);
  const renderer = new marked.Renderer();
  renderer.image = (...args) => imageToFigure(...args);
  marked.setOptions({ gfm: true, breaks: false, renderer });

  const markdown = fs.readFileSync(inputMd, 'utf8');
  const htmlBody = emphasizeHtml(marked.parse(markdown));
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>御水飞行 郭政 任务报告</title>
<style>
:root {
  --ink: #172d34;
  --muted: #657980;
  --paper: #fffdf8;
  --line: #d6e4e1;
  --accent: #0b7a86;
  --accent-soft: #edf8f6;
  --deep: #08282f;
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
  padding: 24px 38px 58px;
  background: var(--paper);
}
h1, h2, h3 {
  color: var(--deep);
  line-height: 1.3;
  letter-spacing: -0.01em;
}
h1 {
  margin: 1rem 0 1rem;
  padding: 0.48rem 0 0.58rem 0.78rem;
  border-left: 5px solid var(--accent);
  border-bottom: 1px solid var(--line);
  font-size: 1.48rem;
}
h2 {
  margin: 1.35rem 0 0.8rem;
  font-size: 1.22rem;
}
h3 {
  margin: 1.1rem 0 0.55rem;
  font-size: 1.05rem;
  color: #12545d;
}
p { margin: 0.55rem 0; }
strong {
  color: #062f37;
  font-weight: 800;
}
ul, ol {
  padding-left: 1.35rem;
  margin: 0.65rem 0 1rem;
}
li { margin: 0.28rem 0; }
a { color: #096a76; }
code {
  padding: 0.1rem 0.3rem;
  border-radius: 6px;
  background: #eaf3f1;
  color: #0e5560;
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
blockquote {
  margin: 0.8rem 0;
  padding: 0.75rem 1rem;
  border-left: 4px solid var(--accent);
  background: var(--accent-soft);
  border-radius: 10px;
}
@media print {
  body { background: #fff; }
  .report { max-width: none; padding: 0; background: #fff; }
  h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
  pre, blockquote, .figure { break-inside: avoid; page-break-inside: avoid; }
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
