import { Form, FormInfo } from "@compo/form"
import { useTranslation } from "@compo/localize"
import React from "react"
import { useArticlesStateOptions } from ".."
import { useCategoryOptions } from "../hooks/use-category-options"

/**
 * ArticlesForm
 */
export const ArticlesForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const stateOptions = useArticlesStateOptions()
  const [categoryOptions, isLoadingCategoryOptions] = useCategoryOptions(true)

  return (
    <>
      <Form.Select
        label={_("state-label")}
        name='state'
        options={stateOptions}
        labelAside={<FormInfo title={_("state-label")} content={_("state-info")} />}
      />
      <Form.Select
        label={_("category-label")}
        name='categoryId'
        options={categoryOptions}
        labelAside={<FormInfo title={_("category-label")} content={_("category-info")} />}
      />{" "}
    </>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    "state-label": "Article status",
    "state-draft": "Draft",
    "state-draft-description": "Article is not visible to visitors",
    "state-published": "Published",
    "state-published-description": "Article is live and visible to visitors",
    "state-info": "Control whether this page is visible on your website. Draft pages are only visible to editors.",
    "category-label": "Category",
    "category-info":
      "Assign this article to a category to help organize your content. Categories help visitors find related articles.",
  },
  fr: {
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
  },
  de: {
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
  },
}
