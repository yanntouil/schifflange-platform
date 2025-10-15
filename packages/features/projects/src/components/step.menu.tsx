import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { ChartNoAxesCombined, Ellipsis, ExternalLink, Trash2 } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import { useProjectsService } from "../service.context"
import { useStep } from "../step.context"
import { StepStateButton } from "./step.state"
import { StepStatsButton } from "./step.stats"

/**
 * StepMenuButton
 */
export const StepMenuButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr } = useStep()
  const { isAdmin } = useProjectsService()
  return (
    <>
      <StepStateButton />
      <StepStatsButton />
      <Ui.DropdownMenu.Quick menu={<StepMenu />}>
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

const StepMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { makeStepUrl, isAdmin, service } = useProjectsService()
  const [, navigate] = useLocation()
  const { swr, confirmDelete } = useStep()

  const isPublished = swr.step.state === "published"

  const seed = async () => {
    Ui.toast.promise(
      service.id(swr.step.project.id).steps.id(swr.step.id).trackings.tracking(swr.step.tracking.id).seed(),
      {
        loading: _("menu.seed-progress"),
        success: _("menu.seed-success"),
        error: _("menu.seed-error"),
      }
    )
  }

  return (
    <>
      {isAdmin && (
        <Ui.DropdownMenu.Item onClick={seed} className='text-orange-700'>
          <ChartNoAxesCombined aria-hidden />
          {_("menu.seed")}
        </Ui.DropdownMenu.Item>
      )}
      {isPublished && (
        <Ui.DropdownMenu.Item asChild>
          <a href={makeStepUrl(swr.step)} target='_blank' rel='noopener noreferrer nofollow'>
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
    "open-menu": "Ouvrir le menu de l'étape",
    menu: {
      seed: "Populer les statistiques",
      "seed-progress": "Population des statistiques",
      "seed-success": "Statistiques populées",
      "seed-error": "Erreur lors de la population des statistiques",
      link: "Voir l'étape sur le site",
      delete: "Supprimer l'étape",
    },
  },
  en: {
    "open-menu": "Open step menu",
    menu: {
      seed: "Populate statistics",
      "seed-progress": "Populating statistics",
      "seed-success": "Statistics populated",
      "seed-error": "Error populating statistics",
      link: "View step on website",
      delete: "Delete step",
    },
  },
  de: {
    "open-menu": "Schrittmenü öffnen",
    menu: {
      seed: "Statistiken füllen",
      "seed-progress": "Statistiken werden gefüllt",
      "seed-success": "Statistiken gefüllt",
      "seed-error": "Fehler beim Füllen der Statistiken",
      link: "Schritt auf der Website anzeigen",
      delete: "Schritt löschen",
    },
  },
}
