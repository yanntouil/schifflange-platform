import { Form, FormInfo } from "@compo/form"
import { useTranslation } from "@compo/localize"
import React from "react"
import { usePagesService, useStateOptions } from "../../"

/**
 * PagesForm
 */
export const PagesForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { isAdmin } = usePagesService()
  const stateOptions = useStateOptions()
  return (
    <>
      <Form.Select
        label={_("state-label")}
        name='state'
        options={stateOptions}
        labelAside={<FormInfo title={_("state-label")} content={_("state-info")} />}
      />
      {isAdmin && (
        <Form.Switch
          label={_("lock-label")}
          name='lock'
          labelAside={<FormInfo title={_("lock-label")} content={_("lock-info")} />}
        />
      )}
    </>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    "state-label": "Page status",
    "state-draft": "Draft",
    "state-draft-description": "Page is not visible to visitors",
    "state-published": "Published",
    "state-published-description": "Page is live and visible to visitors",
    "state-info": "Control whether this page is visible on your website. Draft pages are only visible to editors.",
    "lock-label": "Lock page (admin only)",
    "lock-info":
      "Locked pages cannot be edited by non-admin users. Useful for protecting important pages like homepage or legal pages.",
  },
  fr: {
    "state-label": "Statut de la page",
    "state-draft": "Brouillon",
    "state-draft-description": "La page n'est pas visible aux visiteurs",
    "state-published": "Publié",
    "state-published-description": "La page est en ligne et visible aux visiteurs",
    "state-info":
      "Contrôlez si cette page est visible sur votre site web. Les pages brouillon ne sont visibles qu'aux éditeurs.",
    "lock-label": "Verrouiller la page (admin uniquement)",
    "lock-info":
      "Les pages verrouillées ne peuvent pas être modifiées par les utilisateurs non-admin. Utile pour protéger des pages importantes comme la page d'accueil ou les pages légales.",
  },
  de: {
    "state-label": "Seitenstatus",
    "state-draft": "Entwurf",
    "state-draft-description": "Seite ist für Besucher nicht sichtbar",
    "state-published": "Veröffentlicht",
    "state-published-description": "Seite ist live und für Besucher sichtbar",
    "state-info":
      "Steuern Sie, ob diese Seite auf Ihrer Website sichtbar ist. Entwurfsseiten sind nur für Editoren sichtbar.",
    "lock-label": "Seite sperren (nur Admin)",
    "lock-info":
      "Gesperrte Seiten können nicht von Nicht-Admin-Benutzern bearbeitet werden. Nützlich zum Schutz wichtiger Seiten wie Startseite oder rechtliche Seiten.",
  },
}
