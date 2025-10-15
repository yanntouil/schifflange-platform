import { type Api } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type MenusServiceContextType = {
  service: Api.MenusService
  serviceKey: string
  isAdmin: boolean
  makeUrl: (path: string, code?: string) => string
  routesTo: {
    pages: {
      byId: (pageId: string) => string
    }
    articles: {
      byId: (articleId: string) => string
    }
    menus: {
      list: () => string
      byId: (menuId: string) => string
    }
  }
  makePath: Api.MakePath
  getImageUrl: Api.GetImageUrl
}

/**
 * contexts
 */
export const MenusServiceContext = createContext<MenusServiceContextType | null>(null)

/**
 * hooks
 */
export const useMenusService = () => {
  const context = useContext(MenusServiceContext)
  if (!context) {
    throw new Error("useMenusService must be used within a MenusServiceProvider")
  }
  return context
}
