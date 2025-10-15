import { useContextHotkeys } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, cxm, G } from "@compo/utils"
import * as Portal from "@radix-ui/react-portal"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { Layers, SquareDashed, SquareMinus, XIcon } from "lucide-react"
import React from "react"

/**
 * SelectionFloating
 */
type SelectionProps = {
  selected: unknown[]
  unselect: () => void
  delete?: () => void
  actions?: {
    label: React.ReactNode
    icon: React.ReactNode
    handler: () => void
  }[]
}
const SelectionFloating: React.FC<SelectionProps> = ({ selected, unselect, actions = [], ...props }) => {
  const { _ } = useTranslation(dictionary)

  const ref = React.useRef<HTMLButtonElement>(null)
  const prevFocusedElement = React.useRef<HTMLElement | null>(null)
  // Focus on the selection button when pressing Meta+i
  useContextHotkeys(["Meta+i", "Ctrl+i"], (e) => {
    if (A.isEmpty(selected)) return
    e.preventDefault()
    // Save the previous focused element
    prevFocusedElement.current = document.activeElement as HTMLElement
    // Focus on the selection button
    ref.current?.focus()
  })

  // Handle the click event
  const onClick = (handler: () => void) => () => {
    // Focus on the previous focused element
    prevFocusedElement.current?.focus()
    handler()
  }

  if (A.isEmpty(selected)) return null

  return (
    <Portal.Root>
      <ToggleGroupPrimitive.Root
        type='single'
        className='bg-card fixed right-0 bottom-0 left-0 flex items-center justify-between gap-2 rounded-md border-t px-4 py-2 sm:right-6 sm:bottom-2 sm:left-auto sm:justify-end sm:border'
      >
        <div className='flex items-center gap-2'>
          <Ui.Kbd.Shortcut desktopOnly>
            <Ui.Kbd.Meta shortcut='I' />
          </Ui.Kbd.Shortcut>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            {selected.length}
            <span className='sr-only sm:not-sr-only'>{_(`selected-element${selected.length > 1 ? "s" : ""}`)}</span>
            <Layers className='size-4 sm:hidden' aria-hidden />
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <SelectionButton onClick={onClick(unselect)} ref={ref}>
            <SquareDashed aria-hidden />
            {_("unselect")}
          </SelectionButton>
          {A.mapWithIndex(actions, (index, { label, icon, handler }) => (
            <SelectionButton onClick={onClick(handler)} key={index}>
              {icon}
              {label}
            </SelectionButton>
          ))}
          {G.isNotNullable(props.delete) && (
            <SelectionButton onClick={onClick(props.delete)}>
              <SquareMinus aria-hidden />
              {_("delete")}
            </SelectionButton>
          )}
        </div>
      </ToggleGroupPrimitive.Root>
    </Portal.Root>
  )
}

/**
 * SelectionBar
 */
const SelectionBar: React.FC<SelectionProps> = ({ selected, unselect, actions = [], ...props }) => {
  const { _ } = useTranslation(dictionary)

  const ref = React.useRef<HTMLButtonElement>(null)
  const prevFocusedElement = React.useRef<HTMLElement | null>(null)
  // Focus on the selection button when pressing Meta+i
  useContextHotkeys(["Meta+i", "Ctrl+i"], (e) => {
    if (A.isEmpty(selected)) return
    e.preventDefault()
    // Save the previous focused element
    prevFocusedElement.current = document.activeElement as HTMLElement
    // Focus on the selection button
    ref.current?.focus()
  })

  // Handle the click event
  const onClick = (handler: () => void) => () => {
    // Focus on the previous focused element
    prevFocusedElement.current?.focus()
    handler()
  }

  const hasSelection = A.isNotEmpty(selected)
  return (
    <Ui.AnimateHeight>
      {hasSelection && (
        <ToggleGroupPrimitive.Root
          type='single'
          className={cxm("bg-card mb-4 flex items-center gap-4 rounded-full border py-1 pr-4 pl-1")}
        >
          <SelectionButton onClick={onClick(unselect)} ref={ref} className='rounded-full'>
            <XIcon aria-hidden />
            <Ui.SrOnly>{_("unselect")}</Ui.SrOnly>
          </SelectionButton>
          <div className='mr-2 flex items-center gap-2'>
            <Ui.Kbd.Shortcut desktopOnly>
              <Ui.Kbd.Meta shortcut='I' />
            </Ui.Kbd.Shortcut>
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              {selected.length}
              <span className='sr-only sm:not-sr-only'>
                {_(`selected-short-element${selected.length > 1 ? "s" : ""}`)}
              </span>
              <Layers className='size-4 sm:hidden' aria-hidden />
            </div>
          </div>
          <Ui.Separator orientation='vertical' className='h-4' />
          <div className='flex items-center gap-2'>
            {A.mapWithIndex(actions, (index, { label, icon, handler }) => (
              <SelectionButton onClick={onClick(handler)} key={index}>
                {icon}
                {label}
              </SelectionButton>
            ))}
            {G.isNotNullable(props.delete) && (
              <SelectionButton onClick={onClick(props.delete)}>
                <SquareMinus aria-hidden />
                {_("delete")}
              </SelectionButton>
            )}
          </div>
        </ToggleGroupPrimitive.Root>
      )}
    </Ui.AnimateHeight>
  )
}

/**
 * SelectionButton
 */
const SelectionButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>, "value">
>(({ className, ...props }, ref) => {
  const id = React.useId()
  return (
    <ToggleGroupPrimitive.Item
      className={cxm(Ui.buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground", className)}
      ref={ref}
      value={id}
      {...props}
    />
  )
})

/**
 * translations
 */
const dictionary = {
  fr: {
    "selected-element": "élément sélectionné",
    "selected-elements": "éléments sélectionnés",
    "selected-short-element": "sélectionné",
    "selected-short-elements": "sélectionnés",
    unselect: "Déselectionner",
    delete: "Supprimer",
  },
  en: {
    "selected-element": "element selected",
    "selected-elements": "elements selected",
    "selected-short-element": "selected",
    "selected-short-elements": "selected",
    unselect: "Unselect",
    delete: "Delete",
  },
  de: {
    "selected-element": "ausgewähltes Element",
    "selected-elements": "ausgewählte Elemente",
    "selected-short-element": "ausgewählt",
    "selected-short-elements": "ausgewählt",
    unselect: "Auswählen",
    delete: "Löschen",
  },
}

export { SelectionBar as Bar, SelectionFloating as Floating }
