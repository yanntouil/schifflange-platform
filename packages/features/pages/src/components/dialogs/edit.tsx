import { Form, FormInfo, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { usePagesService, useStateOptions } from "../../"

/**
 * EditPageDialog
 */
export const EditPageDialog: React.FC<Ui.QuickDialogProps<Api.PageWithRelations>> = ({ item, ...props }) => {
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
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.PageWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service, isAdmin } = usePagesService()
  const servicePage = service.id(item.id)

  const initialValues = { state: item.state, lock: item.lock }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) =>
      match(await servicePage.update(values))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { page } }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(page)
          close()
        }),
  })

  const stateOptions = useStateOptions()

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
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
    title: "Edit page",
    description: "Update the page status and settings.",
    "state-label": "Page status",
    "state-draft": "Draft",
    "state-draft-description": "Page is not visible to visitors",
    "state-published": "Published",
    "state-published-description": "Page is live and visible to visitors",
    "state-info": "Control whether this page is visible on your website. Draft pages are only visible to editors.",
    "lock-label": "Lock page (admin only)",
    "lock-info":
      "Locked pages cannot be edited by non-admin users. Useful for protecting important pages like homepage or legal pages.",
    submit: "Save changes",
    updated: "Page updated successfully",
    failed: "Failed to update page",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier la page",
    description: "Mettre à jour le statut et les paramètres de la page.",
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
    submit: "Enregistrer les modifications",
    updated: "Page mise à jour avec succès",
    failed: "Échec de la mise à jour de la page",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Seite bearbeiten",
    description: "Status und Einstellungen der Seite aktualisieren.",
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
    submit: "Änderungen speichern",
    updated: "Seite erfolgreich aktualisiert",
    failed: "Seite konnte nicht aktualisiert werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
