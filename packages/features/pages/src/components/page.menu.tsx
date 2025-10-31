import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { ChartNoAxesCombined, Ellipsis, ExternalLink, Lock, LockOpen, TextCursorInput, Trash2 } from "lucide-react"
import React from "react"
import { usePage } from "../page.context"
import { usePagesService } from "../service.context"
import { LockButton } from "./page.lock"
import { StateButton } from "./page.state"
import { StatsButton } from "./page.stats"

/**
 * MenuButton
 */
export const MenuButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr } = usePage()
  const isLocked = swr.page.lock
  const { isAdmin } = usePagesService()
  return (
    <>
      <StateButton />
      <StatsButton />
      <LockButton />
      {!(!isAdmin && isLocked) && (
        <Ui.DropdownMenu.Quick menu={<PageMenu />}>
          <Ui.Tooltip.Quick tooltip={_("open-menu")} side='left' asChild>
            <Ui.Button variant='ghost' icon size='xs'>
              <Ellipsis aria-hidden />
              <Ui.SrOnly>{_("open-menu")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick>
        </Ui.DropdownMenu.Quick>
      )}
    </>
  )
}

const PageMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { makeUrl, isAdmin, service } = usePagesService()
  const { swr, toggleLock, confirmDelete, editSlug } = usePage()

  const isPublished = swr.page.state === "published"
  const isLocked = swr.page.lock

  const seed = async () => {
    Ui.toast.promise(service.id(swr.page.id).trackings.tracking(swr.page.tracking.id).seed(), {
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
      {isAdmin && (
        <Ui.DropdownMenu.Item onClick={() => toggleLock()} className='text-orange-700'>
          {isLocked ? <LockOpen aria-hidden /> : <Lock aria-hidden />}
          {isLocked ? _("menu.unlock") : _("menu.lock")}
        </Ui.DropdownMenu.Item>
      )}

      <Ui.DropdownMenu.Item onClick={() => editSlug(swr.page.slug)}>
        <TextCursorInput aria-hidden />
        {_("menu.edit-slug")}
      </Ui.DropdownMenu.Item>
      {!isLocked && isPublished && (
        <Ui.DropdownMenu.Item asChild>
          <a href={makeUrl(swr.page.slug)} target='_blank' rel='noopener noreferrer nofollow'>
            <ExternalLink aria-hidden />
            {_("menu.link")}
          </a>
        </Ui.DropdownMenu.Item>
      )}
      {!isLocked && (
        <Ui.DropdownMenu.Item onClick={() => confirmDelete()} disabled={isLocked}>
          <Trash2 aria-hidden />
          {_("menu.delete")}
        </Ui.DropdownMenu.Item>
      )}
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
    "open-menu": "Seitenmenü öffnen",
    menu: {
      "edit-slug": "Slug bearbeiten",
      seed: "Statistiken befüllen",
      "seed-progress": "Statistiken werden befüllt",
      "seed-success": "Statistiken befüllt",
      "seed-error": "Fehler beim Befüllen der Statistiken",
      link: "Seite auf Website anzeigen",
      lock: "Diese Seite sperren",
      unlock: "Diese Seite entsperren",
      delete: "Diese Seite löschen",
    },
  },
}
