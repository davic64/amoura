"use client";

import { useState, useEffect } from "react";

export default function Splash() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("splashShown", "true");
    }
    setHasChecked(true);
  }, []);

  // Block scroll and add ready class
  useEffect(() => {
    if (hasChecked && !showSplash) {
      document.body.classList.add("is-ready");
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    } else if (showSplash) {
      document.body.classList.remove("is-ready");
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [hasChecked, showSplash]);

  if (hasChecked && !showSplash) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white touch-none select-none overflow-hidden h-dvh w-screen">
      <video
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover absolute inset-0"
        onEnded={() => setShowSplash(false)}
      >
        <source src="/splash.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
