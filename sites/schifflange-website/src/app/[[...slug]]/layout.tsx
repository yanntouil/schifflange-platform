import { getPage } from "@/app/[[...slug]]/page"
import { Providers } from "@/app/providers"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { service } from "@/service"
import { LocalizeLanguage } from "@compo/localize"
import { A, D, match } from "@compo/utils"
import { Api } from "@services/site"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { getLanguages, matchLanguage } from "../utils"

/**
 * send request to get available menus
 */
const initialMenus = {
  header: [] as Api.MenuItemWithRelations[],
  footer: [] as Api.MenuItemWithRelations[],
  top: [] as Api.MenuItemWithRelations[],
}
const getMenus = async (lang: string) => {
  const result = await service.menus(lang)
  return match(result)
    .with({ ok: true }, ({ data }) => {
      return A.reduce(data.menus, initialMenus, (acc, menu) => D.set(acc, menu.location, menu.items))
    })
    .otherwise((result) => {
      // skip header and footer if menu is not found
      return null
      // redirect to error 500 page (without layout)
      // throw new Error("Menu not found")
    })
}

/**
 * prepare inter font
 * ? real font use atm on Schifflange website is ff-tisa-sans-web-pro, sans-serif
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
})

/**
 * default metadata
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

/**
 * viewport
 */
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

  const page = await getPage(slug)

  return (
    <html lang={lang} className={inter.className}>
      <body
        data-page={page.ok ? page.data.path : undefined}
        className='group/page isolate min-h-screen antialiased bg-[#FAF6F1]'
        style={{ "--layout-sidebar-width": "270px" } as any}
      >
        <NuqsAdapter>
          <Providers language={lang} languages={languages} defaultLanguage={defaultLanguage}>
            <div className='z-0 flex min-h-screen max-w-[100vw] flex-col overflow-x-hidden'>
              {menus && <Header lang={lang} menu={menus.header} topMenu={menus.top} />}

              <main className='grow isolate z-0' id='main-content'>
                <div>{children}</div>
              </main>

              {menus && <Footer lang={lang} menu={menus.footer} />}
            </div>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  )
}

export default Layout
