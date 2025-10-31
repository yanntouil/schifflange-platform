import { service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useSwrEvent } from "@compo/events"
import { useLanguage } from "@compo/translations"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (eventId: string) => {
  const { event, isLoading } = useSwrEvent(eventId)
  const parent = useParentBreadcrumbs()
  const { translate } = useLanguage()
  React.useEffect(() => Dashboard.setIsLoading(isLoading), [isLoading])
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [
    ...parent,
    [event ? p(translate(event.seo, service.placeholder.seo).title, _("placeholder")) : undefined, routeTo(eventId)],
  ])
}
const dictionary = {
  en: {
    placeholder: "Untitled event",
  },
  fr: {
    placeholder: "Événement sans titre",
  },
  de: {
    placeholder: "Unbenannter Veranstaltung",
  },
}
export default useBreadcrumbs
