import { useTranslation } from "@compo/localize"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"
import { buttonCx } from "../variants"

/**
 * Display a pagination tool to navigate through the pages of a slide
 */
type PaginationProps = {
  total: number
  page: number
  onPageChange: (page: number) => void
}
export const Pagination: React.FC<PaginationProps> = ({ total, page, onPageChange }) => {
  const { _ } = useTranslation(dictionary)

  // previous
  const onPrevious = React.useCallback(() => {
    if (page <= 1) onPageChange(total)
    else onPageChange(page - 1)
  }, [page, total, onPageChange])

  // next
  const onNext = React.useCallback(() => {
    if (page >= total) onPageChange(1)
    else onPageChange(page + 1)
  }, [page, total, onPageChange])

  if (total <= 1) return null
  return (
    <div className='grid grid-cols-[auto_1fr_auto] items-center gap-2' role='toolbar' aria-label={_("pagination")}>
      <button type='button' onClick={onPrevious} className={buttonCx}>
        <ChevronLeft aria-hidden />
        <span className='sr-only'>{_("previous-page")}</span>
      </button>
      <p className='text-center text-sm'>{_("pages", { current: page, total })}</p>
      <button type='button' onClick={onNext} className={buttonCx}>
        <ChevronRight aria-hidden />
        <span className='sr-only'>{_("next-page")}</span>
      </button>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "previous-page": "Previous page",
    "next-page": "Next page",
    pages: "Page {{current}} of {{total}}",
  },
  fr: {
    "previous-page": "Page précédente",
    "next-page": "Page suivante",
    pages: "Page {{current}} sur {{total}}",
  },
  de: {
    "previous-page": "Vorherige Seite",
    "next-page": "Nächste Seite",
    pages: "Seite {{current}} von {{total}}",
  },
}
