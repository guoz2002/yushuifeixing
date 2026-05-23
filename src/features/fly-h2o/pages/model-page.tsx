/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties, RefObject } from "react";
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

const SEQUENCE_FRAME_PRELOAD_BEFORE = 6;
const SEQUENCE_FRAME_PRELOAD_AFTER = 12;
const SEQUENCE_FRAME_KEEP_RADIUS = 16;

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

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothStep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function sequencePlayProgress(rawProgress: number) {
  return smoothStep((rawProgress - 0.08) / 0.84);
}

function useModelScrollChoreography(rootRef: RefObject<HTMLDivElement | null>, refreshKey: string) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealItems = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const scrollScenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-scene]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("isVisible", entry.isIntersecting);
        }
      },
      {
        rootMargin: "0px 0px -14% 0px",
        threshold: 0.16,
      },
    );

    for (const item of revealItems) observer.observe(item);

    let raf = 0;
    const update = () => {
      const totalScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--model-scroll-progress", `${Math.min(1, Math.max(0, window.scrollY / totalScroll))}`);

      for (const scene of scrollScenes) {
        const rect = scene.getBoundingClientRect();
        const travel = Math.max(1, window.innerHeight + rect.height);
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));
        const focus = Math.max(0, 1 - Math.abs(progress - 0.52) * 2.25);

        scene.style.setProperty("--scene-progress", progress.toFixed(4));
        scene.style.setProperty("--scene-focus", focus.toFixed(4));
        scene.style.setProperty("--scene-scale", (0.975 + focus * 0.055).toFixed(4));
        scene.style.setProperty("--scene-y", `${(0.5 - progress) * 58}px`);
        scene.style.setProperty("--scene-fade", (0.78 + focus * 0.22).toFixed(4));
      }
    };

    const schedule = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [refreshKey, rootRef]);
}

