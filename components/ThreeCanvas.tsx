"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Quality = "high" | "medium" | "low" | "off";

type ThreeCanvasProps = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  quality?: Quality;
  onReady?: () => void;
};

/** Intrinsic logo1.png size — never alter this aspect */
const LOGO_W = 564;
const LOGO_H = 442;
const LOGO_ASPECT = LOGO_W / LOGO_H;

function detectQuality(): Quality {
  if (typeof window === "undefined") return "off";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";

  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return "off";
  // Release the probe context instead of leaving it to hit the browser cap.
  (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();

  const mem =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  const tablet = window.innerWidth < 1024;

  if (mem <= 2 || cores <= 2) return "low";
  if (narrow || coarse) return "low";
  if (tablet || mem <= 4) return "medium";
  return "high";
}

export function ThreeCanvas({ scrollRef, quality: qualityProp, onReady }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const container = containerRef.current;
    const scrollEl = scrollRef.current;
    if (!container || !scrollEl) return;

    const quality = qualityProp ?? detectQuality();
    if (quality === "off") {
      container.classList.add("three-canvas--off");
      readyRef.current?.();
      return;
    }

    const isLow = quality === "low";
    const isMed = quality === "medium";
    const dprCap = isLow ? 1 : isMed ? 1.25 : 1.75;
    const starCount = isLow ? 280 : isMed ? 600 : 1100;
    const tubeSegs = isLow ? 80 : isMed ? 140 : 200;
    const sphereSegs = isLow ? 20 : isMed ? 32 : 48;
    const ringSegs = isLow ? 48 : isMed ? 72 : 96;
    const studioParticles = isLow ? 0 : isMed ? 180 : 360;
    const includeCards = !isLow;
    const includeServicesShapes = !isLow;

    let disposed = false;
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(obj: T) => {
      disposables.push(obj);
      return obj;
    };

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050509, isLow ? 0.028 : 0.022);

    const aspect = () => window.innerWidth / Math.max(1, window.innerHeight);
    const isNarrow = () => window.innerWidth < 768;
    const camera = new THREE.PerspectiveCamera(
      isNarrow() ? 62 : 55,
      aspect(),
      0.1,
      200
    );
    camera.position.set(0, 0, isNarrow() ? 18 : 16);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isLow,
      alpha: true,
      powerPreference: isLow ? "low-power" : "default",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.72;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.28));
    const dir1 = new THREE.DirectionalLight(0x8b5cf6, 0.9);
    dir1.position.set(8, 18, 12);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0x22d3ee, 0.65);
    dir2.position.set(-12, -8, 8);
    scene.add(dir2);
    const cometLight = new THREE.PointLight(0xffffff, isLow ? 1.2 : 1.8, 22);
    scene.add(cometLight);

    const starGeo = track(new THREE.BufferGeometry());
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 180;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 70 - 10;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starField = new THREE.Points(
      starGeo,
      track(
        new THREE.PointsMaterial({
          color: 0xf5f3ff,
          size: isLow ? 0.14 : 0.1,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      )
    );
    scene.add(starField);

    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 14, 0),
        new THREE.Vector3(-5, 7, 2),
        new THREE.Vector3(6, 1, 1),
        new THREE.Vector3(-4, -5, 2),
        new THREE.Vector3(5, -11, 1),
        new THREE.Vector3(-3, -17, 0),
        new THREE.Vector3(0, -23, -2),
      ],
      false,
      "centripetal",
      0.5
    );

    scene.add(
      new THREE.Mesh(
        track(new THREE.TubeGeometry(curve, tubeSegs, 0.04, 8, false)),
        track(
          new THREE.MeshBasicMaterial({
            color: 0xaabbff,
            transparent: true,
            opacity: 0.1,
            depthWrite: false,
          })
        )
      )
    );

    if (!isLow) {
      scene.add(
        new THREE.Mesh(
          track(new THREE.TubeGeometry(curve, tubeSegs, 0.09, 8, false)),
          track(
            new THREE.MeshBasicMaterial({
              color: 0x8b5cf6,
              transparent: true,
              opacity: 0.04,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            })
          )
        )
      );
    }

    const cometHead = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.22, 16, 16)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.45,
        })
      )
    );
    scene.add(cometHead);

    const createRing = (
      radius: number,
      tube: number,
      color: number,
      rx: number,
      rz: number,
      opacity = 0.28
    ) => {
      const mesh = new THREE.Mesh(
        track(new THREE.TorusGeometry(radius, tube, 8, ringSegs)),
        track(
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        )
      );
      mesh.rotation.x = rx;
      mesh.rotation.z = rz;
      return mesh;
    };

    // ─── Hero: logo1 (exact aspect) + soft rings ───
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 11, 0);
    if (isNarrow()) heroGroup.scale.setScalar(0.82);

    const logoPivot = new THREE.Group();
    heroGroup.add(logoPivot);

    const ring1 = createRing(4.6, 0.028, 0x22d3ee, Math.PI * 0.42, 0.15, 0.22);
    const ring2 = createRing(5.0, 0.022, 0xf472b6, Math.PI * 0.44, 0.65, 0.18);
    heroGroup.add(ring1, ring2);
    if (!isLow) {
      heroGroup.add(createRing(4.1, 0.016, 0x6366f1, Math.PI * 0.36, -0.35, 0.14));
    }
    scene.add(heroGroup);

    let logoMesh: THREE.Mesh | null = null;
    let logoReady = false;
    let signaledReady = false;

    // Sized to sit behind hero copy without overpowering it
    const logoHeight = isNarrow() ? 3.8 : 4.6;
    const logoWidth = logoHeight * LOGO_ASPECT; // preserve 564×442 exactly

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/images/logo1.png",
      (tex) => {
        // Effect already cleaned up before the texture arrived: free it and bail.
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.premultiplyAlpha = false;
        track(tex);

        // Soft bloom disc behind logo (does not alter logo pixels)
        const glow = new THREE.Mesh(
          track(new THREE.CircleGeometry(logoHeight * 0.68, 48)),
          track(
            new THREE.MeshBasicMaterial({
              color: 0x1e3a8a,
              transparent: true,
              opacity: 0.1,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            })
          )
        );
        glow.position.z = -0.15;
        logoPivot.add(glow);

        const mat = track(
          new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0.92,
            depthWrite: false,
            side: THREE.DoubleSide,
            toneMapped: false, // keep brand colors exact
          })
        );
        logoMesh = new THREE.Mesh(
          track(new THREE.PlaneGeometry(logoWidth, logoHeight)),
          mat
        );
        logoMesh.position.z = 0.05;
        logoPivot.add(logoMesh);
        logoReady = true;
        if (!signaledReady) {
          signaledReady = true;
          readyRef.current?.();
        }
      },
      undefined,
      () => {
        if (!signaledReady) {
          signaledReady = true;
          readyRef.current?.();
        }
      }
    );

    const manifestoGroup = new THREE.Group();
    manifestoGroup.position.set(isNarrow() ? 2.4 : isLow ? 3.2 : 5.5, 5, -1);
    if (isNarrow()) manifestoGroup.scale.setScalar(0.85);
    const knotMesh = new THREE.Mesh(
      track(new THREE.IcosahedronGeometry(isLow ? 1.2 : 1.45, 0)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0xc4b5fd,
          roughness: 0.25,
          metalness: 0.7,
          emissive: 0x4c1d95,
          emissiveIntensity: 0.12,
          flatShading: true,
          transparent: true,
          opacity: 0.42,
        })
      )
    );
    manifestoGroup.add(knotMesh);
    const mRing1 = createRing(2.6, 0.022, 0x22d3ee, Math.PI * 0.45, 0.12, 0.2);
    manifestoGroup.add(mRing1);
    if (!isLow) {
      manifestoGroup.add(createRing(2.95, 0.016, 0xf472b6, Math.PI * 0.38, 0.85, 0.16));
    }
    scene.add(manifestoGroup);

    let icoMesh: THREE.Mesh | null = null;
    let miniKnotMesh: THREE.Mesh | null = null;
    let octaMesh: THREE.Mesh | null = null;
    let goldRingMesh: THREE.Mesh | null = null;

    if (includeServicesShapes) {
      const servicesGroup = new THREE.Group();
      servicesGroup.position.set(4.6, -1.5, 0);
      const softStd = (color: number) =>
        track(
          new THREE.MeshStandardMaterial({
            color,
            roughness: 0.2,
            metalness: 0.75,
            flatShading: true,
            transparent: true,
            opacity: 0.4,
          })
        );

      icoMesh = new THREE.Mesh(track(new THREE.IcosahedronGeometry(1.1, 0)), softStd(0x22d3ee));
      icoMesh.position.set(-1.8, 1.2, 0);

      miniKnotMesh = new THREE.Mesh(
        track(new THREE.TorusKnotGeometry(0.7, 0.18, 48, 8)),
        softStd(0x8b5cf6)
      );
      miniKnotMesh.position.set(1.5, 1.0, -1);

      octaMesh = new THREE.Mesh(track(new THREE.OctahedronGeometry(1.0, 0)), softStd(0xf472b6));
      octaMesh.position.set(-0.8, -1.4, 0.5);

      goldRingMesh = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.9, 0.2, 12, 40)),
        softStd(0xff5e3a)
      );
      goldRingMesh.position.set(1.8, -1.2, -0.5);

      servicesGroup.add(icoMesh, miniKnotMesh, octaMesh, goldRingMesh);
      scene.add(servicesGroup);
    }

    let card1: THREE.Mesh | null = null;
    let card2: THREE.Mesh | null = null;
    let card3: THREE.Mesh | null = null;

    if (includeCards) {
      // Products section (~scroll mid-late)
      const agentsGroup = new THREE.Group();
      agentsGroup.position.set(0, -7.5, 0);

      const createCardTexture = (c1: string, c2: string, c3: string) => {
        const c = document.createElement("canvas");
        c.width = isMed ? 256 : 384;
        c.height = isMed ? 340 : 512;
        const ctx = c.getContext("2d")!;
        const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
        grad.addColorStop(0, c1);
        grad.addColorStop(0.5, c2);
        grad.addColorStop(1, c3);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, c.width, c.height);
        return track(new THREE.CanvasTexture(c));
      };

      const cardGeo = track(new THREE.BoxGeometry(2.2, 3.0, 0.08));
      const cardMat = (map: THREE.Texture) =>
        track(
          new THREE.MeshStandardMaterial({
            map,
            roughness: 0.35,
            metalness: 0.35,
            transparent: true,
            opacity: 0.38,
          })
        );

      card1 = new THREE.Mesh(cardGeo, cardMat(createCardTexture("#818cf8", "#c084fc", "#22d3ee")));
      card1.position.set(-3, 0, 0);
      card1.rotation.set(0.1, 0.32, -0.04);

      card2 = new THREE.Mesh(cardGeo, cardMat(createCardTexture("#3b82f6", "#1e1b4b", "#22d3ee")));
      card2.position.set(0, 0.3, 0.6);
      card2.rotation.set(-0.04, -0.08, 0.02);

      card3 = new THREE.Mesh(cardGeo, cardMat(createCardTexture("#f97316", "#047857", "#e11d48")));
      card3.position.set(3, -0.15, 0);
      card3.rotation.set(0.1, -0.35, 0.05);

      agentsGroup.add(card1, card2, card3);
      scene.add(agentsGroup);
    }

    // Contact section (end of scroll) — reused soft orb, no Studio section
    const studioGroup = new THREE.Group();
    studioGroup.position.set(0, -12.5, 0);
    const cyanOrb = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.5, sphereSegs, sphereSegs)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0x22d3ee,
          emissive: 0x0891b2,
          emissiveIntensity: 0.28,
          roughness: 0.2,
          metalness: 0.75,
          transparent: true,
          opacity: 0.4,
        })
      )
    );
    studioGroup.add(cyanOrb);
    studioGroup.add(createRing(3.1, 0.022, 0x22d3ee, Math.PI * 0.44, 0.28, 0.2));

    let studioPoints: THREE.Points | null = null;
    if (studioParticles > 0) {
      const sGeo = track(new THREE.BufferGeometry());
      const sPos = new Float32Array(studioParticles * 3);
      for (let i = 0; i < studioParticles; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);
        const r = 2 + Math.random() * 3.2;
        sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        sPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        sPos[i * 3 + 2] = r * Math.cos(phi);
      }
      sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
      studioPoints = new THREE.Points(
        sGeo,
        track(
          new THREE.PointsMaterial({
            color: 0x67e8f9,
            size: 0.06,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        )
      );
      studioGroup.add(studioPoints);
    }
    scene.add(studioGroup);

    let scrollProgress = 0;
    let targetProgress = 0;
    let animId = 0;
    let running = true;
    let last = performance.now();

    // Unblock loader if texture is slow
    const readyFallback = window.setTimeout(() => {
      if (!signaledReady) {
        signaledReady = true;
        readyRef.current?.();
      }
    }, 1800);

    // Cache maxScroll so the per-frame scroll handler only reads scrollTop
    // (avoids potential forced synchronous layout on every scroll event).
    let maxScroll = 0;
    const recalcMaxScroll = () => {
      maxScroll = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);
    };
    const updateScroll = () => {
      targetProgress = maxScroll > 0 ? scrollEl.scrollTop / maxScroll : 0;
    };
    recalcMaxScroll();
    const scrollRo = new ResizeObserver(() => {
      recalcMaxScroll();
      updateScroll();
    });
    scrollRo.observe(scrollEl);
    if (scrollEl.firstElementChild) scrollRo.observe(scrollEl.firstElementChild);
    scrollEl.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    const onVis = () => {
      running = document.visibilityState === "visible";
      // Cancel any frame still pending from before the tab was hidden,
      // otherwise each hide/show cycle spawns an extra concurrent loop.
      cancelAnimationFrame(animId);
      if (running) {
        last = performance.now();
        animId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    const tmp = new THREE.Vector3();
    const animate = (now: number) => {
      if (!running) return;
      animId = requestAnimationFrame(animate);

      const minDelta = isLow ? 32 : isMed ? 22 : 0;
      if (minDelta && now - last < minDelta) return;
      last = now;
      const elapsed = now * 0.001;

      scrollProgress += (targetProgress - scrollProgress) * 0.08;
      const t = Math.min(0.999, Math.max(0.001, scrollProgress));
      curve.getPointAt(t, tmp);
      cometHead.position.copy(tmp);
      cometLight.position.copy(tmp);

      // 5 viewport sections (hero → contact): camera travels hero → contact orb
      const targetCamY = 14 - scrollProgress * 26.5;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      if (!isLow) camera.position.x = Math.sin(elapsed * 0.08) * 0.28;
      camera.lookAt(0, camera.position.y - 2, 0);

      // Rings orbit; logo stays upright & undistorted
      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.0045;

      if (logoReady && logoMesh) {
        // Gentle float + soft yaw (never scales non-uniformly)
        logoPivot.position.y = Math.sin(elapsed * 0.7) * 0.18;
        logoPivot.rotation.y = Math.sin(elapsed * 0.45) * 0.22;
        logoPivot.rotation.x = Math.sin(elapsed * 0.35) * 0.06;
        const mat = logoMesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.88 + Math.sin(elapsed * 0.9) * 0.05;
      }

      knotMesh.rotation.x = elapsed * 0.22;
      knotMesh.rotation.y = elapsed * 0.35;
      mRing1.rotation.z += 0.007;

      if (icoMesh) {
        icoMesh.rotation.x += 0.005;
        icoMesh.rotation.y += 0.008;
      }
      if (miniKnotMesh) miniKnotMesh.rotation.y += 0.01;
      if (octaMesh) octaMesh.rotation.z += 0.007;
      if (goldRingMesh) goldRingMesh.rotation.x += 0.008;

      if (card1) card1.rotation.y = 0.32 + Math.sin(elapsed * 0.55) * 0.05;
      if (card2) card2.rotation.y = -0.08 + Math.cos(elapsed * 0.5) * 0.05;
      if (card3) card3.rotation.y = -0.35 + Math.sin(elapsed * 0.6) * 0.05;

      studioGroup.rotation.y = elapsed * 0.12;
      if (studioPoints) studioPoints.rotation.x = elapsed * 0.05;
      starField.rotation.y = elapsed * 0.01;

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / Math.max(1, h);
        camera.fov = w < 768 ? 62 : 55;
        camera.position.z = w < 768 ? 18 : 16;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
        heroGroup.scale.setScalar(w < 768 ? 0.82 : 1);
      });
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      running = false;
      clearTimeout(readyFallback);
      cancelAnimationFrame(animId);
      cancelAnimationFrame(resizeRaf);
      scrollRo.disconnect();
      scrollEl.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qualityProp ?? "auto"]);

  return <div ref={containerRef} className="three-canvas" aria-hidden="true" />;
}
