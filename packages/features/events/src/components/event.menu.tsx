import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { ChartNoAxesCombined, Ellipsis, ExternalLink, TextCursorInput, Trash2 } from "lucide-react"
import React from "react"
import { useEvent } from "../event.context"
import { useEventsService } from "../service.context"
import { StateButton } from "./event.state"
import { StatsButton } from "./event.stats"

/**
 * MenuButton
 */
export const MenuButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr } = useEvent()
  const { isAdmin } = useEventsService()
  return (
    <>
      <StateButton />
      <StatsButton />
      <Ui.DropdownMenu.Quick menu={<EventMenu />}>
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

const EventMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { makeUrl, isAdmin, service } = useEventsService()
  const { swr, confirmDelete, editSlug } = useEvent()

  const isPublished = swr.event.state === "published"

  const seed = async () => {
    Ui.toast.promise(service.id(swr.event.id).trackings.tracking(swr.event.tracking.id).seed(), {
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

      <Ui.DropdownMenu.Item onClick={() => editSlug(swr.event.slug)}>
        <TextCursorInput aria-hidden />
        {_("menu.edit-slug")}
      </Ui.DropdownMenu.Item>
      {isPublished && (
        <Ui.DropdownMenu.Item asChild>
          <a href={makeUrl(swr.event.slug)} target='_blank' rel='noopener noreferrer nofollow'>
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
    "open-menu": "Ouvrir le menu de l'événement",
    menu: {
      "edit-slug": "Modifier le slug",
      seed: "Populer les statistiques",
      "seed-progress": "Population des statistiques",
      "seed-success": "Statistiques populées",
      "seed-error": "Erreur lors de la population des statistiques",
      link: "Voir l'événement sur le site",
      delete: "Supprimer cet événement",
    },
  },
  en: {
    "open-menu": "Open event menu",
    menu: {
      "edit-slug": "Edit slug",
      seed: "Populate statistics",
      "seed-progress": "Populating statistics",
      "seed-success": "Statistics populated",
      "seed-error": "Error populating statistics",
      link: "View event on website",
      delete: "Delete event",
    },
  },
  de: {
    "open-menu": "Veranstaltungs-Menü öffnen",
    menu: {
      "edit-slug": "Slug bearbeiten",
      seed: "Statistiken befüllen",
      "seed-progress": "Statistiken werden befüllt",
      "seed-success": "Statistiken befüllt",
      "seed-error": "Fehler beim Befüllen der Statistiken",
      link: "Veranstaltung auf Website anzeigen",
      delete: "Veranstaltung löschen",
    },
  },
}
