/* eslint-disable @next/next/no-img-element */
"use client";

import { type SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { media } from "../data/media";
import { homeRangeItems } from "../data/home";
import { productCards } from "../data/navigation";
import { useComingSoonDialog } from "../components/coming-soon-dialog";
import { useDragScroll } from "../hooks/use-drag-scroll";

function HomeHero() {
  const { t } = useI18n();
  const guideCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [heroProgress, setHeroProgress] = useState(0);
  const updateHeroProgress = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    const { currentTime, duration } = event.currentTarget;
    if (!Number.isFinite(duration) || duration <= 0) {
      setHeroProgress(0);
      return;
    }

    setHeroProgress(Math.min(1, Math.max(0, currentTime / duration)));
  }, []);

  useEffect(() => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let isActive = true;
    const width = 150;
    const height = 200;
    const lineX = width / 2;
    const glowLength = 86;
    const loopDuration = 2200;

    const drawGuideLine = (timestamp: number) => {
      if (!isActive) return;

      const dpr = window.devicePixelRatio || 1;
      const realWidth = Math.round(width * dpr);
      const realHeight = Math.round(height * dpr);

      if (canvas.width !== realWidth || canvas.height !== realHeight) {
        canvas.width = realWidth;
        canvas.height = realHeight;
      }

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = "rgba(226, 232, 240, 0.34)";
      context.moveTo(lineX, 0);
      context.lineTo(lineX, height);
      context.stroke();

      const progress = (timestamp % loopDuration) / loopDuration;
      const glowStart = -glowLength + (height + glowLength * 2) * progress;
      const glowEnd = glowStart + glowLength;
      const gradient = context.createLinearGradient(lineX, glowStart, lineX, glowEnd);

      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.38)");
      gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.96)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = gradient;
      context.shadowColor = "rgba(255, 255, 255, 0.56)";
      context.shadowBlur = 14;
      context.moveTo(lineX, glowStart);
      context.lineTo(lineX, glowEnd);
      context.stroke();
      context.shadowBlur = 0;

      animationFrame = window.requestAnimationFrame(drawGuideLine);
    };

    animationFrame = window.requestAnimationFrame(drawGuideLine);
    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="homeHero">
      <video
        className="homeHeroVideo"
        src={media.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        poster={media.productY3}
        preload="metadata"
        onTimeUpdate={updateHeroProgress}
      />
      <div className="homeHeroProgress" aria-hidden="true">
        <div className="homeHeroProgressTrack">
          <div className="homeHeroProgressValue" style={{ transform: `scaleX(${heroProgress.toFixed(6)})` }} />
        </div>
      </div>
      <div className="homeHeroContent">
        <img src={media.heroTitle} alt="Alaqua" />
        <p>{t("POWERED BY SCIENCE. ELEVATED BY WATER.")}</p>
        <Link href="/models/h1">{t("EXPLORE Y-3")}</Link>
      </div>
      <canvas ref={guideCanvasRef} width={150} height={200} className="homeHeroGuideCanvas" aria-hidden="true" />
    </section>
  );
}

function HomeY5Banner() {
  const { t } = useI18n();
  const openComingSoon = useComingSoonDialog();

  return (
    <section className="homeY5Section" id="main-content">
      <div className="shielding homeSectionShield homeSectionShieldUpper" />
      <div className="shielding homeSectionShield homeSectionShieldLower" />
      <div className="homeVideoBanner">
        <video src={media.showVideo} autoPlay muted loop playsInline preload="metadata" poster={media.y5Menu} />
        <div className="homeBannerCopy">
          <h2>{t("Y-5 FIVE-SEAT FLAGSHIP")}</h2>
          <p>{t("NEXT-GEN FLAGSHIP. LUXURY FLIGHT ON WATER.")}</p>
          <button type="button" onClick={openComingSoon}>
            {t("DISCOVER THE ALL-NEW Y-5")}
          </button>
        </div>
      </div>
    </section>
  );
}

