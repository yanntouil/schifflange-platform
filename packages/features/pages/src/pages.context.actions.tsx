import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { isSlugPage } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { usePagesService } from "./service.context"
import { SWRPages } from "./swr"

/**
 * useDisplayPage
 */
export const useDisplayPage = () => {
  const [, navigate] = useLocation()
  const { routesTo } = usePagesService()
  const displayPage = React.useCallback(
    (page: Api.PageWithRelations) => {
      navigate(routesTo.pages.byId(page.id))
    },
    [navigate, routesTo.pages.byId]
  )
  return displayPage
}

/**
 * useCreatePage
 * This hook is used to create a page. It will navigate to the new page after creation.
 * this hook is not dependent of the PageContextProvider.
 */
export const useCreatePage = () => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const { service, routesTo } = usePagesService()
  const [createPage, createPageProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async (page) =>
      match(await service.create())
        .with({ ok: false }, () => true)
        .otherwise(({ data }) => {
          navigate(routesTo.pages.byId(data.page.id))
          return false
        }),
    t: _.prefixed("confirm.create"),
  })
  return [createPage, createPageProps] as const
}

/**
 * useToggleStatePage
 * This hook is used to toggle the state between draft and published.
 */
export const useToggleStatePage = (swr: SWRPages) => {
  const { _ } = useTranslation(dictionary)
  const { service } = usePagesService()
  const toggleStatePage = React.useCallback(
    async (page: Api.PageWithRelations) => {
      match(await service.id(page.id).update({ state: page.state === "draft" ? "published" : "draft" }))
        .with({ ok: true }, ({ data }) => swr.update(data.page))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return toggleStatePage
}

/**
 * useToggleLockPage
 * This hook is used to toggle the lock of a page.
 */
export const useToggleLockPage = (swr: SWRPages) => {
  const { _ } = useTranslation(dictionary)
  const { service } = usePagesService()
  const toggleLockPage = React.useCallback(
    async (page: Api.PageWithRelations) => {
      match(await service.id(page.id).update({ lock: !page.lock }))
        .with({ ok: true }, ({ data }) => swr.update(data.page))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return toggleLockPage
}

/**
 * useEditPage
 */
export const useEditPage = (swr: SWRPages) => {
  const [editPage, editPageProps] = Ui.useQuickDialog<Api.PageWithRelations>({
    mutate: async (page) => swr.update(page),
  })
  return [editPage, editPageProps] as const
}

/**
 * useEditSlug
 */
export const useEditSlug = (swr: SWRPages) => {
  const [editSlug, editSlugProps] = Ui.useQuickDialog<Api.Slug, Api.Slug & Api.WithModel>({
    mutate: async (slug) => {
      if (isSlugPage(slug)) {
        swr.update({ id: slug.page.id, slug })
      }
    },
  })
  return [editSlug, editSlugProps] as const
}

/**
 * useConfirmDeletePage
 */
export const useConfirmDeletePage = (swr: SWRPages) => {
  const { _ } = useTranslation(dictionary)
  const { service } = usePagesService()
  const [confirmDeletePage, confirmDeletePageProps] = Ui.useConfirm<Api.PageWithRelations>({
    onAsyncConfirm: async (page) =>
      match(await service.id(page.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(page.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeletePage, confirmDeletePageProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRPages, selectable: Selectable<Api.PageWithRelations>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = usePagesService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.id(id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(id)
          return false
        }),
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed("confirm.delete-selection"),
  })
  return [confirmDeleteSelection, confirmDeleteSelectionProps] as const
}

/**
 * ManagePage type
 */
export type ManagePage = ReturnType<typeof useManagePage>[0]

/**
 * useManagePage
 */
export const useManagePage = (swr: SWRPages, selectable: Selectable<Api.PageWithRelations>) => {
  const displayPage = useDisplayPage()
  const [createPage, createPageProps] = useCreatePage()
  const toggleStatePage = useToggleStatePage(swr)
  const toggleLockPage = useToggleLockPage(swr)
  const [editPage, editPageProps] = useEditPage(swr)
  const [editSlug, editSlugProps] = useEditSlug(swr)
  const [confirmDeletePage, confirmDeletePageProps] = useConfirmDeletePage(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const managePage = {
    displayPage,
    createPage,
    toggleStatePage,
    toggleLockPage,
    editPage,
    editSlug,
    confirmDeletePage,
    confirmDeleteSelection,
  }

  const managePageProps = {
    createPageProps,
    editPageProps,
    editSlugProps,
    confirmDeletePageProps,
    confirmDeleteSelectionProps,
  }

  return [managePage, managePageProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      create: {
        title: "Create page",
        description: "You are about to create a page, if you want to continue you will be redirected to the new page.",
        success: "New page created",
        error: "Error while creating page",
        progress: "Creating page",
      },
      delete: {
        title: "Delete page",
        success: "Page has been deleted",
        error: "Error while deleting page",
        progress: "Deleting page",
      },
      "delete-selection": {
        title: "Delete selected pages",
        success: "Pages have been deleted",
        error: "Error while deleting pages",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      create: {
        title: "Créer une page",
        description:
          "Vous êtes sur le point de créer une page, si vous souhaitez continuer vous serez redirigé vers la nouvelle page.",
        success: "Nouvelle page créée",
        error: "Erreur lors de la création de la page",
        progress: "Création de la page en cours",
      },
      delete: {
        title: "Supprimer la page",
        success: "La page a été supprimée",
        error: "Erreur lors de la suppression de la page",
        progress: "Suppression de la page en cours",
      },
      "delete-selection": {
        title: "Supprimer les pages sélectionnées",
        success: "Les pages ont été supprimées",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      create: {
        title: "Seite erstellen",
        description:
          "Sie sind dabei, eine Seite zu erstellen. Wenn Sie fortfahren möchten, werden Sie zur neuen Seite weitergeleitet.",
        success: "Neue Seite erstellt",
        error: "Fehler beim Erstellen der Seite",
        progress: "Seite wird erstellt",
      },
      delete: {
        title: "Seite löschen",
        success: "Die Seite wurde gelöscht",
        error: "Fehler beim Löschen der Seite",
        progress: "Seite wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Seiten löschen",
        success: "Die Seiten wurden gelöscht",
        error: "Fehler beim Löschen",
        progress: "Löschen von {{counter}} / {{total}}",
      },
    },
  },
}
