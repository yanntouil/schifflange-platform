import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { A } from "@compo/utils"
import React from "react"

/**
 * this component provide a select with role options to use in form
 * ! this component must be only used in an admin dashboard
 */
type FormMemberRoleProps = Omit<React.ComponentProps<typeof Form.Select>, "options">
export const FormMemberRole: React.FC<FormMemberRoleProps> = (props) => {
  const { _ } = useTranslation(dictionary)
  const options = React.useMemo(
    () =>
      A.map(["member", "admin", "owner"], (role) => ({
        label: _(`select.${role}`),
        value: role,
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
      member: "Member",
      admin: "Admin",
      owner: "Owner",
    },
  },
  fr: {
    select: {
      member: "Membre",
      admin: "Administrateur",
      owner: "Propriétaire",
    },
  },
  de: {
    select: {
      member: "Mitglied",
      admin: "Administrator",
      owner: "Besitzer",
    },
  },
}
