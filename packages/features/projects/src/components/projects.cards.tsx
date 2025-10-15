import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { ProjectsCard, ProjectsCardSkeleton } from "./projects.card"

/**
 * ProjectsCards
 */
export const ProjectsCards: React.FC<{ projects: Api.ProjectWithRelations[] }> = ({ projects }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(projects, (project) => (
        <ProjectsCard key={project.id} project={project} />
      ))}
    </section>
  )
}

/**
 * ProjectsCardsSkeleton
 */
export const ProjectsCardsSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(
        Array.from({ length: count }, (_, i) => i),
        (index) => (
          <ProjectsCardSkeleton key={index} />
        )
      )}
    </section>
  )
}
