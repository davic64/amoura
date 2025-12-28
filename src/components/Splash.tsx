"use client";

import { useState, useEffect } from "react";

export default function Splash() {
  const [showSplash, setShowSplash] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (!splashShown) {
      setShowSplash(true);
      sessionStorage.setItem("splashShown", "true");
    }
    setHasChecked(true);
  }, []);

  if (!hasChecked || !showSplash) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white">
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
