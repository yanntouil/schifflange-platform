import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import {
  Ellipsis,
  FileClock,
  FileInput,
  FilePenLine,
  FilePlusIcon,
  FileSymlink,
  SquareArrowOutUpRight,
  SquareDashedMousePointer,
  SquareMousePointer,
  TextCursorInput,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import React from "react"
import { useArticles } from "../articles.context"
import { useArticlesService } from "../service.context"

/**
 * ArticlesMenu
 */
export const ArticlesMenu: React.FC<{ article: Api.ArticleWithRelations }> = ({ article }) => {
  const { _ } = useTranslation(dictionary)
  const { makeUrl } = useArticlesService()
  const ctx = useArticles()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(article)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(article)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(article)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.displayArticle(article)}>
        <FileInput aria-hidden />
        {_("view")}
      </Ui.Menu.Item>
      <Ui.Menu.Item asChild>
        <a href={makeUrl(article.slug)} target='_blank' rel='noopener noreferrer nofollow'>
          <SquareArrowOutUpRight aria-hidden />
          {_("link")}
        </a>
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editArticle(article)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>

      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Ellipsis aria-hidden />
          {_("more")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.Item onClick={() => ctx.toggleStateArticle(article)}>
            {article.state === "draft" ? (
              <>
                <FileSymlink aria-hidden />
                {_("publish")}
              </>
            ) : (
              <>
                <FileClock aria-hidden />
                {_("draft")}
              </>
            )}
          </Ui.Menu.Item>

          <Ui.Menu.Item onClick={() => ctx.editSlug(article.slug)}>
            <TextCursorInput aria-hidden />
            {_("edit-slug")}
          </Ui.Menu.Item>

          <Ui.Menu.Separator />

          <Ui.Menu.Item onClick={() => ctx.confirmDeleteArticle(article)}>
            <Trash2 aria-hidden />
            {_("delete")}
          </Ui.Menu.Item>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createArticle()}>
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
    select: "Select article",
    unselect: "Deselect article",
    view: "Go to article",
    link: "View article on site",
    edit: "Edit settings",
    "edit-slug": "Edit slug",
    publish: "Publish article",
    draft: "Set as draft",
    lock: "Lock article",
    unlock: "Unlock article",
    duplicate: "Duplicate article",
    delete: "Delete article",
    create: "New article",
    "delete-selection": "Delete selected articles",
    more: "More actions",
  },
  fr: {
    select: "Sélectionner l'article",
    unselect: "Désélectionner l'article",
    view: "Aller à l'article",
    link: "Voir l'article sur le site",
    edit: "Modifier les paramètres",
    "edit-slug": "Modifier le slug",
    publish: "Publier l'article",
    draft: "Mettre en brouillon",
    lock: "Verrouiller l'article",
    unlock: "Déverrouiller l'article",
    duplicate: "Dupliquer l'article",
    delete: "Supprimer l'article",
    create: "Nouvel article",
    "delete-selection": "Supprimer les articles sélectionnés",
    more: "Plus d'actions",
  },
  de: {
    select: "Artikel auswählen",
    unselect: "Artikel abwählen",
    view: "Zum Artikel gehen",
    link: "Artikel auf Website anzeigen",
    edit: "Einstellungen bearbeiten",
    "edit-slug": "Slug bearbeiten",
    publish: "Artikel veröffentlichen",
    draft: "Als Entwurf setzen",
    lock: "Artikel sperren",
    unlock: "Artikel entsperren",
    duplicate: "Artikel duplizieren",
    delete: "Artikel löschen",
    create: "Neuer Artikel",
    "delete-selection": "Ausgewählte Artikel löschen",
    more: "Weitere Aktionen",
  },
}
