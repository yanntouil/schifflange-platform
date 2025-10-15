import { useElementSize, useWindowSize } from "@compo/hooks"
import { useInView } from "framer-motion"
import * as React from "react"
import { G, cxm } from "@compo/utils"
import { scrollbarVariants } from "../../variants"
import { Collapsible } from "../collapsible"
import { DialogContext, useDialogContext } from "./context"
import * as AsDesktop from "./desktop"
import * as AsMobile from "./mobile"

const mobileBreakpoint = 640

/**
 * Dialog
 */
const DialogRoot: React.FC<React.ComponentProps<typeof AsDesktop.Root> | React.ComponentProps<typeof AsMobile.Root>> = (
  props
) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? <AsDesktop.Root {...props} /> : <AsMobile.Root {...props} />
}

/**
 * Dialog trigger
 */
const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof AsDesktop.Trigger> | React.ElementRef<typeof AsMobile.Trigger>,
  React.ComponentPropsWithoutRef<typeof AsDesktop.Trigger> | React.ComponentPropsWithoutRef<typeof AsMobile.Trigger>
>((props, ref) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? (
    <AsDesktop.Trigger ref={ref} {...props} />
  ) : (
    <AsMobile.Trigger ref={ref} {...props} />
  )
})
DialogTrigger.displayName = "DialogTrigger"

/**
 * Dialog portal
 */
const DialogPortal: React.FC<
  React.ComponentProps<typeof AsDesktop.Portal> | React.ComponentProps<typeof AsMobile.Portal>
> = (props) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? <AsDesktop.Portal {...props} /> : <AsMobile.Portal {...props} />
}

/**
 * Dialog close
 */
const DialogClose = React.forwardRef<
  React.ElementRef<typeof AsDesktop.Close> | React.ElementRef<typeof AsMobile.Close>,
  React.ComponentPropsWithoutRef<typeof AsDesktop.Close> | React.ComponentPropsWithoutRef<typeof AsMobile.Close>
>((props, ref) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? <AsDesktop.Close ref={ref} {...props} /> : <AsMobile.Close ref={ref} {...props} />
})
DialogClose.displayName = "DialogClose"

/**
 * Dialog overlay
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof AsDesktop.Overlay> | React.ElementRef<typeof AsMobile.Overlay>,
  React.ComponentPropsWithoutRef<typeof AsDesktop.Overlay> | React.ComponentPropsWithoutRef<typeof AsMobile.Overlay>
>((props, ref) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? (
    <AsDesktop.Overlay ref={ref} {...props} />
  ) : (
    <AsMobile.Overlay ref={ref} {...props} />
  )
})
DialogOverlay.displayName = "DialogOverlay"

/**
 * Dialog content
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof AsDesktop.Content> | React.ElementRef<typeof AsMobile.Content>,
  React.ComponentPropsWithoutRef<typeof AsDesktop.Content> | React.ComponentPropsWithoutRef<typeof AsMobile.Content>
>((props, ref) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? (
    <AsDesktop.Content ref={ref} {...props} />
  ) : (
    <AsMobile.Content ref={ref} {...props} />
  )
})
DialogContent.displayName = "DialogContent"

/**
 * Dialog header
 */
const DialogHeader = React.forwardRef<
  React.ElementRef<typeof AsDesktop.Header> | React.ElementRef<typeof AsMobile.Header>,
  React.ComponentPropsWithoutRef<typeof AsDesktop.Header> | React.ComponentPropsWithoutRef<typeof AsMobile.Header>
>((props, ref) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? <AsDesktop.Header ref={ref} {...props} /> : <AsMobile.Header ref={ref} {...props} />
})
DialogHeader.displayName = "DialogHeader"

/**
 * Dialog scroll area
 */
const DialogScrollArea = React.forwardRef<
  React.ElementRef<typeof AsDesktop.ScrollArea> | React.ElementRef<typeof AsMobile.ScrollArea>,
  | React.ComponentPropsWithoutRef<typeof AsDesktop.ScrollArea>
  | React.ComponentPropsWithoutRef<typeof AsMobile.ScrollArea>
>((props, ref) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? (
    <AsDesktop.ScrollArea ref={ref} {...props} />
  ) : (
    <AsMobile.ScrollArea ref={ref} {...props} />
  )
})
DialogScrollArea.displayName = "DialogScrollArea"

/**
 * Dialog footer
 */
const DialogFooter = React.forwardRef<
  React.ElementRef<typeof AsDesktop.Footer> | React.ElementRef<typeof AsMobile.Footer>,
  React.ComponentPropsWithoutRef<typeof AsDesktop.Footer> | React.ComponentPropsWithoutRef<typeof AsMobile.Footer>
