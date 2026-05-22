import type { Metadata } from "next";
import { getSpuOptionsModel } from "@/features/options-detail/options-api";
import { OptionsDetailPage } from "@/features/options-detail/options-detail-page";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Options Detail ${id} | Fly-H2O Replica`,
    description: "Fly-H2O 产品配置页复刻：/options/detail/:id",
  };
}

export default async function OptionsDetailRoute({ params }: PageProps) {
  const { id } = await params;
  const model = await getSpuOptionsModel(id);
  return <OptionsDetailPage model={model} />;
}
