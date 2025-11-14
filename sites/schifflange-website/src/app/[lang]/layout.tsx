import { config } from "@/config"
import type { Metadata, Viewport } from "next"

/**
 * generateMetadata
 */
export const metadata: Metadata = {
  title: "Commune de Schifflange",
  description: "Site officiel de la commune de Schifflange",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-16x16.png",
      sizes: "16x16",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    },
    { rel: "shortcut icon", url: "/favicon.ico" },
  ],
  manifest: "/site.webmanifest",
}
export const viewport: Viewport = {
  themeColor: "white",
  width: "device-width",
  initialScale: 1,
}

/**
 * ISR
 */
export const generateStaticParams = async () => {
  return config.languages.map((lang) => ({ lang }))
}

/**
 * layout
 */
const Layout = async ({ children }: { children: React.ReactNode }) => <>{children}</>
export default Layout