>((props, ref) => {
  const { hasProvider } = useDialogContext()
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? (
    <AsDesktop.Footer
      ref={ref}
      {...props}
      className={cxm(props.className, hasProvider && "sticky bottom-0 -mx-6 bg-card/90")}
    />
  ) : (
    <AsMobile.Footer ref={ref} {...props} />
  )
})
DialogFooter.displayName = "DialogFooter"

/**
 * Dialog scrollable footer
 */
const DialogScrollableFooter = React.forwardRef<
  React.ElementRef<typeof AsDesktop.Footer> | React.ElementRef<typeof AsMobile.Footer>,
  React.ComponentPropsWithoutRef<typeof AsDesktop.Footer> | React.ComponentPropsWithoutRef<typeof AsMobile.Footer>
>((props, ref) => {
  return <AsDesktop.Footer ref={ref} {...props} className={cxm(props.className, "sticky bottom-0 -mx-6 bg-card/90")} />
})
DialogScrollableFooter.displayName = "DialogScrollableFooter"

/**
 * Dialog title
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof AsDesktop.Title> | React.ElementRef<typeof AsMobile.Title>,
  React.ComponentPropsWithoutRef<typeof AsDesktop.Title> | React.ComponentPropsWithoutRef<typeof AsMobile.Title>
>((props, ref) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? <AsDesktop.Title ref={ref} {...props} /> : <AsMobile.Title ref={ref} {...props} />
})
DialogTitle.displayName = "DialogTitle"

/**
 * Dialog description
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof AsDesktop.Description> | React.ElementRef<typeof AsMobile.Description>,
  | React.ComponentPropsWithoutRef<typeof AsDesktop.Description>
  | React.ComponentPropsWithoutRef<typeof AsMobile.Description>
>((props, ref) => {
  const { width } = useWindowSize()
  return width > mobileBreakpoint ? (
    <AsDesktop.Description ref={ref} {...props} />
  ) : (
    <AsMobile.Description ref={ref} {...props} />
  )
})
DialogDescription.displayName = "DialogDescription"

export {
  DialogClose as Close,
  DialogContent as Content,
  DialogDescription as Description,
  DialogFooter as Footer,
  DialogHeader as Header,
  DialogOverlay as Overlay,
  DialogPortal as Portal,
  DialogRoot as Root,
  DialogScrollArea as ScrollArea,
  DialogScrollableFooter as ScrollableFooter,
  DialogTitle as Title,
  DialogTrigger as Trigger,
}

/**
 * Dialog
 */
type Props = {
  open?: boolean
  animate?: boolean
  onCloseAutoFocus?: () => void
  onOpenChange: (state: boolean) => void
  scrollable?: boolean
  className?: string
  classNames?: {
    overlay?: string
    content?: string
    contentScrollable?: string
    close?: string
    header?: string
    title?: string
    description?: string
  }
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
}
export const Quick: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      open = true,
      onCloseAutoFocus,
      className,
      classNames,
      title,
      description,
      animate,
      scrollable = false,
      children,
      ...props
    },
    ref
  ) => {
    const headerRef = React.useRef<HTMLDivElement>(null)
    const [height] = useElementSize(headerRef, { box: "border-box" })
    return (
      <QuickContext.Provider value={{ scrollable, open }}>
        <DialogRoot open={open} {...props} modal>
          <DialogContent
            ref={ref}
            className={className}
            classNames={{
              ...classNames,
              close: cxm("z-10", classNames?.close),
              contentScrollable: cxm(
                scrollable && "max-h-[calc(100vh-2rem)] min-h-0 overflow-y-auto",
                scrollable && scrollbarVariants({ variant: "thin" }),
                classNames?.contentScrollable
              ),
            }}
            style={{ "--dialog-header-height": `${height}px` } as React.CSSProperties}
            onCloseAutoFocus={onCloseAutoFocus}
          >
            {(G.isNotNullable(title) || G.isNotNullable(description)) && (
              <DialogHeader
                className={cxm(scrollable && "sticky top-0 z-10 bg-card/90", classNames?.header)}
                ref={headerRef}
              >
                {G.isNotNullable(title) && <DialogTitle className={classNames?.title}>{title}</DialogTitle>}
                {G.isNotNullable(description) && (
                  <DialogDescription className={classNames?.description}>{description}</DialogDescription>
                )}
              </DialogHeader>
            )}
            {scrollable ? <div className={cxm("px-6", classNames?.contentScrollable)}>{children}</div> : children}
          </DialogContent>
        </DialogRoot>
      </QuickContext.Provider>
    )
  }
)
Quick.displayName = "DialogQuick"

