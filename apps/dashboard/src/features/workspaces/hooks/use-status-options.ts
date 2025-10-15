import { useTranslation } from "@compo/localize"
import { A } from "@compo/utils"
import React from "react"

/**
 * This hook is used to get the status options for the workspace status select
 */
export const useStatusOptions = () => {
  const { _ } = useTranslation(dictionary)
  const statusOptions = React.useMemo(
    () =>
      A.map(["active", "suspended"], (status) => ({
        label: _(status),
        value: status,
      })),
    [_]
  )
  return statusOptions
}

/**
 * translations
 */
const dictionary = {
  en: {
    active: "Active",
    suspended: "Suspended",
  },
  fr: {
    active: "Actif",
    suspended: "Suspendu",
  },
  de: {
    active: "Aktiv",
    suspended: "Gesperrt",
  },
}
