import type {
  NormalizedSku,
  OptionGroup,
  OptionKey,
  OptionValue,
  SpuDetail,
  SpuDetailResponse,
  SpuOptionsModel,
} from "./types";

const DEFAULT_SPU_ID = "2036106382770339842";
const DETAIL_API = "https://api.fly-h2o.cn/app-api/product/spu/get-detail";
const LOCAL_MODEL_FILENAMES = new Set([
  "Titanium-metallic_1774281073638.glb",
  "model_1774281255603.glb",
  "model_1774281477694.glb",
  "model_1774281505987.glb",
  "model_1774281535018.glb",
  "model_1775638905967.glb",
  "model_h1-Bc4HsqGF.glb",
]);

function safeHttps(url: string) {
  return url.startsWith("http://") ? url.replace("http://", "https://") : url;
}

function mapToLocalModelUrl(url?: string) {
  if (!url) return "";
  const httpsUrl = safeHttps(url);

  try {
    const parsed = new URL(httpsUrl);
    const pathname = parsed.pathname;
    const filename = decodeURIComponent(pathname.split("/").pop() || "");
    if (!filename) return httpsUrl;
    if (LOCAL_MODEL_FILENAMES.has(filename)) return `/fly-h2o-replica/models/${filename}`;
    return `/fly-h2o-oss/${pathname.replace(/^\/+/, "")}`;
  } catch {
    return httpsUrl;
  }
}

function moneyFromFen(value?: number) {
  if (!value || Number.isNaN(value)) return 0;
  return Math.round(value / 100);
}

function optionKeyForName(name: string): OptionKey | null {
  const n = name.toLowerCase();
  if (n.includes("船身") || n.includes("body") || n.includes("hull")) return "body";
  if (n.includes("引擎") || n.includes("engine")) return "engine";
  if (n.includes("方向舵") || n.includes("rudder")) return "rudder";
  if (n.includes("内饰") || n.includes("interior")) return "interior";
  return null;
}

const OPTION_KEY_ORDER: OptionKey[] = ["body", "engine", "rudder", "interior"];

function sortGroups(groups: OptionGroup[]) {
  return [...groups].sort((a, b) => OPTION_KEY_ORDER.indexOf(a.key) - OPTION_KEY_ORDER.indexOf(b.key));
}

function buildOptionsModel(detail: SpuDetail): SpuOptionsModel {
  const groupsByProperty = new Map<string, OptionGroup>();
  const valuesByProperty = new Map<string, Set<string>>();
  const skus: NormalizedSku[] = [];

  for (const sku of detail.skus ?? []) {
    const selections: Partial<Record<OptionKey, string>> = {};

    for (const property of sku.properties ?? []) {
      const key = optionKeyForName(property.propertyName);
      if (!key) continue;

      selections[key] = property.valueId;

      if (!groupsByProperty.has(property.propertyId)) {
        groupsByProperty.set(property.propertyId, {
          key,
          propertyId: property.propertyId,
          propertyName: property.propertyName,
          values: [],
        });
      }

      if (!valuesByProperty.has(property.propertyId)) valuesByProperty.set(property.propertyId, new Set());
      const valueKey = `${property.valueId}`;
      if (valuesByProperty.get(property.propertyId)?.has(valueKey)) continue;

      const optionValue: OptionValue = {
        valueId: property.valueId,
        valueName: property.valueName,
        valuePicUrl: safeHttps(property.valuePicUrl || ""),
        valuePriceDesc: moneyFromFen(property.valuePriceDesc),
        file2D: (property.file2D || []).map((url) => safeHttps(url)),
        file3D: mapToLocalModelUrl(property.file3D),
      };

      groupsByProperty.get(property.propertyId)?.values.push(optionValue);
      valuesByProperty.get(property.propertyId)?.add(valueKey);
    }

    skus.push({
      id: sku.id,
      price: moneyFromFen(sku.price),
      picUrl: safeHttps(sku.picUrl || ""),
      selections,
    });
  }

  const groups = sortGroups(Array.from(groupsByProperty.values()));
  const defaultModel3D = groups.find((group) => group.key === "body")?.values.find((value) => value.file3D)?.file3D || "";

  return {
    id: detail.id,
    name: detail.name,
    introduction: detail.introduction,
    description: detail.description,
    basePrice: moneyFromFen(detail.price),
    heroImage: safeHttps(detail.picUrl || ""),
    sliderImages: (detail.sliderPicUrls || []).map((url) => safeHttps(url)),
    defaultModel3D,
    groups,
    skus,
  };
}