function HomeSteering() {
  const { t } = useI18n();

  return (
    <section className="homeSteeringWrap">
      <div className="shielding homeSectionShield homeSectionShieldSteering" />
      <div className="homeSteering">
        <div className="homeSteeringMedia">
          <video src={media.steeringHomeVideo} autoPlay muted loop playsInline preload="metadata" poster={media.steeringImage} />
        </div>
        <div className="homeSteeringCopy">
          <h2>{t("NAVIGATE THE FUTURE, STEER WITH INTELLIGENCE")}</h2>
          <p>
            {t(
              "The smart tri-mode steering wheel integrates critical controls and core data into a single interaction terminal, improving maneuverability and navigation safety for high-performance hydrofoil operation.",
            )}
          </p>
          <Link href="/manufacturing/threeModes">{t("LEARN MORE")}</Link>
        </div>
      </div>
    </section>
  );
}

function HomeRangeSection() {
  const { t } = useI18n();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isLoopResettingRef = useRef(false);
  const activeRenderedIndexRef = useRef(homeRangeItems.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeRenderedIndex, setActiveRenderedIndex] = useState(homeRangeItems.length);
  const { dragging, dragProps } = useDragScroll<HTMLDivElement>(trackRef);
  const loopedRangeItems = useMemo(
    () =>
      [-1, 0, 1].flatMap((copy) =>
        homeRangeItems.map((item, index) => ({
          ...item,
          realIndex: index,
          loopKey: `copy-${copy}-${index}`,
        })),
      ),
    [],
  );

  const centeredRangeScrollLeft = useCallback((track: HTMLDivElement, card: HTMLElement) => {
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    return cardRect.left - trackRect.left + track.scrollLeft - (track.clientWidth - card.clientWidth) / 2;
  }, []);

  const scrollToRenderedRangeCard = useCallback((renderedIndex: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    const card = track?.children.item(renderedIndex) as HTMLElement | null | undefined;
    const normalizedIndex = loopedRangeItems[renderedIndex]?.realIndex ?? 0;

    activeRenderedIndexRef.current = renderedIndex;
    setActiveIndex(normalizedIndex);
    setActiveRenderedIndex(renderedIndex);
    if (!track || !card) return;

    track.scrollTo({
      left: centeredRangeScrollLeft(track, card),
      behavior,
    });
  }, [centeredRangeScrollLeft, loopedRangeItems]);

  const scrollToRangeCard = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const normalizedIndex = (index + homeRangeItems.length) % homeRangeItems.length;
      const currentRenderedIndex = activeRenderedIndexRef.current;
      const currentCopyStart = Math.floor(currentRenderedIndex / homeRangeItems.length) * homeRangeItems.length;
      let renderedIndex = currentCopyStart + normalizedIndex;
      const delta = renderedIndex - currentRenderedIndex;

      if (delta > homeRangeItems.length / 2) renderedIndex -= homeRangeItems.length;
      if (delta < -homeRangeItems.length / 2) renderedIndex += homeRangeItems.length;

      scrollToRenderedRangeCard(renderedIndex, behavior);
    },
    [scrollToRenderedRangeCard],
  );

  const jumpToRenderedRangeCard = useCallback((renderedIndex: number) => {
    const track = trackRef.current;
    const card = track?.children.item(renderedIndex) as HTMLElement | null | undefined;
    if (!track || !card) return;

    isLoopResettingRef.current = true;
    activeRenderedIndexRef.current = renderedIndex;
    setActiveIndex(loopedRangeItems[renderedIndex]?.realIndex ?? 0);
    setActiveRenderedIndex(renderedIndex);
    track.scrollTo({
      left: centeredRangeScrollLeft(track, card),
      behavior: "auto",
    });
    window.requestAnimationFrame(() => {
      isLoopResettingRef.current = false;
    });
  }, [centeredRangeScrollLeft, loopedRangeItems]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const updateActiveCard = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const cards = Array.from(track.children) as HTMLElement[];
        const viewportCenter = track.scrollLeft + track.clientWidth / 2;
        let nextRenderedIndex = 1;
        let nextDistance = Number.POSITIVE_INFINITY;

        cards.forEach((card, index) => {
          const cardCenter = card.offsetLeft + card.clientWidth / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          if (distance < nextDistance) {
            nextDistance = distance;
            nextRenderedIndex = index;
          }
        });

        activeRenderedIndexRef.current = nextRenderedIndex;
        setActiveRenderedIndex(nextRenderedIndex);

        if (!isLoopResettingRef.current && nextRenderedIndex <= 1) {
          setActiveIndex(loopedRangeItems[nextRenderedIndex]?.realIndex ?? 0);
          jumpToRenderedRangeCard(nextRenderedIndex + homeRangeItems.length);
          return;
        }

        if (!isLoopResettingRef.current && nextRenderedIndex >= loopedRangeItems.length - 2) {
          setActiveIndex(loopedRangeItems[nextRenderedIndex]?.realIndex ?? 0);
          jumpToRenderedRangeCard(nextRenderedIndex - homeRangeItems.length);
          return;
        }

        setActiveIndex(loopedRangeItems[nextRenderedIndex]?.realIndex ?? 0);
      });
    };

    const initialFrame = window.requestAnimationFrame(() => jumpToRenderedRangeCard(homeRangeItems.length));
    const initialTimer = window.setTimeout(() => jumpToRenderedRangeCard(homeRangeItems.length), 250);
    updateActiveCard();
    track.addEventListener("scroll", updateActiveCard, { passive: true });
    window.addEventListener("resize", updateActiveCard);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(initialFrame);
      window.clearTimeout(initialTimer);
      track.removeEventListener("scroll", updateActiveCard);
      window.removeEventListener("resize", updateActiveCard);
    };
  }, [jumpToRenderedRangeCard, loopedRangeItems]);

  return (
    <section className="homeRange">
      <div className="homeSectionTitle">
        <h2>{t("Real sailing footage")}</h2>
        <p>
          {t(
            "Filmed live in real waters, this documentary-style section shows range, seakeeping and stability from lift-off to high-speed cruising.",
          )}
        </p>
      </div>
      <div
        className={`homeRangeTrack${dragging ? " isDragging" : ""}`}
        ref={trackRef}
        aria-label={t("Real sailing footage")}
        {...dragProps}
      >
        {loopedRangeItems.map((item, renderedIndex) => {
          const distance = Math.abs(renderedIndex - activeRenderedIndex);
          const cardClassName = [
            "homeRangeCard",
            renderedIndex === activeRenderedIndex ? "active" : "",
            distance === 1 ? "nearby" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <article className={cardClassName} key={item.loopKey}>
              <div>
                <img src={item.image} alt={item.title} loading="lazy" />
                <span aria-hidden="true">+</span>
              </div>
              <h3>{t(item.title)}</h3>
              <p>{t(item.text)}</p>
            </article>
          );
        })}
      </div>
      <div className="homeRangeControls">
        <button
          className="homeRangeArrow"
          type="button"
          onClick={() => scrollToRenderedRangeCard(activeRenderedIndexRef.current - 1)}
          aria-label={t("Previous slide")}
        >
          <ChevronLeft size={24} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <div className="homeRangeDots" aria-label={t("Choose sailing footage")}>
          {homeRangeItems.map((item, index) => (
            <button
              className={index === activeIndex ? "active" : ""}
              type="button"
              onClick={() => scrollToRangeCard(index)}
              aria-label={`${t(item.title)} ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              key={item.title}
            />
          ))}
        </div>
        <button
          className="homeRangeArrow"
          type="button"
          onClick={() => scrollToRenderedRangeCard(activeRenderedIndexRef.current + 1)}
          aria-label={t("Next slide")}
        >
          <ChevronRight size={24} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function HomeProductsSection() {
  const { t } = useI18n();
  const openComingSoon = useComingSoonDialog();

  return (
    <section className="homeProducts">
      <h2>{t("MODEL SERIES")}</h2>
      <div className="homeProductGrid">
        {productCards.map((card) => (
          <article className="homeProductCard" key={card.title}>
            {card.comingSoon ? (
              <button className="homeProductMediaLink" type="button" onClick={openComingSoon}>
                <img src={card.image} alt={card.title} loading="lazy" />
              </button>
            ) : (
              <Link className="homeProductMediaLink" href={card.href}>
                <img src={card.image} alt={card.title} loading="lazy" />
              </Link>
            )}
            <h3>
              {card.title} <span>{t(card.label)}</span>
            </h3>
            {card.comingSoon ? (
              <button className="homeTextLink muted" type="button" onClick={openComingSoon}>
                {t("Coming Soon")}
              </button>
            ) : (
              <Link className="homeTextLink" href={card.href}>
                {t("Learn More")}
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeReplica() {
  return (
    <div className="officialHome">
      <HomeHero />
      <HomeY5Banner />
      <HomeSteering />
      <HomeRangeSection />
      <HomeProductsSection />
    </div>
  );
}
