"use client";

import { useState } from "react";

export default function Splash() {
  const [showSplash, setShowSplash] = useState(true);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <video
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
        onEnded={() => setShowSplash(false)}
      >
        <source src="/splash.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
