import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import { useMenus } from "../menus.context"
import { MenusCards } from "./menus.cards"

/**
 * Menus
 * This component is used to manage and navigate between the menus list
 */
export const Menus: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createMenu, clear, selected, confirmDeleteSelection } = useMenus()
  const { menus } = swr

  const total = menus.length
  const results = menus.length

  return (
    <>
      <Dashboard.Collection onPointerDownOutside={clear} view='card'>
        {/* <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} /> */}
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createMenu}
          isLoading={swr.isLoading}
        >
          <MenusCards menus={menus} />
        </Dashboard.Empty>

        {swr.isLoading && <MenusCardsSkeleton count={3} />}
      </Dashboard.Collection>
    </>
  )
}

/**
 * MenusCardsSkeleton - Loading skeleton
 */
const MenusCardsSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className='grid grid-cols-1 gap-4 @lg/collection:grid-cols-2 @3xl/collection:grid-cols-3'>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className='h-32 animate-pulse rounded-lg bg-gray-100' />
      ))}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    empty: {
      "no-item-title": "Aucun menu pour le moment",
      "no-item-content-create": "Commencez par créer votre premier menu {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de menu ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons pas trouvé de menu correspondant à votre recherche.",
    },
  },
  de: {
    empty: {
      "no-item-title": "Noch keine Menüs vorhanden",
      "no-item-content-create": "Beginnen Sie, indem Sie Ihr erstes Menü {{create:hier erstellen}}",
      "no-item-content": "Es sind derzeit keine Menüs vorhanden.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten kein Menü finden, das Ihrer Suche entspricht.",
    },
  },
  en: {
    empty: {
      "no-item-title": "No menus yet",
      "no-item-content-create": "Start by creating your first menu {{create:by clicking here}}",
      "no-item-content": "There are no menus here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any menu corresponding to your search.",
    },
  },
}
