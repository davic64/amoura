"use client";

import { useState, useEffect } from "react";

export default function Splash() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("splashShown", "true");
    }
    setHasChecked(true);
  }, []);

  // Handle splash timeout and exit animation
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        // Wait for fade out animation
        setTimeout(() => {
          setShowSplash(false);
        }, 800);
      }, 3000); // 3 seconds visible
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

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
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center bg-[#010101] touch-none select-none overflow-hidden h-dvh w-screen transition-opacity duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src="/splash.png"
        alt="Splash"
        className="h-full w-full object-cover absolute inset-0 transition-transform duration-3000 scale-100"
        style={{ transform: isExiting ? "scale(1.1)" : "scale(1)" }}
      />
    </div>
  );
}
