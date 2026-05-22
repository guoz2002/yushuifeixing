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

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://fly.everyonehug.com").replace(/\/+$/, "");
export const siteName = "ALAQUA | 御水飞行";
const ossBase = "https://oss.fly-h2o.cn";
const officialAssetsBase = "https://www.fly-h2o.cn/assets";
export const defaultOgImage = `${officialAssetsBase}/img/home-1-min-MsnRtAf0.png`;
const investorsImage = `${ossBase}/20260324/investors-6_1774283377704.jpg`;
const y3Image = `${ossBase}/20260324/color-1-2_1774283129973.jpg`;
const y5Image = `${ossBase}/20260402/%E4%BA%A7%E5%93%81%E5%9B%BE-%E8%B0%83%E6%95%B4%E5%90%8E_1775116758993.png`;

const y3Id = "2036106382770339842";
const y5Id = "2036332821969633281";

const seoKeywordRegistry = {
  brand: ["御水飞行", "ALAQUA", "Fly H2O", "fly-h2o", "御水飞行官网"],
  category: ["新能源智能水翼艇", "智能电动水翼船", "电动水翼船", "智能水翼艇", "水翼艇", "飞行水翼船", "水上飞行器"],
  products: ["Y-3", "Y-3 三座版", "Y-3 智能水翼艇", "Y-5", "Y-5 五座版", "Y-5 五座旗舰水翼船", "三座电动水翼船", "五座电动水翼船"],
  technology: [
    "水翼结构",
    "水翼控制",
    "动态水翼调节算法",
    "动态调平算法",
    "多传感器融合",
    "全电推进",
    "纯电推进",
    "低阻航行",
    "低噪音航行",
    "低尾浪",
    "碳纤维复合材料",
    "智能座舱",
    "三模方向盘",
    "电池系统",
    "无人水翼艇",
  ],
  scenarios: [
    "水上文旅",
    "城市水上交通",
    "滨水交通",
    "短途接驳",
    "海事巡检",
    "家庭水上出行",
    "度假区水上项目",
    "游艇俱乐部",
    "岛际交通",
    "绿色航运",
    "商务接待",
  ],
  commercial: [
    "试航预约",
    "试乘预约",
    "水翼艇采购咨询",
    "水翼船招商",
    "经销合作",
    "代理合作",
    "商务合作",
    "投资者关系",
    "珠海智能制造",
    "深圳水翼艇",
    "大湾区高端装备",
    "Monaco Energy Boat Challenge",
  ],
} as const;

const registeredSiteKeywords = [
  ...seoKeywordRegistry.brand,
  ...seoKeywordRegistry.category,
  ...seoKeywordRegistry.products,
  ...seoKeywordRegistry.technology,
  ...seoKeywordRegistry.scenarios,
  ...seoKeywordRegistry.commercial,
];

function uniqueKeywords(keywords: string[]) {
  return Array.from(new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean)));
}

function registeredKeywords(keywords: string[]) {
  return uniqueKeywords([...keywords, ...registeredSiteKeywords]);
}

