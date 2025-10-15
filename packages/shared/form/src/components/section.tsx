import { Icon, Ui, variants } from "@compo/ui"
import { cxm } from "@compo/utils"
import React from "react"
import { FormHeader } from "./header"

/**
 * FormSection
 */
export type FormSectionProps = {
  title?: string
  description?: string
  classNames?: {
    container?: string
    header?: string
    title?: string
    description?: string
  }
} & React.ComponentProps<"fieldset">
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  classNames,
  ...props
}) => {
  return (
    <fieldset {...props} className={cxm("space-y-4", classNames?.container, className)}>
      <FormHeader
        title={title}
        description={description}
        classNames={{
          container: classNames?.header,
          title: classNames?.title,
          description: classNames?.description,
        }}
      />
      {children}
    </fieldset>
  )
}

/**
 * FormCollapsibleSection
 */
type FormCollapsibleSectionProps = Omit<FormSectionProps, "classNames"> & {
  persistedKey: string
  defaultOpen?: boolean
  level?: number
  classNames?: FormSectionProps["classNames"] & {
    trigger?: string
    content?: string
  }
}
export const FormCollapsibleSection: React.FC<FormCollapsibleSectionProps> = ({
  title,
  description,
  children,
  className,
  classNames,
  persistedKey,
  defaultOpen = true,
  level = 3,
  ...props
}) => {
  const { animate, open, onOpenChange } = Ui.useCollapsibleState(persistedKey, defaultOpen)
  const iconRef = React.useRef<Icon.ChevronDownHandle>(null)
  return (
    <Ui.Collapsible.Root {...{ open, onOpenChange }} data-animate={animate} asChild>
      <fieldset {...props} className={cxm("group", classNames?.container)}>
        <div className={cxm("space-y-1.5 pt-4", classNames?.header)}>
          <Ui.Collapsible.Trigger
            onMouseEnter={() => iconRef.current?.startAnimation()}
            onMouseLeave={() => iconRef.current?.stopAnimation()}
            className={cxm(
              "flex w-full items-center justify-between gap-4",
              variants.focusVisible(),
              variants.inputRounded(),
              classNames?.trigger
            )}
          >
            <Ui.Hn level={level} className={cxm("text-base/relaxed font-medium tracking-wide", classNames?.title)}>
              {title}
            </Ui.Hn>
            <Icon.ChevronDown
              className='size-4 shrink-0 opacity-50 transition-transform group-data-[state=closed]:-rotate-180'
              aria-hidden
              ref={iconRef}
            />
          </Ui.Collapsible.Trigger>
          {description && (
            <p className={cxm("text-muted-foreground text-sm/tight", classNames?.description)}>{description}</p>
          )}
        </div>
        <Ui.Collapsible.Content
          className={cxm(
            "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down pt-6 space-y-4",
            animate && "overflow-hidden",
            classNames?.content
          )}
        >
          {children}
        </Ui.Collapsible.Content>
      </fieldset>
    </Ui.Collapsible.Root>
  )
}
