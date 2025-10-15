import { usePersistedState } from "@compo/hooks"
import { Translation, useTranslation } from "@compo/localize"
import { X } from "lucide-react"
import * as React from "react"
import { z } from "zod"
import { cn, type VariantProps } from "@compo/utils"
import { Button } from "../button"
import { quoteVariants } from "./variants"

/**
 * QuoteRoot
 */
export type RootProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof quoteVariants>
const QuoteRoot = React.forwardRef<HTMLDivElement, RootProps>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role='alert' className={cn(quoteVariants({ variant }), className)} {...props} />
))
QuoteRoot.displayName = "QuoteRoot"

/**
 * QuoteDismissable
 */
export type DismissableProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof quoteVariants> & {
    id: string
  }
const QuoteDismissable = React.forwardRef<HTMLDivElement, DismissableProps>(
  ({ className, variant, id, children, ...props }, ref) => {
    const { _ } = useTranslation(dictionary)
    const [dismissed, setDismissed] = usePersistedState(
      false,
      `dismiss-${id}`,
      z.boolean(),
      typeof window !== "undefined" ? localStorage : undefined
    )
    if (dismissed) return null
    return (
      <div ref={ref} role='alert' className={cn(quoteVariants({ variant, className: "pr-10" }), className)} {...props}>
        {children}
        <Button
          variant='ghost'
          size='xs'
          icon
          onClick={() => setDismissed(true)}
          className='absolute right-1 top-1 !p-0 text-muted-foreground/50 hover:text-muted-foreground'
        >
          <X className='size-3 stroke-[1]' aria-label={_("dismiss")} />
        </Button>
      </div>
    )
  }
)
QuoteDismissable.displayName = "QuoteDismissable"

const dictionary = {
  fr: {
    dismiss: "Fermer",
  },
  en: {
    dismiss: "Close",
  },
  de: {
    dismiss: "Schließen",
  },
} satisfies Translation

/**
 * QuoteTitle
 */
export type TitleProps = React.HTMLAttributes<HTMLHeadingElement>
const QuoteTitle = React.forwardRef<HTMLParagraphElement, TitleProps>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
))
QuoteTitle.displayName = "QuoteTitle"

/**
 * QuoteDescription
 */
export type DescriptionProps = React.HTMLAttributes<HTMLParagraphElement>
const QuoteDescription = React.forwardRef<HTMLParagraphElement, DescriptionProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("[&_p]:leading-relaxed", className)} {...props} />
))
QuoteDescription.displayName = "QuoteDescription"

export { QuoteDescription as Description, QuoteDismissable as Dismissable, QuoteRoot as Root, QuoteTitle as Title }
