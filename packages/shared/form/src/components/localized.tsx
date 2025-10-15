import { Translation, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Globe } from "lucide-react"
import React from "react"

/**
 * FormLocalized
 */
type FormLocalizedProps = {
  classNames?: {}
  "aria-label"?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
}
export const FormLocalized: React.FC<FormLocalizedProps> = ({ title, content, "aria-label": ariaLabel, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Popover.Root>
      <Ui.Popover.Trigger asChild>
        <Ui.Button variant='ghost' icon size='xs' className='-my-1'>
          <Globe className='stroke-[1.8]' aria-hidden />
          <Ui.SrOnly>{ariaLabel || _("aria-label")}</Ui.SrOnly>
        </Ui.Button>
      </Ui.Popover.Trigger>
      <Ui.Popover.Content align='start' side='right'>
        <div className='space-y-2'>
          <h3 className='text-sm font-medium leading-none'>
            {title || _("info-title")}{" "}
            <span className='text-xs leading-none text-muted-foreground'>{_("localized-aside")}</span>
          </h3>
          <p className='text-xs leading-tight text-muted-foreground'>{content}</p>
        </div>
      </Ui.Popover.Content>
    </Ui.Popover.Root>
  )
}

const dictionary = {
  fr: {
    "aria-label": "Informations sur le champ de formulaire",
    "localized-title": "Informations",
    "localized-aside": "(localisé)",
  },
  en: {
    "aria-label": "Information about the form field",
    "localized-title": "Information",
    "localized-aside": "(localized)",
  },
  de: {
    "aria-label": "Informationen zum Formularfeld",
    "localized-title": "Informationen",
    "localized-aside": "(lokalisiert)",
  },
} satisfies Translation
