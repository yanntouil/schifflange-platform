import { Form, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, match, S } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { FormSlugPath } from "."
import { useReservedPath } from "../hooks/use-reserved-path"
import { useSlugsService } from "../service.context"
import { slugify } from "../utils"

/**
 * EditSlugDialog
 */
export const EditSlugDialog: React.FC<Ui.QuickDialogProps<Api.Slug, Api.Slug & Api.WithModel>> = ({
  item,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.Slug, Api.Slug & Api.WithModel>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)

  const { service } = useSlugsService()
  const reservedPath = useReservedPath(item.id)
  const { min } = validator

  const initialValues = {
    path: item.path,
  }
  const form = useForm({
    values: initialValues,
    validate: validator<typeof initialValues>({
      path: [
        min(1, _("path-required")),
        (value) => (A.includes(reservedPath, slugify(value)) ? _("path-reserved") : null),
      ],
    }),
    onSubmit: async ({ values }) => {
      return await match(
        await service.slug(item.id).update({
          slug: A.last(S.split(values.path, "/")) ?? "",
          path: slugify(values.path),
        })
      )
        .with({ ok: true }, async ({ data }) => {
          mutate?.(data.slug)
          Ui.toast.success(_("updated"))
          close()
        })
        .otherwise(({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => _("E_VALIDATION_FAILURE"))
            .otherwise(() => Ui.toast.error(_("E_UNKNOWN")))
        )
    },
  })

  return (
    <Form.Root form={form}>
      <div className='py-2'>
        <FormSlugPath
          label={_(`path-${item.model}-label`)}
          placeholder={_(`path-${item.model}-placeholder`)}
          name='path'
          labelAside={
            <Form.Info
              title={_("path-info")}
              children={
                <>
                  <p>{_("path-info-1")}</p>
                  <p>{_("path-info-2")}</p>
                  <p>{_("path-info-3")}</p>
                </>
              }
            />
          }
        />
      </div>
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Mise à jour du slug",
    description:
      "La modification du slug peut affecter le référencement et l'accès direct via certains liens existants. Ne faites cela que si vous êtes en connaissance des implications.",
    "path-page-label": "Entrez un slug pour la page",
    "path-page-placeholder": "page/mon-page",
    "path-article-label": "Entrez un slug pour l'article",
    "path-article-placeholder": "article/mon-article",
    "path-event-label": "Entrez un slug pour l'événement",
    "path-event-placeholder": "event/mon-événement",
    "path-required": "Le chemin est requis",
    "path-reserved": "Le chemin est déjà utilisé par une autre ressource",
    "path-info": "Informations sur le slug",
    "path-info-1": "Le slug est un identifiant unique intégré à l'URL de votre page.",
    "path-info-2":
      "Par défaut, l'application génère automatiquement des slugs uniques (avec un identifiant technique) pour éviter tout conflit lors de l'internationalisation du site.",
    "path-info-3":
      "Vous avez la possibilité de personnaliser manuellement ce slug pour obtenir une URL plus lisible (par exemple, a-propos au lieu de clwz2pq1f0001x9m9abcdefg), mais cela reste facultatif et ne doit être fait que si vous maîtrisez les implications sur les liens existants et le référencement.",
    submit: "Mettre à jour",
    updated: "Le slug a été mis à jour",
    E_VALIDATION_FAILURE: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
    E_UNKNOWN: "Une erreur inconnue est survenue lors de la modification du slug",
  },
  de: {
    title: "Slug aktualisieren",
    description:
      "Die Änderung des Slugs kann die Verlinkung und den direkten Zugriff über bestehende Links beeinträchtigen. Führen Sie dies nur durch, wenn Sie sich der Auswirkungen bewusst sind.",
    "path-page-label": "Geben Sie einen Slug für die Seite ein",
    "path-page-placeholder": "seite/meine-seite",
    "path-article-label": "Geben Sie einen Slug für den Artikel ein",
    "path-article-placeholder": "artikel/mein-artikel",
    "path-event-label": "Geben Sie einen Slug für das Event ein",
    "path-event-placeholder": "event/mein-event",
    "path-required": "Der Pfad ist erforderlich",
    "path-reserved": "Der Pfad wird bereits von einer anderen Ressource verwendet",
    "path-info": "Informationen zum Slug",
    "path-info-1": "Der Slug ist eine eindeutige Kennung, die in die URL Ihrer Seite integriert wird.",
    "path-info-2":
      "Standardmäßig generiert die Anwendung automatisch eindeutige Slugs (mit einer technischen Kennung), um Konflikte bei der Internationalisierung der Website zu vermeiden.",
    "path-info-3":
      "Sie haben die Möglichkeit, diesen Slug manuell anzupassen, um eine besser lesbare URL zu erhalten (z.B. ueber-uns anstatt clwz2pq1f0001x9m9abcdefg), aber dies ist optional und sollte nur erfolgen, wenn Sie die Auswirkungen auf bestehende Links und die Suchmaschinenoptimierung verstehen.",
    submit: "Aktualisieren",
    updated: "Der Slug wurde aktualisiert",
    E_VALIDATION_FAILURE:
      "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    E_UNKNOWN: "Ein unbekannter Fehler ist beim Aktualisieren des Slugs aufgetreten",
  },
  en: {
    title: "Update slug",
    description:
      "The modification of the slug can affect the referencing and direct access via certain existing links. Only do this if you are aware of the implications.",
    "path-page-label": "Enter a slug for the page",
    "path-page-placeholder": "page/my-page",
    "path-article-label": "Enter a slug for the article",
    "path-article-placeholder": "article/my-article",
    "path-event-label": "Enter a slug for the event",
    "path-event-placeholder": "event/my-event",
    "path-required": "The path is required",
    "path-reserved": "The path is already used",
    "path-info": "Information about the slug",
    "path-info-1": "The slug is a unique identifier integrated into the URL of your page.",
    "path-info-2":
      "By default, the application automatically generates unique slugs (with a technical identifier) to avoid any conflict when internationalizing the site.",
    "path-info-3":
      "You have the possibility to manually customize this slug to obtain a more readable URL (for example, about instead of clwz2pq1f0001x9m9abcdefg), but this is optional and should only be done if you master the implications on existing links and referencing.",
    submit: "Update",
    updated: "The slug has been updated",
    E_VALIDATION_FAILURE: "Some of your inputs are invalid. Please check your inputs and try again.",
    E_UNKNOWN: "An unknown error occurred while updating the slug",
  },
}
