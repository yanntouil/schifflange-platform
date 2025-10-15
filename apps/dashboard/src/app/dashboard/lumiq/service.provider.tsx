import { ArticlesServiceProvider } from "@compo/articles"
import { ForwardsServiceProvider } from "@compo/forwards"
import { MediasServiceProvider } from "@compo/medias"
import { MenusServiceProvider } from "@compo/menus"
import { PagesServiceProvider } from "@compo/pages"
import { ProjectsServiceProvider } from "@compo/projects"
import { SlugsServiceProvider } from "@compo/slugs"
import React from "react"
import {
  useArticleServiceProps,
  useForwardServiceProps,
  useMediaServiceProps,
  useMenusServiceProps,
  usePageServiceProps,
  useProjectServiceProps,
  useSlugServiceProps,
} from "../hooks"
import articlesRouteTo from "./articles"
import articlesIdRouteTo from "./articles/[articleId]"
import articlesCategoriesRouteTo from "./articles/categories"
import pagesRouteTo from "./pages"
import pagesIdRouteTo from "./pages/[pageId]"
import projectsRouteTo from "./projects"
import projectsIdRouteTo from "./projects/[projectId]"
import projectsIdStepIdRouteTo from "./projects/[projectId]/[stepId]"
import projectsCategoriesRouteTo from "./projects/categories"
import menusRouteTo from "./site/menus"
import menusIdRouteTo from "./site/menus/[menuId]"

/**
 * merge of all service providers
 */
export const DashboardServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pageServiceProps = usePageServiceProps(pagesRouteTo, pagesIdRouteTo)
  const articleServiceProps = useArticleServiceProps(articlesRouteTo, articlesIdRouteTo, articlesCategoriesRouteTo)
  const projectServiceProps = useProjectServiceProps(projectsRouteTo, projectsIdRouteTo, projectsIdStepIdRouteTo, projectsCategoriesRouteTo)
  const slugServiceProps = useSlugServiceProps(pagesIdRouteTo, articlesIdRouteTo, projectsIdRouteTo, projectsIdStepIdRouteTo)
  const forwardServiceProps = useForwardServiceProps(pagesIdRouteTo, articlesIdRouteTo)
  const menusServiceProps = useMenusServiceProps(pagesIdRouteTo, articlesIdRouteTo, menusRouteTo, menusIdRouteTo)
  const mediaServiceProps = useMediaServiceProps()
  return (
    <MediasServiceProvider {...mediaServiceProps}>
      <SlugsServiceProvider {...slugServiceProps}>
        <ForwardsServiceProvider {...forwardServiceProps}>
          <PagesServiceProvider {...pageServiceProps}>
            <ArticlesServiceProvider {...articleServiceProps}>
              <ProjectsServiceProvider {...projectServiceProps}>
                <MenusServiceProvider {...menusServiceProps}>{children}</MenusServiceProvider>
              </ProjectsServiceProvider>
            </ArticlesServiceProvider>
          </PagesServiceProvider>
        </ForwardsServiceProvider>
      </SlugsServiceProvider>
    </MediasServiceProvider>
  )
}
