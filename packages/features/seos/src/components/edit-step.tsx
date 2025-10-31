import { Form, useForm } from "@compo/form"
import { Translation, useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { ArrowRight, SaveAll } from "lucide-react"
import React from "react"
import { SeoContextType, useSeo } from "../seo.context"
import { SeoProvider } from "../seo.context.provider"
import { SeoForm } from "./form"

/**
 * SeoEditStepDialog
 */
export type SeoEditStepDialogProps = Omit<SeoContextType, "contextId" | "edit"> &
  FormProps & {
    title: string
    description: string
  }
export const SeoEditStepDialog: React.FC<SeoEditStepDialogProps> = ({
  title,
  description,
  onNext,
  nextLabel,
  onSkip,
  skipLabel,
  ...props
}) => {
  const formProps = { onNext, nextLabel, onSkip, skipLabel }
  return (
    <Ui.QuickDialogContent
      {...{ title, description }}
      classNames={{ content: "sm:max-w-screen-md", header: "z-10", close: "z-10" }}
      sticky
    >
      <SeoProvider {...props}>
        <DialogForm {...formProps} />
      </SeoProvider>
    </Ui.QuickDialogContent>
  )
}
type FormProps = {
  onNext: () => void
  nextLabel: string
  onSkip?: () => void
  skipLabel?: string
}
const DialogForm: React.FC<FormProps> = ({ onNext, nextLabel, onSkip, skipLabel }) => {
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
          mutate(data.seo)
          onNext()
        })
        .otherwise(() => _("validation"))
    },
  })
  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <SeoForm />
      <Ui.QuickDialogStickyFooter>
        <Ui.Button type='submit'>
          <SaveAll aria-hidden />
          {nextLabel}
        </Ui.Button>
        {onSkip && skipLabel && (
          <Ui.Button variant='outline' onClick={onSkip}>
            {skipLabel}
            <ArrowRight aria-hidden />
          </Ui.Button>
        )}
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    validation: "Une erreur est survenue lors de la validation des données.",
  },
  en: {
    validation: "An error occurred during the validation of the data.",
  },
  de: {
    validation: "Ein Fehler ist bei der Validierung der Daten aufgetreten.",
  },
} satisfies Translation
