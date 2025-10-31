import { Translation, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import { G } from "@mobily/ts-belt"
import { Info } from "lucide-react"
import React from "react"

/**
 * FormInfo
 */
type FormInfoProps = {
  classNames?: {
    trigger?: string
  }
  className?: string
  "aria-label"?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
  children?: React.ReactNode
}
export const FormInfo: React.FC<FormInfoProps> = ({
  title,
  content,
  "aria-label": ariaLabel,
  children,
  classNames,
  className,
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Popover.Root>
      <Ui.Popover.Trigger asChild>
        <Ui.Button variant='ghost' icon size='xs' className={cxm("-my-1", classNames?.trigger, className)}>
          <Info aria-hidden />
          <Ui.SrOnly>{ariaLabel || _("aria-label")}</Ui.SrOnly>
        </Ui.Button>
      </Ui.Popover.Trigger>
      <Ui.Popover.Content align='start' side='right'>
        <div className='space-y-2 text-xs/relaxed text-muted-foreground'>
          <h3 className='text-sm/tight font-medium text-foreground'>{title || _("info-title")}</h3>
          {G.isNotNullable(content) && <p>{content}</p>}
          {children}
        </div>
      </Ui.Popover.Content>
    </Ui.Popover.Root>
  )
}

const dictionary = {
  fr: {
    "aria-label": "Informations sur le champ de formulaire",
    "info-title": "Informations",
  },
  en: {
    "aria-label": "Information about the form field",
    "info-title": "Information",
  },
  de: {
    "aria-label": "Informationen zum Formularfeld",
    "info-title": "Informationen",
  },
} satisfies Translation
