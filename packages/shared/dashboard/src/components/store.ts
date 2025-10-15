import { useTranslation, type Translation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, placeholder } from "@compo/utils"
import React from "react"
import { useTitle } from "react-use"
import { create } from "zustand"
import { decorateStore } from "../zustand"

/**
 * types
 */
type BreadcrumbsState = {
  breadcrumbs: Ui.BreadcrumbType[]
  isLoading: boolean
}
/**
 * initial state
 */
const initialState: BreadcrumbsState = {
  breadcrumbs: [],
  isLoading: false,
}

/**
 * store
 */
export const breadcrumbsStore = decorateStore(
  initialState,
  create,
  {
    devtools: {
      name: "breadcrumbs-store",
      enabled: true,
    },
  },
  {
    setBreadcrumbs: (breadcrumbs: Ui.BreadcrumbType[]) => breadcrumbsStore.set((state) => ({ ...state, breadcrumbs })),
    setIsLoading: (isLoading: boolean) => breadcrumbsStore.set((state) => ({ ...state, isLoading })),
  }
)
export const useBreadcrumbs = (
  dictionary: Translation,
  fn: (t: ReturnType<typeof useTranslation>, p: typeof placeholder) => Ui.BreadcrumbType[]
) => {
  const t = useTranslation(dictionary)
  return fn(t, placeholder)
}
export const useBreadcrumbsStore = () => {
  const breadcrumbs = breadcrumbsStore.use(D.prop("breadcrumbs"))
  const isLoading = breadcrumbsStore.use(D.prop("isLoading"))
  return { breadcrumbs, isLoading }
}
export const usePage = (breadcrumbs: Ui.BreadcrumbType[], title: string) => {
  React.useEffect(() => {
    breadcrumbsStore.actions.setBreadcrumbs(breadcrumbs)
  }, [breadcrumbs])
  useTitle(title)
}
export const setIsLoading = (isLoading: boolean) => {
  breadcrumbsStore.actions.setIsLoading(isLoading)
}
