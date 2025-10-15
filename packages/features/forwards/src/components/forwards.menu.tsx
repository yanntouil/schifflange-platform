import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { G } from "@compo/utils"
import { type Api } from "@services/dashboard"
import {
  Ellipsis,
  FileInput,
  FilePenLine,
  FilePlusIcon,
  SquareArrowOutUpRight,
  SquareDashedMousePointer,
  SquareMousePointer,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { useForwards } from "../forwards.context"
import { useForwardsService } from "../service.context"

/**
 * ForwardsMenu
 */
export const ForwardsMenu: React.FC<{ forward: Api.Forward }> = ({ forward }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useForwards()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(forward)
  const { routeToArticle, routeToPage, makeUrl } = useForwardsService()
  const page = forward.slug?.page?.id
  const article = forward.slug?.article?.id
  const url = makeUrl(forward.slug)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(forward)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(forward)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}

      {G.isNotNullable(page) && (
        <Ui.Menu.Item asChild>
          <Link href={routeToPage(page)}>
            <FileInput aria-hidden />
            {_("view-page")}
          </Link>
        </Ui.Menu.Item>
      )}

      {G.isNotNullable(article) && (
        <Ui.Menu.Item asChild>
          <Link href={routeToArticle(article)}>
            <FileInput aria-hidden />
            {_("view-article")}
          </Link>
        </Ui.Menu.Item>
      )}
      <Ui.Menu.Item asChild>
        <a href={url} target='_blank' rel='noopener noreferrer nofollow'>
          <SquareArrowOutUpRight aria-hidden />
          {_("open-forward")}
        </a>
      </Ui.Menu.Item>

      <Ui.Menu.Item onClick={() => ctx.editForward(forward)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>

      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Ellipsis aria-hidden />
          {_("more")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.Item onClick={() => ctx.confirmDeleteForward(forward)}>
            <Trash2 aria-hidden />
            {_("delete")}
          </Ui.Menu.Item>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>

      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createForward()}>
            <FilePlusIcon aria-hidden />
            {_("create")}
          </Ui.Menu.Item>
          {isSelected && (
            <>
              <Ui.Menu.Separator />
              <Ui.Menu.Item onClick={() => ctx.confirmDeleteSelection()}>
                <Trash2Icon aria-hidden />
                {_("delete-selection")}
              </Ui.Menu.Item>
            </>
          )}
        </>
      )}
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    select: "Select redirect",
    unselect: "Deselect redirect",
    "view-page": "View page",
    "view-article": "View article",
    "open-forward": "Open forward",
    edit: "Edit redirect",
    delete: "Delete redirect",
    create: "New redirect",
    "delete-selection": "Delete selected redirects",
    more: "More actions",
  },
  fr: {
    select: "Sélectionner la redirection",
    unselect: "Désélectionner la redirection",
    "view-page": "Voir la page",
    "view-article": "Voir l'article",
    "open-forward": "Ouvrir la redirection",
    edit: "Modifier la redirection",
    delete: "Supprimer la redirection",
    create: "Nouvelle redirection",
    "delete-selection": "Supprimer les redirections sélectionnées",
    more: "Plus d'actions",
  },
  de: {
    select: "Weiterleitung auswählen",
    unselect: "Weiterleitung abwählen",
    "view-page": "Seite anzeigen",
    "view-article": "Artikel anzeigen",
    "open-forward": "Weiterleitung öffnen",
    edit: "Weiterleitung bearbeiten",
    delete: "Weiterleitung löschen",
    create: "Neue Weiterleitung",
    "delete-selection": "Ausgewählte Weiterleitungen löschen",
    more: "Weitere Aktionen",
  },
}