const manufacturingImage = `${officialAssetsBase}/img/factory-banner-DanwpLnk.jpg`;
const contactImage = `${officialAssetsBase}/img/contact-1-Cv7nPYbB.jpg`;

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
    title: "Y-3 三座智能水翼艇 | ALAQUA 御水飞行",
    description: "了解 ALAQUA Y-3 三座新能源智能水翼艇的船体美学、水翼结构、速度、续航、座舱、碳纤维材料和全电推进参数。",
    keywords: ["ALAQUA Y-3", "Y-3 三座版", "三座智能水翼艇", "新能源水翼艇", "水翼艇参数", "家庭水上出行"],
    image: y3Image,
    imageAlt: "ALAQUA Y-3 three-seat intelligent hydrofoil",
    h1: "ALAQUA Y-3 三座智能水翼艇",
    summary: "Y-3 以三座布局、动态水翼控制、碳纤维复合材料和全电推进，服务家庭出游、休闲娱乐、试乘体验与短途水上交通。",
    bullets: ["Y-3 三座布局", "动态水翼控制与全电推进", "家庭出游、休闲娱乐和短途接驳"],
    priority: 0.88,
    changeFrequency: "weekly",
    pageType: "Product",
  },
  "/models/h2": {
    title: "Y-5 五座旗舰智能水翼船 | ALAQUA 御水飞行",
    description: "了解 ALAQUA Y-5 五座旗舰智能电动水翼船，面向文旅运营、酒店度假、商务接待、示范航线和高端水上交通场景。",
    keywords: ["ALAQUA Y-5", "Y-5 五座版", "五座智能水翼船", "旗舰水翼艇", "文旅水上交通", "商务接待水翼船"],
    image: y5Image,
    imageAlt: "ALAQUA Y-5 five-seat flagship electric hydrofoil",
    h1: "ALAQUA Y-5 五座旗舰智能水翼船",
    summary: "Y-5 以五座旗舰座舱承载更多运营场景，适合文旅航线、酒店度假、商务接待和城市滨水出行。",
    bullets: ["Y-5 五座旗舰座舱", "文旅运营、酒店度假与商务接待", "智能电动水翼平台"],
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
  "/tech/advantages": {
    title: "技术优势 | ALAQUA 稳定、续航与高速水翼控制",
    description:
      "了解 ALAQUA 御水飞行在智能水翼稳定控制、低阻航行、续航效率、速度表现和多传感器融合方面的技术优势。",
    keywords: ["水翼船技术优势", "水翼稳定控制", "低阻航行", "电动水翼船续航", "多传感器融合"],
    image: defaultOgImage,
    imageAlt: "ALAQUA hydrofoil stability and range technology",
    h1: "ALAQUA 水翼稳定与效率优势",
    summary: "通过水翼减阻、动态调平和电动推进协同，提升航行稳定性、续航效率和水上移动体验。",
    bullets: ["动态水翼调节", "低阻低尾浪航行", "续航、速度与舒适性平衡"],
    priority: 0.82,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/tech/scenario": {
    title: "应用场景 | ALAQUA 城市水上交通与文旅水翼船",
    description:
      "ALAQUA 智能电动水翼船可用于城市滨水交通、文旅航线、岛际接驳、酒店度假、商务接待和家庭水上出行。",
    keywords: ["水上文旅", "城市水上交通", "岛际交通", "度假区水上项目", "商务接待水翼船"],
    image: defaultOgImage,
    imageAlt: "ALAQUA electric hydrofoil application scenarios",
    h1: "ALAQUA 智能电动水翼船应用场景",
    summary: "覆盖城市滨水、文旅度假、岛际接驳、商务接待和家庭休闲等多类水上移动需求。",
    bullets: ["城市滨水与短途接驳", "文旅运营和酒店度假", "商务接待与家庭水上出行"],
    priority: 0.82,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/features": {
    title: "产品亮点 | ALAQUA 智能水上移动体验",
    description:
      "了解 ALAQUA 御水飞行的智能电动水翼船亮点，包括水翼飞行体验、纯电推进、智能控制、低噪音和低尾浪航行。",
    keywords: ["智能水上移动", "水翼船亮点", "纯电水翼船", "低噪音航行", "低尾浪"],
    image: defaultOgImage,
    imageAlt: "ALAQUA intelligent water mobility features",
    h1: "ALAQUA 智能水上移动亮点",
    summary: "以水翼升力、智能控制和纯电推进，让水上交通兼具效率、安静体验和科技感。",
    bullets: ["水翼飞行体验", "纯电低噪音推进", "智能操控与低尾浪"],
    priority: 0.78,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/manufacturing": {
    title: "智能制造 | ALAQUA 珠海制造与质量体系",
    description: "了解 ALAQUA 御水飞行的智能制造、碳纤维材料、质量控制、品牌工艺和珠海制造基地。",
    keywords: ["珠海智能制造", "水翼船制造", "碳纤维船体", "ALAQUA 工厂", "质量控制"],
    image: manufacturingImage,
    imageAlt: "ALAQUA intelligent manufacturing base",
    h1: "ALAQUA 智能制造与质量体系",
    summary: "通过材料、工艺、制造基地和质量体系支撑智能电动水翼船的稳定交付。",
    bullets: ["珠海制造基地", "碳纤维轻量化结构", "质量控制与工程验证"],
    priority: 0.82,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/manufacturing/quality": {
    title: "质量控制 | ALAQUA 智能电动水翼船制造体系",
    description:
      "了解 ALAQUA 御水飞行在智能电动水翼船制造中的检验、装配、测试、交付检查和质量控制流程。",
    keywords: ["水翼船质量控制", "电动水翼船测试", "智能制造质量体系", "交付检查", "装配检测"],
    image: manufacturingImage,
    imageAlt: "ALAQUA hydrofoil quality control",
    h1: "ALAQUA 水翼船质量控制",
    summary: "以检验、装配、测试和交付检查组成可追踪的制造质量流程。",
    bullets: ["装配与检验流程", "航行与交付测试", "制造质量追踪"],
    priority: 0.74,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/manufacturing/brand": {
    title: "品牌工艺 | ALAQUA 御水飞行高端水上交通品牌",
    description:
      "了解 ALAQUA 御水飞行的品牌工艺、产品设计语言、智能电动水翼船体验和面向高端水上交通的品牌定位。",
    keywords: ["ALAQUA 品牌", "御水飞行品牌", "高端水上交通", "水翼船设计", "智能水翼船品牌"],
    image: manufacturingImage,
    imageAlt: "ALAQUA brand craftsmanship",
    h1: "ALAQUA 御水飞行品牌工艺",
    summary: "以工程能力、产品设计和水上体验共同构建面向未来的智能水上交通品牌。",
    bullets: ["品牌设计语言", "工程与工艺表达", "高端水上移动体验"],
    priority: 0.72,
    changeFrequency: "monthly",
    pageType: "AboutPage",
  },
  "/manufacturing/carbonFiber": {
    title: "碳纤维结构 | ALAQUA 轻量化智能水翼船",
    description:
      "了解 ALAQUA 智能电动水翼船的碳纤维复合材料、轻量化船体结构、制造工艺和水翼航行效率。",
    keywords: ["碳纤维水翼船", "轻量化船体", "复合材料船体", "智能水翼艇制造", "水翼结构"],
    image: manufacturingImage,
    imageAlt: "ALAQUA carbon fiber hydrofoil structure",
    h1: "ALAQUA 碳纤维轻量化结构",
    summary: "以碳纤维复合材料和结构设计降低重量，为水翼升力、续航效率和操控体验提供基础。",
    bullets: ["碳纤维复合材料", "轻量化船体结构", "水翼效率与稳定性"],
    priority: 0.76,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/manufacturing/unmanned": {
    title: "无人水翼平台 | ALAQUA 智能水上技术",
    description:
      "了解 ALAQUA 在无人水翼艇、传感器融合、智能控制和水上平台化应用方面的技术探索。",
    keywords: ["无人水翼艇", "无人水上平台", "水翼控制系统", "传感器融合", "智能水上技术"],
    image: manufacturingImage,
    imageAlt: "ALAQUA unmanned hydrofoil platform",
    h1: "ALAQUA 无人水翼平台技术",
    summary: "围绕传感器、平台结构和智能控制能力，探索无人化水上移动与作业场景。",
    bullets: ["无人水翼平台", "多传感器融合", "智能水上作业场景"],
    priority: 0.7,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/manufacturing/threeModes": {
    title: "三模方向盘 | ALAQUA 智能水翼船操控系统",
    description:
      "了解 ALAQUA 三模方向盘和智能操控系统，覆盖不同航行状态、使用场景和水上驾驶体验。",
    keywords: ["三模方向盘", "水翼船操控", "智能座舱", "智能操控系统", "水翼船驾驶"],
    image: manufacturingImage,
    imageAlt: "ALAQUA three-mode steering control",
    h1: "ALAQUA 三模方向盘与智能操控",
    summary: "通过模式化操控、智能座舱和水翼控制联动，让水上驾驶更直观、更稳定。",
    bullets: ["三模方向盘", "智能座舱交互", "水翼航行控制"],
    priority: 0.72,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/manufacturing/battery": {
    title: "电池系统 | ALAQUA 智能电动水翼船能源方案",
    description:
      "了解 ALAQUA 智能电动水翼船的高压能源系统、电池安全、续航效率和纯电推进能力。",
    keywords: ["电动水翼船电池", "高压能源系统", "水翼船续航", "纯电推进", "电池安全"],
    image: manufacturingImage,
    imageAlt: "ALAQUA hydrofoil battery system",
    h1: "ALAQUA 电池系统与纯电推进",
    summary: "以高压能源系统、电池管理和纯电推进支撑低噪音、低尾浪和高效率水翼航行。",
    bullets: ["高压能源系统", "电池安全与管理", "纯电推进效率"],
    priority: 0.72,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/manufacturing/outboard-motor": {
    title: "电动推进系统 | ALAQUA 智能水翼船动力方案",
    description:
      "了解 ALAQUA 智能电动水翼船的电动推进系统、低噪音航行、动力效率和高端水上交通体验。",
    keywords: ["电动推进系统", "电动舷外机", "水翼船动力", "低噪音航行", "纯电水上交通"],
    image: manufacturingImage,
    imageAlt: "ALAQUA electric propulsion system",
    h1: "ALAQUA 电动推进系统",
    summary: "以纯电动力、低噪音推进和水翼减阻协同，提升水上交通的效率与舒适性。",
    bullets: ["纯电动力系统", "低噪音航行", "水翼减阻协同"],
    priority: 0.72,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/manufacturing/carbon-fiber-material": {
    title: "碳纤维材料 | ALAQUA 智能电动水翼船材料工艺",
    description:
      "了解 ALAQUA 用于智能电动水翼船的碳纤维材料、复合材料结构、轻量化工艺和船体制造能力。",
    keywords: ["碳纤维材料", "复合材料结构", "水翼船材料", "轻量化工艺", "船体制造"],
    image: manufacturingImage,
    imageAlt: "ALAQUA carbon fiber materials",
    h1: "ALAQUA 碳纤维材料工艺",
    summary: "围绕碳纤维材料、复合结构和轻量化工艺，支撑智能电动水翼船的效率与强度。",
    bullets: ["碳纤维材料", "复合结构工艺", "轻量化船体制造"],
    priority: 0.7,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/factory": {
    title: "珠海制造基地 | ALAQUA 智能电动水翼船工厂",
    description:
      "了解 ALAQUA 御水飞行珠海智能制造基地、制造交付能力、质量体系和智能电动水翼船生产布局。",
    keywords: ["ALAQUA 工厂", "珠海制造基地", "智能电动水翼船工厂", "水翼船生产", "高端装备制造"],
    image: manufacturingImage,
    imageAlt: "ALAQUA Zhuhai intelligent manufacturing base",
    h1: "ALAQUA 珠海智能制造基地",
    summary: "以珠海制造基地、质量流程和交付能力支持智能电动水翼船商业化落地。",
    bullets: ["珠海智能制造", "制造与交付能力", "高端装备质量体系"],
    priority: 0.74,
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
  "/team": {
    title: "团队介绍 | ALAQUA 御水飞行工程与运营团队",
    description:
      "了解 ALAQUA 御水飞行团队、工程研发、产品设计、制造运营和智能电动水翼船商业化能力。",
    keywords: ["御水飞行团队", "ALAQUA 团队", "水翼船研发团队", "智能制造团队", "工程设计团队"],
    image: investorsImage,
    imageAlt: "ALAQUA team",
    h1: "ALAQUA 御水飞行团队",
    summary: "工程研发、产品设计、制造运营和商业合作团队共同推进智能电动水翼船落地。",
    bullets: ["工程研发团队", "产品设计与制造运营", "商业合作与服务能力"],
    priority: 0.72,
    changeFrequency: "monthly",
    pageType: "AboutPage",
  },
  "/test-drive": {
    title: "试航预约 | ALAQUA 御水飞行智能电动水翼船",
    description:
      "预约 ALAQUA 御水飞行智能电动水翼船试航体验，了解 Y-3、Y-5 产品、试乘安排、合作咨询和水上体验服务。",
    keywords: ["水翼船试航", "试乘预约", "Y-3 试航", "Y-5 试航", "御水飞行预约"],
    image: contactImage,
    imageAlt: "ALAQUA test drive booking",
    h1: "预约 ALAQUA 智能电动水翼船试航",
    summary: "提交试航和合作咨询，体验 Y-3 与 Y-5 智能电动水翼船的低噪音水上飞行感。",
    bullets: ["Y-3 与 Y-5 试航体验", "试乘预约", "产品和合作咨询"],
    priority: 0.8,
    changeFrequency: "weekly",
    pageType: "WebPage",
  },
  "/contact": {
    title: "联系我们 | ALAQUA 御水飞行业务合作与试航预约",
    description: "联系 ALAQUA 御水飞行，咨询智能电动水翼船、试航预约、经销合作、服务支持和商务合作。",
    keywords: ["联系御水飞行", "ALAQUA 联系方式", "水翼船试航", "经销合作", "商务合作"],
    image: contactImage,
    imageAlt: "Contact ALAQUA",
    h1: "联系 ALAQUA 御水飞行",
    summary: "提交咨询、预约试航或联系业务团队，获取产品、渠道、服务与合作信息。",
    bullets: ["产品咨询", "预约试航", "经销与商务合作"],
    priority: 0.76,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/contact/charging": {
    title: "充电与能源服务 | ALAQUA 智能电动水翼船",
    description:
      "了解 ALAQUA 智能电动水翼船充电、能源服务、运营补能方案和水上交通项目支持。",
    keywords: ["水翼船充电", "电动水翼船能源服务", "运营补能", "充电方案", "电动船服务"],
    image: `${officialAssetsBase}/img/contact-10-DwGLPb8Z.png`,
    imageAlt: "ALAQUA charging service",
    h1: "ALAQUA 充电与能源服务",
    summary: "为智能电动水翼船运营、试航和交付场景提供充电与能源服务支持。",
    bullets: ["电动水翼船补能", "运营能源服务", "项目交付支持"],
    priority: 0.66,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/contact/finance": {
    title: "采购与金融服务 | ALAQUA 智能电动水翼船",
    description:
      "了解 ALAQUA 智能电动水翼船采购咨询、商务合作、金融服务和文旅运营项目支持。",
    keywords: ["水翼船采购", "电动水翼船金融服务", "商务合作", "文旅项目采购", "水翼船报价咨询"],
    image: `${officialAssetsBase}/img/contact-12-4aAXiGhN.png`,
    imageAlt: "ALAQUA finance service",
    h1: "ALAQUA 采购与金融服务",
    summary: "面向客户、渠道和运营项目提供采购咨询、金融服务和商务合作支持。",
    bullets: ["采购咨询", "金融服务支持", "渠道和项目合作"],
    priority: 0.66,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/contact/serve": {
    title: "服务保障 | ALAQUA 智能电动水翼船售后支持",
    description:
      "了解 ALAQUA 智能电动水翼船服务保障、售后支持、运营维护和客户服务体系。",
    keywords: ["水翼船售后", "服务保障", "运营维护", "客户服务", "电动水翼船服务"],
    image: contactImage,
    imageAlt: "ALAQUA service support",
    h1: "ALAQUA 服务保障",
    summary: "围绕试航、交付、运营和维护，提供智能电动水翼船服务保障体系。",
    bullets: ["售后支持", "运营维护", "客户服务体系"],
    priority: 0.68,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/contact/dealers": {
    title: "经销合作 | ALAQUA 御水飞行渠道与体验中心",
    description:
      "联系 ALAQUA 御水飞行了解智能电动水翼船经销合作、渠道拓展、体验中心和区域水上交通项目合作。",
    keywords: ["水翼船经销", "御水飞行经销合作", "渠道合作", "体验中心", "代理合作"],
    image: `${officialAssetsBase}/img/contact-6-CB56dRgK.jpg`,
    imageAlt: "ALAQUA dealer network",
    h1: "ALAQUA 经销合作与体验中心",
    summary: "面向区域渠道、体验中心和水上项目合作伙伴，开放智能电动水翼船经销合作。",
    bullets: ["经销与代理合作", "体验中心网络", "区域水上项目"],
    priority: 0.72,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
  "/contact/customerService": {
    title: "客户服务 | ALAQUA 御水飞行支持中心",
    description: "获取 ALAQUA 御水飞行客户服务、产品咨询、售后支持和智能电动水翼船使用帮助。",
    keywords: ["御水飞行客户服务", "ALAQUA 支持", "水翼船售后支持", "产品咨询", "服务帮助"],
    image: contactImage,
    imageAlt: "ALAQUA customer service",
    h1: "ALAQUA 客户服务",
    summary: "为产品咨询、售后支持、服务保障和使用问题提供客户服务入口。",
    bullets: ["产品咨询", "售后支持", "服务帮助"],
    priority: 0.62,
    changeFrequency: "monthly",
    pageType: "WebPage",
  },
};

const routeAliases: Record<string, string> = {
  "/dealers": "/contact/dealers",
  "/serve": "/contact/serve",
  "/customerService": "/contact/customerService",
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
      canonicalPath: basePath,
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
    keywords: registeredKeywords(seo.keywords),
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
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
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
  "/models",
  "/models/h1",
  "/models/h2",
  "/tech",
  "/tech/advantages",
  "/tech/scenario",
  "/features",
  "/manufacturing",
  "/manufacturing/quality",
  "/manufacturing/brand",
  "/manufacturing/carbonFiber",
  "/manufacturing/unmanned",
  "/manufacturing/threeModes",
  "/manufacturing/battery",
  "/manufacturing/outboard-motor",
  "/manufacturing/carbon-fiber-material",
  "/factory",
  "/company-intro",
  "/team",
  "/test-drive",
  "/contact",
  "/contact/charging",
  "/contact/finance",
  "/contact/serve",
  "/contact/dealers",
  "/contact/customerService",
].map((path) => {
  const url = absoluteUrl(path);
  const seo = getSeoConfig(path);

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
      about: registeredKeywords(seo.keywords).map((keyword) => ({ "@type": "Thing", name: keyword })),
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
