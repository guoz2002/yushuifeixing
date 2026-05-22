export type SpuProperty = {
  propertyId: string;
  propertyName: string;
  valueId: string;
  valueName: string;
  valuePicUrl: string;
  valuePriceDesc: number;
  file2D: string[];
  file3D: string;
};

export type SpuSku = {
  id: string;
  price: number;
  marketPrice: number;
  picUrl: string;
  stock: number;
  properties: SpuProperty[];
};

export type SpuDetail = {
  id: string;
  name: string;
  introduction: string;
  description: string;
  picUrl: string;
  sliderPicUrls: string[];
  price: number;
  marketPrice: number;
  skus: SpuSku[];
};

export type SpuDetailResponse = {
  code: number;
  msg: string;
  data?: SpuDetail | null;
};

export type OptionKey = "body" | "engine" | "rudder" | "interior";

export type OptionValue = {
  valueId: string;
  valueName: string;
  valuePicUrl: string;
  valuePriceDesc: number;
  file2D: string[];
  file3D: string;
};

export type OptionGroup = {
  key: OptionKey;
  propertyId: string;
  propertyName: string;
  values: OptionValue[];
};

export type NormalizedSku = {
  id: string;
  price: number;
  picUrl: string;
  selections: Partial<Record<OptionKey, string>>;
};

export type SpuOptionsModel = {
  id: string;
  name: string;
  introduction: string;
  description: string;
  basePrice: number;
  heroImage: string;
  sliderImages: string[];
  defaultModel3D: string;
  groups: OptionGroup[];
  skus: NormalizedSku[];
};
