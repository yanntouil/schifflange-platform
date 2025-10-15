import { DictionaryFn, Interpolate, useTranslation } from "@compo/localize"
import { variants } from "@compo/ui"
import { cxm, G } from "@compo/utils"
import { Layers, Search } from "lucide-react"
import React from "react"

/**
 * CollectionEmpty
 */
export type CollectionEmptyProps = {
  t: DictionaryFn
  total: number // total items in database
  results: number // total items in results
  reset?: () => Promise<void> | void
  create?: () => Promise<void> | void
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}
const CollectionEmpty: React.FC<CollectionEmptyProps> = ({
  t,
  total,
  results,
  reset,
  create,
  isLoading = false,
  className,
  children,
}) => {
  const { _ } = useTranslation(dictionary)
  const iconCx = "text-muted-foreground mb-2 size-10 stroke-[1]"

  if (isLoading || !(total === 0 || results === 0)) return children

  const resetText = reset
    ? t("no-result-content-reset", { defaultValue: _("no-result-content-reset") })
    : t("no-result-content", { defaultValue: _("no-result-content") })

  const createText = create
    ? t("no-item-content-create", { defaultValue: _("no-item-content-create") })
    : t("no-item-content", { defaultValue: _("no-item-content") })

  const isNoItem = total === 0
  return (
    <div
      className={cxm(
        "border-border bg-muted/50 text-muted-foreground flex w-full flex-grow flex-col items-center justify-center rounded-md border px-4 py-4 text-center",
        className
      )}
    >
      <div className='flex flex-col items-center justify-center gap-1'>
        {isNoItem ? <Layers aria-hidden className={iconCx} /> : <Search aria-hidden className={iconCx} />}
        <h2 className='text-foreground text-xl/tight font-medium'>
          {isNoItem
            ? t("no-item-title", { defaultValue: _("no-item-title") })
            : t("no-result-title", { defaultValue: _("no-result-title") })}
        </h2>
        <p className='text-muted-foreground text-sm/tight'>
          <Interpolate
            text={isNoItem ? createText : resetText}
            replacements={{
              create: (children) => <Button action={create}>{children}</Button>,
              reset: (children) => <Button action={reset}>{children}</Button>,
            }}
          />
        </p>
      </div>
    </div>
  )
}
export { CollectionEmpty as Empty }

const Button: React.FC<{
  action?: () => Promise<void> | void
  children: React.ReactNode
}> = ({ action, children }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  if (G.isNullable(action)) return null
  return (
    <button
      onClick={async () => {
        setIsLoading(true)
        await action()
        setIsLoading(false)
      }}
      disabled={isLoading}
      className={variants.link({ variant: "underline" })}
      type='button'
    >
      {children}
    </button>
  )
}

const dictionary = {
  fr: {
    "no-item-title": "Liste vide",
    "no-item-content-create":
      "Il n'y a pas d'éléments ici pour le moment, vous pouvez créer votre premier [en cliquant ici](action:create).",
    "no-item-content": "Il n'y a pas d'éléments ici pour le moment.",
    "no-result-title": "Aucun résultat trouvé",
    "no-result-content": "Nous n'avons trouvé aucun élément correspondant à votre recherche.",
    "no-result-content-reset":
      "Nous n'avons trouvé aucun élément correspondant à votre recherche, essayez de [réinitialiser tous les filtres](action:reset)",
  },
  en: {
    "no-item-title": "Empty list",
    "no-item-content-create":
      "There are no items here for the moment, you can create your first [by clicking here](action:create).",
    "no-item-content": "There are no items here for the moment.",
    "no-result-title": "No results found",
    "no-result-content": "We couldn't find any item matching your search.",
    "no-result-content-reset":
      "We couldn't find any item matching your search, try to [reset all filters](action:reset)",
  },
  de: {
    "no-item-title": "Leere Liste",
    "no-item-content-create":
      "Es gibt hier momentan keine Elemente, Sie können Ihr erstes [indem Sie hier klicken](action:create).",
    "no-item-content": "Es gibt hier momentan keine Elemente.",
    "no-result-title": "Keine Ergebnisse gefunden",
    "no-result-content": "Wir konnten kein Element finden, das Ihrer Suche entspricht.",
    "no-result-content-reset":
      "Wir konnten kein Element finden, das Ihrer Suche entspricht, versuchen Sie, [alle Filter zurückzusetzen](action:reset)",
  },
}
