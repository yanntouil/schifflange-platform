import { useMemoKey, useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useDirectoryService } from "./service.context"

/**
 * usePinnedOrganisations
 */
export const usePinnedOrganisations = () => {
  const { _ } = useTranslation(dictionary)
  const { service, serviceKey } = useDirectoryService()
  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.organisations.all(query),
      key: useMemoKey("dashboard-pinned-organisations", { serviceKey, query }),
    },
    { fallbackData: { organisations: [] }, keepPreviousData: true }
  )

  const { organisations } = data

  // mutation helper
  const mutateOrganisations = (fn: (items: Api.Organisation[]) => Api.Organisation[]) =>
    mutate((data) => data && { ...data, organisations: fn(data.organisations) }, { revalidate: true })

  // is pinned by id
  const isPinned = (id: string) => A.some(organisations, (f) => f.id === id && f.pin)

  // pin a organisation by id
  const pin = async (id: string): Promise<void> => {
    // Optimistic update
    await mutateOrganisations((organisations) =>
      A.map(organisations, (f) => (f.id === id ? D.merge(f, { pin: true, pinOrder: organisations.length }) : f))
    )

    // API call
    match(await service.organisations.pins.id(id).pin())
      .with(
        { ok: true },
        async ({ data }) =>
          void (await mutateOrganisations((organisations) =>
            A.map(organisations, (f) => (f.id === id ? D.merge(f, data) : f))
          ))
      )
      .otherwise(async () => {
        // Rollback on error
        await mutateOrganisations((organisations) =>
          A.map(organisations, (f) => (f.id === id ? D.merge(f, { pin: false, pinOrder: 0 }) : f))
        )
        Ui.toast.error(_("failed-to-pin"))
      })
  }

  // unpin a organisation by id
  const unpin = async (id: string): Promise<void> => {
    // Store current state for rollback
    const currentOrg = A.find(organisations, (f) => f.id === id)

    // Optimistic update
    await mutateOrganisations((organisations) =>
      A.map(organisations, (f) => (f.id === id ? D.merge(f, { pin: false, pinOrder: 0 }) : f))
    )

    // API call
    match(await service.organisations.pins.id(id).unpin())
      .with(
        { ok: true },
        async ({ data }) =>
          void (await mutateOrganisations((organisations) =>
            A.map(organisations, (f) => (f.id === id ? D.merge(f, data) : f))
          ))
      )
      .otherwise(async () => {
        // Rollback on error
        if (currentOrg) {
          await mutateOrganisations((organisations) =>
            A.map(organisations, (f) => (f.id === id ? D.merge(f, { pin: currentOrg.pin, pinOrder: currentOrg.pinOrder }) : f))
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

  // reorder pinned organisations
  const reorder = async (pins: string[]): Promise<void> => {
    // Store current state for rollback
    const currentOrganisations = [...organisations]

    // Optimistic update
    await mutateOrganisations((organisations) =>
      A.map(organisations, (f) =>
        A.includes(pins, f.id) ? D.merge(f, { pinOrder: A.getIndexBy(pins, (p) => p === f.id) ?? 0 }) : f
      )
    )

    // API call
    match(await service.organisations.pins.reorder({ pins }))
      .with(
        { ok: true },
        async ({ data }) =>
          void (await mutateOrganisations((organisations) =>
            A.map(organisations, (f) =>
              A.includes(pins, f.id) ? D.merge(f, { pinOrder: A.getIndexBy(pins, (p) => p === f.id) ?? 0 }) : f
            )
          ))
      )
      .otherwise(async () => {
        // Rollback on error
        await mutateOrganisations(() => currentOrganisations)
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

  return { organisations, ...swr }
}

/**
 * SWROrganisations type
 */
export type PinnedOrganisations = ReturnType<typeof usePinnedOrganisations>
const query: Api.Payload.Workspaces.Directory.Organisations = {
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
    "failed-to-pin": "Failed to pin organisation",
    "failed-to-unpin": "Failed to unpin organisation",
    "failed-to-reorder": "Failed to reorder organisations",
  },
  fr: {
    "failed-to-pin": "Échec de la fixation de l'organisation",
    "failed-to-unpin": "Échec de la défixation de l'organisation",
    "failed-to-reorder": "Échec du repositionnement des organisations",
  },
  de: {
    "failed-to-pin": "Organisation konnte nicht fixiert werden",
    "failed-to-unpin": "Organisation konnte nicht defixiert werden",
  },
}
