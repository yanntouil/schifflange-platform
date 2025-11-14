import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { A } from "@compo/utils"
import React from "react"

export const MenusForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const typeOptions = React.useMemo(
    () => A.map(["header", "footer", "top"], (type) => ({ value: type, label: _(`location-${type}`) })),
    [_]
  )
  return (
    <>
      <Form.Input name='name' label={_("name-label")} placeholder={_("name-placeholder")} />
      <Form.Select
        name='location'
        label={_("location-label")}
        placeholder={_("location-placeholder")}
        options={typeOptions}
      />
    </>
  )
}

const dictionary = {
  fr: {
    "name-label": "Nom du menu",
    "name-placeholder": "Menu principal",
    "location-label": "Position",
    "location-placeholder": "Sélectionner une position",
    "location-header": "En-tête",
    "location-footer": "Pied de page",
    "location-top": "Haut de page",
  },
  de: {
    "name-label": "Menüname",
    "name-placeholder": "Hauptmenü",
    "location-label": "Position",
    "location-placeholder": "Position auswählen",
    "location-header": "Kopfzeile",
    "location-footer": "Fußzeile",
    "location-top": "Hautseite",
  },
  en: {
    "name-label": "Menu name",
    "name-placeholder": "Main menu",
    "location-label": "Location",
    "location-placeholder": "Select a location",
    "location-header": "Header",
    "location-footer": "Footer",
    "location-top": "Top",
  },
}