function fallbackModel(spuId: string): SpuOptionsModel {
  const bodyPropertyId = "body";
  const enginePropertyId = "engine";
  const rudderPropertyId = "rudder";
  const interiorPropertyId = "interior";

  return {
    id: spuId,
    name: "Y-3",
    introduction:
      '<div class="text-white text-lg sm:text-xl lg:text-2xl mb-2">39.9 万元</div><div class="mb-2 xl:mb-3 4xl:mb-4">高端私人艇</div>4.9米总长度 | 三座轻量布局<br/>双档巡航15/30节 | 2.5小时续航能力',
    description: "配置数据加载失败，已使用本地兜底数据。",
    basePrice: 399000,
    heroImage: "https://oss.fly-h2o.cn/20260402/store-3_1775116797713.png",
    sliderImages: [
      "https://oss.fly-h2o.cn/20260323/home-14_1774280491573.png",
      "https://oss.fly-h2o.cn/20260323/home-15_1774280491573.jpeg",
      "https://oss.fly-h2o.cn/20260323/home-16_1774280491581.jpeg",
    ],
    defaultModel3D: "/fly-h2o-replica/models/Titanium-metallic_1774281073638.glb",
    groups: [
      {
        key: "body",
        propertyId: bodyPropertyId,
        propertyName: "船身",
        values: [
          {
            valueId: "body-gray",
            valueName: "钛金属色",
            valuePicUrl: "https://oss.fly-h2o.cn/20260323/gray_1774281001277.png",
            valuePriceDesc: 0,
            file2D: ["https://oss.fly-h2o.cn/20260323/car1_ying_1774281083229.jpeg"],
            file3D: "/fly-h2o-replica/models/Titanium-metallic_1774281073638.glb",
          },
          {
            valueId: "body-red",
            valueName: "烈焰红",
            valuePicUrl: "https://oss.fly-h2o.cn/20260323/red_1774281122467.png",
            valuePriceDesc: 0,
            file2D: ["https://oss.fly-h2o.cn/20260323/car1_red_1774281256789.jpeg"],
            file3D: "/fly-h2o-replica/models/model_1774281255603.glb",
          },
        ],
      },
      {
        key: "engine",
        propertyId: enginePropertyId,
        propertyName: "引擎",
        values: [
          { valueId: "x12", valueName: "X12", valuePicUrl: "https://oss.fly-h2o.cn/20260324/x12_1774281669286.png", valuePriceDesc: 0, file2D: [], file3D: "" },
          { valueId: "x20", valueName: "X20", valuePicUrl: "https://oss.fly-h2o.cn/20260324/x20_1774281678601.png", valuePriceDesc: 100000, file2D: [], file3D: "" },
        ],
      },
      {
        key: "rudder",
        propertyId: rudderPropertyId,
        propertyName: "方向舵",
        values: [
          {
            valueId: "smart-rudder",
            valueName: "智能双向舵",
            valuePicUrl: "https://oss.fly-h2o.cn/20260324/driver_wheel_1774281733841.png",
            valuePriceDesc: 49800,
            file2D: [],
            file3D: "",
          },
        ],
      },
      {
        key: "interior",
        propertyId: interiorPropertyId,
        propertyName: "内饰",
        values: [
          {
            valueId: "interior-red",
            valueName: "深酒红",
            valuePicUrl: "https://oss.fly-h2o.cn/20260324/1_1774281819422.png",
            valuePriceDesc: 15000,
            file2D: [],
            file3D: "",
          },
        ],
      },
    ],
    skus: [
      {
        id: "sku-fallback",
        price: 463800,
        picUrl: "https://oss.fly-h2o.cn/20260324/car1_ying_1774323344005.jpeg",
        selections: {
          body: "body-gray",
          engine: "x12",
          rudder: "smart-rudder",
          interior: "interior-red",
        },
      },
    ],
  };
}

export async function getSpuOptionsModel(spuId: string): Promise<SpuOptionsModel> {
  const id = spuId || DEFAULT_SPU_ID;

  try {
    const search = new URLSearchParams({ id });
    const response = await fetch(`${DETAIL_API}?${search.toString()}`, { next: { revalidate: 60 * 30 } });
    if (!response.ok) return fallbackModel(id);

    const payload = (await response.json()) as SpuDetailResponse;
    if (payload.code !== 0 || !payload.data) return fallbackModel(id);

    return buildOptionsModel(payload.data);
  } catch {
    return fallbackModel(id);
  }
}
