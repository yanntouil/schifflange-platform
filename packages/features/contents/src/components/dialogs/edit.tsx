import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, G, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useContent } from "../../context"
import { makeItem } from "../../utils"
import { flattenClientItems } from "../../utils.ssr"

/**
 * EditDialog
 */
export const EditDialog: React.FC<Ui.QuickDialogProps<Api.ContentItem>> = ({ item, ...props }) => {
  const { items } = useContent()
  const itemsArray = flattenClientItems(items)
  const current = item !== false ? A.find(itemsArray, (i) => i.export.type === item.type) : undefined
  const { _ } = useTranslation(current?.export.dictionary ?? dictionary)

  return (
    <Ui.QuickDialog
      {...props}
      title={_("form.title")}
      description={_("form.description")}
      classNames={{ content: "sm:max-w-3xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <ItemForm item={item} {...props} />}
    </Ui.QuickDialog>
  )
}
const ItemForm: React.FC<Ui.QuickDialogSafeProps<Api.ContentItem>> = ({ item, close }) => {
  const { _ } = useTranslation(dictionary)
  const { items, swr, service } = useContent()
  const { languages } = useContextualLanguage()
  const itemsArray = flattenClientItems(items)
  const current = A.find(itemsArray, (i) => i.export.type === item.type)
  if (G.isNullable(current)) return null
  const typedItem = makeItem(
    { ...item, type: current.export.type },
    current.export.props,
    current.export.translations,
    languages
  )
  const Form = React.useMemo(() => current.createForm(current.export), [current.export])
  return (
    <Dashboard.Error
      fallbackRender={(props) => (
        <Dashboard.Trace
          {...props}
          title={_("error-title")}
          description={_("error-description")}
          className='p-0 pb-6'
        />
      )}
    >
      <Form
        item={typedItem}
        close={close}
        onSubmit={async (payload) => {
          const res = await service.items.id(item.id).update(payload)
          match(res)
            .with({ failed: true }, ({ except }) => Ui.toast.error(_("failed")))
            .otherwise(({ data }) => {
              Ui.toast.success(_("success"))
              swr.updateItem(data.item)
              close()
            })
        }}
      />
    </Dashboard.Error>
  )
}

const dictionary = {
  fr: {
    form: {
      title: "Mettre à jour",
      description: "Mettre à jour le block de contenu",
    },
    success: "Le block de contenu a été mis à jour",
    failed: "La mise à jour a échoué",
    "error-title": "Erreur imprévue lors de la mise à jour du block de contenu",
    "error-description":
      "Une erreur est survenue lors du rendu de ce formulaire. Vous pouvez voir le message d'erreur ci-dessous, essayer de le réparer ou contacter l'assistance.",
  },
  de: {
    form: {
      title: "Aktualisieren",
      description: "Den Inhalts-Block aktualisieren",
    },
    success: "Inhalts-Block aktualisiert",
    failed: "Aktualisierung fehlgeschlagen",
    "error-title": "Unerwarteter Fehler beim Aktualisieren des Inhalts-Blocks",
    "error-description":
      "Ein Fehler ist beim Rendern dieses Formulars aufgetreten. Sie können die Fehlermeldung unten sehen, versuchen Sie, sie zu beheben oder wenden Sie sich an den Support.",
  },
  en: {
    form: {
      title: "Update",
      description: "Update the content block",
    },
    success: "Content block updated",
    failed: "Update failed",
    "error-title": "Unexpected error updating content block",
    "error-description":
      "An error occurred while rendering this form. You can see the error message below, try to fix it or report it to support.",
  },
}
