import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
import React from "react"
import { useCategories } from "../categories.context"

/**
 * CategoriesHeader
 */
export const CategoriesHeader: React.FC<{ hideCreate?: boolean }> = ({ hideCreate = false }) => {
  const { _ } = useTranslation(dictionary)
  const { createCategory } = useCategories()
  return (
    <Dashboard.Header className='flex justify-between gap-8'>
      <div className='space-y-1.5'>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant='outline' icon size='lg' onClick={() => createCategory()}>
        <Plus aria-hidden />
        <Ui.SrOnly>{_("create-category")}</Ui.SrOnly>
      </Ui.Button>
    </Dashboard.Header>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Categories",
    description: "Manage all categories",
    "create-category": "Create category",
  },
  fr: {
    title: "Catégories",
    description: "Gérer toutes les catégories",
    "create-category": "Créer une catégorie",
  },
  de: {
    title: "Kategorien",
    description: "Alle Kategorien verwalten",
    "create-category": "Kategorie erstellen",
  },
}
