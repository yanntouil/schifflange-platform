import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useArticlesService } from ".."
import { ArticlesForm } from "./articles.form"

/**
 * ArticlesEditDialog
 */
export const ArticlesEditDialog: React.FC<Ui.QuickDialogProps<Api.ArticleWithRelations>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.ArticleWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useArticlesService()
  const servicePage = service.id(item.id)

  const initialValues = { state: item.state, categoryId: item.categoryId || "none" }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
        categoryId: values.categoryId === "none" ? null : values.categoryId,
      }
      return match(await servicePage.update(payload))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { article } }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(article)
          close()
        })
    },
  })
  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <ArticlesForm />
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
    title: "Edit article",
    description: "Update the article status and settings.",
    "state-label": "Article status",
    "state-draft": "Draft",
    "state-draft-description": "Article is not visible to visitors",
    "state-published": "Published",
    "state-published-description": "Article is live and visible to visitors",
    "state-info": "Control whether this page is visible on your website. Draft pages are only visible to editors.",
    "category-label": "Category",
    "category-info":
      "Assign this article to a category to help organize your content. Categories help visitors find related articles.",
    "lock-label": "Lock article (admin only)",
    "lock-info":
      "Locked articles cannot be edited by non-admin users. Useful for protecting important articles like homepage or legal articles.",
    submit: "Save changes",
    updated: "Article updated successfully",
    failed: "Failed to update article",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier l'article",
    description: "Mettre à jour le statut et les paramètres de l'article.",
    "state-label": "Statut de l'article",
    "state-draft": "Brouillon",
    "state-draft-description": "L'article n'est pas visible aux visiteurs",
    "state-published": "Publié",
    "state-published-description": "L'article est en ligne et visible aux visiteurs",
    "state-info":
      "Contrôlez si cet article est visible sur votre site web. Les articles brouillon ne sont visibles qu'aux éditeurs.",
    "category-label": "Catégorie",
    "category-info":
      "Assignez cet article à une catégorie pour aider à organiser votre contenu. Les catégories aident les visiteurs à trouver des articles similaires.",
    "lock-label": "Verrouiller l'article (admin uniquement)",
    "lock-info":
      "Les articles verrouillés ne peuvent pas être modifiés par les utilisateurs non-admin. Utile pour protéger des articles importantes comme l'article d'accueil ou les articles légaux.",
    submit: "Enregistrer les modifications",
    updated: "Article mise à jour avec succès",
    failed: "Échec de la mise à jour de l'article",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Artikel bearbeiten",
    description: "Den Artikel-Status und die Einstellungen aktualisieren.",
    "state-label": "Artikel-Status",
    "state-draft": "Entwurf",
    "state-draft-description": "Artikel ist für Besucher nicht sichtbar",
    "state-published": "Veröffentlicht",
    "state-published-description": "Artikel ist live und für Besucher sichtbar",
    "state-info":
      "Kontrollieren Sie, ob dieser Artikel auf Ihrer Website sichtbar ist. Entwurfs-Artikel sind nur für Redakteure sichtbar.",
    "category-label": "Kategorie",
    "category-info":
      "Weisen Sie diesen Artikel einer Kategorie zu, um Ihre Inhalte zu organisieren. Kategorien helfen Besuchern, verwandte Artikel zu finden.",
    "lock-label": "Artikel sperren (nur Admin)",
    "lock-info":
      "Gesperrte Artikel können nicht von Nicht-Admin-Benutzern bearbeitet werden. Nützlich zum Schutz wichtiger Artikel wie Homepage oder rechtliche Artikel.",
    submit: "Änderungen speichern",
    updated: "Artikel erfolgreich aktualisiert",
    failed: "Fehler beim Aktualisieren des Artikels",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
