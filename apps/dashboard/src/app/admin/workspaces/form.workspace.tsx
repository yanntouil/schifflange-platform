import { useStatusOptions } from "@/features/workspaces/hooks/use-status-options"
import { useThemeOptions } from "@/features/workspaces/hooks/use-theme-options"
import { useTypeOptions } from "@/features/workspaces/hooks/use-type-options"
import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Layers2 } from "lucide-react"
import React from "react"

/**
 * display workspace form to update workspace or create a new one
 */
export const WorkspaceForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)

  const statusOptions = useStatusOptions()
  const typeOptions = useTypeOptions()
  const themeOptions = useThemeOptions()
  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 @md:grid-cols-[16rem_1fr]">
        <div>
          <Form.Image name="image" aspect="aspect-square">
            <Layers2 className="text-muted-foreground size-10 stroke-[1]" aria-hidden />
          </Form.Image>
        </div>
        <div className="space-y-6">
          <Form.Input name="name" label={_("name-label")} placeholder={_("name-placeholder")} required />
          <div className="space-y-4">
            <Form.Select
              name="type"
              label={_("type-label")}
              placeholder={_("type-placeholder")}
              options={typeOptions}
              required
              labelAside={<Form.Info title={_("type-label")} content={_("type-info")} />}
            />
            <Form.Select
              name="themeId"
              label={_("theme-label")}
              placeholder={_("theme-placeholder")}
              options={themeOptions}
              labelAside={<Form.Info title={_("theme-label")} content={_("theme-info")} />}
            />
          </div>
        </div>
      </div>
      <Form.Select
        name="status"
        label={_(`status-label`)}
        labelAside={<Form.Info title={_(`status-label`)} content={_(`status-info`)} />}
        options={statusOptions}
      />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "name-label": "Workspace name",
    "name-placeholder": "Enter workspace name",
    "type-label": "Workspace type",
    "type-placeholder": "Select workspace type",
    "type-info": "Workspace type cannot only be changed in the admin after creation to avoid configuration conflicts.",
    "theme-label": "Theme",
    "theme-placeholder": "Select a theme",
    "theme-info": "Only administrators and workspace owners can change the theme. This affects the visual appearance for all members.",
    "status-label": "Workspace status",
    "status-info": "Enable or disable this workspace.",
  },
  fr: {
    "name-label": "Nom de l'espace",
    "name-placeholder": "Saisissez le nom de l'espace",
    "type-label": "Type d'espace",
    "type-placeholder": "Sélectionnez le type d'espace",
    "type-info":
      "Le type d'espace ne peut être modifié après création que dans l'espace d'administration pour éviter les conflits de configuration.",
    "theme-label": "Thème",
    "theme-placeholder": "Sélectionnez un thème",
    "theme-info":
      "Seuls les administrateurs et les propriétaires peuvent changer le thème. Cela affecte l'apparence visuelle pour tous les membres.",
    "status-label": "Statut de l'espace de travail",
    "status-info": "Activez ou désactivez cet espace de travail.",
  },
  de: {
    "name-label": "Arbeitsbereich-Name",
    "name-placeholder": "Arbeitsbereich-Name eingeben",
    "type-label": "Arbeitsbereich-Typ",
    "type-placeholder": "Arbeitsbereich-Typ auswählen",
    "type-info": "Der Arbeitsbereich-Typ kann nur im Admin-Bereich nach der Erstellung geändert werden, um Konfigurationskonflikte zu vermeiden.",
    "theme-label": "Theme",
    "theme-placeholder": "Theme auswählen",
    "theme-info": "Nur Administratoren und Arbeitsbereich-Eigentümer können das Theme ändern. Dies betrifft das visuelle Erscheinungsbild für alle Mitglieder.",
    "status-label": "Arbeitsbereich-Status",
    "status-info": "Diesen Arbeitsbereich aktivieren oder deaktivieren.",
  },
}
