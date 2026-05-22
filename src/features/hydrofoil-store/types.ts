export type HomePageProduct = {
  id: string;
  spuId: string;
  spuName: string;
  spuPicUrl: string;
  introduction: string;
  categoryName: string;
};

export type HomePageListResponse = {
  code: number;
  msg: string;
  data?: HomePageProduct[];
};
