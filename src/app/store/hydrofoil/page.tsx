import type { Metadata } from "next";
import { getHomePageProducts } from "@/features/hydrofoil-store/store-api";
import { StoreHydrofoilPage } from "@/features/hydrofoil-store/store-hydrofoil-page";

export const metadata: Metadata = {
  title: "Hydrofoil Store | Fly-H2O Replica",
  description: "Fly-H2O 商城页复刻：/store/hydrofoil",
};

export default async function HydrofoilStoreRoute() {
  const products = await getHomePageProducts();
  return <StoreHydrofoilPage products={products} />;
}
