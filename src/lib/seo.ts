import type { Metadata, MetadataRoute } from "next";

export type SeoSearchParams = Record<string, string | string[] | undefined>;

type SeoConfig = {
  path: string;
  canonicalPath?: string;
  title: string;
  description: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  h1: string;
  summary: string;
  bullets: string[];
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  index?: boolean;
  pageType?: "WebPage" | "AboutPage" | "Product" | "CollectionPage";
};

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
export const siteName = "ALAQUA | 御水飞行";
const ossBase = "https://oss.fly-h2o.cn";
const officialAssetsBase = "/fly-h2o-official-assets";
export const defaultOgImage = `${officialAssetsBase}/img/home-1-min-MsnRtAf0.png`;
const investorsImage = `${ossBase}/20260324/investors-6_1774283377704.jpg`;
const y3Image = `${ossBase}/20260324/color-1-2_1774283129973.jpg`;
const y5Image = `${ossBase}/20260402/%E4%BA%A7%E5%93%81%E5%9B%BE-%E8%B0%83%E6%95%B4%E5%90%8E_1775116758993.png`;

const y3Id = "2036106382770339842";
const y5Id = "2036332821969633281";

const routeSeo: Record<string, Omit<SeoConfig, "path">> = {
  "/": {
    title: "ALAQUA 御水飞行官网 | 新一代智能电动水翼船",
    description:
      "ALAQUA 御水飞行专注智能电动水翼船与水上交通工具，覆盖 Y-3、Y-5、水翼技术、智能制造、文旅运营和城市水域出行场景。",
    keywords: ["ALAQUA", "御水飞行", "飞行水翼船", "电动水翼船", "智能水上交通", "Y-3", "Y-5"],
    image: defaultOgImage,
    imageAlt: "ALAQUA intelligent electric hydrofoil",
    h1: "ALAQUA 御水飞行智能电动水翼船",
    summary: "以电动水翼技术、智能控制和低噪音航行体验，打造面向城市水域、度假场景和商业运营的新一代水上交通工具。",
    bullets: ["智能电动水翼平台", "Y-3 与 Y-5 产品矩阵", "城市水域、文旅与度假运营场景"],
    priority: 1,
    changeFrequency: "weekly",
    pageType: "WebPage",
  },
  "/investors": {
    title: "投资者关系 | ALAQUA 御水飞行智能电动水翼船",
    description:
      "了解 ALAQUA 御水飞行的投资者信息、产业资本合作、智能电动水翼船商业化路径、珠海智能制造基地、水上交通和文旅运营增长机会。",
    keywords: [
      "御水飞行投资",
      "ALAQUA investors",
      "电动水翼船投资",
      "智能水上交通",
      "水翼船商业化",
      "珠海智能制造",
      "文旅水上交通",
    ],
    image: investorsImage,
    imageAlt: "ALAQUA investors and intelligent manufacturing",
    h1: "ALAQUA 御水飞行投资者关系",
    summary:
      "面向产业资本、合作伙伴和商业场景，呈现 ALAQUA 在智能电动水翼船、制造能力、渠道拓展和水上交通应用中的增长故事。",
    bullets: ["产业资本与硬科技产品路径", "智能电动水翼船商业化机会", "珠海制造基地、质量体系和渠道扩展"],
    priority: 0.96,
    changeFrequency: "weekly",
    pageType: "AboutPage",
  },
  "/models": {
    title: "产品系列 | ALAQUA Y-3 与 Y-5 智能电动水翼船",
    description: "查看 ALAQUA Y-3 三座版与 Y-5 五座旗舰版智能电动水翼船，了解水翼设计、低噪音纯电推进和水上飞行体验。",
    keywords: ["ALAQUA Y-3", "ALAQUA Y-5", "电动水翼船", "智能水翼艇", "水上飞行器"],
    image: y3Image,
    imageAlt: "ALAQUA Y series hydrofoil",
    h1: "ALAQUA Y 系列智能电动水翼船",
    summary: "Y-3 与 Y-5 覆盖私人体验、家庭出行、文旅运营和高端商务接待等多种水上交通场景。",
    bullets: ["Y-3 三座版", "Y-5 五座旗舰版", "电动水翼与智能操控"],
    priority: 0.9,
    changeFrequency: "weekly",
    pageType: "CollectionPage",
  },
  "/models/h1": {
    title: "ALAQUA H-1 / Y 系列智能电动水翼船",
    description: "了解 ALAQUA 智能电动水翼船产品介绍、船体美学、水翼结构、速度、续航、座舱和技术参数。",
    keywords: ["ALAQUA", "H-1", "Y-3", "Y-5", "电动水翼船", "水翼艇参数"],
    image: y3Image,
    imageAlt: "ALAQUA hydrofoil model",
    h1: "ALAQUA 智能电动水翼船产品介绍",
    summary: "从船体结构、颜色、座舱、动力和性能参数理解 ALAQUA 智能电动水翼船。",
    bullets: ["高效水翼结构", "智能座舱与电动推进", "适合私人、商务和文旅运营"],
    priority: 0.88,
    changeFrequency: "weekly",
    pageType: "Product",
  },
  "/tech": {
    title: "核心技术 | ALAQUA 智能电动水翼与控制系统",
    description: "探索 ALAQUA 在水翼控制、稳定性、续航、无人化、电池与电动推进系统上的技术能力。",
    keywords: ["水翼控制", "电动推进", "水翼船技术", "智能控制系统", "电池系统"],
    image: defaultOgImage,
    imageAlt: "ALAQUA hydrofoil technology",
    h1: "ALAQUA 智能电动水翼技术",
    summary: "以水翼结构、智能控制、电池系统和电动推进提升航行效率、稳定性与水上出行体验。",
    bullets: ["水翼减阻与稳定控制", "智能三模方向盘", "高压能源与电动推进"],
    priority: 0.84,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/manufacturing": {
    title: "智能制造 | ALAQUA 珠海制造与质量体系",
    description: "了解 ALAQUA 御水飞行的智能制造、碳纤维材料、质量控制、品牌工艺和珠海制造基地。",
    keywords: ["珠海智能制造", "水翼船制造", "碳纤维船体", "ALAQUA 工厂", "质量控制"],
    image: `${officialAssetsBase}/img/factory-banner-DanwpLnk.jpg`,
    imageAlt: "ALAQUA intelligent manufacturing base",
    h1: "ALAQUA 智能制造与质量体系",
    summary: "通过材料、工艺、制造基地和质量体系支撑智能电动水翼船的稳定交付。",
    bullets: ["珠海制造基地", "碳纤维轻量化结构", "质量控制与工程验证"],
    priority: 0.82,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/company-intro": {
    title: "公司介绍 | ALAQUA 御水飞行",
    description: "了解 ALAQUA 御水飞行品牌、团队、智能电动水翼船产品和水上交通愿景。",
    keywords: ["ALAQUA 公司介绍", "御水飞行", "智能水上交通公司", "电动水翼船品牌"],
    image: defaultOgImage,
    imageAlt: "ALAQUA brand",
    h1: "关于 ALAQUA 御水飞行",
    summary: "ALAQUA 致力于以智能电动水翼船重塑城市水域、文旅度假和商业运营中的水上移动方式。",
    bullets: ["智能水上交通品牌", "电动水翼船研发与制造", "面向全球水域应用"],
    priority: 0.78,
    changeFrequency: "monthly",
    pageType: "AboutPage",
  },
  "/contact": {
    title: "联系我们 | ALAQUA 御水飞行业务合作与试航预约",
    description: "联系 ALAQUA 御水飞行，咨询智能电动水翼船、试航预约、经销合作、服务支持和商务合作。",
    keywords: ["联系御水飞行", "ALAQUA 联系方式", "水翼船试航", "经销合作", "商务合作"],
    image: `${officialAssetsBase}/img/contact-1-Cv7nPYbB.jpg`,
    imageAlt: "Contact ALAQUA",
    h1: "联系 ALAQUA 御水飞行",
    summary: "提交咨询、预约试航或联系业务团队，获取产品、渠道、服务与合作信息。",
    bullets: ["产品咨询", "预约试航", "经销与商务合作"],
    priority: 0.76,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
};

const routeAliases: Record<string, string> = {
  "/features": "/tech",
  "/tech/advantages": "/tech",
  "/tech/scenario": "/tech",
  "/manufacturing/quality": "/manufacturing",
  "/manufacturing/brand": "/manufacturing",
  "/manufacturing/carbonFiber": "/manufacturing",
  "/manufacturing/threeModes": "/manufacturing",
  "/manufacturing/battery": "/manufacturing",
  "/manufacturing/outboard-motor": "/manufacturing",
  "/factory": "/manufacturing",
  "/team": "/investors",
  "/dealers": "/contact",
  "/serve": "/contact",
  "/test-drive": "/contact",
};

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

export function pathFromSlug(slug?: string[]) {
  return slug?.length ? `/${slug.join("/")}` : "/";
}

function firstSearchParam(searchParams: SeoSearchParams | undefined, key: string) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

function productConfigForSearchParams(path: string, searchParams?: SeoSearchParams): SeoConfig | null {
  if (path !== "/models/h1") return null;

  const id = firstSearchParam(searchParams, "id");
  if (id === y3Id) {
    return {
      ...routeSeo["/models/h1"],
      path,
      canonicalPath: `/models/h1?id=${y3Id}`,
      title: "Y-3 三座智能电动水翼船 | ALAQUA 御水飞行",
      description:
        "ALAQUA Y-3 三座智能电动水翼船，适合私人体验、家庭短途、轻商务接待和试航展示，融合水翼结构、智能操控与纯电推进。",
      keywords: ["Y-3", "三座电动水翼船", "ALAQUA Y-3", "智能水翼艇", "家庭水上出行"],
      image: y3Image,
      imageAlt: "ALAQUA Y-3 three-seat electric hydrofoil",
      h1: "ALAQUA Y-3 三座智能电动水翼船",
      summary: "Y-3 面向私人、家庭和轻商务场景，以更灵活的三座水翼平台提供低噪音、低尾浪的水上飞行体验。",
      bullets: ["三座布局", "纯电推进与水翼减阻", "私人体验、家庭短途和轻商务接待"],
      priority: 0.94,
    };
  }

  if (id === y5Id) {
    return {
      ...routeSeo["/models/h1"],
      path,
      canonicalPath: `/models/h1?id=${y5Id}`,
      title: "Y-5 五座旗舰智能电动水翼船 | ALAQUA 御水飞行",
      description:
        "ALAQUA Y-5 五座旗舰智能电动水翼船，面向文旅运营、酒店度假、商务接待和示范航线，提供更完整的座舱与运营能力。",
      keywords: ["Y-5", "五座电动水翼船", "ALAQUA Y-5", "文旅水上交通", "旗舰水翼艇"],
      image: y5Image,
      imageAlt: "ALAQUA Y-5 five-seat flagship electric hydrofoil",
      h1: "ALAQUA Y-5 五座旗舰智能电动水翼船",
      summary: "Y-5 面向文旅、酒店度假和商务接待场景，以五座旗舰座舱支持更高容量和更完整的运营体验。",
      bullets: ["五座旗舰座舱", "文旅运营与商务接待", "智能电动水翼平台"],
      priority: 0.94,
    };
  }

  return null;
}

export function getSeoConfig(path: string, searchParams?: SeoSearchParams): SeoConfig {
  const productConfig = productConfigForSearchParams(path, searchParams);
  if (productConfig) return productConfig;

  const basePath = routeSeo[path] ? path : routeAliases[path] || path;
  const config = routeSeo[basePath];
  if (config) {
    return {
      ...config,
      path,
      canonicalPath: path,
    };
  }

  return {
    path,
    canonicalPath: path,
    title: "ALAQUA 御水飞行 | 智能电动水翼船",
    description: "ALAQUA 御水飞行官网页面，展示智能电动水翼船、水上交通技术、制造体系、服务与业务合作信息。",
    keywords: ["ALAQUA", "御水飞行", "智能电动水翼船", "水上交通"],
    image: defaultOgImage,
    imageAlt: "ALAQUA electric hydrofoil",
    h1: "ALAQUA 御水飞行",
    summary: "探索 ALAQUA 智能电动水翼船、水上交通技术、产品、制造、服务与合作信息。",
    bullets: ["智能电动水翼船", "水上交通技术", "业务合作与服务支持"],
    priority: 0.4,
    changeFrequency: "monthly",
    index: false,
    pageType: "WebPage",
  };
}

export function buildMetadata(path: string, searchParams?: SeoSearchParams): Metadata {
  const seo = getSeoConfig(path, searchParams);
  const canonical = seo.canonicalPath || seo.path;
  const canonicalUrl = absoluteUrl(canonical);
  const imageUrl = absoluteUrl(seo.image);
  const shouldIndex = seo.index !== false;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          alt: seo.imageAlt,
        },
      ],
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [imageUrl],
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function buildRootMetadata(): Metadata {
  const homeMetadata = buildMetadata("/");

  return {
    ...homeMetadata,
    metadataBase: new URL(siteUrl),
    title: {
      default: routeSeo["/"].title,
      template: "%s",
    },
    description: routeSeo["/"].description,
    applicationName: "ALAQUA",
    authors: [{ name: "ALAQUA 御水飞行", url: siteUrl }],
    creator: "ALAQUA 御水飞行",
    publisher: "ALAQUA 御水飞行",
    category: "Electric hydrofoil, smart water mobility",
    classification: "Electric boats, hydrofoil craft, intelligent water transportation",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      telephone: false,
      address: false,
      email: false,
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export const sitemapEntries: MetadataRoute.Sitemap = [
  "/",
  "/investors",
  `/models/h1?id=${y3Id}`,
  `/models/h1?id=${y5Id}`,
  "/models",
  "/tech",
  "/tech/advantages",
  "/tech/scenario",
  "/features",
  "/manufacturing",
  "/manufacturing/quality",
  "/manufacturing/brand",
  "/manufacturing/carbonFiber",
  "/manufacturing/threeModes",
  "/manufacturing/battery",
  "/manufacturing/outboard-motor",
  "/factory",
  "/company-intro",
  "/team",
  "/contact",
  "/dealers",
  "/serve",
  "/test-drive",
].map((path) => {
  const url = absoluteUrl(path);
  const [pathname, query = ""] = path.split("?");
  const searchParams = query
    ? Object.fromEntries(new URLSearchParams(query).entries())
    : undefined;
  const seo = getSeoConfig(pathname, searchParams);

  return {
    url,
    lastModified: new Date("2026-05-22T00:00:00.000Z"),
    changeFrequency: seo.changeFrequency,
    priority: seo.priority,
    images: [absoluteUrl(seo.image)],
  };
});

export function buildStructuredData(path: string, searchParams?: SeoSearchParams) {
  const seo = getSeoConfig(path, searchParams);
  const canonical = seo.canonicalPath || seo.path;
  const canonicalUrl = absoluteUrl(canonical);
  const imageUrl = absoluteUrl(seo.image);
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${canonicalUrl}#webpage`;

  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "ALAQUA 御水飞行",
      alternateName: ["ALAQUA", "Fly H2O", "御水飞行"],
      url: siteUrl,
      logo: absoluteUrl(`${officialAssetsBase}/img/logo-D5s-fn5f.png`),
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: siteName,
      publisher: { "@id": organizationId },
      inLanguage: ["zh-CN", "en"],
    },
    {
      "@type": seo.pageType || "WebPage",
      "@id": webpageId,
      url: canonicalUrl,
      name: seo.title,
      headline: seo.h1,
      description: seo.description,
      image: imageUrl,
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
      inLanguage: ["zh-CN", "en"],
      about: seo.keywords.map((keyword) => ({ "@type": "Thing", name: keyword })),
    },
  ];

  if (seo.pageType === "Product") {
    graph.push({
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      name: seo.h1,
      description: seo.description,
      image: imageUrl,
      brand: { "@id": organizationId },
      category: "Electric hydrofoil boat",
      manufacturer: { "@id": organizationId },
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
