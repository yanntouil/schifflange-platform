import { Form, FormInfo, FormInput, FormSwitch, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api, type Payload } from "@services/dashboard"
import React from "react"
import { useMediasFolder } from "../../folder.context"
import { useMediasService } from "../../service.context"

/**
 * CreateFolderDialog
 */
export const CreateFolderDialog: React.FC<Ui.QuickDialogProps<void, Api.MediaFolderWithRelations>> = ({
  item,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.MediaFolderWithRelations>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service, isAdmin } = useMediasService()
  const { folderId } = useMediasFolder()
  const { min, max } = validator
  type Values = Payload.Workspaces.Medias.CreateFolder & { parentId?: string | null }
  const form = useForm<Values>({
    allowSubmitAttempt: true,
    values: { name: "", lock: false },
    validate: validator({
      name: [min(1, _("name-required")), max(100, _("name-max"))],
    }),
    onSubmit: async ({ values }) => {
      match(await service.folders.create(values, folderId ?? undefined))
        .with({ failed: true }, async ({ except, response }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => _("validation"))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { folder } }) => {
          Ui.toast.success(_("created"))
          if (mutate) await mutate(folder)
          close()
        })
    },
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
    title: "Create new folder",
    description: "Add a new folder to organize your media files efficiently.",
    "name-label": "Folder name",
    "name-placeholder": "e.g., Marketing Assets 2024",
    "name-required": "Folder name is required",
    "name-max": "Folder name must be less than 100 characters",
    "name-info": "Choose a descriptive name that clearly identifies the folder's purpose and content.",
    "lock-label": "Lock folder (admin only)",
    "lock-info":
      "Locked folders prevent non-admin users from adding, editing, or deleting files. Useful for protecting finalized content or templates.",
    submit: "Create folder",
    validation: "Some of your input is invalid. Please check your entries and try again.",
    created: "Folder created successfully",
    failed: "Failed to create folder",
  },
  fr: {
    title: "Créer un nouveau dossier",
    description: "Ajoutez un nouveau dossier pour organiser efficacement vos fichiers média.",
    "name-label": "Nom du dossier",
    "name-placeholder": "ex. Assets Marketing 2024",
    "name-required": "Le nom du dossier est requis",
    "name-max": "Le nom du dossier doit contenir moins de 100 caractères",
    "name-info": "Choisissez un nom descriptif qui identifie clairement l'objectif et le contenu du dossier.",
    "lock-label": "Verrouiller le dossier (admin uniquement)",
    "lock-info":
      "Les dossiers verrouillés empêchent les utilisateurs non-admin d'ajouter, modifier ou supprimer des fichiers. Utile pour protéger du contenu finalisé ou des modèles.",
    submit: "Créer le dossier",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
    created: "Dossier créé avec succès",
    failed: "Échec de la création du dossier",
  },
  de: {
    title: "Neuen Ordner erstellen",
    description: "Fügen Sie einen neuen Ordner hinzu, um Ihre Mediendateien effizient zu organisieren.",
    "name-label": "Ordnername",
    "name-placeholder": "z.B. Marketing Assets 2024",
    "name-required": "Ordnername ist erforderlich",
    "name-max": "Ordnername muss weniger als 100 Zeichen enthalten",
    "name-info": "Wählen Sie einen beschreibenden Namen, der den Zweck und Inhalt des Ordners klar identifiziert.",
    "lock-label": "Ordner sperren (nur Admin)",
    "lock-info":
      "Gesperrte Ordner verhindern, dass Nicht-Admin-Benutzer Dateien hinzufügen, bearbeiten oder löschen. Nützlich zum Schutz von finalisiertem Inhalt oder Vorlagen.",
    submit: "Ordner erstellen",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    created: "Ordner erfolgreich erstellt",
    failed: "Fehler beim Erstellen des Ordners",
  },
}
