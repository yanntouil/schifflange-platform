import { Translation, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm, G, isNotEmptyString } from "@compo/utils"
import React from "react"
import { FormRoot, useForm } from "."

/**
 * FormQuickUpdate
 * display a quick update form in a dialog
 */
type FormQuickUpdateProps = {
  // field row props
  label: string
  content: React.ReactNode
  button: string
  // dialog props
  title: string
  description: string
  submit?: string
  cancel?: string
  children: React.ReactNode
  form: ReturnType<typeof useForm<any>>
  classNames?: {
    label?: string
    content?: string
    button?: string
    dialog: Ui.Dialog.DialogContentProps["classNames"] & {
      header?: string
      title?: string
      body?: string
      description?: string
      footer?: string
    }
  }
}
export const FormQuickUpdate: React.FC<FormQuickUpdateProps> = ({
  label,
  content,
  button,
  children,
  title,
  description,
  submit,
  form,
  classNames,
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Dialog.Uncontrolled>
      <div className='flex items-center justify-between gap-6' data-slot='auth-field'>
        <div className=''>
          <h4 className='text-sm font-medium'>{label}</h4>
          {G.isString(content) ? (
            <p className='text-muted-foreground text-xs'>{content}</p>
          ) : (
            <div className='text-muted-foreground text-xs'>{content}</div>
          )}
        </div>
        <div>
          <Ui.Dialog.Trigger asChild>
            <Ui.Button variant='outline' size='sm'>
              {button}
            </Ui.Button>
          </Ui.Dialog.Trigger>
        </div>
      </div>
      <Ui.Dialog.Content
        classNames={{
          content: cxm("sm:max-w-lg", classNames?.dialog?.content),
          wrapper: classNames?.dialog?.wrapper,
        }}
      >
        <FormRoot form={form}>
          <Ui.Dialog.Header className={classNames?.dialog?.header}>
            <Ui.Dialog.Title className={classNames?.dialog?.title}>{title}</Ui.Dialog.Title>
            {isNotEmptyString(description) && (
              <Ui.Dialog.Description className={classNames?.dialog?.description}>{description}</Ui.Dialog.Description>
            )}
          </Ui.Dialog.Header>
          <div className={cxm("space-y-6 py-6", classNames?.dialog?.body)}>{children}</div>
          <Ui.Dialog.Footer className={classNames?.dialog?.footer}>
            <Ui.Button className='w-full'>{submit ?? _("submit")}</Ui.Button>
          </Ui.Dialog.Footer>
        </FormRoot>
      </Ui.Dialog.Content>
    </Ui.Dialog.Uncontrolled>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    submit: "Save",
    cancel: "Cancel",
  },
  fr: {
    submit: "Enregistrer",
    cancel: "Annuler",
  },
  de: {
    submit: "Speichern",
    cancel: "Abbrechen",
  },
} satisfies Translation
