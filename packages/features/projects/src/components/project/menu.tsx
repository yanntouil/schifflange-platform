import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { A } from "@mobily/ts-belt"
import { ProjectStepType } from "@services/dashboard/src/types"
import { Blocks, ChartNoAxesCombined, Ellipsis, ExternalLink, Plus, TextCursorInput, Trash2 } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import { useProject } from "../../project.context"
import { useProjectsService } from "../../service.context"
import { StateButton } from "./state"
import { StatsButton } from "./stats"

/**
 * MenuButton
 */
export const MenuButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr } = useProject()
  const { isAdmin } = useProjectsService()
  return (
    <>
      <StateButton />
      <StatsButton />
      <Ui.DropdownMenu.Quick menu={<ProjectMenu />}>
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

const ProjectMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { makeUrl, isAdmin, service, routeToStep } = useProjectsService()
  const [, navigate] = useLocation()
  const { swr, confirmDelete, editSlug } = useProject()

  const isPublished = swr.project.state === "published"

  const seed = async () => {
    Ui.toast.promise(service.id(swr.project.id).trackings.tracking(swr.project.tracking.id).seed(), {
      loading: _("menu.seed-progress"),
      success: _("menu.seed-success"),
      error: _("menu.seed-error"),
    })
  }

  // manage steps
  const availableSteps: ProjectStepType[] = React.useMemo(
    () =>
      A.filter(
        ["consultation", "incubation", "scaling"],
        (type) => !A.some(swr.project.steps, (step) => step.type === type)
      ),
    [swr.project.steps]
  )

  const addStep = async (type: ProjectStepType) => {
    match(await service.id(swr.project.id).steps.create({ type }))
      .with({ ok: true }, ({ data }) => {
        navigate(routeToStep(swr.project.id, data.step.id))
      })
      .otherwise(() => {
        Ui.toast.error(_("menu.add-step-error"))
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

      <Ui.DropdownMenu.Item onClick={() => editSlug(swr.project.slug)}>
        <TextCursorInput aria-hidden />
        {_("menu.edit-slug")}
      </Ui.DropdownMenu.Item>
      <Ui.DropdownMenu.Sub>
        <Ui.DropdownMenu.SubTrigger>
          <Blocks aria-hidden />
          {_("menu.steps")}
        </Ui.DropdownMenu.SubTrigger>
        <Ui.DropdownMenu.SubContent>
          {A.map(availableSteps, (step) => (
            <Ui.DropdownMenu.Item key={step} onClick={() => addStep(step)}>
              <Plus aria-hidden />
              {_(`menu.add-step-${step}`)}
            </Ui.DropdownMenu.Item>
          ))}
        </Ui.DropdownMenu.SubContent>
      </Ui.DropdownMenu.Sub>
      {isPublished && (
        <Ui.DropdownMenu.Item asChild>
          <a href={makeUrl(swr.project)} target='_blank' rel='noopener noreferrer nofollow'>
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
    "open-menu": "Ouvrir le menu du projet",
    menu: {
      "edit-slug": "Modifier le slug",
      steps: "Ajouter un étape",
      "add-step-consultation": "Étape de consultation",
      "add-step-incubation": "Étape d'incubation",
      "add-step-scaling": "Étape de multiplication",
      seed: "Populer les statistiques",
      "seed-progress": "Population des statistiques",
      "seed-success": "Statistiques populées",
      "seed-error": "Erreur lors de la population des statistiques",
      link: "Voir le projet sur le site",
      lock: "Verrouiller ce projet",
      unlock: "Déverrouiller ce projet",
      delete: "Supprimer ce projet",
    },
  },
  en: {
    "open-menu": "Open project menu",
    menu: {
      "edit-slug": "Edit slug",
      seed: "Populate statistics",
      "seed-progress": "Populating statistics",
      "seed-success": "Statistics populated",
      "seed-error": "Error populating statistics",
      link: "View project on website",
      lock: "Lock this project",
      unlock: "Unlock this project",
      delete: "Delete this project",
    },
  },
  de: {
    "open-menu": "Projektmenü öffnen",
    menu: {
      "edit-slug": "Slug bearbeiten",
      seed: "Statistiken füllen",
      "seed-progress": "Statistiken werden gefüllt",
      "seed-success": "Statistiken gefüllt",
      "seed-error": "Fehler beim Füllen der Statistiken",
      link: "Projekt auf der Website anzeigen",
      lock: "Dieses Projekt sperren",
      unlock: "Dieses Projekt entsperren",
      delete: "Dieses Projekt löschen",
    },
  },
}
