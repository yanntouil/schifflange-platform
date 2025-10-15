import { usePersistedState } from "@compo/hooks"
import { Translation, useTranslation } from "@compo/localize"
import * as Primitive from "@radix-ui/react-collapsible"
import { ChevronUp } from "lucide-react"
import React from "react"
import { z } from "zod"
import { cx } from "@compo/utils"
import { Button } from "../button"
import { SrOnly } from "../sr-only"
import { CollapsibleCardContext, useCollapsibleCard } from "./context"

/**
 * CardRoot
 */
const CardRoot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    id: string
    defaultOpen?: boolean
    disabled?: boolean
    hideOnDisabled?: boolean
  }
>(({ className, children, id, defaultOpen = true, disabled = false, hideOnDisabled = false, ...props }, ref) => {
  const [open, onOpenChange] = usePersistedState(
    defaultOpen,
    `card-${id}`,
    z.boolean(),
    typeof window !== "undefined" ? sessionStorage : undefined
  )
  const [animate, setAnimate] = React.useState(false)
  React.useEffect(() => {
    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 200)
    return () => clearTimeout(timeout)
  }, [open])
  return (
    <CollapsibleCardContext.Provider value={{ id, open, onOpenChange, animate, disabled, hideOnDisabled }}>
      <Primitive.Root
        ref={ref}
        disabled={disabled}
        className={cx(
          "group/card mx-auto grid w-full max-w-screen-2xl rounded-[2px] border border-border bg-card @container/card",
          className
        )}
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      >
        {children}
      </Primitive.Root>
    </CollapsibleCardContext.Provider>
  )
})

/**
 * CardHeader
 */
const CardHeader = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cx("flex w-full items-center justify-between gap-6 px-4 py-4 @lg/card:px-6", className)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    )
  }
)

/**
 * CardHeaderTitle
 */
const CardHeaderTitle = React.forwardRef<React.ElementRef<"h2">, React.ComponentPropsWithoutRef<"h2">>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        className={cx("flex items-center gap-2 text-base font-semibold leading-none tracking-tight", className)}
        {...props}
        ref={ref}
      >
        {children}
      </h2>
    )
  }
)

/**
 * CardHeaderAside
 */
const CardHeaderAside = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    isCollapsible?: boolean
    hideToggleTrigger?: boolean
  }
>(({ className, children, hideToggleTrigger = false, ...props }, ref) => {
  const { _ } = useTranslation(dictionary)
  const { disabled, hideOnDisabled } = useCollapsibleCard()
  const hide = (hideOnDisabled && disabled) || hideToggleTrigger
  const isCollapsible = !hide && (props.isCollapsible ?? true)
  return (
    <div {...props} className={cx("flex items-center gap-2", className)} ref={ref}>
      {children}
      {isCollapsible && (
        <Primitive.CollapsibleTrigger asChild>
          <Button variant='ghost' size='xs' icon>
            <ChevronUp
              aria-hidden
              className='!size-3.5 shrink-0 opacity-50 transition-transform group-data-[state=closed]/card:-rotate-180'
            />
            <SrOnly>{_("accordion-toggle")}</SrOnly>
          </Button>
        </Primitive.CollapsibleTrigger>
      )}
    </div>
  )
})

/**
 * CardContent
 */
const CardContent = React.forwardRef<
  React.ElementRef<typeof Primitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof Primitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => {
  //
  return (
    <Primitive.CollapsibleContent
      ref={ref}
      className={cx("data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down", className)}
      {...props}
    >
      {children}
    </Primitive.CollapsibleContent>
  )
})

export {
  CardHeaderAside as Aside,
  CardContent as Content,
  CardHeader as Header,
  CardRoot as Root,
  CardHeaderTitle as Title,
}
const dictionary = {
  fr: {
    "accordion-toggle": "Ouvrir/Fermer",
  },
  en: {
    "accordion-toggle": "Open/Close",
  },
  de: {
    "accordion-toggle": "Öffnen/Schließen",
  },
} satisfies Translation
