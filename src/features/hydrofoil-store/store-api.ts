import type { HomePageListResponse, HomePageProduct } from "./types";

const STORE_API = "https://api.fly-h2o.cn/app-api/product/home-page/list";

const FALLBACK_PRODUCTS: HomePageProduct[] = [
  {
    id: "2036261280480657409",
    spuId: "2036106382770339842",
    spuName: "Y-3",
    spuPicUrl: "https://oss.fly-h2o.cn/20260402/store-3_1775116797713.png",
    introduction:
      '<div class="text-white text-lg sm:text-xl lg:text-2xl mb-2">39.9 万元</div><div class="mb-2 xl:mb-3 4xl:mb-4">高端私人艇</div>4.9米总长度 | 三座轻量布局<br/>双档巡航15/30节 | 2.5小时续航能力',
    categoryName: "三座版",
  },
  {
    id: "2036336213454487554",
    spuId: "2036332821969633281",
    spuName: "Y-5",
    spuPicUrl: "https://oss.fly-h2o.cn/20260402/产品图-调整后_1775116758993.png",
    introduction:
      '<div class="text-white text-lg sm:text-xl lg:text-2xl mb-2">新一代水翼艇 全新升级</div><div class="mb-2 sm:mb-6 lg:mb-7">敬请期待</div>',
    categoryName: "五座版",
  },
];

export async function getHomePageProducts(): Promise<HomePageProduct[]> {
  try {
    const response = await fetch(STORE_API, {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) return FALLBACK_PRODUCTS;
    const payload = (await response.json()) as HomePageListResponse;
    if (payload.code !== 0 || !Array.isArray(payload.data) || payload.data.length === 0) return FALLBACK_PRODUCTS;

    return payload.data;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}
