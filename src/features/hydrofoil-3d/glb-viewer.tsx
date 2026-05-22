/* eslint-disable @next/next/no-img-element */
"use client";

import { Suspense, useMemo } from "react";
import { Center, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Box3, Group, Vector3 } from "three";
import { useNearViewport } from "@/features/fly-h2o/hooks/use-near-viewport";

type HydrofoilGlbViewerProps = {
  src?: string | null;
  poster?: string;
  className?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

function NormalizedGlbModel({ src }: { src: string }) {
  const { scene } = useGLTF(src, "/draco/");

  const normalized = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child: object) => {
      const mesh = child as { isMesh?: boolean; castShadow?: boolean; receiveShadow?: boolean };
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    const box = new Box3().setFromObject(cloned);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 1e-6);

    const normalizedGroup = new Group();
    const targetSpan = 2.4;
    const scale = targetSpan / maxDim;

    cloned.position.sub(center);
    normalizedGroup.scale.setScalar(scale);
    normalizedGroup.add(cloned);

    return normalizedGroup;
  }, [scene]);

  return (
    <group rotation={[-0.08, -0.62, 0]} position={[0, -0.15, 0]}>
      <Center>
        <primitive object={normalized} />
      </Center>
    </group>
  );
}

export function HydrofoilGlbViewer({
  src,
  poster,
  className,
  autoRotate = true,
  autoRotateSpeed = 0.6,
}: HydrofoilGlbViewerProps) {
  const [stageRef, shouldRenderCanvas] = useNearViewport<HTMLDivElement>("700px");
  const rootClass = className ? `relative overflow-hidden ${className}` : "relative h-full w-full overflow-hidden";

  if (!src) {
    return (
      <div className={rootClass}>
        {poster ? (
          <img alt="" className="h-full w-full object-contain" src={poster} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/40 text-xs tracking-[0.16em] text-white/55">3D MODEL UNAVAILABLE</div>
        )}
      </div>
    );
  }

  return (
    <div className={rootClass} ref={stageRef}>
      {shouldRenderCanvas ? (
        <Canvas camera={{ position: [0, 0.35, 4.4], fov: 36 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={1.35} />
          <directionalLight color="#ffffff" intensity={2.8} position={[4, 4, 5]} />
          <directionalLight color="#00fff7" intensity={1.4} position={[-4, 1.5, -3]} />

          <Suspense
            fallback={
              <Html center>
                <span className="rounded border border-white/20 bg-black/55 px-3 py-1 text-xs tracking-[0.14em] text-white/75">LOADING 3D</span>
              </Html>
            }
          >
            <NormalizedGlbModel key={src} src={src} />
            <Environment files="/fly-h2o-official-assets/t_env_light-r6ZBsESp.hdr" />
          </Suspense>

          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            enablePan={false}
            enableZoom
            maxDistance={8}
            minDistance={2.4}
          />
        </Canvas>
      ) : poster ? (
        <img alt="" className="h-full w-full object-contain" loading="lazy" src={poster} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-black/40 text-xs tracking-[0.16em] text-white/55">3D LOADING</div>
      )}
    </div>
  );
}
