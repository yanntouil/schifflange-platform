import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { dateToISO, match, parseDate } from "@compo/utils"
import React from "react"
import { usePublication } from "../publication.context"
import { PublicationForm } from "./form"

/**
 * PublicationDialog
 */
export const PublicationDialog: React.FC<Ui.QuickDialogProps<void>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<void>> = ({ close }) => {
  const { _ } = useTranslation(dictionary)
  const { publication, service, mutate } = usePublication()
  const initialValues = {
    publishedById: publication.publishedBy?.id ?? null,
    publishedAt: parseDate(publication.publishedAt),
    isScheduled: publication.publishedFrom || publication.publishedTo ? true : false,
    publishedFrom: parseDate(publication.publishedFrom),
    publishedTo: parseDate(publication.publishedTo),
  }
  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        publishedById: values.publishedById || null,
        publishedAt: dateToISO(values.publishedAt),
        publishedFrom: values.isScheduled ? dateToISO(values.publishedFrom) : null,
        publishedTo: values.isScheduled ? dateToISO(values.publishedTo) : null,
      }
      match(await service.update(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("updated"))
          mutate(data.publication)
          close()
        })
        .otherwise(({ except }) => {
          Ui.toast.error(_("validation-failure"))
        })
    },
  })
  return (
    <Form.Root form={form} className='space-y-4 pt-2'>
      <Form.Assertive />
      <PublicationForm />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Options de publication",
    description: "Configurez les paramètres de publication de ce contenu",
    submit: "Enregistrer les options",
    updated: "Options de publication mises à jour",
    "validation-failure": "Erreur lors de la mise à jour des options",
  },
  en: {
    title: "Publication Options",
    description: "Configure the publication settings for this content",
    submit: "Save options",
    updated: "Publication options updated",
    "validation-failure": "Error updating publication options",
  },
  de: {
    title: "Veröffentlichungsoptionen",
    description: "Konfigurieren Sie die Veröffentlichungseinstellungen für diesen Inhalt",
    submit: "Optionen speichern",
    updated: "Veröffentlichungsoptionen aktualisiert",
    "validation-failure": "Fehler beim Aktualisieren der Veröffentlichungsoptionen",
  },
}
