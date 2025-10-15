import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { ChartNoAxesCombined, Ellipsis, ExternalLink, TextCursorInput, Trash2 } from "lucide-react"
import React from "react"
import { useArticle } from "../../article.context"
import { useArticlesService } from "../../service.context"
import { StateButton } from "./state"
import { StatsButton } from "./stats"

/**
 * MenuButton
 */
export const MenuButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr } = useArticle()
  const { isAdmin } = useArticlesService()
  return (
    <>
      <StateButton />
      <StatsButton />
      <Ui.DropdownMenu.Quick menu={<ArticleMenu />}>
        <Ui.Tooltip.Quick tooltip={_("open-menu")} side='left' asChild>
          <Ui.Button variant='ghost' icon size='xs'>
            <Ellipsis aria-hidden />
            <Ui.SrOnly>{_("open-menu")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
      </Ui.DropdownMenu.Quick>
    </>
  )
}

const ArticleMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { makeUrl, isAdmin, service } = useArticlesService()
  const { swr, confirmDelete, editSlug } = useArticle()

  const isPublished = swr.article.state === "published"

  const seed = async () => {
    Ui.toast.promise(service.id(swr.article.id).trackings.tracking(swr.article.tracking.id).seed(), {
      loading: _("menu.seed-progress"),
      success: _("menu.seed-success"),
      error: _("menu.seed-error"),
    })
  }

  return (
    <>
      {isAdmin && (
        <Ui.DropdownMenu.Item onClick={seed} className='text-orange-700'>
          <ChartNoAxesCombined aria-hidden />
          {_("menu.seed")}
        </Ui.DropdownMenu.Item>
      )}

      <Ui.DropdownMenu.Item onClick={() => editSlug(swr.article.slug)}>
        <TextCursorInput aria-hidden />
        {_("menu.edit-slug")}
      </Ui.DropdownMenu.Item>
      {isPublished && (
        <Ui.DropdownMenu.Item asChild>
          <a href={makeUrl(swr.article.slug)} target='_blank' rel='noopener noreferrer nofollow'>
            <ExternalLink aria-hidden />
            {_("menu.link")}
          </a>
        </Ui.DropdownMenu.Item>
      )}
      <Ui.DropdownMenu.Item onClick={() => confirmDelete()}>
        <Trash2 aria-hidden />
        {_("menu.delete")}
      </Ui.DropdownMenu.Item>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "open-menu": "Ouvrir le menu de la page",
    menu: {
      "edit-slug": "Modifier le slug",
      seed: "Populer les statistiques",
      "seed-progress": "Population des statistiques",
      "seed-success": "Statistiques populées",
      "seed-error": "Erreur lors de la population des statistiques",
      link: "Voir la page sur le site",
      lock: "Verrouiller cette page",
      unlock: "Déverrouiller cette page",
      delete: "Supprimer cette page",
    },
  },
  en: {
    "open-menu": "Open page menu",
    menu: {
      "edit-slug": "Edit slug",
      seed: "Populate statistics",
      "seed-progress": "Populating statistics",
      "seed-success": "Statistics populated",
      "seed-error": "Error populating statistics",
      link: "View page on website",
      lock: "Lock this page",
      unlock: "Unlock this page",
      delete: "Delete this page",
    },
  },
  de: {
    "open-menu": "Artikel-Menü öffnen",
    menu: {
      "edit-slug": "Slug bearbeiten",
      seed: "Statistiken befüllen",
      "seed-progress": "Statistiken werden befüllt",
      "seed-success": "Statistiken befüllt",
      "seed-error": "Fehler beim Befüllen der Statistiken",
      link: "Artikel auf Website anzeigen",
      lock: "Diesen Artikel sperren",
      unlock: "Diesen Artikel entsperren",
      delete: "Diesen Artikel löschen",
    },
  },
}
