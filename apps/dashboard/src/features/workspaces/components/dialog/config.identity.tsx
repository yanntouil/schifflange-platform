import { service } from "@/services"
import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Layers2 } from "lucide-react"
import React from "react"
import { useThemeOptions } from "../../hooks/use-theme-options"
import { useTypeOptions } from "../../hooks/use-type-options"
import { makeAuthorization } from "./config.authorization"

const fetcher = {
  key: "workspace-themes",
  fetch: () => service.workspaces.themes(),
}

/**
 * Workspace identity section component
 */
export const WorkspaceIdentitySection: React.FC<{
  can: ReturnType<typeof makeAuthorization>
}> = ({ can }) => {
  const { _ } = useTranslation(dictionary)

  const typeOptions = useTypeOptions()
  const themeOptions = useThemeOptions()

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 @md:grid-cols-[16rem_1fr]">
      <div>
        <Form.Image name="image" aspect="aspect-square" disabled={!can.changeImage}>
          <Layers2 className="text-muted-foreground size-10 stroke-[1]" aria-hidden />
        </Form.Image>
      </div>
      <div className="space-y-6">
        <Form.Input name="name" label={_("name-label")} placeholder={_("name-placeholder")} required disabled={!can.changeName} />
        <div className="space-y-4">
          <Form.Select
            name="type"
            label={_("type-label")}
            placeholder={_("type-placeholder")}
            options={typeOptions}
            required
            disabled={!can.changeType}
            labelAside={<Form.Info title={_("type-label")} content={_("type-info")} />}
          />
          <Form.Select
            name="themeId"
            label={_("theme-label")}
            placeholder={_("theme-placeholder")}
            options={themeOptions}
            disabled={!can.changeTheme}
            labelAside={<Form.Info title={_("theme-label")} content={_("theme-info")} />}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Translations
 */
const dictionary = {
  en: {
    "name-label": "Workspace name",
    "name-placeholder": "Enter workspace name",
    "type-label": "Workspace type",
    "type-placeholder": "Select workspace type",
    "type-info": "Workspace type cannot be changed after creation to avoid configuration conflicts.",
    "theme-label": "Theme",
    "theme-placeholder": "Select a theme",
    "theme-info": "Only workspace owners can change the theme. This affects the visual appearance for all members.",
  },
  fr: {
    "name-label": "Nom de l'espace",
    "name-placeholder": "Saisissez le nom de l'espace",
    "type-label": "Type d'espace",
    "type-placeholder": "Sélectionnez le type d'espace",
    "type-info": "Le type d'espace ne peut pas être modifié après création pour éviter les conflits de configuration.",
    "theme-label": "Thème",
    "theme-placeholder": "Sélectionnez un thème",
    "theme-info": "Seuls les propriétaires peuvent changer le thème. Cela affecte l'apparence visuelle pour tous les membres.",
  },
  de: {
    "name-label": "Arbeitsbereich-Name",
    "name-placeholder": "Arbeitsbereich-Name eingeben",
    "type-label": "Arbeitsbereich-Typ",
    "type-placeholder": "Arbeitsbereich-Typ auswählen",
    "type-info": "Der Arbeitsbereich-Typ kann nach der Erstellung nicht geändert werden, um Konfigurationskonflikte zu vermeiden.",
    "theme-label": "Theme",
    "theme-placeholder": "Theme auswählen",
    "theme-info": "Nur Arbeitsbereich-Eigentümer können das Theme ändern. Dies betrifft das visuelle Erscheinungsbild für alle Mitglieder.",
  },
}
