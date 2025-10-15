import {
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, cn, placeholder } from "@compo/utils"
import { placeholder as apiPlaceholder } from "@services/dashboard"
import { Check, ChevronsUpDown, X } from "lucide-react"
import React from "react"
import { useProjectsService, useSwrProjects } from "../../../"

/**
 * FormProjects
 */
export type FormProjectsProps = FieldProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<ClassNames>
    max?: number
  }
export const FormProjects: React.FC<FormProjectsProps> = ({ classNames, max, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <Field {...extractInputProps({ ...props })} classNames={classNames} max={max} />
    </FormGroup>
  )
}

type ClassNames = {
  trigger?: string
  content?: string
  badge?: string
  card?: string
  cardList?: string
}

type FieldProps = {
  classNames?: ClassNames
  max?: number
}

const Field: React.FC<FieldProps> = ({ classNames, max = 5 }) => {
  const { _ } = useTranslation(dictionary)
  const { projects } = useSwrProjects()
  const { getImageUrl } = useProjectsService()
  const { translate } = useLanguage()
  const { value = [], setFieldValue, disabled } = useFieldContext<string[]>()
  const [isOpen, setIsOpen] = React.useState(false)

  // Get selected projects for display
  const selectedProjects = React.useMemo(() => {
    if (!projects) return []
    return A.filter(projects, (project) => value.includes(project.id))
  }, [projects, value])

  // Get available projects for selection
  const availableProjects = React.useMemo(() => {
    if (!projects) return []
    return A.map(projects, (project) => {
      const { title, description, image } = translate(project.seo, apiPlaceholder.seo)
      return {
        label: title,
        labelShort: project.trackingId,
        value: project.id,
        image: getImageUrl(image),
        description: description,
        category: project.category ? translate(project.category, apiPlaceholder.projectCategory).title : undefined,
      }
    })
  }, [projects, translate, getImageUrl])

  const toggleProject = (projectId: string) => {
    if (value.includes(projectId)) {
      setFieldValue(A.filter(value, (id) => id !== projectId))
    } else if (value.length < max) {
      setFieldValue([...value, projectId])
    }
  }

  const removeProject = (projectId: string) => {
    setFieldValue(A.filter(value, (id) => id !== projectId))
  }


  return (
    <div className='space-y-4'>
      {/* Multi-Select Trigger */}
      <Ui.Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Ui.Popover.Trigger asChild>
          <button
            type='button'
            role='combobox'
            aria-expanded={isOpen}
            disabled={disabled}
            className={cn(Ui.selectVariants(), classNames?.trigger)}
          >
            <span className='text-muted-foreground'>
              {value.length === 0
                ? _("select-projects")
                : _(`projects-selected${value.length === 1 ? "-1" : ""}`, { count: value.length })}
            </span>
            <div className='flex items-center gap-2'>
              <ChevronsUpDown className='h-4 w-4 opacity-50' aria-hidden />
            </div>
          </button>
        </Ui.Popover.Trigger>

        <Ui.Popover.Content
          className={cn("w-[var(--radix-popper-anchor-width)] p-0", classNames?.content)}
          align='start'
        >
          <Ui.Command.Root>
            <Ui.Command.Input placeholder={_("search-projects")} />
            <Ui.Command.List>
              <Ui.Command.Empty>{_("no-projects-found")}</Ui.Command.Empty>
              <Ui.Command.Group>
                <div className='p-2 border-b'>
                  <div className='text-xs text-muted-foreground'>
                    {_("selected-count", { current: value.length, max })}
                  </div>
                </div>
                {A.map(availableProjects, (project) => {
                  const isSelected = value.includes(project.value)
                  const isDisabled = !isSelected && value.length >= max

                  return (
                    <Ui.Command.Item
                      key={project.value}
                      onSelect={() => !isDisabled && toggleProject(project.value)}
                      className={cn("p-3 cursor-pointer", isDisabled && "opacity-50 cursor-not-allowed")}
                    >
                      <div className='flex items-center gap-3 flex-1'>
                        <div className='flex-1 space-y-1 flex items-center gap-4'>
                          <Ui.Image
                            src={project.image ?? ""}
                            alt={project.label}
                            className='bg-muted aspect-square w-20 rounded object-cover object-center'
                          >
                            <Ui.ImageEmpty />
                          </Ui.Image>
                          <div>
                            <div className='line-clamp-1 text-base leading-relaxed font-medium'>
                              {placeholder(project.label, _(`title-ph`))}
                            </div>
                            {project.category && <p className='text-xs text-primary'>{project.category}</p>}
                            <div className='text-muted-foreground line-clamp-2 pt-2 text-xs leading-tight'>
                              {placeholder(project.description, _(`description-ph`))}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-center w-4 h-4 mt-0.5'>
                          {isSelected && <Check className='h-4 w-4 text-primary' aria-hidden />}
                        </div>
                      </div>
                    </Ui.Command.Item>
                  )
                })}
              </Ui.Command.Group>
            </Ui.Command.List>
          </Ui.Command.Root>
        </Ui.Popover.Content>
      </Ui.Popover.Root>

      {/* Selected Projects Cards */}
      {selectedProjects.length > 0 && (
        <div className={cn("space-y-2", classNames?.cardList)}>
          <div className='text-sm font-medium'>{_("selected-projects")}</div>
          <div className='grid gap-3'>
            {A.map(selectedProjects, (project) => {
              const { title, description, image } = translate(project.seo, apiPlaceholder.seo)
              return (
                <div
                  key={project.id}
                  className={cn("flex items-start gap-3 p-2 border rounded-lg bg-card", classNames?.card)}
                >
                  <Ui.Image
                    src={getImageUrl(image) ?? ""}
                    alt={title}
                    className='bg-muted aspect-square w-20 rounded object-cover object-center flex-shrink-0'
                  >
                    <Ui.ImageEmpty />
                  </Ui.Image>
                  <div className='flex-1 space-y-0.5 flex flex-col justify-center'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium text-sm'>{placeholder(title, _("title-ph"))}</p>
                    </div>
                    {project.category && (
                      <p className='text-xs text-primary'>
                        {translate(project.category, apiPlaceholder.projectCategory).title}
                      </p>
                    )}
                    {description && (
                      <p className='text-xs text-muted-foreground line-clamp-2'>
                        {placeholder(description, _("description-ph"))}
                      </p>
                    )}
                  </div>
                  <Ui.Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeProject(project.id)}
                    className='h-6 w-6 p-0 text-muted-foreground hover:text-destructive'
                  >
                    <X className='h-4 w-4' />
                  </Ui.Button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "select-projects": "Sélectionner des projets...",
    "projects-selected-1": "{{count}} projet sélectionné",
    "projects-selected": "{{count}} projets sélectionnés",
    "search-projects": "Rechercher des projets...",
    "no-projects-found": "Aucun projet trouvé",
    "selected-projects": "Projets sélectionnés",
    "selected-count": "{{current}}/{{max}} sélectionnés",
    "title-ph": "Titre du projet",
    "description-ph": "Description du projet",
    more: "de plus",
  },
  en: {
    "select-projects": "Select projects...",
    "projects-selected-1": "{{count}} project selected",
    "projects-selected": "{{count}} projects selected",
    "search-projects": "Search projects...",
    "no-projects-found": "No projects found",
    "selected-projects": "Selected projects",
    "selected-count": "{{current}}/{{max}} selected",
    "title-ph": "Project title",
    "description-ph": "Project description",
    more: "more",
  },
  de: {
    "select-projects": "Projekte auswählen...",
    "projects-selected-1": "{{count}} Projekt ausgewählt",
    "projects-selected": "{{count}} Projekte ausgewählt",
    "search-projects": "Projekte suchen...",
    "no-projects-found": "Keine Projekte gefunden",
    "selected-projects": "Ausgewählte Projekte",
    "selected-count": "{{current}}/{{max}} ausgewählt",
    "title-ph": "Projekttitel",
    "description-ph": "Projektbeschreibung",
    more: "weitere",
  },
}
