import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * FormUpdate
 */
export const FormUpdate: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialogStickyFooter>
      <Form.Submit className='w-full'>{_("update")}</Form.Submit>
    </Ui.QuickDialogStickyFooter>
  )
}

const dictionary = {
  fr: {
    update: "Mettre à jour",
  },
  de: {
    update: "Aktualisieren",
  },
  en: {
    update: "Update",
  },
}