/**
 * need to refactor this code to be usable with mobile and sheets
 */
export const Scrollable: React.FC<
  Props & {
    hideDescriptionOnScroll?: boolean
  }
> = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      open = true,
      onCloseAutoFocus,
      onOpenChange,
      className,
      classNames,
      title,
      description,
      animate,
      children,
      ...props
    },
    ref
  ) => {
    const [headerHeight, setHeaderHeight] = React.useState<number>(0)
    const [isScroll, setIsScroll] = React.useState<boolean>(false)
    const [descriptionDisplayed, setDescriptionDisplayed] = React.useState<boolean>(true)
    return (
      <DialogContext.Provider
        value={{
          hasProvider: true,
          open,
          onOpenChange,
          isScroll,
          setIsScroll,
          descriptionDisplayed,
          setDescriptionDisplayed,
          setHeaderHeight,
          headerHeight,
        }}
      >
        <AsDesktop.Root open={open} {...props} modal onOpenChange={onOpenChange}>
          <AsDesktop.Content
            ref={ref}
            className={className}
            classNames={{
              ...classNames,
              close: cxm("z-10", classNames?.close),
              contentScrollable: cxm(
                "max-h-[calc(100vh)] sm:max-h-[calc(100vh-2rem)] min-h-0 overflow-y-auto",
                scrollbarVariants({ variant: "thin" }),
                classNames?.contentScrollable
              ),
            }}
            style={{ "--dialog-header-height": `${headerHeight}px` } as React.CSSProperties}
            onCloseAutoFocus={onCloseAutoFocus}
          >
            <ScrollableDisplayedContent title={title} description={description} classNames={classNames}>
              {children}
            </ScrollableDisplayedContent>
          </AsDesktop.Content>
        </AsDesktop.Root>
      </DialogContext.Provider>
    )
  }
)
Scrollable.displayName = "DialogScrollable"

/**
 * Scrollable inner
 */
const ScrollableDisplayedContent: React.FC<{
  title?: React.ReactNode
  description?: React.ReactNode
  classNames?: {
    header?: string
    title?: string
    description?: string
    contentScrollable?: string
  }
  children: React.ReactNode
}> = ({ title, description, classNames, children }) => {
  const { setIsScroll, setDescriptionDisplayed, setHeaderHeight } = useDialogContext()

  // observe header height and update the dialog context
  const headerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!headerRef.current) return
    const handler = () => headerRef.current && setHeaderHeight(headerRef.current.clientHeight)
    const resizeObserver = new ResizeObserver(handler)
    resizeObserver.observe(headerRef.current)
    return () => resizeObserver.disconnect()
  }, [headerRef, setHeaderHeight])

  // update scroll state into the dialog context
  const headerTopRef = React.useRef<HTMLDivElement>(null)
  const headerBottomRef = React.useRef<HTMLDivElement>(null)
  const headerTopInView = useInView(headerTopRef)
  const headerBottomInView = useInView(headerBottomRef)
  React.useEffect(() => setIsScroll(headerTopInView), [headerTopInView, setIsScroll])
  React.useEffect(() => setDescriptionDisplayed(headerBottomInView), [headerBottomInView, setDescriptionDisplayed])

  const displayDescription = headerBottomInView
  return (
    <>
      {(G.isNotNullable(title) || G.isNotNullable(description)) && (
        <AsDesktop.Header className={cxm("sticky top-0 z-10 bg-card/90", classNames?.header)} ref={headerRef}>
          {G.isNotNullable(title) && <AsDesktop.Title className={classNames?.title}>{title}</AsDesktop.Title>}
          {G.isNotNullable(description) && (
            <Collapsible.Root open={displayDescription}>
              <Collapsible.Content asChild>
                <AsDesktop.Description
                  className={cxm(
                    "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
                    classNames?.description
                  )}
                >
                  {description}
                </AsDesktop.Description>
              </Collapsible.Content>
            </Collapsible.Root>
          )}
        </AsDesktop.Header>
      )}
      <div className={cxm("relative px-6", classNames?.contentScrollable)}>
        <div
          aria-hidden
          className='-mt-[--dialog-header-height] grid h-[--dialog-header-height] w-[0px] grid-rows-2 bg-red-500'
        >
          <div ref={headerTopRef} />
          <div ref={headerBottomRef} />
        </div>
        {children}
      </div>
    </>
  )
}
ScrollableDisplayedContent.displayName = "DialogScrollableInner"

const QuickContext = React.createContext({
  scrollable: false,
  open: false,
})
