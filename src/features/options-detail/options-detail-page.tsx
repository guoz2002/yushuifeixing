/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HydrofoilGlbViewer } from "@/features/hydrofoil-3d/glb-viewer";
import type { OptionGroup, OptionKey, OptionValue, SpuOptionsModel } from "./types";

type TabKey = OptionKey | "summary";
type PreviewMode = "3d" | "2d";

const TAB_ORDER: { key: TabKey; label: string }[] = [
  { key: "body", label: "船身颜色" },
  { key: "engine", label: "引擎配置" },
  { key: "rudder", label: "方向舵" },
  { key: "interior", label: "内饰风格" },
  { key: "summary", label: "配置清单" },
];

const formatter = new Intl.NumberFormat("zh-CN");

function priceText(value: number) {
  if (value <= 0) return "免费";
  return `¥${formatter.format(value)}`;
}

function groupByKey(model: SpuOptionsModel, key: OptionKey) {
  return model.groups.find((group) => group.key === key);
}

function buildInitialSelections(model: SpuOptionsModel) {
  const fromSku = model.skus[0]?.selections ?? {};
  return {
    body: fromSku.body ?? groupByKey(model, "body")?.values[0]?.valueId ?? "",
    engine: fromSku.engine ?? groupByKey(model, "engine")?.values[0]?.valueId ?? "",
    rudder: fromSku.rudder ?? groupByKey(model, "rudder")?.values[0]?.valueId ?? "",
    interior: fromSku.interior ?? groupByKey(model, "interior")?.values[0]?.valueId ?? "",
  };
}

function getOption(group: OptionGroup | undefined, valueId: string) {
  if (!group || !valueId) return null;
  return group.values.find((value) => value.valueId === valueId) ?? null;
}

function selectedPreviewImage(option: OptionValue | null, fallback: string[]) {
  if (option?.file2D?.length) return option.file2D;
  if (option?.valuePicUrl) return [option.valuePicUrl, ...fallback];
  return fallback;
}

