import { useTranslation } from "@compo/localize"
import { TrackingCharts } from "@compo/trackings"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, cx, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { ChevronsUpDown, Search } from "lucide-react"
import React from "react"
import { useProjects } from "../../projects.context"

/**
 * TrackingsCharts
 */
export const TrackingsCharts: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()

  const { swr } = useProjects()
  const { projects } = swr
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<
    { type: "all" } | { type: "project"; project: (typeof projects)[number] }
  >({
    type: "all",
  })
  const trackingIds = React.useMemo(() => {
    // all projects
    if (selected.type === "all") return A.map(projects, (project) => project.tracking.id) as string[]
    // selected project
    return [selected.project.tracking.id]
  }, [projects, selected])

  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Content className='pt-6'>
        <TrackingCharts
          trackings={trackingIds}
          display='views'
          defaultStats='visit'
          defaultDisplayBy='months'
          classNames={{ header: "pb-6" }}
        >
          <Ui.Popover.Root open={open} onOpenChange={setOpen}>
            <Ui.Popover.Trigger
              className={cx(
                "group flex grow items-center gap-2 text-left",
                Ui.cardTitleVariants(),
                variants.focusVisible(),
                variants.inputRounded()
              )}
              role='combobox'
              aria-expanded={open}
            >
              <span className='line-clamp-1 grow'>
                {_("showing-message", {
                  selected:
                    selected.type === "project"
                      ? _("showing-specific-project", {
                          project: placeholder(
                            translate(selected.project.seo, servicePlaceholder.seo).title,
                            _("project-title-placeholder")
                          ),
                        })
                      : _("showing-all-project"),
                })}
              </span>
              <ChevronsUpDown className='ml-auto size-3.5 @2xl/analytics:ml-2' aria-hidden />
            </Ui.Popover.Trigger>
            <Ui.Popover.Content className='w-[var(--radix-popover-trigger-width)] p-0'>
              <Ui.Command.Root>
                <Ui.Command.Input placeholder={_("search-placeholder")} />
                <Ui.Command.List>
                  <Ui.Command.Empty className='text-muted-foreground flex flex-col items-center justify-center gap-2 px-4 py-4'>
                    <Search className='size-6 stroke-[1]' aria-hidden />
                    <div className='text-sm'>{_("empty-result")}</div>
                  </Ui.Command.Empty>
                  <Ui.Command.Group>
                    <Ui.Command.Item
                      value='all'
                      keywords={[_("all-projects")]}
                      onSelect={() => {
                        setSelected({ type: "all" })
                        setOpen(false)
                      }}
                    >
                      {_("all-projects")}
                    </Ui.Command.Item>
                  </Ui.Command.Group>
                  <Ui.Command.Group heading={_("project-heading")}>
                    {A.map(projects, (project) => (
                      <Ui.Command.Item
                        key={project.id}
                        value={project.id}
                        keywords={[
                          placeholder(translate(project.seo, servicePlaceholder.seo).title, _("project-placeholder")),
                        ]}
                        onSelect={() => {
                          setSelected({ type: "project", project })
                          setOpen(false)
                        }}
                      >
                        {placeholder(translate(project.seo, servicePlaceholder.seo).title, _("project-placeholder"))}
                      </Ui.Command.Item>
                    ))}
                  </Ui.Command.Group>
                </Ui.Command.List>
              </Ui.Command.Root>
            </Ui.Popover.Content>
          </Ui.Popover.Root>
        </TrackingCharts>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translation
 */
const dictionary = {
  fr: {
    title: "Statistiques des visites",
    "showing-message": "Statistiques des visites sur {{selected}}",
    "showing-all-project": "tous les projets",
    "showing-specific-project": "le projet {{project}}",
    "all-projects": "Tous les projets publiés",
    "project-heading": "Statistiques par projet",
    "project-placeholder": "Projet sans titre",
    "search-placeholder": "Rechercher un projet",
    "empty-result": "Aucun projet trouvé",
  },
  en: {
    title: "Visits statistics",
    "showing-message": "Statistics of visits on {{selected}}",
    "showing-all-project": "all projects",
    "showing-specific-project": "the project {{project}}",
    "all-projects": "All published projects",
    "project-heading": "Statistics by project",
    "project-placeholder": "Untitled project",
    "search-placeholder": "Search a project",
    "empty-result": "No project found",
  },
  de: {
    title: "Besuchsstatistiken",
    "showing-message": "Besuchsstatistiken für {{selected}}",
    "showing-all-project": "alle Projekte",
    "showing-specific-project": "das Projekt {{project}}",
    "all-projects": "Alle veröffentlichten Projekte",
    "project-heading": "Statistiken nach Projekt",
    "project-placeholder": "Projekt ohne Titel",
    "search-placeholder": "Projekt suchen",
    "empty-result": "Kein Projekt gefunden",
  },
}
