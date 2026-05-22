export function normalizedPath(pathname: string | null, slug?: string[]) {
  if (slug?.length) return `/${slug.join("/")}`;
  const path = pathname || "/";
  return path === "" ? "/" : path;
}

export function routeKeyForPath(path: string) {
  const segments = path.split("/").filter(Boolean);

  if (segments[0] === "preview" && segments[1]) return "/preview/:id";
  if (segments[0] === "options" && segments[1] === "detail" && segments[2]) return "/options/detail/:id";
  if (segments[0] === "store" && segments[1] === "accessories" && segments[2]) return "/store/accessories/:id";
  if (segments[0] === "store" && segments[1] === "design" && segments[2]?.toLowerCase() === "hulldesignbuild") {
    return "/store/design/HullDesignBuild";
  }
  if (segments[0] === "contact" && segments[1] === "dealers" && segments[2]) return "/contact/dealers/:id";
  if (segments[0] === "dealers" && segments[1]) return "/dealers/:id";
  if (segments[0] === "contact" && segments[1] === "customerService" && segments[2]) return "/contact/customerService/:id";
  if (segments[0] === "customerService" && segments[1]) return "/customerService/:id";
  if (segments[0] === "orders" && segments[1]) return "/orders/:orderId";
  if (segments[0] === "order-confirmation" && segments[1]) return "/order-confirmation/:orderId";

  return path;
}

export function pathParam(path: string) {
  const value = path.split("/").filter(Boolean).at(-1) || "";
  return decodeURIComponent(value);
}

export function detailKeyForPath(path: string) {
  if (path === "/contact/serve") return "/serve";
  if (path === "/contact/customerService") return "/customerService";
  return path;
}
