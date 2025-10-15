import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { Edit, SquareArrowOutUpRight, Trash2 } from "lucide-react"
import React from "react"
import { useMenu } from "../../menu.context"
import { useMenusService } from "../../service.context"

/**
 * ItemMenu
 */
export const ItemMenu: React.FC<{
  item: Api.MenuItemWithRelations
  editItem: (item: Api.MenuItemWithRelations) => void
}> = ({ item, editItem }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useMenu()

  const { makeUrl } = useMenusService()
  const { current, translate } = useContextualLanguage()
  const externalUrl = translate(item, servicePlaceholder.menuItem).props.url
  const urlFromLink = makeUrl((item.props?.link as string) ?? "", current.code)
  const urlFromSlug = makeUrl(item.slug?.path ?? "", current.code)
  return (
    <>
      {item.type === "url" && (
        <Ui.Menu.Item asChild>
          <a href={externalUrl} target='_blank' rel='noopener noreferrer'>
            <SquareArrowOutUpRight aria-hidden />
            {_("display-url")}
          </a>
        </Ui.Menu.Item>
      )}
      {item.type === "link" && (
        <Ui.Menu.Item asChild>
          <a href={urlFromLink} target='_blank' rel='noopener noreferrer'>
            <SquareArrowOutUpRight aria-hidden />
            {_("display-link")}
          </a>
        </Ui.Menu.Item>
      )}
      {item.type === "resource" && item.slug && (
        <>
          <Ui.Menu.Item asChild>
            <a href={urlFromSlug} target='_blank' rel='noopener noreferrer'>
              <SquareArrowOutUpRight aria-hidden />
              {_(`display-${item.slug?.model}`)}
            </a>
          </Ui.Menu.Item>
          <Ui.Menu.Item onClick={() => ctx.displayResource(item)}>
            <SquareArrowOutUpRight aria-hidden />
            {_(`open-${item.slug.model}`)}
          </Ui.Menu.Item>
        </>
      )}
      <Ui.Menu.Item onClick={() => editItem(item)}>
        <Edit aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.confirmDeleteItem(item)}>
        <Trash2 aria-hidden />
        {_("delete")}
      </Ui.Menu.Item>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "display-url": "Afficher le lien sur le web",
    "display-link": "Afficher le lien sur le site",
    "display-page": "Afficher la page sur le site",
    "display-article": "Afficher l'article sur le site",
    "open-page": "Aller à la page",
    "open-article": "Aller à l'article",
    edit: "Modifier l'élément",
    delete: "Supprimer l'élément",
  },
  de: {
    "display-url": "Link im Web anzeigen",
    "display-link": "Link auf der Website anzeigen",
    "display-page": "Seite auf der Website anzeigen",
    "display-article": "Artikel auf der Website anzeigen",
    "open-page": "Zur Seite gehen",
    "open-article": "Zum Artikel gehen",
    edit: "Element bearbeiten",
    delete: "Element löschen",
  },
  en: {
    "display-url": "Display the link on the web",
    "display-link": "Display the link on the site",
    "display-page": "Display the page on the site",
    "display-article": "Display the article on the site",
    "open-page": "Go to the page",
    "open-article": "Go to the article",
    edit: "Edit the element",
    delete: "Delete the element",
  },
}
