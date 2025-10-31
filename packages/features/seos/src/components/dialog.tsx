import { Form, useForm } from "@compo/form"
import { Translation, useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useSeo } from "../seo.context"
import { SeoForm } from "./form"

/**
 * SeoDialog
 */
export const SeoDialog: React.FC<Ui.QuickDialogProps<void>> = ({ item, ...props }) => {
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
  const { seo, service, mutate } = useSeo()
  const form = useForm({
    values: {
      translations: useFormTranslatable(seo.translations, servicePlaceholder.seo),
    },
    onSubmit: async ({ values }) => {
      // socials are not implemented yet
      const payload = {
        files: [],
        translations: D.map(values.translations, ({ image, ...translation }) => ({
          ...translation,
          imageId: image?.id || null,
          socials: [],
        })),
      }
      return match(await service.update(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("updated"))
          mutate(data.seo)
          close()
        })
        .otherwise(() => Ui.toast.error(_("validation")))
    },
  })
  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <SeoForm />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Modifier le SEO",
    description:
      "Il est nécessaire de remplir tous les champs pour chacune des langues afin que le référencement soit optimisé.",
    submit: "Mettre à jour",
    updated: "Le SEO a été modifié avec succès.",
    validation: "Une erreur est survenue lors de la validation des données.",
  },
  en: {
    title: "Edit SEO",
    description: "It is necessary to fill in all fields for each language in order to optimize the referencing.",
    submit: "Update",
    updated: "The SEO has been edited successfully.",
    validation: "An error occurred during the validation of the data.",
  },
  de: {
    title: "SEO bearbeiten",
    description:
      "Es ist notwendig, alle Felder für jede Sprache auszufüllen, um die Suchmaschinenoptimierung zu optimieren.",
    submit: "Aktualisieren",
    updated: "Das SEO wurde erfolgreich bearbeitet.",
    validation: "Ein Fehler ist bei der Validierung der Daten aufgetreten.",
  },
} satisfies Translation
