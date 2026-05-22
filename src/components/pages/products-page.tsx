/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import styles from "./products-page.module.css";

const A = "https://www.fly-h2o.cn/assets";

const productsMedia = {
  heroVideo: `${A}/video/video-17-CUuGGuFh.mp4`,
  overviewVideo: `${A}/video/video-2-DFzHsRMm.mp4`,
  topView: `${A}/img/icon-14-Dg4Zn3GG.png`,
  carbonFiber: `${A}/img/home-15-DhV2dv8a.jpeg`,
  controlArchitecture: `${A}/img/h2-1-BI_zgU0H.jpg`,
  performance: `${A}/img/h2-2-CdzpsO7N.jpg`,
};

const productParts = [
  {
    en: "Carbon Monocoque",
    title: "碳纤维单体壳",
    top: "50%",
    left: "76%",
    side: "right",
    zoom: 1,
  },
  {
    en: "Propulsion",
    title: "智能矩阵灯组",
    top: "8%",
    left: "60%",
    side: "right",
    zoom: 1.32,
  },
  {
    en: "Front Hydrofoil",
    title: "前水翼",
    top: "14%",
    left: "20%",
    side: "left",
    zoom: 1.32,
  },
  {
    en: "IMU Array",
    title: "智能驾驶舱",
    top: "40%",
    left: "50%",
    side: "right",
    zoom: 1.32,
  },
  {
    en: "Rear Hydrofoil",
    title: "后水翼",
    top: "80%",
    left: "6%",
    side: "left",
    zoom: 1.32,
  },
  {
    en: "Liquid-Cooled Battery",
    title: "液冷电池系统",
    top: "98%",
    left: "50%",
    side: "right",
    zoom: 1,
  },
] as const;

const productMetrics = [
  { id: "CRUISE", value: "30", unit: "kt", label: "巡航速度" },
  { id: "V-MAX", value: "33", unit: "kt", label: "最高速度" },
  { id: "RANGE", value: "2.5", unit: "h", label: "续航时间" },
  { id: "CHARGE", value: "1.5", unit: "h", label: "快充时间" },
] as const;

function useActivePartIndex(count: number) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
        setActiveIndex(Math.min(count - 1, Math.floor(progress * count)));
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [count]);

  return [sectionRef, activeIndex] as const;
}

export function ProductsPage() {
  const { t } = useI18n();
  const [overviewRef, activePartIndex] = useActivePartIndex(productParts.length);
  const activePart = productParts[activePartIndex];
  const mediaStyle = {
    transform: `scale(${activePart.zoom})`,
    transformOrigin: `${activePart.left} ${activePart.top}`,
  } as CSSProperties;

  return (
    <div className={styles.page} id="main-content">
      <section className={styles.hero} aria-label={t("控制架构")}>
        <video src={productsMedia.heroVideo} autoPlay muted loop playsInline preload="metadata" />
        <div className={styles.heroTitle}>
          <h1>{t("控制架构")}</h1>
        </div>
      </section>

      <section className={styles.overview} ref={overviewRef} aria-label={t("水翼结构分解")}>
        <div className={styles.overviewSticky}>
          <video className={styles.overviewVideo} src={productsMedia.overviewVideo} autoPlay muted loop playsInline preload="metadata" />
          <div className={styles.overviewGlow} />
          <div className={styles.indexNumber}>{String(activePartIndex + 1).padStart(2, "0")}</div>

          <div className={styles.mediaFrame}>
            <div className={styles.topView} style={mediaStyle}>
              <img src={productsMedia.topView} alt={t("水翼艇俯视结构图")} />
              {productParts.map((part, index) => {
                const isActive = index === activePartIndex;

                return (
                  <span
                    className={`${styles.partDot} ${isActive ? styles.activeDot : ""}`}
                    key={part.en}
                    style={{ top: part.top, left: part.left }}
                  >
                    <span />
                    {isActive ? <i className={part.side === "left" ? styles.lineLeft : styles.lineRight} /> : null}
                  </span>
                );
              })}
            </div>
          </div>

          <aside className={`${styles.partPanel} ${activePart.side === "left" ? styles.panelLeft : styles.panelRight}`}>
            <span>{activePart.en}</span>
            <h2>{t(activePart.title)}</h2>
          </aside>

          <div className={styles.scrollHint}>
            <span>SCROLL</span>
            <i />
          </div>
        </div>
      </section>

      <section className={styles.craftSection}>
        <div className={styles.cardGrid}>
          <article className={styles.imageCard}>
            <img src={productsMedia.carbonFiber} alt={t("碳纤维船体")} loading="lazy" />
            <div className={styles.cornerFrame} aria-hidden="true" />
            <h2>{t("碳纤维船体")}</h2>
          </article>
          <article className={styles.imageCard}>
            <img src={productsMedia.controlArchitecture} alt={t("控制架构")} loading="lazy" />
            <div className={styles.cornerFrame} aria-hidden="true" />
            <h2>{t("稳定控制")}</h2>
          </article>
        </div>
      </section>

      <section className={styles.metricsSection}>
        <div className={styles.metricsFrame}>
          <img src={productsMedia.performance} alt={t("水翼艇性能")} loading="lazy" />
          <div className={styles.metricsCopy}>
            <h2>{t("性能参数")}</h2>
            <p>LOA 4.9 M · BEAM 3.4 M · DRAFT 1.2 M · 5 PAX</p>
          </div>
          <div className={styles.metricGrid}>
            {productMetrics.map((metric) => (
              <article key={metric.id}>
                <span>{metric.id}</span>
                <strong>
                  {metric.value}
                  <small>{metric.unit}</small>
                </strong>
                <p>{t(metric.label)}</p>
              </article>
            ))}
          </div>
        </div>
        <Link className={styles.cta} href="/store/hydrofoil">
          {t("了解更多")}
        </Link>
      </section>
    </div>
  );
}
