/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n";
import { media } from "../data/media";
import { modelColorStories, modelDetailCards, modelGalleryItems, modelPageCopy, modelSequenceFrames } from "../data/model";
import { useNearViewport } from "../hooks/use-near-viewport";
import { ModelStage } from "../components/model-stage";
import type { PageConfig } from "../types";

function releaseSequenceFrame(image: HTMLImageElement) {
  image.onload = null;
  image.onerror = null;
  image.removeAttribute("src");
}

function ProductSequenceCanvas({ lines }: { lines: readonly string[] }) {
  const { t } = useI18n();
  const [sectionRef, shouldLoadFrames] = useNearViewport<HTMLElement>("900px");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const pendingFramesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const frameIndexRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const frame = framesRef.current.get(index);
    const holder = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !holder || !context || !frame?.complete || !frame.naturalWidth) return;

    const width = Math.max(1, holder.clientWidth);
    const height = Math.max(1, holder.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bitmapWidth = Math.floor(width * dpr);
    const bitmapHeight = Math.floor(height * dpr);

    if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
      canvas.width = bitmapWidth;
      canvas.height = bitmapHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    const scale = Math.max(width / frame.naturalWidth, height / frame.naturalHeight);
    const x = (width - frame.naturalWidth * scale) / 2;
    const y = (height - frame.naturalHeight * scale) / 2;
    context.drawImage(frame, x, y, frame.naturalWidth * scale, frame.naturalHeight * scale);
  }, []);

  const evictDistantFrames = useCallback((centerIndex: number) => {
    const keep = new Set<number>([0]);
    for (let offset = -4; offset <= 4; offset += 1) keep.add(centerIndex + offset);

    for (const [index, image] of framesRef.current) {
      if (keep.has(index)) continue;
      releaseSequenceFrame(image);
      framesRef.current.delete(index);
    }
  }, []);

  const loadFrame = useCallback(
    (index: number) => {
      if (!shouldLoadFrames || index < 0 || index >= modelSequenceFrames.length) return;

      const existing = framesRef.current.get(index);
      if (existing) {
        if (existing.complete && existing.naturalWidth && index === frameIndexRef.current) drawFrame(index);
        return;
      }

      if (pendingFramesRef.current.has(index)) return;

      const image = new Image();
      pendingFramesRef.current.set(index, image);
      image.decoding = "async";
      image.onload = () => {
        pendingFramesRef.current.delete(index);
        framesRef.current.set(index, image);
        if (index === 0) setLoaded(true);
        if (index === frameIndexRef.current) drawFrame(index);
      };
      image.onerror = () => {
        pendingFramesRef.current.delete(index);
      };
      image.src = modelSequenceFrames[index];
    },
    [drawFrame, shouldLoadFrames],
  );

  const loadNearbyFrames = useCallback(
    (index: number) => {
      loadFrame(index);
      loadFrame(index - 1);
      loadFrame(index + 1);
      loadFrame(index - 2);
      loadFrame(index + 2);
      evictDistantFrames(index);
    },
    [evictDistantFrames, loadFrame],
  );

  useEffect(() => {
    if (!shouldLoadFrames) return;
    loadNearbyFrames(0);
  }, [loadNearbyFrames, shouldLoadFrames]);

  useEffect(() => {
    const loadedFrames = framesRef.current;
    const pendingFrames = pendingFramesRef.current;

    return () => {
      for (const image of loadedFrames.values()) releaseSequenceFrame(image);
      for (const image of pendingFrames.values()) releaseSequenceFrame(image);
      loadedFrames.clear();
      pendingFrames.clear();
    };
  }, []);

  useEffect(() => {
    if (!shouldLoadFrames) return;

    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const index = Math.round(progress * (modelSequenceFrames.length - 1));
      frameIndexRef.current = index;
      loadNearbyFrames(index);
      drawFrame(index);
    };

    const schedule = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [drawFrame, loadNearbyFrames, sectionRef, shouldLoadFrames]);

  return (
    <section className="productSequence" ref={sectionRef}>
      <div className="productSequenceSticky">
        <canvas aria-label={t("Hydrofoil scroll sequence")} ref={canvasRef} />
        {!loaded ? <span className="productSequenceLoading">{t("LOADING")}</span> : null}
        <div className="productSequenceCopy">
          {lines.map((line) => (
            <p key={line}>{t(line)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductColorTheater() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const current = modelColorStories[active];

  return (
    <section className="productColorTheater">
      <div className="productColorMedia">
        <img src={current.image} alt={t(current.name)} />
        <video key={current.video} src={current.video} muted playsInline autoPlay preload="metadata" />
      </div>
      <div className="productColorCopy">
        <div>
          <span>{t("富有生命力的色彩")}</span>
          <h2>{t(current.name)}</h2>
          <i />
        </div>
        <p>{t(current.description)}</p>
      </div>
      <div className="productColorSwatches">
        {modelColorStories.map((item, index) => (
          <button
            aria-label={t(item.name)}
            className={active === index ? "active" : ""}
            key={item.name}
            onClick={() => setActive(index)}
            style={{ "--swatch": item.color } as CSSProperties}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

export function ModelPage({ page }: { page: PageConfig }) {
  const { t } = useI18n();
  const modelKey = page.label === "Y-5" ? "h2" : "h1";
  const copy = modelPageCopy[modelKey];

  return (
    <div className="officialModelPage" id="main-content">
      <section className="productHeroReplica">
        <video src={copy.heroVideo} autoPlay muted loop playsInline preload="metadata" />
        <div>
          <p>{t(copy.series)}</p>
        </div>
      </section>

      <ProductSequenceCanvas lines={copy.sequenceLines} />

      <section className="productDetailReplica">
        <div className="productSectionTitle">
          <h2>{t(copy.aestheticsTitle)}</h2>
          <p>{t(copy.aestheticsText)}</p>
        </div>
        <div className="productDetailGrid">
          {modelDetailCards.map(([title, text, image]) => (
            <article key={title}>
              <img src={image} alt={t(title)} loading="lazy" />
              <div>
                <h3>{t(title)}</h3>
                <p>{t(text)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="productWindSection">
        <video src={media.modelWind} muted loop playsInline autoPlay preload="metadata" />
        <div>
          <h2>{t(copy.windTitle)}</h2>
          <p>{t(copy.windText)}</p>
        </div>
      </section>

      <ProductColorTheater />

      <section className="productModelCanvas">
        <div className="productModelCanvasCopy">
          <span>{t("3D MODEL")}</span>
          <h2>{t("旋转模型")}</h2>
          <p>{t("官方 GLB 资源已接入本地画布，可拖拽查看船体比例与水翼结构。")}</p>
        </div>
        <ModelStage variant={modelKey === "h1" ? "h1" : "y3"} />
      </section>

      <section className="productTechnicalSection">
        <img src={media.modelTech} alt={t("Technical data background")} />
        <div className="productTechnicalInner">
          <h2>{t("技术参数")}</h2>
          <div className="productTechnicalCard">
            {copy.specs.map(([group, rows]) => (
              <div key={group}>
                <h3>{t(group)}</h3>
                {rows.map(([label, value]) => (
                  <p key={label}>
                    <span>{t(label)}</span>
                    <strong>{t(value)}</strong>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="productGalleryReplica">
        <div className="productSectionTitle">
          <h2>{t("画廊 水翼艇")}</h2>
          <p>
            {t("探索")} {t(copy.series.replace("版", ""))} {t("的每一个精致细节，感受水上飞行的优雅之美。")}
          </p>
        </div>
        <div className="productGalleryTrack">
          {modelGalleryItems.map((item, index) => {
            const branded = "brand" in item && item.brand === true;

            return (
              <article key={`${item.src}-${index}`} className={branded ? "brand" : ""}>
                {item.type === "video" ? (
                  <video src={item.src} muted loop playsInline autoPlay preload="metadata" />
                ) : (
                  <img src={item.src} alt={`${t("画廊 水翼艇")} ${index + 1}`} loading="lazy" />
                )}
                {branded ? (
                  <div>
                    <img src={media.heroTitle} alt="Alaqua" />
                    <p>{t("释放无限动力")}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
