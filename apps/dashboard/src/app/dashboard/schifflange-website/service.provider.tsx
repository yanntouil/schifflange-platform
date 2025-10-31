import { ArticlesServiceProvider } from "@compo/articles"
import { DirectoryServiceProvider } from "@compo/directory"
import { EventsServiceProvider } from "@compo/events"
import { ForwardsServiceProvider } from "@compo/forwards"
import { LibrariesServiceProvider } from "@compo/libraries"
import { MediasServiceProvider } from "@compo/medias"
import { MenusServiceProvider } from "@compo/menus"
import { PagesServiceProvider } from "@compo/pages"
import { SlugsServiceProvider } from "@compo/slugs"
import React from "react"
import { routesTo } from "."
import {
  useArticleServiceProps,
  useDirectoryServiceProps,
  useEventServiceProps,
  useForwardServiceProps,
  useLibrariesServiceProps,
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
              <EventsServiceProvider {...useEventServiceProps()} routesTo={routesTo}>
                <DirectoryServiceProvider {...useDirectoryServiceProps()} routesTo={routesTo.directory}>
                  <LibrariesServiceProvider {...useLibrariesServiceProps()} routesTo={routesTo.libraries}>
                    <MenusServiceProvider {...useMenusServiceProps()} routesTo={routesTo}>
                      {children}
                    </MenusServiceProvider>
                  </LibrariesServiceProvider>
                </DirectoryServiceProvider>
              </EventsServiceProvider>
            </ArticlesServiceProvider>
          </PagesServiceProvider>
        </ForwardsServiceProvider>
      </SlugsServiceProvider>
    </MediasServiceProvider>
  )
}
