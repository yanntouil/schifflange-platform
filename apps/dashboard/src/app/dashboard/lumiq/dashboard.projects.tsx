import { useTranslation } from "@compo/localize"
import { useSwrProjects } from "@compo/projects"
import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import { Presentation } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import routeToProjects from "./projects"

export const ProjectsCard: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { projects } = useSwrProjects()

  return (
    <Ui.Card.Root className={cxm(className)} {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2} className="relative">
          {_("title")}
          <div
            className="absolute top-0 right-0 flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 [&>svg]:size-4"
            aria-hidden
          >
            <Presentation />
          </div>
        </Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight">{projects.length}</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{_("active")}</span>
                <span className="font-medium">{projects.filter((p) => p.state === "published").length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{_("pending")}</span>
                <span className="font-medium">{projects.filter((p) => p.state === "draft").length}</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-xs">
              <Link to={routeToProjects()}>{_("description")}</Link>
            </p>
          </div>
        </div>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  en: {
    title: "Projects",
    description: "Create and manage your website projects",
    active: "Active",
    pending: "Pending",
  },
  fr: {
    title: "Projets",
    description: "Créez et gérez les projets de votre site",
    active: "Actifs",
    pending: "En attente",
  },
  de: {
    title: "Projekte",
    description: "Erstellen und verwalten Sie Ihre Website-Projekte",
    active: "Aktiv",
    pending: "Ausstehend",
  },
}
