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
  Lock,
  LockOpen,
  SquareArrowOutUpRight,
  SquareDashedMousePointer,
  SquareMousePointer,
  TextCursorInput,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import React from "react"
import { usePages } from "../pages.context"
import { usePagesService } from "../service.context"

/**
 * PagesMenu
 */
export const PagesMenu: React.FC<{ page: Api.PageWithRelations }> = ({ page }) => {
  const { _ } = useTranslation(dictionary)
  const { isAdmin, makeUrl } = usePagesService()
  const ctx = usePages()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(page)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(page)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(page)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.displayPage(page)}>
        <FileInput aria-hidden />
        {_("view")}
      </Ui.Menu.Item>
      <Ui.Menu.Item asChild>
        <a href={makeUrl(page)} target='_blank' rel='noopener noreferrer nofollow'>
          <SquareArrowOutUpRight aria-hidden />
          {_("link")}
        </a>
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editPage(page)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>

      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Ellipsis aria-hidden />
          {_("more")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.Item onClick={() => ctx.toggleStatePage(page)} disabled={page.lock}>
            {page.state === "draft" ? (
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

          <Ui.Menu.Item onClick={() => ctx.editSlug(page.slug)}>
            <TextCursorInput aria-hidden />
            {_("edit-slug")}
          </Ui.Menu.Item>

          {isAdmin && (
            <Ui.Menu.Item
              onClick={() => ctx.toggleLockPage(page)}
              className='text-orange-600 data-[highlighted]:text-orange-600'
            >
              {page.lock ? (
                <>
                  <Lock aria-hidden />
                  {_("unlock")}
                </>
              ) : (
                <>
                  <LockOpen aria-hidden />
                  {_("lock")}
                </>
              )}
            </Ui.Menu.Item>
          )}

          <Ui.Menu.Separator />

          <Ui.Menu.Item onClick={() => ctx.confirmDeletePage(page)}>
            <Trash2 aria-hidden />
            {_("delete")}
          </Ui.Menu.Item>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createPage()}>
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
    select: "Select page",
    unselect: "Deselect page",
    view: "Go to page",
    link: "View page on site",
    edit: "Edit settings",
    "edit-slug": "Edit slug",
    publish: "Publish page",
    draft: "Set as draft",
    lock: "Lock page",
    unlock: "Unlock page",
    duplicate: "Duplicate page",
    delete: "Delete page",
    create: "New page",
    "delete-selection": "Delete selected pages",
    more: "More actions",
  },
  fr: {
    select: "Sélectionner la page",
    unselect: "Désélectionner la page",
    view: "Aller à la page",
    link: "Voir la page sur le site",
    edit: "Modifier les paramètres",
    "edit-slug": "Modifier le slug",
    publish: "Publier la page",
    draft: "Mettre en brouillon",
    lock: "Verrouiller la page",
    unlock: "Déverrouiller la page",
    duplicate: "Dupliquer la page",
    delete: "Supprimer la page",
    create: "Nouvelle page",
    "delete-selection": "Supprimer les pages sélectionnées",
    more: "Plus d'actions",
  },
  de: {
    select: "Seite auswählen",
    unselect: "Auswahl aufheben",
    view: "Zur Seite gehen",
    link: "Seite auf der Website anzeigen",
    edit: "Einstellungen bearbeiten",
    "edit-slug": "Slug bearbeiten",
    publish: "Seite veröffentlichen",
    draft: "Als Entwurf markieren",
    lock: "Seite sperren",
    unlock: "Seite entsperren",
    duplicate: "Seite duplizieren",
    delete: "Seite löschen",
    create: "Neue Seite",
    "delete-selection": "Ausgewählte Seiten löschen",
    more: "Weitere Aktionen",
  },
}
