/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties, RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n, type Locale } from "@/i18n";
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
type ModelKey = keyof typeof DEFAULT_MODEL_IDS;

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

function pickLocalizedText(official: string | undefined, fallback: string, locale: Locale) {
  if (locale !== "en") return fallback;
  if (!official) return fallback;
  return official;
}

function pickLocalizedLines(official: string | undefined, fallback: readonly string[], locale: Locale) {
  if (locale !== "en") return [...fallback];
  if (!official) return [...fallback];
  const lines = splitHtmlLines(official);
  if (lines.length === 0) return [...fallback];
  return lines;
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

function forceHttpsUrl(url?: string) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http://") ? trimmed.replace("http://", "https://") : trimmed;
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
  const [isInView, setIsInView] = useState(false);
  const [readyVideoKey, setReadyVideoKey] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const previousRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);
  const safeActive = stories.length > 0 ? Math.min(active, stories.length - 1) : 0;
  const current = stories[safeActive];
  const activeMediaKey = current ? `${current.image}\u0000${current.video}` : "";
  const storySignature = useMemo(
    () => stories.map((item) => `${item.image}\u0000${item.video}`).join("\u0001"),
    [stories],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: "160px 0px",
        threshold: 0.12,
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    previousRef.current = safeActive;

    for (const video of videoRefs.current) {
      if (!video) continue;
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // Ignore browsers that reject seeking before metadata is ready.
      }
    }
  }, [safeActive, storySignature]);

  useEffect(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    const previous = previousRef.current;
    if (previous !== safeActive) {
      const previousVideo = videoRefs.current[previous];
      if (previousVideo) {
        previousVideo.pause();
        resetTimerRef.current = window.setTimeout(() => {
          previousVideo.currentTime = 0;
        }, 700);
      }
    }

    previousRef.current = safeActive;

    const currentVideo = videoRefs.current[safeActive];
    if (!currentVideo) return undefined;

    currentVideo.pause();
    if (!isInView) return undefined;

    let cancelled = false;
    const playCurrent = () => {
      if (cancelled) return;

      try {
        currentVideo.currentTime = 0;
      } catch {
        // Metadata can still be pending on the first render.
      }

      currentVideo.play().catch(() => {
        setReadyVideoKey((state) => (state === activeMediaKey ? null : state));
      });
    };

    if (currentVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playCurrent();
    } else {
      currentVideo.addEventListener("loadeddata", playCurrent, { once: true });
      currentVideo.load();
    }

    return () => {
      cancelled = true;
      currentVideo.removeEventListener("loadeddata", playCurrent);
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, [activeMediaKey, isInView, safeActive]);

  const setVideoVisible = useCallback((index: number, ready: boolean) => {
    const item = stories[index];
    if (!item) return;

    const key = `${item.image}\u0000${item.video}`;
    setReadyVideoKey((state) => {
      if (ready) return state === key ? state : key;
      return state === key ? null : state;
    });
  }, [stories]);

  const onVideoPlaying = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (index === safeActive && video && !video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setVideoVisible(index, true);
    }
  }, [safeActive, setVideoVisible]);

  const onVideoPause = useCallback((index: number) => {
    setVideoVisible(index, false);
  }, [setVideoVisible]);

  const onVideoEnded = useCallback((index: number) => {
    setVideoVisible(index, false);
  }, [setVideoVisible]);

  if (!current) return null;

  return (
    <section className="productColorTheater" data-scroll-scene ref={sectionRef}>
      <div className="productColorMedia">
        {stories.map((item, index) => {
          const mediaKey = `${item.image}\u0000${item.video}`;
          const isVideoReady = readyVideoKey === mediaKey;

          return (
            <div className={safeActive === index ? "active" : ""} key={`${item.name}-${index}`}>
              <img className={isVideoReady ? "isHidden" : ""} src={item.image} alt={t(item.name)} />
              <video
                className={isVideoReady ? "isReady" : ""}
                muted
                onEnded={() => onVideoEnded(index)}
                onPause={() => onVideoPause(index)}
                onPlaying={() => onVideoPlaying(index)}
                onTimeUpdate={() => onVideoPlaying(index)}
                playsInline
                poster={item.image}
                preload={safeActive === index ? "auto" : "metadata"}
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                src={item.video}
              />
            </div>
          );
        })}
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
  const { t, locale } = useI18n();
  const modelKey: ModelKey = path === "/models/h2" ? "h2" : page.label === "Y-5" ? "h2" : "h1";
  const shouldShowModelCanvas = path !== "/models/h1";
  const copy = modelPageCopy[modelKey];
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [officialDetails, setOfficialDetails] = useState<OfficialHomePageDetails | null>(null);
  const [officialDetailsModelKey, setOfficialDetailsModelKey] = useState<ModelKey | null>(null);
  const activeOfficialDetails = officialDetailsModelKey === modelKey ? officialDetails : null;
  useModelScrollChoreography(pageRef, `${modelKey}-${activeOfficialDetails ? "official" : "fallback"}`);

  useEffect(() => {
    let cancelled = false;
    const modelId = DEFAULT_MODEL_IDS[modelKey];

    async function loadOfficialDetails() {
      try {
        const response = await fetch(`/app-api/product/spu/get-detail?id=${modelId}`, { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) {
            setOfficialDetails(null);
            setOfficialDetailsModelKey(modelKey);
          }
          return;
        }
        const payload = (await response.json()) as OfficialSpuResponse;
        if (!cancelled) {
          setOfficialDetails(payload.data?.homePageDetails ?? null);
          setOfficialDetailsModelKey(modelKey);
        }
      } catch {
        if (!cancelled) {
          setOfficialDetails(null);
          setOfficialDetailsModelKey(modelKey);
        }
      }
    }

    void loadOfficialDetails();

    return () => {
      cancelled = true;
    };
  }, [modelKey]);

  const seriesText = pickLocalizedText(activeOfficialDetails?.templateA?.text, copy.series, locale);
  const heroVideo = forceHttpsUrl(activeOfficialDetails?.templateA?.mediaUrl) || copy.heroVideo;
  const sequenceLines = useMemo(
    () => pickLocalizedLines(activeOfficialDetails?.templateB?.text, copy.sequenceLines, locale),
    [activeOfficialDetails?.templateB?.text, copy.sequenceLines, locale],
  );

  const sequenceFrames = useMemo(() => {
    const urls = (activeOfficialDetails?.templateB?.mediaUrls || []).map((url) => forceHttpsUrl(url)).filter(Boolean);
    if (urls.length > 0) return sortMediaUrls(urls);
    return modelKey === "h1" ? modelSequenceFramesOfficial : modelSequenceFrames;
  }, [activeOfficialDetails?.templateB?.mediaUrls, modelKey]);

  const aestheticsTitle = pickLocalizedText(activeOfficialDetails?.templateC?.title, copy.aestheticsTitle, locale);
  const aestheticsText = pickLocalizedText(activeOfficialDetails?.templateC?.text, copy.aestheticsText, locale);
  const detailCards = useMemo((): Array<[string, string, string]> => {
    const fallbackCards = modelDetailCards.map(([title, text, image]): [string, string, string] => [title, text, image]);
    const cards = activeOfficialDetails?.templateC?.cards || [];
    if (cards.length > 0) {
      return cards
        .map((card, index): [string, string, string] => {
          const fallback = fallbackCards[index] || ["", "", ""];
          return [
            pickLocalizedText(card.title?.trim(), fallback[0], locale),
            pickLocalizedText(card.text, fallback[1], locale),
            forceHttpsUrl(card.mediaUrl) || fallback[2],
          ];
        })
        .filter(([, , image]) => Boolean(image));
    }
    return fallbackCards;
  }, [activeOfficialDetails?.templateC?.cards, locale]);

  const windVideo = forceHttpsUrl(activeOfficialDetails?.templateD?.mediaUrl) || media.modelWind;
  const windTitle = pickLocalizedText(activeOfficialDetails?.templateD?.title, copy.windTitle, locale);
  const windText = pickLocalizedText(activeOfficialDetails?.templateD?.text, copy.windText, locale);

  const colorStories = useMemo((): RuntimeColorStory[] => {
    const stories = activeOfficialDetails?.templateE || [];
    if (stories.length > 0) {
      return stories
        .map((item): RuntimeColorStory => ({
          sectionTitle: pickLocalizedText(item.leftSmallText, "富有生命力的色彩", locale),
          name: pickLocalizedText(item.leftBigText, "", locale),
          description: pickLocalizedText(item.rightSmallText, "", locale),
          color: item.color || "#000000",
          image: forceHttpsUrl(item.imageUrl),
          video: forceHttpsUrl(item.videoUrl),
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
  }, [activeOfficialDetails?.templateE, locale]);

  const technicalBackground = forceHttpsUrl(activeOfficialDetails?.templateF?.backgroundImageUrl) || media.modelTech;
  const technicalTitle = pickLocalizedText(activeOfficialDetails?.templateF?.leftBigTitle, "技术参数", locale);
  const technicalSpecs = useMemo((): Array<[string, Array<[string, string]>]> => {
    const fallbackSpecs = copy.specs.map(([group, rows]): [string, Array<[string, string]>] => [
      group,
      rows.map(([label, value]): [string, string] => [label, value]),
    ]);
    const cards = activeOfficialDetails?.templateF?.rightCards || [];
    if (cards.length > 0) {
      return cards.map((card, index): [string, Array<[string, string]>] => {
        const fallbackGroup = fallbackSpecs[index]?.[0] || "";
        const fallbackRows = fallbackSpecs[index]?.[1] || [];
        const rows = (card.maps || []).map((map, rowIndex): [string, string] => {
          const fallbackRow = fallbackRows[rowIndex] || ["", ""];
          return [
            pickLocalizedText(map.key, fallbackRow[0], locale),
            pickLocalizedText(map.value, fallbackRow[1], locale),
          ];
        });
        return [pickLocalizedText(card.title, fallbackGroup, locale), rows.length > 0 ? rows : fallbackRows];
      });
    }
    return fallbackSpecs;
  }, [activeOfficialDetails?.templateF?.rightCards, copy.specs, locale]);

  const galleryTitle = pickLocalizedText(activeOfficialDetails?.templateG?.title, "画廊 水翼艇", locale);
  const galleryText = pickLocalizedText(
    activeOfficialDetails?.templateG?.text,
    `探索 ${copy.series.replace("版", "")} 的每一个精致细节，感受水上飞行的优雅之美。`,
    locale,
  );
  const galleryItems = useMemo((): RuntimeGalleryItem[] => {
    const urls = (activeOfficialDetails?.templateG?.mediaUrls || []).map((url) => forceHttpsUrl(url)).filter(Boolean);
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
  }, [activeOfficialDetails?.templateG?.mediaUrls]);

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

      {shouldShowModelCanvas ? (
        <section className="productModelCanvas" data-scroll-scene>
          <div className="productModelCanvasCopy" data-reveal>
            <span>{t("3D MODEL")}</span>
            <h2>{t("旋转模型")}</h2>
            <p>{t("官方 GLB 资源已接入本地画布，可拖拽查看船体比例与水翼结构。")}</p>
          </div>
          <ModelStage variant={modelKey === "h1" ? "h1" : "y3"} />
        </section>
      ) : null}

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
            const branded =
              !activeOfficialDetails && Boolean(fallbackItem && "brand" in fallbackItem && fallbackItem.brand === true);

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
