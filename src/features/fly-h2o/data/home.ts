import { media } from "./media";

export const homeRangeItems = [
  {
    title: "Shenzhen · Dameisha Real Shot",
    text: "Real shot recording of the hydrofoil lifting and running nearshore under real sea conditions.",
    image: media.range3,
  },
  {
    title: "Shenzhen · Dasha River Real Shot",
    text: "Urban inland waterway footage showing controllability and a stable running posture.",
    image: media.range4,
  },
  {
    title: "Shenzhen · Dasha River Multi-Angle",
    text: "Side tracking and multi-angle views capture the product details in motion.",
    image: media.range4b,
  },
  {
    title: "Dongguan · Songshan Lake",
    text: "Aerial views show the lift-up navigation attitude over calm lake water.",
    image: media.range2,
  },
  {
    title: "Zhuhai · Pearl River Estuary",
    text: "Field testing in complex water validates stability, endurance and seaworthiness.",
    image: media.range1,
  },
];

export const homeGalleryItems = [
  { type: "image", image: media.gallery1, detail: media.gallery1Detail },
  { type: "image", image: media.gallery2, detail: media.gallery2Detail },
  { type: "image", image: media.gallery3, detail: media.gallery3Detail },
  { type: "video", image: media.galleryVideo },
  { type: "image", image: media.gallery4, detail: media.gallery4Detail },
  { type: "image", image: media.app5 },
  { type: "image", image: media.gallery6 },
  { type: "image", image: media.app4 },
] as const;
