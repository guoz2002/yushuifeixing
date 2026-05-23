/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n";
import { media } from "../data/media";
import {
  modelColorStories,
  modelDetailCards,
  modelGalleryItems,
  modelPageCopy,
  modelSequenceFrames,
  modelSequenceFramesOfficial,
} from "../data/model";
import { useNearViewport } from "../hooks/use-near-viewport";
import { ModelStage } from "../components/model-stage";
import type { PageConfig } from "../types";

type OfficialCard = {
  title?: string;
  text?: string;
  mediaUrl?: string;
};

type OfficialTemplateA = {
  text?: string;
  mediaUrl?: string;
};

type OfficialTemplateB = {
  text?: string;
  mediaUrls?: string[];
};

type OfficialTemplateC = {
  title?: string;
  text?: string;
  cards?: OfficialCard[];
};

type OfficialTemplateD = {
  mediaUrl?: string;
  title?: string;
  text?: string;
};

type OfficialTemplateE = {
  leftSmallText?: string;
  leftBigText?: string;
  rightSmallText?: string;
  color?: string;
  imageUrl?: string;
  videoUrl?: string;
};

type OfficialTemplateFCard = {
  title?: string;
  maps?: {
    key?: string;
    value?: string;
  }[];
};

type OfficialTemplateF = {
  backgroundImageUrl?: string;
  leftBigTitle?: string;
  rightCards?: OfficialTemplateFCard[];
};

type OfficialTemplateG = {
  title?: string;
  text?: string;
  mediaUrls?: string[];
};

type OfficialHomePageDetails = {
  templateA?: OfficialTemplateA;
  templateB?: OfficialTemplateB;
  templateC?: OfficialTemplateC;
  templateD?: OfficialTemplateD;
  templateE?: OfficialTemplateE[];
  templateF?: OfficialTemplateF;
  templateG?: OfficialTemplateG;
};

type OfficialSpuResponse = {
  data?: {
    homePageDetails?: OfficialHomePageDetails;
  };
};

type RuntimeColorStory = {
  sectionTitle: string;
  name: string;
  description: string;
  color: string;
  image: string;
  video: string;
};

type RuntimeGalleryItem = {
  type: "video" | "image";
  src: string;
};

const DEFAULT_MODEL_IDS = {
  h1: "2036106382770339842",
  h2: "2036332821969633281",
} as const;

function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function splitHtmlLines(value: string) {
  return value
    .split(/<br\s*\/?>/i)
    .map((line) => stripHtmlTags(line))
    .filter(Boolean);
}

function sortMediaUrls(urls: readonly string[]) {
  return [...urls].sort((a, b) => {
    const first = a.split("/").pop() || "";
    const second = b.split("/").pop() || "";
    return first.localeCompare(second);
  });
}

function isVideoSource(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

function releaseSequenceFrame(image: HTMLImageElement) {
  image.onload = null;
  image.onerror = null;
  image.removeAttribute("src");
}

function ProductSequenceCanvas({ lines, frames }: { lines: readonly string[]; frames: readonly string[] }) {
  const { t } = useI18n();
  const [sectionRef, shouldLoadFrames] = useNearViewport<HTMLElement>("900px");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const holder = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !holder || !context) return;

    let frame = framesRef.current[index];
    if (!frame?.complete || !frame.naturalWidth) {
      for (let offset = 1; offset < framesRef.current.length; offset += 1) {
        const previous = framesRef.current[index - offset];
        if (previous?.complete && previous.naturalWidth) {
          frame = previous;
          break;
        }

        const next = framesRef.current[index + offset];
        if (next?.complete && next.naturalWidth) {
          frame = next;
          break;
        }
      }
    }
    if (!frame?.complete || !frame.naturalWidth) return;

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

  useEffect(() => {
    frameIndexRef.current = 0;
    for (const image of framesRef.current) releaseSequenceFrame(image);
    framesRef.current = [];

    if (!shouldLoadFrames || frames.length === 0) return;

    let cancelled = false;
    let firstReady = false;
    const images = frames.map((url, index) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (cancelled) return;
        if (!firstReady) {
          firstReady = true;
          setLoaded(true);
        }
        if (index === frameIndexRef.current) drawFrame(index);
      };
      image.onerror = () => {
        if (!cancelled && index === 0 && !firstReady) setLoaded(true);
      };
      image.src = url;
      return image;
    });
    framesRef.current = images;

    return () => {
      cancelled = true;
      for (const image of images) releaseSequenceFrame(image);
      framesRef.current = [];
    };
  }, [drawFrame, frames, shouldLoadFrames]);

  useEffect(() => {
    if (!shouldLoadFrames || frames.length === 0) return;

    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const index = Math.round(progress * (frames.length - 1));
      frameIndexRef.current = index;
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
  }, [drawFrame, frames.length, sectionRef, shouldLoadFrames]);

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

