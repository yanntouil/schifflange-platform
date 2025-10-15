import { useIsMobile } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, cxm } from "@compo/utils"
import { Plus } from "lucide-react"
import React from "react"
import { useContent } from "../context"

/**
 * Add
 */
type Props = {
  onClick: () => void
  index: number
  isSorting: boolean
}
export const Add: React.FC<Props> = ({ index, onClick, isSorting }) => {
  const { _ } = useTranslation(dictionary)
  const { content } = useContent()

  const isAlone = A.isEmpty(content.items)
  const isLast = index === content.items.length - 1
  const isFirst = index === -1
  const suffix = isAlone ? "first" : isLast ? "after" : isFirst ? "before" : "between"

  const isMobile = useIsMobile()
  if (isMobile)
    return (
      <div
        className={cxm(
          "flex w-full items-center justify-end py-2 transition-opacity duration-300 ease-in-out",
          isSorting && "opacity-0"
        )}
      >
        <Ui.Button onClick={onClick} variant='secondary' size='xxs'>
          <Plus aria-hidden />
          <Ui.SrOnly>{_(`create-item-${suffix}`)}</Ui.SrOnly>
        </Ui.Button>
      </div>
    )
  return (
    <div
      className={cxm(
        "flex w-full cursor-auto items-center justify-center",
        "focus-within:opacity-100 hover:opacity-100",
        "transition-all delay-300 duration-150 focus-within:delay-0",
        isSorting && "opacity-0",
        isAlone ? "h-16 opacity-100" : "h-8 opacity-0 focus-within:h-16 hover:h-16"
      )}
    >
      <Ui.Button onClick={onClick} variant='secondary' size='sm'>
        <Plus aria-hidden />
        {_(`create-item-${suffix}`)}
      </Ui.Button>
    </div>
  )
}

const dictionary = {
  fr: {
    "create-item-first": "Créer un block de contenu",
    "create-item-after": "Créer un block de contenu après",
    "create-item-before": "Créer un block de contenu avant",
    "create-item-between": "Créer un block de contenu entre",
  },
  de: {
    "create-item-first": "Einen Inhalts-Block erstellen",
    "create-item-after": "Einen Inhalts-Block danach erstellen",
    "create-item-before": "Einen Inhalts-Block davor erstellen",
    "create-item-between": "Einen Inhalts-Block dazwischen erstellen",
  },
  en: {
    "create-item-first": "Create a content block",
    "create-item-after": "Create a content block after",
    "create-item-before": "Create a content block before",
    "create-item-between": "Create a content block between",
  },
}
