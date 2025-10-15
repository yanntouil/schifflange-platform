import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, F } from "@compo/utils"
import { Api } from "@services/dashboard"
import { Blocks, ExternalLink, Plus, Trash2 } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { useProject } from "../../project.context"
import { useProjectsService } from "../../service.context"
import { ProjectsStateIcon } from "../icons"

/**
 * Steps
 */
export const Steps: React.FC = () => {
  const { swr } = useProject()
  const sortedSteps = React.useMemo(() => A.sortBy(swr.project.steps, ({ type }) => type), [swr.project.steps])
  return (
    <ul className='flex max-w-lg flex-col items-start gap-0.5'>
      {A.map(sortedSteps, (step) => (
        <Step key={step.id} step={step} />
      ))}
      <AddSteps />
    </ul>
  )
}

/**
 * AddSteps
 * display a dropdown menu to add a specific step
 */
const AddSteps: React.FC = () => {
  const { _ } = useTranslation(dictionary)

  const { swr } = useProject()
  const project = swr.project

  const availableSteps: Api.ProjectStepType[] = React.useMemo(
    () =>
      A.sortBy(
        A.filter(
          ["consultation", "incubation", "scaling"],
          (type) => !A.some(project.steps, (step) => step.type === type)
        ),
        F.identity
      ),
    [project.steps]
  )
  const { addStep } = useProject()
  if (A.isEmpty(availableSteps)) return null
  return (
    <li>
      <Ui.DropdownMenu.Quick
        menu={
          <>
            {A.map(availableSteps, (step) => (
              <Ui.DropdownMenu.Item key={step} onClick={() => addStep(step)}>
                <Blocks aria-hidden />
                {_(`title`, { type: _(`${step}`) })}
              </Ui.DropdownMenu.Item>
            ))}
          </>
        }
      >
        <Ui.Button variant='ghost' size='sm'>
          <Plus aria-hidden />
          {_("add")}
        </Ui.Button>
      </Ui.DropdownMenu.Quick>
    </li>
  )
}

/**
 * Step
 * display a step and actions to toggle its state and delete it
 */
const Step: React.FC<{ step: Api.ProjectStepWithRelations }> = ({ step }) => {
  const { _ } = useContextualLanguage(dictionary)

  const { swr } = useProject()
  const project = swr.project

  const { confirmDeleteStep, toggleStepState } = useProject()
  const isPublished = step.state === "published"
  const { routeToStep } = useProjectsService()
  return (
    <li className='flex w-full items-center justify-between gap-4 text-sm hover:bg-muted focus-within:bg-muted rounded-md p-1 -mx-1'>
      <Ui.Button asChild variant='ghost' size='sm' className='grow justify-start'>
        <Link to={routeToStep(project.id, step.id)}>
          <ExternalLink aria-hidden />
          {_(`title`, { type: _(`${step.type}`) })}
        </Link>
      </Ui.Button>
      <div className='flex items-center gap-2'>
        <Ui.Tooltip.Quick tooltip={isPublished ? _("state-published") : _("state-draft")} side='left' asChild>
          <Ui.Button variant='ghost' icon size='sm' onClick={() => toggleStepState(step.id)}>
            <ProjectsStateIcon state={step.state} />
            <Ui.SrOnly>{isPublished ? _("state-published") : _("state-draft")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
        <Ui.Tooltip.Quick tooltip={_("delete")} side='left' asChild>
          <Ui.Button variant='ghost' size='sm' onClick={() => confirmDeleteStep(step.id)}>
            <Trash2 aria-hidden />
            <Ui.SrOnly>{_("delete")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
      </div>
    </li>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    add: "Add a step",
    title: "Step {{type}}",
    consultation: "of consultation ",
    incubation: "of incubation ",
    scaling: "of scaling ",
    delete: "Delete step",
    "state-draft": "Draft (click to publish)",
    "state-published": "Published (click to unpublish)",
  },
  fr: {
    add: "Ajouter une étape",
    title: "Étape {{type}}",
    consultation: "de consultation ",
    incubation: "d'incubation ",
    scaling: "de multiplication ",
    delete: "Supprimer l'étape",
    "state-draft": "Brouillon (cliquer pour publier)",
    "state-published": "Publié (cliquer pour mettre en brouillon)",
  },
  de: {
    add: "Ein Schritt hinzufügen",
    title: "Schritt {{type}}",
    consultation: "der Beratung ",
    incubation: "der Inkubation ",
    scaling: "der Skalierung ",
    delete: "Schritt löschen",
    "state-draft": "Entwurf (klicken, um zu veröffentlichen)",
    "state-published": "Veröffentlicht (klicken, um zurückzusetzen)",
  },
}
