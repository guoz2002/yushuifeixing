#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const endpoint = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://fly.everyonehug.com");
const siteOrigin = site.origin;
const dryRun = process.argv.includes("--dry-run");
const explicitUrls = process.argv.slice(2).filter((arg) => arg !== "--dry-run");

function unique(values) {
  return Array.from(new Set(values));
}

async function readIndexNowKey() {
  const publicDir = path.join(process.cwd(), "public");
  const files = await readdir(publicDir);
  const keyFile = files.find((file) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(file));

  if (!keyFile) {
    throw new Error("No IndexNow key file found in public/. Expected public/{key}.txt.");
  }

  const key = keyFile.replace(/\.txt$/, "");
  const contents = (await readFile(path.join(publicDir, keyFile), "utf8")).trim();

  if (contents !== key) {
    throw new Error(`IndexNow key file ${keyFile} must contain exactly the key.`);
  }

  return key;
}

async function urlsFromSitemap() {
  const sitemapUrl = new URL("/sitemap.xml", siteOrigin).toString();
  const response = await fetch(sitemapUrl);
  const xml = await response.text();

  if (!response.ok) {
    throw new Error(`Could not read ${sitemapUrl}: HTTP ${response.status}`);
  }

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());

  if (urls.length === 0) {
    throw new Error(`No <loc> entries found in ${sitemapUrl}. Deploy the sitemap before submitting IndexNow.`);
  }

  return urls;
}

function normalizeUrl(value) {
  return new URL(value, siteOrigin).toString();
}

const key = await readIndexNowKey();
const keyLocation = new URL(`/${key}.txt`, siteOrigin).toString();
const candidateUrls = explicitUrls.length > 0 ? explicitUrls.map(normalizeUrl) : await urlsFromSitemap();
const urlList = unique(candidateUrls).filter((url) => new URL(url).host === site.host);

if (urlList.length === 0) {
  throw new Error(`No URLs matched host ${site.host}.`);
}

const payload = {
  host: site.host,
  key,
  keyLocation,
  urlList,
};

if (dryRun) {
  console.log(JSON.stringify({ endpoint, ...payload }, null, 2));
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(payload),
});

const body = await response.text();
console.log(`IndexNow response: HTTP ${response.status}${body ? ` ${body}` : ""}`);

if (![200, 202].includes(response.status)) {
  process.exitCode = 1;
}
