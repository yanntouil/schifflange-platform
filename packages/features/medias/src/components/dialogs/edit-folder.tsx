import { Form, FormInfo, FormInput, FormSwitch, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api, type Payload } from "@services/dashboard"
import React from "react"
import { useMediasService } from "../../service.context"

/**
 * EditFolderDialog
 */
export const EditFolderDialog: React.FC<Ui.QuickDialogProps<Api.MediaFolderWithRelations>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.MediaFolderWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service, isAdmin } = useMediasService()

  const serviceFolder = service.folders.id(item.id)

  const { min, max } = validator
  type Values = Payload.Workspaces.Medias.UpdateFolder
  const form = useForm<Values>({
    allowSubmitAttempt: true,
    values: { name: item.name, lock: item.lock },
    validate: validator({
      name: [min(1, _("name-required")), max(100, _("name-max"))],
    }),
    onSubmit: async ({ values }) =>
      match(await serviceFolder.update(values))
        .with({ failed: true }, async ({ except, response }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => _("validation"))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { folder } }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(folder)
          close()
        }),
  })

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <FormInput
        label={_("name-label")}
        name='name'
        placeholder={_("name-placeholder")}
        maxLength={100}
        labelAside={<FormInfo title={_("name-label")} content={_("name-info")} />}
      />
      {isAdmin && (
        <FormSwitch
          label={_("lock-label")}
          name='lock'
          labelAside={<FormInfo title={_("lock-label")} content={_("lock-info")} />}
        />
      )}
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    title: "Edit folder",
    description: "Organize your media library with clear, descriptive folder names.",
    "name-label": "Folder name",
    "name-placeholder": "e.g., Product Photos 2024",
    "name-required": "Name is required",
    "name-max": "Name must be less than 100 characters",
    "name-info": "Choose a descriptive name that helps you and your team quickly identify the folder's content.",
    "lock-label": "Lock folder (admin only)",
    "lock-info":
      "Locked folders prevent non-admin users from adding, editing, or deleting files. Useful for protecting finalized content or templates.",
    submit: "Save changes",
    updated: "Folder updated successfully",
    failed: "Failed to update folder",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier le dossier",
    description: "Organisez votre médiathèque avec des noms de dossiers clairs et descriptifs.",
    "name-label": "Nom du dossier",
    "name-placeholder": "ex. Photos Produits 2024",
    "name-required": "Le nom est requis",
    "name-max": "Le nom doit contenir moins de 100 caractères",
    "name-info":
      "Choisissez un nom descriptif qui vous aide, vous et votre équipe, à identifier rapidement le contenu du dossier.",
    "lock-label": "Verrouiller le dossier (admin uniquement)",
    "lock-info":
      "Les dossiers verrouillés empêchent les utilisateurs non-admin d'ajouter, modifier ou supprimer des fichiers. Utile pour protéger du contenu finalisé ou des modèles.",
    submit: "Enregistrer les modifications",
    updated: "Dossier mis à jour avec succès",
    failed: "Échec de la mise à jour du dossier",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Ordner bearbeiten",
    description: "Organisieren Sie Ihre Medienbibliothek mit klaren, beschreibenden Ordnernamen.",
    "name-label": "Ordnername",
    "name-placeholder": "z.B. Produktfotos 2024",
    "name-required": "Name ist erforderlich",
    "name-max": "Name muss weniger als 100 Zeichen enthalten",
    "name-info":
      "Wählen Sie einen beschreibenden Namen, der Ihnen und Ihrem Team hilft, den Ordnerinhalt schnell zu identifizieren.",
    "lock-label": "Ordner sperren (nur Admin)",
    "lock-info":
      "Gesperrte Ordner verhindern, dass Nicht-Admin-Benutzer Dateien hinzufügen, bearbeiten oder löschen. Nützlich zum Schutz von finalisiertem Inhalt oder Vorlagen.",
    submit: "Änderungen speichern",
    updated: "Ordner erfolgreich aktualisiert",
    failed: "Fehler beim Aktualisieren des Ordners",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
