import { extractFormFilePayload, Form, makeFormFileValue, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { ExtraField } from "@services/dashboard/src/types"
import React from "react"
import { organisationTypeDefault } from "../hooks/use-type-options"
import { useDirectoryService } from "../service.context"
import { OrganisationAddress } from "./form/addresses"
import { OrganisationsForm } from "./organisations.form"

/**
 * OrganisationsCreateDialog
 */
export const OrganisationsCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.Organisation>> = ({
  item,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-4xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.Organisation>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service, organisationId, organisationType } = useDirectoryService()

  const initialValues = {
    logoImage: makeFormFileValue(),
    cardImage: makeFormFileValue(),
    type: organisationType ?? organisationTypeDefault,
    phones: [] as ExtraField[],
    emails: [] as ExtraField[],
    extras: [] as ExtraField[],
    addresses: [] as OrganisationAddress[],
    categoryIds: [] as string[],
    translations: useFormTranslatable<Api.OrganisationTranslation, Partial<Api.OrganisationTranslation>>(
      [],
      servicePlaceholder.organisation
    ),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
        logoImage: extractFormFilePayload(values.logoImage),
        cardImage: extractFormFilePayload(values.cardImage),
        parentOrganisationId: organisationId ?? null,
      }
      return match(await service.organisations.create(payload))
        .with({ ok: true }, async ({ data }) => {
          Ui.toast.success(_("created"))
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
    title: "Create organisation",
    description: "Create a new organisation.",
    submit: "Create organisation",
    created: "Organisation created successfully",
    failed: "Failed to create organisation",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Créer une organisation",
    description: "Créer une nouvelle organisation.",
    submit: "Créer l'organisation",
    created: "Organisation créée avec succès",
    failed: "Échec de la création de l'organisation",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Organisation erstellen",
    description: "Eine neue Organisation erstellen.",
    submit: "Organisation erstellen",
    created: "Organisation erfolgreich erstellt",
    failed: "Organisation konnte nicht erstellt werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
