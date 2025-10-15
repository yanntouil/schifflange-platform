import { service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useSwrProjectStep } from "@compo/projects"
import { useLanguage } from "@compo/translations"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (projectId: string, stepId: string) => {
  const { step, isLoading } = useSwrProjectStep(projectId, stepId)
  const parent = useParentBreadcrumbs(projectId)
  const { translate } = useLanguage()
  React.useEffect(() => Dashboard.setIsLoading(isLoading), [isLoading])
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [
    ...parent,
    [
      step ? p(translate(step.seo, service.placeholder.seo).title, _(`step-${step?.type ?? "empty"}`)) : undefined,
      routeTo(projectId, stepId),
    ],
  ])
}
const dictionary = {
  en: {
    "step-consultation": "Consultation",
    "step-incubation": "Incubation",
    "step-scaling": "Scaling",
    "step-empty": "Step",
  },
  fr: {
    "step-consultation": "Consultation",
    "step-incubation": "Incubation",
    "step-scaling": "Multiplication",
    "step-empty": "Étape",
  },
  de: {
    "step-consultation": "Beratung",
    "step-incubation": "Inkubation",
    "step-scaling": "Skalierung",
    "step-empty": "Schritt",
  },
}
export default useBreadcrumbs
