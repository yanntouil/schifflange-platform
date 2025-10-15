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
import { useProjects } from "../projects.context"
import { useProjectsService } from "../service.context"

/**
 * ProjectsMenu
 */
export const ProjectsMenu: React.FC<{ project: Api.ProjectWithRelations }> = ({ project }) => {
  const { _ } = useTranslation(dictionary)
  const { makeUrl } = useProjectsService()
  const ctx = useProjects()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(project)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(project)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(project)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.displayProject(project)}>
        <FileInput aria-hidden />
        {_("view")}
      </Ui.Menu.Item>
      <Ui.Menu.Item asChild>
        <a href={makeUrl(project)} target='_blank' rel='noopener noreferrer nofollow'>
          <SquareArrowOutUpRight aria-hidden />
          {_("link")}
        </a>
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editProject(project)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>

      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Ellipsis aria-hidden />
          {_("more")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.Item onClick={() => ctx.toggleStateProject(project)}>
            {project.state === "draft" ? (
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

          <Ui.Menu.Item onClick={() => ctx.editSlug(project.slug)}>
            <TextCursorInput aria-hidden />
            {_("edit-slug")}
          </Ui.Menu.Item>

          <Ui.Menu.Separator />

          <Ui.Menu.Item onClick={() => ctx.confirmDeleteProject(project)}>
            <Trash2 aria-hidden />
            {_("delete")}
          </Ui.Menu.Item>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createProject()}>
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
    select: "Select project",
    unselect: "Deselect project",
    view: "Go to project",
    link: "View project on site",
    edit: "Edit settings",
    "edit-slug": "Edit slug",
    publish: "Publish project",
    draft: "Set as draft",
    lock: "Lock project",
    unlock: "Unlock project",
    duplicate: "Duplicate project",
    delete: "Delete project",
    create: "New project",
    "delete-selection": "Delete selected projects",
    more: "More actions",
  },
  fr: {
    select: "Sélectionner le projet",
    unselect: "Désélectionner le projet",
    view: "Aller au projet",
    link: "Voir le projet sur le site",
    edit: "Modifier les paramètres",
    "edit-slug": "Modifier le slug",
    publish: "Publier le projet",
    draft: "Mettre en brouillon",
    lock: "Verrouiller le projet",
    unlock: "Déverrouiller le projet",
    duplicate: "Dupliquer le projet",
    delete: "Supprimer le projet",
    create: "Nouvel projet",
    "delete-selection": "Supprimer les projets sélectionnés",
    more: "Plus d'actions",
  },
  de: {
    select: "Projekt auswählen",
    unselect: "Projekt abwählen",
    view: "Zum Projekt gehen",
    link: "Projekt auf der Website anzeigen",
    edit: "Einstellungen bearbeiten",
    "edit-slug": "Slug bearbeiten",
    publish: "Projekt veröffentlichen",
    draft: "Als Entwurf setzen",
    lock: "Projekt sperren",
    unlock: "Projekt entsperren",
    duplicate: "Projekt duplizieren",
    delete: "Projekt löschen",
    create: "Neues Projekt",
    "delete-selection": "Ausgewählte Projekte löschen",
    more: "Weitere Aktionen",
  },
}
