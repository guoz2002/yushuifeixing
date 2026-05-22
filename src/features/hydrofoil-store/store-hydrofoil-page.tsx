/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { HydrofoilGlbViewer } from "@/features/hydrofoil-3d/glb-viewer";
import type { HomePageProduct } from "./types";

const CARD_OVERLAY = "/fly-h2o-replica/store-2-CBGdK0nk.png";
const STORE_MODELS: Record<string, string> = {
  "Y-3": "/fly-h2o-replica/models/model_1775638905967.glb",
  "Y-5": "/fly-h2o-replica/models/model_h1-Bc4HsqGF.glb",
};

function cardClipPath(index: number) {
  if (index % 2 === 0) {
    return "polygon(0% 3%, 86% 3%, 95% 10%, 95% 100%, 0 100%)";
  }
  return "polygon(8% 3%, 100% 3%, 100% 100%, 6% 100%, 0% 93%, 0% 12%)";
}

function cardLabel(product: HomePageProduct) {
  if (product.spuName === "Y-5") return "敬请期待";
  return "开始配置";
}

function cardModel(product: HomePageProduct) {
  return STORE_MODELS[product.spuName] || "/fly-h2o-replica/models/model_1775638905967.glb";
}

export function StoreHydrofoilPage({ products }: { products: HomePageProduct[] }) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link className="text-sm tracking-[0.3em] text-white/90" href="/">
            ALAQUA
          </Link>
          <nav className="flex items-center gap-6 text-xs tracking-[0.24em] text-white/65 sm:text-sm">
            <Link className="transition hover:text-white" href="/store/hydrofoil">
              STORE
            </Link>
            <Link className="transition hover:text-white" href="/options/detail/2036106382770339842">
              CONFIG
            </Link>
          </nav>
        </div>
      </header>

      <section className="pb-10 pt-6 sm:pb-14 sm:pt-8 lg:pb-16 lg:pt-10">
        <div className="mx-auto mb-8 w-full max-w-[1400px] px-4 sm:px-6 lg:mb-10 lg:px-10">
          <p className="text-xs tracking-[0.22em] text-white/45">HYDROFOIL STORE</p>
          <h1 className="mt-3 text-2xl font-light tracking-[0.08em] sm:text-3xl lg:text-4xl">Y SERIES PRODUCT MATRIX</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/50 sm:text-base">复刻自 fly-h2o 官方商城入口页，保留深色舞台式展示和双产品卡片结构。</p>
        </div>

        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-10">
          {products.map((product, index) => {
            const disabled = product.spuName === "Y-5";

            return (
              <article
                className="group relative flex min-h-[72vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171717]"
                key={product.id}
                style={{ clipPath: cardClipPath(index) }}
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%]">
                  <img alt="" className="h-full w-full rounded-b-2xl object-cover opacity-70 transition duration-500 group-hover:opacity-95" src={CARD_OVERLAY} />
                </div>

                <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-7 lg:p-9">
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-light tracking-[0.12em] sm:text-3xl">{product.spuName}</h2>
                      <span className="rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs tracking-[0.2em] text-white/70">{product.categoryName}</span>
                    </div>
                    <div className="space-y-2 text-sm leading-7 text-white/70 sm:text-base sm:leading-8" dangerouslySetInnerHTML={{ __html: product.introduction }} />
                  </div>

                  <div className="mt-6">
                    <div className="relative h-[34vh] min-h-[250px] w-full overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_65%_20%,rgba(0,255,247,0.12),transparent_55%),#121212] transition duration-500 group-hover:border-white/25">
                      <HydrofoilGlbViewer autoRotate autoRotateSpeed={0.7} className="h-full w-full p-2 sm:p-3" poster={product.spuPicUrl} src={cardModel(product)} />
                      <div className="pointer-events-none absolute right-3 top-3 rounded border border-white/20 bg-black/45 px-2 py-1 text-[10px] tracking-[0.2em] text-white/65">3D MODEL</div>
                    </div>
                    <div className="mt-5 flex flex-col items-center justify-center gap-3">
                      {disabled ? (
                        <button className="w-full rounded-lg bg-[#707070] px-6 py-3 text-sm tracking-[0.16em] text-black/75 sm:w-auto sm:text-base" disabled type="button">
                          {cardLabel(product)}
                        </button>
                      ) : (
                        <Link
                          className="w-full rounded-lg bg-[#00fff7] px-6 py-3 text-center text-sm tracking-[0.16em] text-black transition hover:bg-[#66fff9] sm:w-auto sm:text-base"
                          href={`/options/detail/${product.spuId}`}
                        >
                          {cardLabel(product)}
                        </Link>
                      )}
                      <p className="text-center text-xs text-white/45">提示：点击 Y-3 可直接进入产品配置页（Y-5 仍为预告状态）。</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
