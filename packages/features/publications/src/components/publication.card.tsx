import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { UserTooltip } from "@compo/users"
import { Calendar1, Clock, UserCircle } from "lucide-react"
import React from "react"
import { usePublication } from "../publication.context"

/**
 * PublicationCard
 * the inner card content for the publication
 */
export const PublicationCard: React.FC = () => {
  const { _, format } = useTranslation(dictionary)
  const { publication } = usePublication()

  return (
    <>
      {publication.publishedAt && (
        <Dashboard.Card.Field>
          <Calendar1 aria-hidden />
          {_(`publishedAt`)} {format(publication.publishedAt, "PPP")}
        </Dashboard.Card.Field>
      )}
      {publication.publishedBy && (
        <Dashboard.Card.Field>
          <UserTooltip
            user={publication.publishedBy}
            beforeTrigger={
              <>
                <UserCircle aria-hidden className='inline-block size-3.5 stroke-[1.5]' />
                {_(`publishedBy`)}
              </>
            }
          />
        </Dashboard.Card.Field>
      )}
      {(publication.publishedFrom || publication.publishedTo) && (
        <Dashboard.Card.Field>
          <Clock aria-hidden />
          {_(`publication`)}{" "}
          {_("publication-message", {
            from: publication.publishedFrom
              ? _("publication-from", { date: format(publication.publishedFrom, "PPP") })
              : "",
            to: publication.publishedTo ? _("publication-to", { date: format(publication.publishedTo, "PPP") }) : "",
          })}
        </Dashboard.Card.Field>
      )}
    </>
  )
}

const dictionary = {
  fr: {
    // Field labels
    publishedAt: "Date de publication",
    publishedBy: "Publié par",
    publication: "Période de visibilité:",

    // Publication period messages
    "publication-message": "{{from}} {{to}}",
    "publication-from": "à partir du {{date}}",
    "publication-to": "jusqu'au {{date}}",
  },
  en: {
    // Field labels
    publishedAt: "Publication date",
    publishedBy: "Published by",
    publication: "Visibility period",

    // Publication period messages
    "publication-message": "{{from}} {{to}}",
    "publication-from": "From {{date}}",
    "publication-to": " to {{date}}",
  },
  de: {
    // Field labels
    publishedAt: "Veröffentlichungsdatum",
    publishedBy: "Veröffentlicht von",
    publication: "Sichtbarkeitszeitraum",

    // Publication period messages
    "publication-message": "{{from}} {{to}}",
    "publication-from": "Ab {{date}}",
    "publication-to": "bis {{date}}",
  },
}
