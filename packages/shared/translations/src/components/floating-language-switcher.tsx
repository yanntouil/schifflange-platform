import { Translation, useTranslation } from "@compo/localize"
import { Primitives, Ui } from "@compo/ui"
import { A, O, S, cxm } from "@compo/utils"
import React from "react"
import { useContextualLanguage } from "../context.hooks"

/**
 * FloatingLanguageSwitcher
 */
export const FloatingLanguageSwitcher: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { languages, t, setCurrent, current } = useContextualLanguage()
  const [open, setOpen] = React.useState(false)
  if (languages.length === 1) return null
  return (
    <Primitives.Portal>
      <Primitives.DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
        <Primitives.DropdownMenu.Trigger asChild>
          <Ui.Tooltip.Quick tooltip={_("switch")} side='left' asChild>
            <Ui.Button className={cxm("fixed top-4 right-4 rounded-full text-xs uppercase")} icon>
              {S.slice(current.code, 0, 2)}
            </Ui.Button>
          </Ui.Tooltip.Quick>
        </Primitives.DropdownMenu.Trigger>
        <Primitives.DropdownMenu.Portal>
          <Primitives.DropdownMenu.Content
            className={cxm(
              "flex origin-bottom flex-col items-center justify-center gap-2",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            )}
            sideOffset={6}
          >
            {A.filterMap(languages, (language) =>
              language.code !== current.code ? (
                <Ui.Tooltip.Quick
                  tooltip={_(`switch-to`, { language: t(language.code) })}
                  side='left'
                  key={language.id}
                  asChild
                >
                  <Primitives.DropdownMenu.Item
                    className={cxm(
                      Ui.buttonVariants({
                        variant: "secondary",
                        size: "sm",
                        className: "size-7 !cursor-pointer rounded-full px-0 uppercase select-none",
                      })
                    )}
                    onClick={() => setCurrent(language)}
                  >
                    {S.slice(language.code, 0, 2)}
                    <Ui.SrOnly>{_(`switch-to`, { language: t(language.code) })}</Ui.SrOnly>
                  </Primitives.DropdownMenu.Item>
                </Ui.Tooltip.Quick>
              ) : (
                O.None
              )
            )}
          </Primitives.DropdownMenu.Content>
        </Primitives.DropdownMenu.Portal>
      </Primitives.DropdownMenu.Root>
    </Primitives.Portal>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    switch: "Changer la langue affichée",
    "switch-to": "Changer la langue vers {{language}}",
  },
  en: {
    switch: "Switch language displayed",
    "switch-to": "Switch language to {{language}}",
  },
  de: {
    switch: "Sprache wechseln",
    "switch-to": "Sprache wechseln zu {{language}}",
  },
} satisfies Translation