function ProductColorTheater({ stories }: { stories: readonly RuntimeColorStory[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [videoReady, setVideoReady] = useState<Record<number, boolean>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const previousRef = useRef(0);
  const safeActive = stories.length > 0 ? Math.min(active, stories.length - 1) : 0;
  const current = stories[safeActive];

  useEffect(() => {
    const previous = previousRef.current;
    if (previous !== safeActive) {
      const previousVideo = videoRefs.current[previous];
      if (previousVideo) {
        setVideoReady((state) => ({ ...state, [previous]: false }));
        previousVideo.pause();
        window.setTimeout(() => {
          previousVideo.currentTime = 0;
        }, 700);
      }
    }

    previousRef.current = safeActive;
    setVideoReady((state) => ({ ...state, [safeActive]: false }));

    const currentVideo = videoRefs.current[safeActive];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.play().catch(() => {});
    }
  }, [safeActive]);

  const onVideoPlay = useCallback((index: number) => {
    if (index === safeActive) {
      setVideoReady((state) => ({ ...state, [index]: true }));
    }
  }, [safeActive]);

  const onVideoEnded = useCallback((index: number) => {
    setVideoReady((state) => ({ ...state, [index]: false }));
  }, []);

  if (!current) return null;

  return (
    <section className="productColorTheater">
      <div className="productColorMedia">
        {stories.map((item, index) => (
          <div className={safeActive === index ? "active" : ""} key={`${item.name}-${index}`}>
            <img className={videoReady[index] ? "isHidden" : ""} src={item.image} alt={t(item.name)} />
            <video
              muted
              onEnded={() => onVideoEnded(index)}
              onPlay={() => onVideoPlay(index)}
              playsInline
              preload="metadata"
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              src={item.video}
            />
          </div>
        ))}
      </div>
      <div className="productColorCopy">
        <div>
          <span>{t(current.sectionTitle)}</span>
          <h2>{t(current.name)}</h2>
          <i />
        </div>
        <p>{t(current.description)}</p>
      </div>
      <div className="productColorSwatches">
        {stories.map((item, index) => (
          <button
            aria-label={t(item.name)}
            className={safeActive === index ? "active" : ""}
            key={`${item.name}-${index}`}
            onClick={() => setActive(index)}
            style={{ "--swatch": item.color } as CSSProperties}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

export function ModelPage({ page, path }: { page: PageConfig; path: string }) {
  const { t } = useI18n();
  const modelKey = path === "/models/h2" ? "h2" : page.label === "Y-5" ? "h2" : "h1";
  const copy = modelPageCopy[modelKey];
  const [officialDetails, setOfficialDetails] = useState<OfficialHomePageDetails | null>(null);

  useEffect(() => {
    let cancelled = false;
    const modelId = DEFAULT_MODEL_IDS[modelKey];

    async function loadOfficialDetails() {
      try {
        const response = await fetch(`/app-api/product/spu/get-detail?id=${modelId}`, { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as OfficialSpuResponse;
        if (!cancelled) setOfficialDetails(payload.data?.homePageDetails ?? null);
      } catch {
        if (!cancelled) setOfficialDetails(null);
      }
    }

    void loadOfficialDetails();

    return () => {
      cancelled = true;
    };
  }, [modelKey]);

  const seriesText = officialDetails?.templateA?.text || copy.series;
  const heroVideo = officialDetails?.templateA?.mediaUrl || copy.heroVideo;
  const sequenceLines = useMemo(() => {
    const text = officialDetails?.templateB?.text;
    if (!text) return copy.sequenceLines;
    const lines = splitHtmlLines(text);
    return lines.length > 0 ? lines : copy.sequenceLines;
  }, [officialDetails?.templateB?.text, copy.sequenceLines]);

  const sequenceFrames = useMemo(() => {
    const urls = officialDetails?.templateB?.mediaUrls || [];
    if (urls.length > 0) return sortMediaUrls(urls);
    return modelKey === "h1" ? modelSequenceFramesOfficial : modelSequenceFrames;
  }, [officialDetails?.templateB?.mediaUrls, modelKey]);

  const aestheticsTitle = officialDetails?.templateC?.title || copy.aestheticsTitle;
  const aestheticsText = officialDetails?.templateC?.text || copy.aestheticsText;
  const detailCards = useMemo((): Array<[string, string, string]> => {
    const cards = officialDetails?.templateC?.cards || [];
    if (cards.length > 0) {
      return cards
        .map((card): [string, string, string] => [card.title?.trim() || "", card.text || "", card.mediaUrl || ""])
        .filter(([, , image]) => Boolean(image));
    }
    return modelDetailCards.map(([title, text, image]) => [title, text, image]);
  }, [officialDetails?.templateC?.cards]);

  const windVideo = officialDetails?.templateD?.mediaUrl || media.modelWind;
  const windTitle = officialDetails?.templateD?.title || copy.windTitle;
  const windText = officialDetails?.templateD?.text || copy.windText;

  const colorStories = useMemo((): RuntimeColorStory[] => {
    const stories = officialDetails?.templateE || [];
    if (stories.length > 0) {
      return stories
        .map((item): RuntimeColorStory => ({
          sectionTitle: item.leftSmallText || "富有生命力的色彩",
          name: item.leftBigText || "",
          description: item.rightSmallText || "",
          color: item.color || "#000000",
          image: item.imageUrl || "",
          video: item.videoUrl || "",
        }))
        .filter((item) => Boolean(item.name && (item.video || item.image)));
    }
    return modelColorStories.map((item) => ({
      sectionTitle: "富有生命力的色彩",
      name: item.name,
      description: item.description,
      color: item.color,
      image: item.image,
      video: item.video,
    }));
  }, [officialDetails?.templateE]);

  const technicalBackground = officialDetails?.templateF?.backgroundImageUrl || media.modelTech;
  const technicalTitle = officialDetails?.templateF?.leftBigTitle || "技术参数";
  const technicalSpecs = useMemo((): Array<[string, Array<[string, string]>]> => {
    const cards = officialDetails?.templateF?.rightCards || [];
    if (cards.length > 0) {
      return cards.map((card): [string, Array<[string, string]>] => [
        card.title || "",
        (card.maps || []).map((map): [string, string] => [map.key || "", map.value || ""]),
      ]);
    }
    return copy.specs.map(([group, rows]): [string, Array<[string, string]>] => [
      group,
      rows.map(([label, value]): [string, string] => [label, value]),
    ]);
  }, [officialDetails?.templateF?.rightCards, copy.specs]);

  const galleryTitle = officialDetails?.templateG?.title || "画廊 水翼艇";
  const galleryText = officialDetails?.templateG?.text || `探索 ${copy.series.replace("版", "")} 的每一个精致细节，感受水上飞行的优雅之美。`;
  const galleryItems = useMemo((): RuntimeGalleryItem[] => {
    const urls = officialDetails?.templateG?.mediaUrls || [];
    if (urls.length > 0) {
      return urls.map((src) => ({
        type: isVideoSource(src) ? "video" : "image",
        src,
      }));
    }
    return modelGalleryItems.map((item) => ({
      type: item.type,
      src: item.src,
    }));
  }, [officialDetails?.templateG?.mediaUrls]);

  return (
    <div className="officialModelPage" id="main-content">
      <section className="productHeroReplica">
        <video src={heroVideo} autoPlay muted loop playsInline preload="metadata" />
        <div>
          <p>{t(seriesText)}</p>
        </div>
      </section>

      <ProductSequenceCanvas lines={sequenceLines} frames={sequenceFrames} />

      <section className="productDetailReplica">
        <div className="productSectionTitle">
          <h2>{t(aestheticsTitle)}</h2>
          <p>{t(aestheticsText)}</p>
        </div>
        <div className="productDetailGrid">
          {detailCards.map(([title, text, image]) => (
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
        <video src={windVideo} muted loop playsInline autoPlay preload="metadata" />
        <div>
          <h2>{t(windTitle)}</h2>
          <p>{t(windText)}</p>
        </div>
      </section>

      <ProductColorTheater stories={colorStories} />

      <section className="productModelCanvas">
        <div className="productModelCanvasCopy">
          <span>{t("3D MODEL")}</span>
          <h2>{t("旋转模型")}</h2>
          <p>{t("官方 GLB 资源已接入本地画布，可拖拽查看船体比例与水翼结构。")}</p>
        </div>
        <ModelStage variant={modelKey === "h1" ? "h1" : "y3"} />
      </section>

      <section className="productTechnicalSection">
        <img src={technicalBackground} alt={t("Technical data background")} />
        <div className="productTechnicalInner">
          <h2>{t(technicalTitle)}</h2>
          <div className="productTechnicalCard">
            {technicalSpecs.map(([group, rows]) => (
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
          <h2>{t(galleryTitle)}</h2>
          <p>{t(galleryText)}</p>
        </div>
        <div className="productGalleryTrack">
          {galleryItems.map((item, index) => {
            const fallbackItem = modelGalleryItems[index];
            const branded = !officialDetails && Boolean(fallbackItem && "brand" in fallbackItem && fallbackItem.brand === true);

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
