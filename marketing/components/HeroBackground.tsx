"use client";

import { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width: number;
    let height: number;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // ---- Drawing functions ----

    function drawSky() {
      // Warm daytime sky gradient
      const grad = ctx!.createLinearGradient(0, 0, 0, height * 0.55);
      grad.addColorStop(0, "#0b1a2a");
      grad.addColorStop(0.2, "#0e2a3f");
      grad.addColorStop(0.5, "#134a5e");
      grad.addColorStop(0.75, "#1a7080");
      grad.addColorStop(1, "#1a8a8a");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, width, height * 0.55);
    }

    function drawSun() {
      const sunX = width * 0.5;
      const sunY = height * 0.18;
      const sunR = Math.min(width, height) * 0.05;

      // Outer haze
      const haze = ctx!.createRadialGradient(sunX, sunY, sunR, sunX, sunY, sunR * 12);
      haze.addColorStop(0, "rgba(255, 200, 100, 0.15)");
      haze.addColorStop(0.3, "rgba(255, 180, 80, 0.06)");
      haze.addColorStop(0.6, "rgba(255, 160, 60, 0.02)");
      haze.addColorStop(1, "rgba(255, 160, 60, 0)");
      ctx!.fillStyle = haze;
      ctx!.fillRect(0, 0, width, height * 0.6);

      // Middle glow
      const glow = ctx!.createRadialGradient(sunX, sunY, sunR * 0.5, sunX, sunY, sunR * 4);
      glow.addColorStop(0, "rgba(255, 220, 150, 0.4)");
      glow.addColorStop(0.5, "rgba(255, 200, 120, 0.1)");
      glow.addColorStop(1, "rgba(255, 180, 100, 0)");
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(sunX, sunY, sunR * 4, 0, Math.PI * 2);
      ctx!.fill();

      // Sun disc
      const disc = ctx!.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
      disc.addColorStop(0, "rgba(255, 240, 200, 0.95)");
      disc.addColorStop(0.7, "rgba(255, 220, 160, 0.85)");
      disc.addColorStop(1, "rgba(255, 200, 120, 0.6)");
      ctx!.beginPath();
      ctx!.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx!.fillStyle = disc;
      ctx!.fill();
    }

    function drawSunReflection(t: number) {
      const sunX = width * 0.5;
      const horizonY = height * 0.52;
      const shoreY = height * 0.78;

      // Shimmering light path on water
      for (let i = 0; i < 60; i++) {
        const progress = i / 60;
        const y = horizonY + progress * (shoreY - horizonY);
        const spread = 20 + progress * 80;
        const shimmer = Math.sin(t * 0.002 + i * 0.5) * (spread * 0.3);
        const alpha = 0.12 * (1 - progress * 0.8);
        const w = 4 + progress * 12;

        ctx!.fillStyle = `rgba(255, 220, 150, ${alpha})`;
        ctx!.fillRect(sunX - spread / 2 + shimmer, y, w, 2);
        ctx!.fillRect(sunX + spread / 2 - w + shimmer * 0.7, y, w, 2);
        ctx!.fillRect(sunX - w / 2 + shimmer * 0.5, y, w * 0.6, 1.5);
      }
    }

    function drawOcean(t: number) {
      const horizonY = height * 0.52;
      const shoreY = height * 0.78;

      // Ocean base
      const oceanGrad = ctx!.createLinearGradient(0, horizonY, 0, shoreY);
      oceanGrad.addColorStop(0, "#0a6a7a");
      oceanGrad.addColorStop(0.3, "#0c7d8c");
      oceanGrad.addColorStop(0.6, "#0e8e9c");
      oceanGrad.addColorStop(1, "#10a0ac");
      ctx!.fillStyle = oceanGrad;
      ctx!.fillRect(0, horizonY, width, shoreY - horizonY);

      // Wave layers
      for (let layer = 0; layer < 6; layer++) {
        const layerY = horizonY + ((shoreY - horizonY) * (layer + 1)) / 7;
        const amplitude = 2 + layer * 1.2;
        const frequency = 0.004 - layer * 0.0004;
        const speed = 0.0007 + layer * 0.00015;
        const alpha = 0.04 + layer * 0.015;

        ctx!.beginPath();
        ctx!.moveTo(0, layerY);
        for (let x = 0; x <= width; x += 3) {
          const y =
            layerY +
            Math.sin(x * frequency + t * speed) * amplitude +
            Math.sin(x * frequency * 2.1 + t * speed * 1.5) * (amplitude * 0.3);
          ctx!.lineTo(x, y);
        }
        ctx!.lineTo(width, layerY + amplitude + 4);
        ctx!.lineTo(0, layerY + amplitude + 4);
        ctx!.closePath();
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.fill();
      }
    }

    function drawWaves(t: number) {
      const shoreY = height * 0.78;

      // Breaking waves with foam
      for (let w = 0; w < 3; w++) {
        const wavePhase = t * 0.0004 + w * 2.1;
        const waveCycle = (Math.sin(wavePhase) + 1) / 2;
        const waveY = shoreY - 8 + waveCycle * 20;
        const waveAlpha = 0.2 + (1 - waveCycle) * 0.25;

        ctx!.beginPath();
        ctx!.moveTo(0, waveY + 6);
        for (let x = 0; x <= width; x += 2) {
          const y =
            waveY +
            Math.sin(x * 0.006 + t * 0.001 + w) * 3 +
            Math.sin(x * 0.015 + t * 0.002) * 1.5;
          ctx!.lineTo(x, y);
        }
        ctx!.lineTo(width, waveY + 16);
        ctx!.lineTo(0, waveY + 16);
        ctx!.closePath();

        const foamGrad = ctx!.createLinearGradient(0, waveY, 0, waveY + 12);
        foamGrad.addColorStop(0, `rgba(255, 255, 255, ${waveAlpha})`);
        foamGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx!.fillStyle = foamGrad;
        ctx!.fill();
      }
    }

    function drawSand() {
      const shoreY = height * 0.78;

      // Wet sand
      const wetGrad = ctx!.createLinearGradient(0, shoreY - 3, 0, shoreY + 25);
      wetGrad.addColorStop(0, "#3a7a70");
      wetGrad.addColorStop(1, "#6a9a70");
      ctx!.fillStyle = wetGrad;
      ctx!.fillRect(0, shoreY - 3, width, 28);

      // Dry sand
      const sandGrad = ctx!.createLinearGradient(0, shoreY + 22, 0, height);
      sandGrad.addColorStop(0, "#8a9a6a");
      sandGrad.addColorStop(0.3, "#b0a878");
      sandGrad.addColorStop(0.6, "#c4b888");
      sandGrad.addColorStop(1, "#a89870");
      ctx!.fillStyle = sandGrad;
      ctx!.fillRect(0, shoreY + 22, width, height - shoreY - 22);

      // Sand grain texture
      ctx!.fillStyle = "rgba(255, 255, 255, 0.015)";
      for (let i = 0; i < 400; i++) {
        const sx = (i * 137.5) % width;
        const sy = shoreY + 18 + ((i * 73.1) % (height - shoreY - 18));
        const sr = 0.4 + (i % 3) * 0.4;
        ctx!.beginPath();
        ctx!.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawHorizonGlow() {
      const horizonY = height * 0.52;
      const glowGrad = ctx!.createRadialGradient(
        width * 0.5, horizonY, 0,
        width * 0.5, horizonY, width * 0.45
      );
      glowGrad.addColorStop(0, "rgba(255, 200, 120, 0.1)");
      glowGrad.addColorStop(0.5, "rgba(10, 125, 140, 0.06)");
      glowGrad.addColorStop(1, "rgba(10, 125, 140, 0)");
      ctx!.fillStyle = glowGrad;
      ctx!.fillRect(0, horizonY - 60, width, 120);
    }

    // ---- Animation loop ----
    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);

      drawSky();
      drawSun();
      drawOcean(t);
      drawSunReflection(t);
      drawHorizonGlow();
      drawWaves(t);
      drawSand();

      // Text contrast overlay — darker at top and bottom, lighter in middle
      const overlayGrad = ctx!.createLinearGradient(0, 0, 0, height);
      overlayGrad.addColorStop(0, "rgba(0, 0, 0, 0.5)");
      overlayGrad.addColorStop(0.3, "rgba(0, 0, 0, 0.3)");
      overlayGrad.addColorStop(0.55, "rgba(0, 0, 0, 0.15)");
      overlayGrad.addColorStop(0.8, "rgba(0, 0, 0, 0.2)");
      overlayGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx!.fillStyle = overlayGrad;
      ctx!.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(draw);
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
