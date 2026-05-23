import type { Metadata } from "next";
import { UnderConstructionModal } from "@/components/under-construction-modal";

export const metadata: Metadata = {
  title: "配置页正在设计中 | ALAQUA",
  description: "配置页暂时不可进入，正在设计中。",
};

export default function OptionsDetailRoute() {
  return <UnderConstructionModal sectionLabel="配置页" />;
}
