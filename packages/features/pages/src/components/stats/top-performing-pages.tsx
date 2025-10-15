import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, millify, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { Link } from "wouter"
import { usePages } from "../../pages.context"
import { usePagesService } from "../../service.context"

/**
 * TopPerformingPages
 */
export const TopPerformingPages: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { routeToPage } = usePagesService()
  const { translate } = useLanguage()
  const { swr } = usePages()
  const { pages } = swr
  const sortedPages = React.useMemo(() => A.sort(pages, (a, b) => b.tracking.visits - a.tracking.visits), [pages])
  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
      </Ui.Card.Header>

      <Ui.Card.Content className='flex flex-col gap-2'>
        <p className='flex items-center justify-end'>
          <span className='text-sm font-medium text-[var(--chart-2)]'>{_("visits")}</span>
        </p>
        <ul className='flex flex-col gap-2'>
          {A.map(A.take(sortedPages, 5), ({ id, seo, tracking }) => (
            <li className='flex items-center justify-between gap-8 text-sm' key={id}>
              <Link to={routeToPage(id)} className={variants.link()}>
                <span className='line-clamp-1 tracking-tight'>
                  {placeholder(translate(seo, servicePlaceholder.seo).title, _("placeholder"))}
                </span>
              </Link>
              <span className='font-medium text-[var(--chart-2)]'>{millify(tracking.visits, { precision: 1 })}</span>
            </li>
          ))}
        </ul>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  fr: {
    title: "Pages les plus visitées",
    placeholder: "Page sans titre",
    visits: "Visites",
  },
  en: {
    title: "Top performing pages",
    placeholder: "Untitled page",
    visits: "Visits",
  },
  de: {
    title: "Seiten mit bester Performance",
    placeholder: "Unbenannte Seite",
    visits: "Aufrufe",
  },
}
