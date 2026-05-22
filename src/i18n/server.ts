import { headers } from "next/headers";
import { localeFromRequestHeaders } from "./locale-detection";

export async function detectRequestLocale() {
  return localeFromRequestHeaders(await headers());
}
