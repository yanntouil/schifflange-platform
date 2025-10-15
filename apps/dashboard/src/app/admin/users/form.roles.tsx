import { useAuth } from "@/features/auth/hooks/use-auth"
import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { A } from "@compo/utils"
import React from "react"

/**
 * this component provide a select with role options to use in form
 * ! this component must be only used in an admin dashboard
 */
type FormRoleProps = Omit<React.ComponentProps<typeof Form.Select>, "options">
export const FormRole: React.FC<FormRoleProps> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const isSuperadmin = me.role === "superadmin"
  const options = React.useMemo(
    () => [
      ...A.map(["member", "admin"], (role) => ({
        label: _(`select.${role}`),
        value: role,
      })),
      {
        label: _(`select.superadmin` + (isSuperadmin ? "" : "-disabled")),
        value: "superadmin",
        disabled: !isSuperadmin,
      },
    ],
    [_, isSuperadmin]
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
      superadmin: "Super admin",
      "superadmin-disabled": "Super admin (reserved right)",
    },
  },
  fr: {
    select: {
      member: "Membre",
      admin: "Administrateur",
      superadmin: "Super administrateur",
      "superadmin-disabled": "Super administrateur (droit réservé)",
    },
  },
  de: {
    select: {
      member: "Mitglied",
      admin: "Administrator",
      superadmin: "Super-Administrator",
      "superadmin-disabled": "Super-Administrator (vorbehaltenes Recht)",
    },
  },
}
