import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Api } from "@services/dashboard"
import React from "react"
import { useMenu } from "../../menu.context"
import { useTemplates } from "../templates.context"
import { ItemMenu } from "./item-menu"
import { Menu } from "./menu"
import { Reorderable } from "./reorderable"

/**
 * Header
 */
export const Header: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createItem } = useMenu()

  return (
    <>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title", { name: swr.menu.name })}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>

      <Dashboard.Empty
        total={swr.items.length}
        results={swr.items.length}
        t={_.prefixed("empty")}
        create={() => createItem({ order: -1 })}
        isLoading={false}
      >
        <Menu createItem={createItem}>
          {(item) => (
            <Reorderable item={item} createItem={createItem} menu={(subItem) => <ItemMenu item={subItem} />}>
              {(item) => <DispatchTemplate item={item} />}
            </Reorderable>
          )}
        </Menu>
      </Dashboard.Empty>
    </>
  )
}

/**
 * templates
 */
const DispatchTemplate: React.FC<{
  item: Api.MenuItemWithRelations
}> = ({ item }) => {
  const { templates } = useTemplates()
  if (templates.length === 0 || item.type === "group") return null
  const template = templates.find((t) => t.value === item.props.template)
  if (!template) return null
  const Render = template.Render
  return <Render item={item} />
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Gestion du menu principal",
    description: "Organisez les éléments du menu de navigation principal.",
    empty: {
      "no-item-title": "Aucun élément pour le moment",
      "no-item-content-create": "Commencez par ajouter votre premier élément {{create:en cliquant ici}}",
      "no-item-content": "Ce menu n'a pas encore d'éléments.",
    },
  },
  de: {
    title: "Hauptmenü-Verwaltung",
    description: "Organisieren Sie die Hauptnavigationselemente.",
    empty: {
      "no-item-title": "Noch keine Elemente vorhanden",
      "no-item-content-create": "Beginnen Sie, indem Sie Ihr erstes Element {{create:hier hinzufügen}}",
      "no-item-content": "Dieses Menü hat noch keine Elemente.",
    },
  },
  en: {
    title: "Main menu management",
    description: "Organize the main navigation menu items.",
    empty: {
      "no-item-title": "No items yet",
      "no-item-content-create": "Start by adding your first item {{create:by clicking here}}",
      "no-item-content": "This menu has no items yet.",
    },
  },
}
