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
      // Ensure app is ready if splash is skipped
      document.body.classList.add("is-ready");
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
        // Add ready class immediately to start login animations during fade out
        document.body.classList.add("is-ready");

        setTimeout(() => {
          setShowSplash(false);
          // Restore app background color
          document.documentElement.style.backgroundColor = "";
        }, 800);
      }, 3000); // 3 seconds visible
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Block scroll
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [showSplash]);

  if (hasChecked && !showSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center bg-[#f43e5c] touch-none select-none overflow-hidden transition-opacity duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src="/splash.png"
        alt="Splash"
        className="h-full w-full object-cover absolute inset-0 transition-transform duration-3000 scale-100"
        style={{ transform: isExiting ? "scale(1.05)" : "scale(1)" }}
      />
    </div>
  );
}
