import { useMemoKey, useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useLibrariesService } from "./service.context"

/**
 * usePinnedLibraries
 */
export const usePinnedLibraries = () => {
  const { _ } = useTranslation(dictionary)
  const { service, serviceKey } = useLibrariesService()
  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.all(query),
      key: useMemoKey("dashboard-pinned-libraries", { serviceKey, query }),
    },
    { fallbackData: { libraries: [] }, keepPreviousData: true }
  )

  const { libraries } = data

  // mutation helper
  const mutateLibraries = (fn: (items: Api.Library[]) => Api.Library[]) =>
    mutate((data) => data && { ...data, libraries: fn(data.libraries) }, { revalidate: true })

  // is pinned by id
  const isPinned = (id: string) => A.some(libraries, (f) => f.id === id && f.pin)

  // pin a library by id
  const pin = async (id: string): Promise<void> => {
    // Optimistic update
    await mutateLibraries((libraries) =>
      A.map(libraries, (f) => (f.id === id ? D.merge(f, { pin: true, pinOrder: libraries.length }) : f))
    )

    // API call
    match(await service.pins.id(id).pin())
      .with(
        { ok: true },
        async ({ data }) =>
          void (await mutateLibraries((libraries) => A.map(libraries, (f) => (f.id === id ? D.merge(f, data.pin) : f))))
      )
      .otherwise(async () => {
        // Rollback on error
        await mutateLibraries((libraries) =>
          A.map(libraries, (f) => (f.id === id ? D.merge(f, { pin: false, pinOrder: 0 }) : f))
        )
        Ui.toast.error(_("failed-to-pin"))
      })
  }

  // unpin a library by id
  const unpin = async (id: string): Promise<void> => {
    // Store current state for rollback
    const currentLib = A.find(libraries, (f) => f.id === id)

    // Optimistic update
    await mutateLibraries((libraries) =>
      A.map(libraries, (f) => (f.id === id ? D.merge(f, { pin: false, pinOrder: 0 }) : f))
    )

    // API call
    match(await service.pins.id(id).unpin())
      .with(
        { ok: true },
        async ({ data }) =>
          void (await mutateLibraries((libraries) => A.map(libraries, (f) => (f.id === id ? D.merge(f, data.pin) : f))))
      )
      .otherwise(async () => {
        // Rollback on error
        if (currentLib) {
          await mutateLibraries((libraries) =>
            A.map(libraries, (f) =>
              f.id === id ? D.merge(f, { pin: currentLib.pin, pinOrder: currentLib.pinOrder }) : f
            )
          )
        }
        Ui.toast.error(_("failed-to-unpin"))
      })
  }

  const makePinnable = (id: string) => ({
    isPinned: () => isPinned(id),
    pin: async () => await pin(id),
    unpin: async () => await unpin(id),
  })

  // reorder pinned libraries
  const reorder = async (pins: string[]): Promise<void> => {
    // Store current state for rollback
    const currentLibraries = [...libraries]

    // Optimistic update
    await mutateLibraries((libraries) =>
      A.map(libraries, (f) =>
        A.includes(pins, f.id) ? D.merge(f, { pinOrder: A.getIndexBy(pins, (p) => p === f.id) ?? 0 }) : f
      )
    )

    // API call
    match(await service.pins.reorder({ pins }))
      .with(
        { ok: true },
        async ({ data }) =>
          void (await mutateLibraries((libraries) =>
            A.map(libraries, (f) =>
              A.includes(pins, f.id) ? D.merge(f, { pinOrder: A.getIndexBy(pins, (p) => p === f.id) ?? 0 }) : f
            )
          ))
      )
      .otherwise(async () => {
        // Rollback on error
        await mutateLibraries(() => currentLibraries)
        Ui.toast.error(_("failed-to-reorder"))
      })
  }

  const swr = {
    ...props,
    mutate,
    isPinned,
    pin,
    unpin,
    reorder,
    makePinnable,
  }

  return { libraries, ...swr }
}

/**
 * PinnedLibraries type
 */
export type PinnedLibraries = ReturnType<typeof usePinnedLibraries>
const query: Api.Payload.Workspaces.Libraries.Libraries = {
  sortBy: {
    field: "pinOrder",
    direction: "asc",
  },
  filterBy: {
    pinned: true,
  },
}

/**
 * translations
 */
const dictionary = {
  en: {
    "failed-to-pin": "Failed to pin library",
    "failed-to-unpin": "Failed to unpin library",
    "failed-to-reorder": "Failed to reorder libraries",
  },
  fr: {
    "failed-to-pin": "Échec de la fixation de la bibliothèque",
    "failed-to-unpin": "Échec de la défixation de la bibliothèque",
    "failed-to-reorder": "Échec du repositionnement des bibliothèques",
  },
  de: {
    "failed-to-pin": "Bibliothek konnte nicht fixiert werden",
    "failed-to-unpin": "Bibliothek konnte nicht defixiert werden",
    "failed-to-reorder": "Bibliotheken konnten nicht neu angeordnet werden",
  },
}