function ProductSequenceCanvas({ lines, frames }: { lines: readonly string[]; frames: readonly string[] }) {
  const { t } = useI18n();
  const [sectionRef, shouldLoadFrames] = useNearViewport<HTMLElement>("900px");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineElementsRef = useRef<Array<HTMLParagraphElement | null>>([]);
  const framesRef = useRef<Array<HTMLImageElement | null>>([]);
  const frameIndexRef = useRef(0);
  const lineIndexRef = useRef(0);
  const loadingCancelledRef = useRef(false);
  const firstFrameReadyRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [activeLine, setActiveLine] = useState(0);

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

  const warmFrameWindow = useCallback((center: number) => {
    if (frames.length === 0) return;

    if (framesRef.current.length !== frames.length) {
      for (const image of framesRef.current) {
        if (image) releaseSequenceFrame(image);
      }
      framesRef.current = Array.from({ length: frames.length }, () => null);
    }

    const markLoaded = () => {
      if (firstFrameReadyRef.current) return;
      firstFrameReadyRef.current = true;
      setLoaded(true);
    };

    const ensureFrame = (index: number) => {
      if (index < 0 || index >= frames.length) return;
      if (framesRef.current[index]) return;

      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (loadingCancelledRef.current) return;
        markLoaded();
        if (index === frameIndexRef.current) drawFrame(index);
      };
      image.onerror = () => {
        if (loadingCancelledRef.current) return;
        if (index === 0) markLoaded();
      };
      image.src = frames[index];
      framesRef.current[index] = image;
    };

    const preloadStart = Math.max(0, center - SEQUENCE_FRAME_PRELOAD_BEFORE);
    const preloadEnd = Math.min(frames.length - 1, center + SEQUENCE_FRAME_PRELOAD_AFTER);
    for (let index = preloadStart; index <= preloadEnd; index += 1) ensureFrame(index);

    const keepStart = Math.max(0, center - SEQUENCE_FRAME_KEEP_RADIUS);
    const keepEnd = Math.min(frames.length - 1, center + SEQUENCE_FRAME_KEEP_RADIUS);
    for (let index = 0; index < framesRef.current.length; index += 1) {
      if (index >= keepStart && index <= keepEnd) continue;
      const image = framesRef.current[index];
      if (!image) continue;
      releaseSequenceFrame(image);
      framesRef.current[index] = null;
    }
  }, [drawFrame, frames]);

  useEffect(() => {
    frameIndexRef.current = 0;
    loadingCancelledRef.current = false;
    firstFrameReadyRef.current = false;
    for (const image of framesRef.current) {
      if (image) releaseSequenceFrame(image);
    }
    framesRef.current = [];

    if (!shouldLoadFrames || frames.length === 0) return;

    warmFrameWindow(0);

    return () => {
      loadingCancelledRef.current = true;
      for (const image of framesRef.current) {
        if (image) releaseSequenceFrame(image);
      }
      framesRef.current = [];
    };
  }, [frames, shouldLoadFrames, warmFrameWindow]);

  useEffect(() => {
    if (!shouldLoadFrames || frames.length === 0) return;

    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp01(-rect.top / scrollable);
      const playProgress = sequencePlayProgress(progress);
      const index = Math.round(playProgress * (frames.length - 1));
      const lineCount = Math.max(1, lines.length);
      const lineProgress = playProgress * Math.max(1, lineCount - 1);
      const nextLine = Math.min(lineCount - 1, Math.max(0, Math.round(lineProgress)));
      section.style.setProperty("--sequence-progress", playProgress.toFixed(4));
      section.style.setProperty("--sequence-raw-progress", progress.toFixed(4));
      section.style.setProperty("--sequence-canvas-scale", (1.07 - playProgress * 0.1).toFixed(4));
      section.style.setProperty("--sequence-canvas-y", `${(0.5 - playProgress) * 52}px`);
      lineElementsRef.current.forEach((element, lineIndex) => {
        if (!element) return;
        const strength = clamp01(1 - Math.abs(lineProgress - lineIndex) * 0.72);
        element.style.setProperty("--line-active", strength.toFixed(4));
        element.style.setProperty("--line-offset", `${(1 - strength) * -18}px`);
        element.style.setProperty("--line-scale", (0.975 + strength * 0.025).toFixed(4));
      });
      frameIndexRef.current = index;
      if (nextLine !== lineIndexRef.current) {
        lineIndexRef.current = nextLine;
        setActiveLine(nextLine);
      }
      warmFrameWindow(index);
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
  }, [drawFrame, frames.length, lines.length, sectionRef, shouldLoadFrames, warmFrameWindow]);

  return (
    <section className="productSequence" data-scroll-scene ref={sectionRef}>
      <div className="productSequenceSticky">
        <canvas aria-label={t("Hydrofoil scroll sequence")} ref={canvasRef} />
        {!loaded ? <span className="productSequenceLoading">{t("LOADING")}</span> : null}
        <div className="productSequenceProgress" aria-hidden="true">
          <span />
        </div>
        <div className="productSequenceCopy" data-reveal>
          {lines.map((line, index) => (
            <p
              className={index === activeLine ? "active" : ""}
              key={`${line}-${index}`}
              ref={(element) => {
                lineElementsRef.current[index] = element;
              }}
              style={
                {
                  "--line-active": index === 0 ? 1 : 0,
                  "--line-offset": index === 0 ? "0px" : "-18px",
                  "--line-scale": index === 0 ? 1 : 0.975,
                } as CSSProperties
              }
            >
              {t(line)}
            </p>
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
  const resetTimerRef = useRef<number | null>(null);
  const safeActive = stories.length > 0 ? Math.min(active, stories.length - 1) : 0;
  const current = stories[safeActive];

  useEffect(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    const previous = previousRef.current;
    if (previous !== safeActive) {
      const previousVideo = videoRefs.current[previous];
      if (previousVideo) {
        setVideoReady((state) => ({ ...state, [previous]: false }));
        previousVideo.pause();
        resetTimerRef.current = window.setTimeout(() => {
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

    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
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
    <section className="productColorTheater" data-scroll-scene>
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
      <div className="productColorCopy" data-reveal>
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
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [officialDetails, setOfficialDetails] = useState<OfficialHomePageDetails | null>(null);
  useModelScrollChoreography(pageRef, `${modelKey}-${officialDetails ? "official" : "fallback"}`);

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
    <div className="officialModelPage" id="main-content" ref={pageRef}>
      <div className="modelScrollThread" aria-hidden="true">
        <span />
      </div>

      <section className="productHeroReplica" data-scroll-scene>
        <video src={heroVideo} autoPlay muted loop playsInline preload="metadata" />
        <div>
          <p>{t(seriesText)}</p>
        </div>
      </section>

      <ProductSequenceCanvas lines={sequenceLines} frames={sequenceFrames} />

      <section className="productDetailReplica" data-scroll-scene>
        <div className="productSectionTitle" data-reveal>
          <h2>{t(aestheticsTitle)}</h2>
          <p>{t(aestheticsText)}</p>
        </div>
        <div className="productDetailGrid">
          {detailCards.map(([title, text, image], index) => (
            <article data-reveal key={title} style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}>
              <img src={image} alt={t(title)} loading="lazy" />
              <div>
                <h3>{t(title)}</h3>
                <p>{t(text)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="productWindSection" data-scroll-scene>
        <video src={windVideo} muted loop playsInline autoPlay preload="metadata" />
        <div data-reveal>
          <h2>{t(windTitle)}</h2>
          <p>{t(windText)}</p>
        </div>
      </section>

      <ProductColorTheater stories={colorStories} />

      <section className="productModelCanvas" data-scroll-scene>
        <div className="productModelCanvasCopy" data-reveal>
          <span>{t("3D MODEL")}</span>
          <h2>{t("旋转模型")}</h2>
          <p>{t("官方 GLB 资源已接入本地画布，可拖拽查看船体比例与水翼结构。")}</p>
        </div>
        <ModelStage variant={modelKey === "h1" ? "h1" : "y3"} />
      </section>

      <section className="productTechnicalSection" data-scroll-scene>
        <img src={technicalBackground} alt={t("Technical data background")} />
        <div className="productTechnicalInner">
          <h2 data-reveal>{t(technicalTitle)}</h2>
          <div className="productTechnicalCard" data-reveal>
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

      <section className="productGalleryReplica" data-scroll-scene>
        <div className="productSectionTitle" data-reveal>
          <h2>{t(galleryTitle)}</h2>
          <p>{t(galleryText)}</p>
        </div>
        <div className="productGalleryTrack">
          {galleryItems.map((item, index) => {
            const fallbackItem = modelGalleryItems[index];
            const branded = !officialDetails && Boolean(fallbackItem && "brand" in fallbackItem && fallbackItem.brand === true);

            return (
              <article
                className={branded ? "brand" : ""}
                data-reveal
                key={`${item.src}-${index}`}
                style={{ "--reveal-delay": `${Math.min(index, 5) * 70}ms` } as CSSProperties}
              >
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
