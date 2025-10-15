"use client"

import { useTranslation } from "@/lib/localize"
import { Dialog } from "../dialog"

/**
 * AccessibilityDialog
 */
export const AccessibilityDialog = (props: React.PropsWithChildren) => {
  const { children } = props
  const { _ } = useTranslation(dictionary)
  return (
    <Dialog trigger={children} title={_(`title`)} description={_(`description`)}>
      <div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
      </div>
    </Dialog>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Accessibility",
    description: "Accessibility description",
  },
  en: {
    title: "Accessibility",
    description: "Accessibility description",
  },
  de: {
    title: "Zugänglichkeit",
    description: "Zugänglichkeit beschreibung",
  },
}
