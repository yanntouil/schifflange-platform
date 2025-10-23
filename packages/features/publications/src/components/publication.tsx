import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { Calendar1, Clock, Edit, UserCircle } from "lucide-react"
import React from "react"
import { type PublicationContextType, usePublication } from "../publication.context"
import { PublicationProvider } from "../publication.context.provider"
import { PublicationIcon } from "./publication.icon"

/**
 * Publication
 * display the publication and each feature to update it
 */
export type PublicationProps = PublicationInnerProps & Omit<PublicationContextType, "contextId" | "edit">
export const Publication: React.FC<PublicationProps> = ({ title, children, fieldsBefore, ...props }) => {
  const innerProps = { title, children, fieldsBefore }
  return (
    <PublicationProvider {...props}>
      <PublicationInner {...innerProps} />
    </PublicationProvider>
  )
}

/**
 * SeoInner
 * the inner component of the seo component
 */
type PublicationInnerProps = {
  title?: string
  children?: React.ReactNode
  fieldsBefore?: React.ReactNode
}
const PublicationInner: React.FC<PublicationInnerProps> = ({ title, children, fieldsBefore }) => {
  const { _, format } = useTranslation(dictionary)
  const { publication, persistedId, edit } = usePublication()

  return (
    <Ui.CollapsibleCard.Root id={persistedId}>
      <Ui.CollapsibleCard.Header>
        <Ui.CollapsibleCard.Title>{title || _("title")}</Ui.CollapsibleCard.Title>
        <Ui.CollapsibleCard.Aside>
          <Ui.Tooltip.Quick tooltip={_("edit")} side='left' asChild>
            <Ui.Button variant='ghost' size='xs' icon onClick={edit}>
              <Edit aria-hidden />
              <Ui.SrOnly>{_("edit")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick>
          <PublicationIcon />
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content className='@container/seo overflow-hidden'>
        <div className='flex flex-col gap-2 px-6 pb-4 max-w-xl'>
          <Dashboard.Field.Root stretch className='[&_svg]:shrink-0'>
            {fieldsBefore}
            <Dashboard.Field.Item icon={<Calendar1 aria-hidden />} name={_(`publishedAt`)}>
              {publication.publishedAt ? format(publication.publishedAt, "PPP") : _("no-published-at")}
            </Dashboard.Field.Item>
            <Dashboard.Field.Item icon={<UserCircle aria-hidden />} name={_(`publishedBy`)}>
              {publication.publishedBy ? <UserTooltip user={publication.publishedBy} /> : _("no-published-by")}
            </Dashboard.Field.Item>
            {(publication.publishedFrom || publication.publishedTo) && (
              <Dashboard.Field.Item icon={<Clock aria-hidden />} name={_(`publication`)}>
                {_("publication-message", {
                  from: publication.publishedFrom
                    ? _("publication-from", { date: format(publication.publishedFrom, "PPP") })
                    : "",
                  to: publication.publishedTo
                    ? _("publication-to", { date: format(publication.publishedTo, "PPP") })
                    : "",
                })}
              </Dashboard.Field.Item>
            )}
          </Dashboard.Field.Root>
        </div>
        {children}
      </Ui.CollapsibleCard.Content>
    </Ui.CollapsibleCard.Root>
  )
}

const dictionary = {
  fr: {
    title: "Options de publication",
    edit: "Modifier les options de publication",

    // Status messages
    "now-available": "Actuellement publié",
    "was-available": "Publication terminée {{distance}}",
    "will-be-available": "Sera publié {{distance}}",

    // Field labels
    publishedAt: "Date de publication",
    publishedBy: "Publié par",
    publication: "Période de visibilité",

    // Empty states
    "no-published-at": "Aucune date définie",
    "no-published-by": "Aucun éditeur assigné",

    // Publication period messages
    "publication-message": "{{from}} {{to}}",
    "publication-from": "a partir du {{date}}",
    "publication-to": "jusqu'au {{date}}",
  },
  en: {
    title: "Publication options",
    edit: "Edit publication options",

    // Status messages
    "now-available": "Currently published",
    "was-available": "Publication ended {{distance}}",
    "will-be-available": "Will be published {{distance}}",

    // Field labels
    publishedAt: "Publication date",
    publishedBy: "Published by",
    publication: "Visibility period",

    // Empty states
    "no-published-at": "No date set",
    "no-published-by": "No publisher assigned",

    // Publication period messages
    "publication-message": "{{from}}{{to}}",
    "publication-from": "From {{date}}",
    "publication-to": " to {{date}}",
  },
  de: {
    title: "Veröffentlichungsoptionen",
    edit: "Veröffentlichungsoptionen bearbeiten",

    // Status messages
    "now-available": "Derzeit veröffentlicht",
    "was-available": "Veröffentlichung endete {{distance}}",
    "will-be-available": "Wird veröffentlicht {{distance}}",

    // Field labels
    publishedAt: "Veröffentlichungsdatum",
    publishedBy: "Veröffentlicht von",
    publication: "Sichtbarkeitszeitraum",

    // Empty states
    "no-published-at": "Kein Datum festgelegt",
    "no-published-by": "Kein Herausgeber zugewiesen",

    // Publication period messages
    "publication-message": "{{from}} {{to}}",
    "publication-from": "Ab {{date}}",
    "publication-to": "bis {{date}}",
  },
}
