import { Form } from "@compo/form"
import { useContextHotkeys, useIsSticky } from "@compo/hooks"
import { Primitives, Ui } from "@compo/ui"
import { A, G, cxm } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLanguage } from "../context.hooks"
import { FormTranslatableContext, useFormTranslatableContext } from "./form-translatable-context"
// import { useHotkeys } from "react-hotkeys-hook"

/**
 * FormTranslatableTabs
 * Tabs component to switch between languages with sticky behavior
 *
 * Features:
 * - Language switching tabs that stick below dialog header during scroll
 * - Uses CSS variable --dialog-header-height set by DialogHeader component
 * - IntersectionObserver with sentinel element to detect sticky state
 * - Keyboard shortcut (Cmd+G) to cycle through languages
 * - Visual scaling effect when sticky (scale-75)
 * - Context provider for child components to access current language
 *
 * The sticky positioning works by:
 * 1. DialogHeader calculates its height and sets --dialog-header-height CSS variable
 * 2. Tabs use sticky positioning with top: calc(var(--dialog-header-height) - var(--tab-list-height))
 * 3. Sentinel element positioned at sticky threshold detects when tabs become sticky
 * 4. isSticky state triggers visual changes (scaling, etc.)
 */
type FormTranslatableTabsProps = {
  children: ((language: Api.Language) => React.ReactNode) | React.ReactNode
  defaultLanguage?: Api.Language["id"]
  className?: string
  classNames?: {
    root?: string
    list?: string
    trigger?: string
    content?: string
  }
}

export const FormTranslatableTabs: React.FC<FormTranslatableTabsProps> = ({
  children,
  className,
  classNames,
  defaultLanguage,
}) => {
  const { current, others, t } = useLanguage()
  const languages = React.useMemo(() => [current, ...others], [current, others])
  const [language, setLanguage] = React.useState(defaultLanguage || current.id)
  const currentLanguage = React.useMemo(
    () => languages.find(({ id }) => id === language) as Api.Language,
    [language, languages]
  )

  const nextLanguage = React.useCallback(() => {
    if (languages.length === 1) return
    const index = A.getIndexBy(languages, ({ id }) => id === language)
    if (G.isNullable(index)) return
    const nextLanguage = languages[(index + 1) % languages.length]
    if (G.isNullable(nextLanguage)) return
    setLanguage(nextLanguage.id)
  }, [language, languages])

  // yann shortcut to switch quickly between languages
  useContextHotkeys("meta+g", nextLanguage)
  const tabListRef = React.useRef<HTMLDivElement>(null)

  // Detect if tabs are currently sticky (sticking to top)
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const isSticky = useIsSticky(sentinelRef)

  return (
    <FormTranslatableContext.Provider value={{ language, setLanguage, current: currentLanguage }}>
      <div aria-hidden />
      <Primitives.Tabs.Root value={language} onValueChange={setLanguage} className={cxm(classNames?.root)}>
        {/* Sentinel element to detect sticky state */}
        <div
          ref={sentinelRef}
          className='-mb-px h-px'
          style={{
            position: "absolute",
            top: `calc(var(--dialog-header-height) - var(--tab-list-height) - 0.5rem - 1px)`,
          }}
        />
        {languages.length > 1 && (
          <Primitives.Tabs.List
            ref={tabListRef}
            className={cxm(
              "flex w-full items-center justify-end gap-2 rounded-md py-1 pb-2",
              "text-sm font-medium whitespace-nowrap",
              "ring-offset-background data-[state=active]:bg-background",
              "data-[state=active]:text-foreground data-[state=active]:shadow",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              "disabled:pointer-events-none disabled:opacity-50",
              "sticky -right-8 z-10",
              "top-[100px]",
              "origin-bottom-right transition-transform duration-300",
              isSticky && "scale-75",
              classNames?.list
            )}
            style={
              {
                "--tab-list-height": `44px`,
                top: "calc(var(--dialog-header-height) - var(--tab-list-height))",
              } as React.CSSProperties
            }
          >
            {A.map(languages, ({ id, code }) => (
              <Primitives.Tabs.Trigger
                key={id}
                value={id}
                className={cxm(
                  Ui.buttonVariants({ variant: id === language ? "default" : "secondary", size: "sm" }),
                  classNames?.trigger
                )}
              >
                {t(code)}
              </Primitives.Tabs.Trigger>
            ))}
          </Primitives.Tabs.List>
        )}

        {G.isFunction(children)
          ? A.map(languages, (language) => (
              <Primitives.Tabs.Content
                value={language.id}
                key={language.id}
                className={cxm("outline-none", classNames?.content, className)}
              >
                <Form.Fields name={language.id}>{children(language)}</Form.Fields>
              </Primitives.Tabs.Content>
            ))
          : children}
      </Primitives.Tabs.Root>
    </FormTranslatableContext.Provider>
  )
}

type FormTranslatableContentProps = Omit<Ui.Tabs.TabsContentProps, "children" | "value"> & {
  children: (language: Api.Language) => React.ReactNode
}
export const FormTranslatableContent: React.FC<FormTranslatableContentProps> = ({ children, className, ...props }) => {
  const { current } = useFormTranslatableContext()
  return (
    <Primitives.Tabs.Content {...props} value={current.id} className={cxm("outline-none", className)}>
      <Form.Fields name={current.id}>{children(current)}</Form.Fields>
    </Primitives.Tabs.Content>
  )
}
