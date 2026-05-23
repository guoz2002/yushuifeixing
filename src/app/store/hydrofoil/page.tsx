import type { Metadata } from "next";
import { UnderConstructionModal } from "@/components/under-construction-modal";

export const metadata: Metadata = {
  title: "商城页正在设计中 | ALAQUA",
  description: "商城页暂时不可进入，正在设计中。",
};

export default function HydrofoilStoreRoute() {
  return <UnderConstructionModal sectionLabel="商城页" />;
}
