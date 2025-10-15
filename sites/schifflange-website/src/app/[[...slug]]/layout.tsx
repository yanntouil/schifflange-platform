import { getPage } from "@/app/[[...slug]]/page"
import { Providers } from "@/app/providers"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { service } from "@/service"
import { LocalizeLanguage } from "@compo/localize"
import { A, match } from "@compo/utils"
import type { Metadata, Viewport } from "next"
import { Instrument_Sans } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { getLanguages, matchLanguage } from "../utils"

const getMenus = async (lang: string) => {
  const result = await service.menus(lang)

  const { header, footer } = match(result)
    .with({ ok: true }, ({ data }) => data)
    .otherwise((result) => {
      // redirect to error 500 page (without layout)
      throw new Error("Menu not found")
    })

  return { header, footer }
}

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-instrument-sans",
})

/**
 * default metadata
 */
export const metadata: Metadata = {
  title: "LumiQ",
  description: "LumiQ",
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
 * layout
 */

const Layout: NextLayoutSC<{ slug: string[] }> = async ({ children, params }) => {
  const { slug } = await params
  const lang = matchLanguage(A.head(slug)) as LocalizeLanguage
  const menus = await getMenus(lang)
  const [defaultLanguage, languages] = await getLanguages()
  const { header, footer } = menus

  const page = await getPage(slug)

  return (
    <html lang={lang} className={instrumentSans.className}>
      <body
        data-page={page.ok ? page.data.path : undefined}
        className='group/page isolate min-h-screen antialiased bg-[#FAF6F1]'
        style={{ "--layout-sidebar-width": "270px" } as any}
      >
        <NuqsAdapter>
          <Providers language={lang} languages={languages} defaultLanguage={defaultLanguage}>
            <div className='z-0 flex min-h-screen max-w-[100vw] flex-col overflow-x-hidden'>
              <Header lang={lang} menu={header} />

              <main className='grow isolate z-0' id='main-content'>
                <div>{children}</div>
              </main>

              <Footer lang={lang} menu={footer} />
            </div>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  )
}

export default Layout
