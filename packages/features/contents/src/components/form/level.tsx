import { Form, FormSelectOption } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { A } from "@mobily/ts-belt"
import React from "react"

/**
 * FormLevel
 */
type Props = {
  name?: string
  label?: string
  info?: string
  classNames?: React.ComponentProps<typeof Form.Select>["classNames"]
}
export const FormLevel: React.FC<Props> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { name = "level", label = _("level-label"), info = _("level-info"), classNames } = props
  const titleLevelOption = React.useMemo(
    () =>
      A.map(A.range(1, 6), (level) => ({
        label: _("level-option", { level }),
        value: `${level}`,
      })) as FormSelectOption[],
    [_]
  )
  return (
    <Form.Select
      options={titleLevelOption}
      label={label}
      name={name}
      labelAside={<Form.Info title={label} content={info} />}
      classNames={classNames}
    />
  )
}

const dictionary = {
  fr: {
    "level-label": "Sélectionner un niveau pour le titre",
    "level-option": "Niveau {{level}}",
    "level-info":
      "Niveau de l'entête est important pour le référencement et l'accessibilité il permet de définir l'importance de l'entête en relation avec les autres entêtes",
  },
  de: {
    "level-label": "Eine Ebene für den Titel auswählen",
    "level-option": "Ebene {{level}}",
    "level-info":
      "Die Ebene der Überschrift ist wichtig für SEO und Barrierefreiheit, sie definiert die Wichtigkeit der Überschrift im Verhältnis zu anderen Überschriften",
  },
  en: {
    "level-label": "Select a level for the title",
    "level-option": "Level {{level}}",
    "level-info":
      "Level of the header is important for SEO and accessibility, it defines the importance of the header in relation to other headers",
  },
}
