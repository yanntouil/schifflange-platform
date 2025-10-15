import { ArticlesServiceProvider } from "@compo/articles"
import { ForwardsServiceProvider } from "@compo/forwards"
import { MediasServiceProvider } from "@compo/medias"
import { MenusServiceProvider } from "@compo/menus"
import { PagesServiceProvider } from "@compo/pages"
import { SlugsServiceProvider } from "@compo/slugs"
import React from "react"
import { routesTo } from "."
import {
  useArticleServiceProps,
  useForwardServiceProps,
  useMediaServiceProps,
  useMenusServiceProps,
  usePageServiceProps,
  useSlugServiceProps,
} from "../hooks"

/**
 * merge of all service providers
 */
export const DashboardServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MediasServiceProvider {...useMediaServiceProps()}>
      <SlugsServiceProvider {...useSlugServiceProps()} routesTo={routesTo}>
        <ForwardsServiceProvider {...useForwardServiceProps()} routesTo={routesTo}>
          <PagesServiceProvider {...usePageServiceProps()} routesTo={routesTo}>
            <ArticlesServiceProvider {...useArticleServiceProps()} routesTo={routesTo}>
              <MenusServiceProvider {...useMenusServiceProps()} routesTo={routesTo}>
                {children}
              </MenusServiceProvider>
            </ArticlesServiceProvider>
          </PagesServiceProvider>
        </ForwardsServiceProvider>
      </SlugsServiceProvider>
    </MediasServiceProvider>
  )
}
