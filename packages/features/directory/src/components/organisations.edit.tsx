import { extractFormFilePayload, Form, makeFormFileValue, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage, useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, match } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import React from "react"
import { useCategoryOptions } from "../hooks/use-category-options"
import { organisationTypes, useTypeOptions } from "../hooks/use-type-options"
import { useDirectoryService } from "../service.context"
import { OrganisationsForm } from "./organisations.form"

/**
 * OrganisationsEditDialog
 */
export const OrganisationsEditDialog: React.FC<Ui.QuickDialogProps<Api.Organisation>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-4xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.Organisation>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service, getImageUrl, organisationType } = useDirectoryService()
  const { current } = useContextualLanguage()
  const initialValues = {
    logoImage: makeFormFileValue(getImageUrl(item.logoImage, "preview")),
    cardImage: makeFormFileValue(getImageUrl(item.cardImage, "preview")),
    type: item.type,
    phones: item.phones,
    emails: item.emails,
    extras: item.extras,
    addresses: item.addresses,
    categoryIds: A.map(item.categories, D.prop("id")),
    translations: useFormTranslatable(item.translations, servicePlaceholder.organisation),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
        logoImage: extractFormFilePayload(values.logoImage),
        cardImage: extractFormFilePayload(values.cardImage),
      }
      return match(await service.organisations.id(item.id).update(payload))
        .with({ ok: true }, async ({ data }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(data.organisation)
          close()
        })
        .otherwise(async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
    },
  })
  const typeOptions = useTypeOptions()
  const [categoryOptions] = useCategoryOptions(form.values.type)

  /**
   * State to preserve categories per type
   * Initializes an object with all organisation types as keys
   * Only the current type (item.type) contains existing categories,
   * other types are initialized with empty arrays
   */
  const [categoriesByType, setCategoriesByType] = React.useState(() =>
    A.reduce(organisationTypes, {} as Record<Api.OrganisationType, string[]>, (acc, type) =>
      D.set(acc, type, item.type === type ? A.map(item.categories, D.prop("id")) : [])
    )
  )

  /**
   * Handle category preservation when type changes
   * typeRef keeps track of the previous type to detect changes
   */
  const typeRef = React.useRef(item.type)
  React.useEffect(() => {
    // If type hasn't changed, do nothing (prevents infinite loops)
    const prevType = typeRef.current
    const newType = form.values.type
    if (prevType === newType) return
    typeRef.current = newType

    // Save current categories for the previous type before switching
    const currentCategories = [...form.values.categoryIds]
    const prevCategories = D.get(categoriesByType, prevType) ?? []
    const hasChanged = !A.every(currentCategories, (id) => A.includes(prevCategories, id))
    if (hasChanged) {
      setCategoriesByType((prev) => D.set(prev, prevType, currentCategories))
    }

    // Restore saved categories for the new type (or [] if none)
    form.setValues({ categoryIds: D.get(categoriesByType, newType) ?? [] })
  }, [form.values.type, form.values.categoryIds, form.setValues, categoriesByType])

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <OrganisationsForm />
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
    title: "Edit organisation",
    description: "Update the selected organisation.",
    submit: "Save changes",
    updated: "Organisation updated successfully",
    failed: "Failed to update organisation",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier l'organisation",
    description: "Mettre à jour l'organisation sélectionnée.",
    submit: "Enregistrer les modifications",
    updated: "Organisation mise à jour avec succès",
    failed: "Échec de la mise à jour de l'organisation",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Organisation bearbeiten",
    description: "Die ausgewählte Organisation aktualisieren.",
    submit: "Änderungen speichern",
    updated: "Organisation erfolgreich aktualisiert",
    failed: "Organisation konnte nicht aktualisiert werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
