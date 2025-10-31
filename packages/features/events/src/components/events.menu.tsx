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
import { useEvents } from "../events.context"
import { useEventsService } from "../service.context"

/**
 * EventsMenu
 */
export const EventsMenu: React.FC<{ event: Api.EventWithRelations }> = ({ event }) => {
  const { _ } = useTranslation(dictionary)
  const { makeUrl } = useEventsService()
  const ctx = useEvents()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(event)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(event)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(event)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.displayEvent(event)}>
        <FileInput aria-hidden />
        {_("view")}
      </Ui.Menu.Item>
      <Ui.Menu.Item asChild>
        <a href={makeUrl(event.slug)} target='_blank' rel='noopener noreferrer nofollow'>
          <SquareArrowOutUpRight aria-hidden />
          {_("link")}
        </a>
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editEvent(event)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>

      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Ellipsis aria-hidden />
          {_("more")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.Item onClick={() => ctx.toggleStateEvent(event)}>
            {event.state === "draft" ? (
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

          <Ui.Menu.Item onClick={() => ctx.editSlug(event.slug)}>
            <TextCursorInput aria-hidden />
            {_("edit-slug")}
          </Ui.Menu.Item>

          <Ui.Menu.Separator />

          <Ui.Menu.Item onClick={() => ctx.confirmDeleteEvent(event)}>
            <Trash2 aria-hidden />
            {_("delete")}
          </Ui.Menu.Item>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createEvent()}>
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
    select: "Select event",
    unselect: "Deselect event",
    view: "Go to event",
    link: "View event on site",
    edit: "Edit settings",
    "edit-slug": "Edit slug",
    publish: "Publish event",
    draft: "Set as draft",
    delete: "Delete event",
    create: "New event",
    "delete-selection": "Delete selected events",
    more: "More actions",
  },
  fr: {
    select: "Sélectionner l'événement",
    unselect: "Désélectionner l'événement",
    view: "Aller à l'événement",
    link: "Voir l'événement sur le site",
    edit: "Modifier les paramètres",
    "edit-slug": "Modifier le slug",
    publish: "Publier l'événement",
    draft: "Mettre en brouillon",
    delete: "Supprimer l'événement",
    create: "Nouvel événement",
    "delete-selection": "Supprimer les événements sélectionnés",
    more: "Plus d'actions",
  },
  de: {
    select: "Veranstaltung auswählen",
    unselect: "Veranstaltung abwählen",
    view: "Zur Veranstaltung gehen",
    link: "Veranstaltung auf Website anzeigen",
    edit: "Einstellungen bearbeiten",
    "edit-slug": "Slug bearbeiten",
    publish: "Veranstaltung veröffentlichen",
    draft: "Als Entwurf setzen",
    delete: "Veranstaltung löschen",
    create: "Neue Veranstaltung",
    "delete-selection": "Ausgewählte Veranstaltungen löschen",
    more: "Weitere Aktionen",
  },
}
