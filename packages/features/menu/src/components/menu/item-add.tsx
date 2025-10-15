import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, cx } from "@compo/utils"
import { Plus } from "lucide-react"
import React from "react"
import { useMenu } from "../../menu.context"

/**
 * ItemAdd
 */
type Props = {
  onClick: () => void
  index: number
  isSorting: boolean
}
export const ItemAdd: React.FC<Props> = ({ index, onClick, isSorting }) => {
  const { _ } = useTranslation(dictionary)
  const { swr } = useMenu()

  const isAlone = A.isEmpty(swr.items)
  const isLast = index === swr.items.length - 1
  const isFirst = index === -1
  const suffix = isAlone ? "first" : isLast ? "after" : isFirst ? "before" : "between"

  return (
    <div
      className={cx(
        "flex w-full cursor-auto items-center justify-center",
        "focus-within:opacity-100 hover:opacity-100",
        "transition-all delay-300 duration-150 focus-within:delay-0",
        isSorting && "opacity-0",
        isAlone ? "h-16 opacity-100" : "h-4 opacity-0 focus-within:h-16 hover:h-16"
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
    "create-item-first": "Créer un élément",
    "create-item-after": "Créer un élément après",
    "create-item-before": "Créer un élément avant",
    "create-item-between": "Créer un élément entre",
  },
  de: {
    "create-item-first": "Element erstellen",
    "create-item-after": "Element danach erstellen",
    "create-item-before": "Element davor erstellen",
    "create-item-between": "Element dazwischen erstellen",
  },
  en: {
    "create-item-first": "Create an element",
    "create-item-after": "Create an element after",
    "create-item-before": "Create an element before",
    "create-item-between": "Create an element between",
  },
}