export function OptionsDetailPage({ model }: { model: SpuOptionsModel }) {
  const [activeTab, setActiveTab] = useState<TabKey>("body");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("3d");
  const [selections, setSelections] = useState(buildInitialSelections(model));
  const [manualPreview, setManualPreview] = useState<string | null>(null);

  const bodyGroup = groupByKey(model, "body");
  const engineGroup = groupByKey(model, "engine");
  const rudderGroup = groupByKey(model, "rudder");
  const interiorGroup = groupByKey(model, "interior");

  const selectedBody = getOption(bodyGroup, selections.body);
  const selectedEngine = getOption(engineGroup, selections.engine);
  const selectedRudder = getOption(rudderGroup, selections.rudder);
  const selectedInterior = getOption(interiorGroup, selections.interior);

  const matchedSku = useMemo(() => {
    return (
      model.skus.find((sku) => {
        for (const group of model.groups) {
          const picked = selections[group.key];
          if (picked && sku.selections[group.key] !== picked) return false;
        }
        return true;
      }) ?? null
    );
  }, [model.groups, model.skus, selections]);

  const selectedExtras = (selectedBody?.valuePriceDesc ?? 0) + (selectedEngine?.valuePriceDesc ?? 0) + (selectedRudder?.valuePriceDesc ?? 0) + (selectedInterior?.valuePriceDesc ?? 0);
  const totalPrice = matchedSku?.price ?? model.basePrice + selectedExtras;

  const previewImages = selectedPreviewImage(selectedBody, model.sliderImages.length ? model.sliderImages : [model.heroImage]);
  const selectedModel3D = selectedBody?.file3D || model.defaultModel3D;
  const heroImage = manualPreview || matchedSku?.picUrl || previewImages[0] || model.heroImage;

  const activeGroup = activeTab === "summary" ? null : groupByKey(model, activeTab);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link className="text-sm tracking-[0.3em] text-white/90" href="/">
            ALAQUA
          </Link>
          <div className="flex items-center gap-5 text-xs tracking-[0.2em] text-white/70">
            <Link className="transition hover:text-white" href="/store/hydrofoil">
              HYDROFOIL
            </Link>
            <span>{model.name}</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-6 px-4 pb-8 pt-5 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:gap-8 lg:px-10 lg:pt-8">
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <div className="relative h-[46vh] min-h-[340px] w-full bg-[radial-gradient(circle_at_65%_20%,rgba(0,255,247,0.16),transparent_55%),linear-gradient(180deg,#161616_0%,#0a0a0a_100%)] sm:h-[56vh] lg:h-[64vh]">
            {previewMode === "3d" ? (
              <HydrofoilGlbViewer autoRotate autoRotateSpeed={0.7} className="h-full w-full p-4 sm:p-6 lg:p-8" poster={heroImage} src={selectedModel3D} />
            ) : (
              <img alt={model.name} className="h-full w-full object-contain p-4 sm:p-6 lg:p-8" src={heroImage} />
            )}
            <div className="absolute left-4 top-4 rounded-lg border border-white/15 bg-black/45 px-3 py-2 text-xs tracking-[0.2em] text-white/70 sm:left-6 sm:top-6">
              OPTIONS DETAIL
            </div>
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg border border-white/15 bg-black/45 p-1 sm:right-6 sm:top-6">
              <button
                className={`rounded px-3 py-1 text-xs tracking-[0.16em] transition ${previewMode === "3d" ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
                onClick={() => setPreviewMode("3d")}
                type="button"
              >
                3D
              </button>
              <button
                className={`rounded px-3 py-1 text-xs tracking-[0.16em] transition ${previewMode === "2d" ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
                onClick={() => setPreviewMode("2d")}
                type="button"
              >
                2D
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="mb-4">
              <h1 className="text-2xl font-light tracking-[0.08em] sm:text-3xl">{model.name} 配置工作台</h1>
              <div className="mt-2 text-sm leading-7 text-white/65" dangerouslySetInnerHTML={{ __html: model.introduction }} />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {previewImages.slice(0, 6).map((image, idx) => (
                <button
                  className="h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/5 transition hover:border-white/40"
                  key={`${image}-${idx}`}
                  onClick={() => setManualPreview(image)}
                  type="button"
                >
                  <img alt={`${model.name} 预览 ${idx + 1}`} className="h-full w-full object-cover" src={image} />
                </button>
              ))}
            </div>
          </div>
        </article>

        <aside className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#131313]">
          <div className="border-b border-white/10 px-4 pt-4 sm:px-6 sm:pt-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-[0.08em] sm:text-2xl">配置器</h2>
              <span className="rounded-full border border-[#00fff7]/40 bg-[#00fff7]/10 px-3 py-1 text-xs text-[#86fffb]">LIVE CONFIG</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {TAB_ORDER.map((tab) => (
                <button
                  className={`whitespace-nowrap border-b-2 pb-2 text-sm tracking-[0.12em] transition ${
                    activeTab === tab.key ? "border-white text-white" : "border-transparent text-white/45 hover:text-white/80"
                  }`}
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {activeTab === "summary" ? (
              <div className="space-y-5">
                <h3 className="text-base tracking-[0.12em] text-white/80">当前配置</h3>
                <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">船身</span>
                    <span>{selectedBody?.valueName ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">引擎</span>
                    <span>{selectedEngine?.valueName ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">方向舵</span>
                    <span>{selectedRudder?.valueName ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">内饰</span>
                    <span>{selectedInterior?.valueName ?? "-"}</span>
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <p className="text-xs leading-6 text-white/55">{model.description.replace(/<[^>]*>/g, "").slice(0, 180)}...</p>
                  </div>
                </div>
              </div>
            ) : activeGroup ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {activeGroup.values.map((value) => {
                  const selected = selections[activeGroup.key] === value.valueId;
                  const preview = value.file2D?.[0] || value.valuePicUrl || model.heroImage;

                  return (
                    <button
                      className={`cursor-pointer overflow-hidden rounded-xl border bg-black/20 text-left transition ${
                        selected ? "border-white shadow-[0_0_0_1px_rgba(255,255,255,0.25)]" : "border-white/10 hover:border-white/40"
                      }`}
                      key={value.valueId}
                      onClick={() => {
                        setSelections((prev) => ({ ...prev, [activeGroup.key]: value.valueId }));
                        setPreviewMode("3d");
                        setManualPreview(null);
                      }}
                      type="button"
                    >
                      <div className="h-28 bg-[radial-gradient(circle_at_50%_20%,rgba(0,255,247,0.12),transparent_60%),#101010] p-2">
                        <img alt={value.valueName} className="h-full w-full object-contain" src={preview} />
                      </div>
                      <div className="space-y-1 px-3 py-3">
                        <p className="text-sm font-medium">{value.valueName}</p>
                        <p className="text-xs text-[#95fffb]">{priceText(value.valuePriceDesc)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/10 bg-black/35 px-4 py-4 sm:px-6">
            <div className="mb-3 space-y-1">
              <p className="text-xs tracking-[0.18em] text-white/55">PRICE DETAILS</p>
              <div className="flex items-end justify-between">
                <span className="text-sm text-white/65">基础价 ¥{formatter.format(model.basePrice)}</span>
                <strong className="text-2xl font-semibold text-white">¥{formatter.format(totalPrice)}</strong>
              </div>
            </div>
            <Link
              className="block w-full rounded-lg bg-[#00fff7] px-4 py-3 text-center text-sm font-medium tracking-[0.15em] text-black transition hover:bg-[#66fff9]"
              href="/contact"
            >
              立即咨询
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
