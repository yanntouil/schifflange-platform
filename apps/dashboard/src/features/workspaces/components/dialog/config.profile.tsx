import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableContent } from "@compo/translations"
import { Layers2 } from "lucide-react"
import React from "react"
import { makeAuthorization } from "./config.authorization"

/**
 * Workspace profile & branding section component
 */
export const WorkspaceProfileSection: React.FC<{
  can: ReturnType<typeof makeAuthorization>
}> = ({ can }) => {
  const { _ } = useTranslation(dictionary)

  if (!can.changeBranding) return null

  return (
    <Form.Fields name="profile">
      <Form.CollapsibleSection
        persistedKey="workspace-branding"
        level={2}
        title={_("branding-title")}
        description={_("branding-description")}
        defaultOpen={true}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 @md:grid-cols-[16rem_1fr]">
            <div>
              <Form.Image name="logo" aspect="aspect-square">
                <Layers2 className="text-muted-foreground size-10 stroke-[1]" aria-hidden />
              </Form.Image>
              <p className="text-muted-foreground mt-2 text-xs">{_("logo-help")}</p>
            </div>
            <div className="space-y-6">
              <Form.Fields name="translations">
                <FormTranslatableContent>
                  {({ code }) => (
                    <Form.Textarea
                      name="welcomeMessage"
                      label={_("welcome-message-label")}
                      placeholder={_("welcome-message-placeholder")}
                      lang={code}
                      rows={4}
                    />
                  )}
                </FormTranslatableContent>
              </Form.Fields>
            </div>
          </div>
        </div>
      </Form.CollapsibleSection>
    </Form.Fields>
  )
}

/**
 * Translations
 */
const dictionary = {
  en: {
    "branding-title": "Branding & Identity",
    "branding-description": "Customize your workspace's visual identity and welcome message",
    "logo-help": "Upload a logo that represents your workspace",
    "welcome-message-label": "Welcome message",
    "welcome-message-placeholder": "Welcome new members with a personalized message",
  },
  fr: {
    "branding-title": "Image de marque et identité",
    "branding-description": "Personnalisez l'identité visuelle et le message de bienvenue de votre espace",
    "logo-help": "Téléchargez un logo qui représente votre espace de travail",
    "welcome-message-label": "Message de bienvenue",
    "welcome-message-placeholder": "Accueillez les nouveaux membres avec un message personnalisé",
  },
  de: {
    "branding-title": "Markenbildung & Identität",
    "branding-description": "Passen Sie die visuelle Identität und Willkommensnachricht Ihres Arbeitsbereichs an",
    "logo-help": "Laden Sie ein Logo hoch, das Ihren Arbeitsbereich repräsentiert",
    "welcome-message-label": "Willkommensnachricht",
    "welcome-message-placeholder": "Begrüßen Sie neue Mitglieder mit einer personalisierten Nachricht",
  },
}
