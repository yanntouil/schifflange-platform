import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { MatchableSize, S, cxm } from "@compo/utils"
import { SearchIcon, XIcon } from "lucide-react"
import React from "react"
import { useToolbar } from "./toolbar.context"

/**
 * Toolbar search
 */
type ToolbarSearchProps = React.ComponentPropsWithoutRef<"div"> & {
  label?: string
  placeholder?: string
  search: string
  size?: MatchableSize
  setSearch: (search: string) => void
}
const ToolbarSearch: React.FC<ToolbarSearchProps> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { size: toolbarSize } = useToolbar()
  const {
    size = toolbarSize,
    className,
    label = _("label"),
    placeholder = _("placeholder"),
    search,
    setSearch,
    ...rest
  } = props
  const id = React.useId()
  const searchRef = React.useRef<HTMLInputElement>(null)
  const searchClear = () => {
    setSearch("")
    searchRef.current?.focus()
  }

  return (
    <div
      className={cxm("relative w-full @2xl/toolbar:w-auto @2xl/toolbar:grow", className)}
      {...rest}
      data-slot='dashboard-toolbar-search'
    >
      <label
        className={cxm(variants.inputIcon({ size, side: "left", className: "text-muted-foreground" }))}
        htmlFor={id}
      >
        <SearchIcon aria-hidden />
        <Ui.SrOnly>{label}</Ui.SrOnly>
      </label>
      <input
        id={id}
        ref={searchRef}
        value={search}
        onChange={({ target }) => setSearch(target.value)}
        className={variants.input({ icon: "both", size })}
        placeholder={placeholder}
      />
      {S.isNotEmpty(search) && (
        <Ui.Button variant='ghost' className={variants.inputIcon({ size, side: "right" })} icon onClick={searchClear}>
          <XIcon aria-hidden />
          <Ui.SrOnly>{_("clear")}</Ui.SrOnly>
        </Ui.Button>
      )}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    label: "Search",
    placeholder: "Search in list",
    clear: "Clear search",
  },
  fr: {
    label: "Rechercher",
    placeholder: "Rechercher dans la liste",
    clear: "Effacer la recherche",
  },
  de: {
    label: "Suchen",
    placeholder: "In der Liste suchen",
    clear: "Suche löschen",
  },
}

export { ToolbarSearch as Search }
