import { Translation, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, cxm } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { Globe } from "lucide-react"
import React from "react"
import { useLanguage } from "../context.hooks"

/**
 * TranslationPopover
 */
type TranslationPopoverProps<L extends { languageId: string } & Api.TranslatableValues> = {
  item: Api.Translatable<L>
  placeholder: Omit<Api.TranslatableValues, "languageId">
  className?: string
  children: (
    translated: L,
    context: {
      language: Api.Language
      displayedName: string
    }
  ) => React.ReactNode
}
export const TranslationPopover = <L extends { languageId: string } & Api.TranslatableValues>({
  item,
  placeholder,
  children,
  className,
}: TranslationPopoverProps<L>) => {
  const { _ } = useTranslation(dictionary)
  const { translate, others, t } = useLanguage()
  return (
    <Ui.Popover.Quick
      className={cxm(
        Ui.buttonVariants({ variant: "ghost", icon: true, size: "sm", className: "text-muted-foreground/60" }),
        className
      )}
      align='start'
      side='left'
      content={
        <>
          {A.map(others, (other) => (
            <React.Fragment key={other.id}>
              {children(translate.language(other.id)(item, placeholder as L) as L, {
                language: other,
                displayedName: t(other.code),
              })}
            </React.Fragment>
          ))}
        </>
      }
    >
      <Globe aria-hidden />
      <Ui.SrOnly>{_("translations-label")}</Ui.SrOnly>
    </Ui.Popover.Quick>
  )
}

const dictionary = {
  fr: {
    translations: "Autres traductions",
  },
  en: {
    translations: "Other translations",
  },
  de: {
    translations: "Andere Übersetzungen",
  },
} satisfies Translation
