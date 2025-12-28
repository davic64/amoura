"use client";

import { useEffect, useState } from "react";

export default function DeviceDetector() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = window.navigator.userAgent;
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsDesktop(!mobileRegex.test(userAgent));
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isDesktop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          📱 Amoura
        </h1>
        <p className="text-gray-600">
          Esta aplicación solo está disponible para dispositivos móviles.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Por favor, abre este enlace desde tu teléfono o tablet.
        </p>
      </div>
    </div>
  );
}
