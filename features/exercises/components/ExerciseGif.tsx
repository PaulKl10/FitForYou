"use client";

import { useRef, useEffect, useState } from "react";

interface ExerciseGifProps {
  src: string;
  alt: string;
  className?: string;
  animated?: boolean;
}

export function ExerciseGif({
  src,
  alt,
  className,
  animated = false,
}: ExerciseGifProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      setCanvasReady(true);
    };
    img.src = src;
  }, [src]);

  return (
    <div className={`relative ${className ?? ""}`}>
      {!canvasReady && !animated && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${
          animated ? "hidden" : "block group-hover:hidden"
        }`}
        style={{ objectFit: "cover" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${
          animated ? "block" : "hidden group-hover:block"
        }`}
      />
    </div>
  );
}
