import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { A } from "@compo/utils"
import React from "react"

/**
 * this component provide a select with status options to use in form
 * ! this component must be only used in an admin dashboard
 */
type FormStatusProps = Omit<React.ComponentProps<typeof Form.Select>, "options">
export const FormStatus: React.FC<FormStatusProps> = (props) => {
  const { _ } = useTranslation(dictionary)
  const options = React.useMemo(
    () =>
      A.map(["pending", "active", "deleted", "suspended"], (status) => ({
        label: _(`select.${status}`),
        value: status,
      })),
    [_]
  )
  return <Form.Select {...props} options={options} />
}

/**
 * translations
 */
const dictionary = {
  en: {
    select: {
      pending: "Pending account (not verified)",
      active: "Active account (verified)",
      deleted: "Deleted account",
      suspended: "Suspended account",
    },
  },
  fr: {
    select: {
      pending: "Compte en attente (non vérifié)",
      active: "Compte actif (vérifié)",
      deleted: "Compte supprimé",
      suspended: "Compte suspendu",
    },
  },
  de: {
    select: {
      pending: "Ausstehendes Konto (nicht verifiziert)",
      active: "Aktives Konto (verifiziert)",
      deleted: "Gelöschtes Konto",
      suspended: "Gesperrtes Konto",
    },
  },
}
