import { DictionaryFn, translateDefault, Translation, useTranslation } from "@compo/localize"
import { G } from "@mobily/ts-belt"
import React from "react"
import { ConfirmDialogProps } from "react-confirm"
import { toast } from "sonner"
import { Alert } from "../alert"
import { ConfirmProps } from "./types"

/**
 * Confirm
 */
export const Confirm: React.FC<ConfirmProps> = (props) => {
  const {
    open,
    onCancel,
    onConfirm,
    onAsyncConfirm,
    list,
    displayName = () => "",
    t = translateDefault,
    ...rest
  } = props
  const { _ } = useTranslation(dictionary)

  const onClick = async () => {
    if (open === false) return
    if (G.isNotNullable(onConfirm)) onConfirm(open)
    if (G.isNotNullable(onAsyncConfirm)) {
      if (list) {
        let counter = 0
        const total = list.length
        const toastId = toast.loading(
          t("progress", { counter, total, defaultValue: _("multiple-progress", { counter, total }) })
        )

        let hasErrors = false
        for (const item of list) {
          const isFailed = await onAsyncConfirm(item)
          if (isFailed === true) {
            hasErrors = true
            toast.error(t("error", { defaultValue: _("error") }), { description: displayName(item) })
          }
          counter++
          if (counter < total) {
            toast.loading(t("progress", { counter, total, defaultValue: _("multiple-progress", { counter, total }) }), {
              id: toastId,
            })
          }
        }

        toast.dismiss(toastId)
        if (!hasErrors) {
          toast.success(t("success", { defaultValue: _("success") }))
        }
        rest.finally?.()
      } else {
        const toastId = toast.loading(t("progress", { defaultValue: _("progress") }))
        const isFailed = await onAsyncConfirm(open)
        if (isFailed === true) toast.error(t("error", { defaultValue: _("error") }), { id: toastId })
        else if (isFailed === false) toast.success(t("success", { defaultValue: _("success") }), { id: toastId })
        else toast.dismiss(toastId)
        rest.finally?.()
      }
    }
    onCancel()
  }
  return (
    <Alert.Root open={open !== false} onOpenChange={onCancel}>
      <Alert.Content className='max-w-md'>
        <Alert.Header>
          <Alert.Title>{t("title", { defaultValue: _("title") })}</Alert.Title>
          {t.exist("description") && (
            <Alert.Description className='text-sm text-muted-foreground'>{t("description")}</Alert.Description>
          )}
        </Alert.Header>
        <Alert.Footer>
          <Alert.Cancel>{t("cancel", { defaultValue: _("cancel") })}</Alert.Cancel>
          <Alert.Action onClick={onClick}>{t("confirm", { defaultValue: _("confirm") })}</Alert.Action>
        </Alert.Footer>
      </Alert.Content>
    </Alert.Root>
  )
}

/**
 * Confirmable
 */
export type ConfirmableProps = {
  t?: DictionaryFn
}
export const Confirmable: React.FC<ConfirmDialogProps<ConfirmableProps, boolean>> = ({
  t = translateDefault,
  proceed,
  show,
}) => {
  return (
    <Alert.Root open={show} onOpenChange={() => proceed(false)}>
      <Alert.Content className='max-w-md'>
        <Alert.Header>
          <Alert.Title>{t("title")}</Alert.Title>
          {t.exist("description") && (
            <Alert.Description className='text-sm text-muted-foreground'>{t("description")}</Alert.Description>
          )}
        </Alert.Header>
        <Alert.Footer>
          <Alert.Cancel>{t("cancel")}</Alert.Cancel>
          <Alert.Action onClick={() => proceed(true)}>{t("confirm")}</Alert.Action>
        </Alert.Footer>
      </Alert.Content>
    </Alert.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Êtes-vous sûr?",
    description: "",
    cancel: "Annuler",
    confirm: "Confirmer",
    success: "Succès de l'exécution",
    error: "Erreur lors de l'exécution",
    progress: "Progression de l'exécution",
    "multiple-progress": "Progression de l'exécution {{counter}} / {{total}}",
  },
  en: {
    title: "Are you sure?",
    description: "",
    cancel: "Cancel",
    confirm: "Confirm",
    success: "Success of execution",
    error: "Error during execution",
    progress: "Progression of execution",
    "multiple-progress": "Progression of execution {{counter}} / {{total}}",
  },
  de: {
    title: "Sind Sie sicher?",
    description: "",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    success: "Erfolgreich",
    error: "Fehler",
    progress: "Fortschritt",
    "multiple-progress": "Fortschritt {{counter}} / {{total}}",
  },
} satisfies Translation
