/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties } from "react";
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { useI18n } from "@/i18n";
import { dracoDecoder, media } from "../data/media";
import { useNearViewport } from "../hooks/use-near-viewport";

function ModelObject({ src, variant }: { src: string; variant: "y3" | "h1" }) {
  const { scene } = useGLTF(src, dracoDecoder);
  const cloned = useMemo(() => scene.clone(), [scene]);
  const scale = variant === "h1" ? 0.34 : 0.00095;

  return (
    <group rotation={[-0.12, -0.72, 0]} scale={scale} position={[0, -0.42, 0]}>
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

export function ModelStage({ variant = "y3" }: { variant?: "y3" | "h1" }) {
  const { t } = useI18n();
  const src = variant === "h1" ? media.modelH1 : media.modelY3;
  const poster = variant === "h1" ? media.y5Menu : media.y3Menu;
  const [stageRef, shouldRenderCanvas] = useNearViewport<HTMLDivElement>("900px");

  return (
    <div
      className="modelStage"
      ref={stageRef}
      style={{ "--model-poster": `url(${poster})` } as CSSProperties}
      aria-label={t("3D hydrofoil model preview")}
    >
      {shouldRenderCanvas ? (
        <Canvas
          camera={{ position: [0, 0.55, 7.6], fov: 38 }}
          dpr={[1, 1.75]}
          fallback={<img className="modelFallback" src={poster} alt="" />}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.25} />
          <directionalLight position={[4, 4, 5]} intensity={3.2} color="#ffffff" />
          <directionalLight position={[-4, 1.5, -3]} intensity={1.4} color="#00fff7" />
          <Suspense
            fallback={
              <Html center>
                <span className="modelLoading">{t("LOADING")}</span>
              </Html>
            }
          >
            <ModelObject src={src} variant={variant} />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.55} />
        </Canvas>
      ) : (
        <img className="modelFallback" src={poster} alt="" loading="lazy" />
      )}
    </div>
  );
}
