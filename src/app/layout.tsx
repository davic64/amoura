import type { Metadata, Viewport } from "next";
import "./globals.css";
import DeviceDetector from "@/components/DeviceDetector";
import Splash from "@/components/Splash";

export const metadata: Metadata = {
  title: "Amoura",
  description: "Amoura - Mobile App",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Amoura",
  },
  icons: {
    icon: "/amoura_icon.png",
    apple: "/amoura_icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f43e5c", // Match splash background to avoid initial flash
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/amoura_icon.png" />
        <link rel="apple-touch-icon" href="/amoura_icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (!sessionStorage.getItem('splashShown')) {
                document.documentElement.style.backgroundColor = '#f43e5c';
              }
            `,
          }}
        />
        <link
          rel="apple-touch-startup-image"
          href="/amoura_icon.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/amoura_icon.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/amoura_icon.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/amoura_icon.png"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
        />
      </head>
      <body>
        <Splash />
        <DeviceDetector />
        <div>{children}</div>
      </body>
    </html>
  );
}
