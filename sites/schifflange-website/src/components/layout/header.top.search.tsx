"use client"

import { cxm } from "@compo/utils"
import { Search, X } from "lucide-react"
import React from "react"
import { useTranslation } from "../../lib/localize"
import { Ui } from "../ui"

/**
 * display a search form in the header
 */
export const HeaderSearch = () => {
  const { _ } = useTranslation(dictionary)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const toggleRef = React.useRef<HTMLButtonElement>(null)

  // Focus input when searchOpen becomes true
  React.useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  const onToggleSearch = () => {
    setSearchOpen((prev) => {
      if (prev) {
        // Closing: keep focus on toggle button
        setTimeout(() => toggleRef.current?.focus(), 0)
      }
      return !prev
    })
  }

  const onInputFocus = () => {
    // If input receives focus while closed, open it
    if (!searchOpen) {
      setSearchOpen(true)
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submit")
  }

  return (
    <form className='relative flex items-center justify-end gap-2' onSubmit={onSubmit}>
      <div className={cxm("relative flex items-center", !searchOpen && "w-0 overflow-hidden")}>
        <input
          ref={inputRef}
          type='text'
          placeholder={_("search-placeholder")}
          onFocus={onInputFocus}
          tabIndex={searchOpen ? 0 : -1}
          className={cxm(
            "bg-white border border-white rounded-full pl-3 pr-7 py-0.5 text-xs placeholder:text-muted-foreground outline-none text-foreground",
            "transition-all duration-300 ease-in-out",
            searchOpen ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none bg-white",
            Ui.variants.disabled(),
            Ui.variants.focus({ variant: "visible" })
          )}
        />
        {searchOpen && (
          <button
            type='submit'
            className={cxm(
              "absolute right-0 inset-y-0 h-full aspect-square flex items-center justify-center rounded-full",
              Ui.variants.disabled(),
              Ui.variants.focus({ variant: "visible" })
            )}
          >
            <Search className='size-3.5 text-foreground' aria-hidden />
            <Ui.SrOnly>{_("search-submit")}</Ui.SrOnly>
          </button>
        )}
      </div>
      <button
        ref={toggleRef}
        type='button'
        className={cxm(
          "flex items-center justify-center rounded-full",
          Ui.variants.disabled(),
          Ui.variants.focus({ variant: "visible" }),
          "focus-visible:ring-offset-primary"
        )}
        onClick={onToggleSearch}
      >
        {searchOpen ? <X className='size-4 text-white' /> : <Search className='size-4 text-white' />}
        <Ui.SrOnly>{_(searchOpen ? "search-close" : "search-open")}</Ui.SrOnly>
      </button>
    </form>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "search-placeholder": "Rechercher...",
    "search-submit": "Rechercher",
    "search-open": "Ouvrir la recherche",
    "search-close": "Fermer la recherche",
  },
  en: {
    "search-placeholder": "Search...",
    "search-submit": "Search",
    "search-open": "Open search",
    "search-close": "Close search",
  },
  de: {
    "search-placeholder": "Suchen...",
    "search-submit": "Suchen",
    "search-open": "Suche öffnen",
    "search-close": "Suche schließen",
  },
  lb: {
    "search-placeholder": "Sichen...",
    "search-submit": "Sichen",
    "search-open": "Sich opmaachen",
    "search-close": "Sich zoumaachen",
  },
}
