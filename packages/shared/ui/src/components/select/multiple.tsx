import { Translation, useTranslation } from "@compo/localize"
import { Check, ChevronsUpDown, X } from "lucide-react"
import * as React from "react"
import { A, cn, cva, pipe, type VariantProps } from "@compo/utils"
import { disabledVariants, focusVisibleVariants } from "../../variants"
import { Badge } from "../badge"
import { Command } from "../command"
import { Popover } from "../popover"
import { Separator } from "../separator"
import { SrOnly } from "../sr-only"

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva("", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
      secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

/**
 * MultiSelect
 */
export type MultiSelectProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> &
  VariantProps<typeof multiSelectVariants> & {
    options: {
      label: React.ReactNode
      labelShort?: React.ReactNode
      value: string
    }[]
    onValueChange: (value: string[]) => void
    defaultValue?: string[]
    value?: string[]
    placeholder?: string
    maxDisplayedItems?: number
    displayClear?: boolean
    displaySelectAll?: boolean
    modalPopover?: boolean
    className?: string
    classNames?: {
      trigger?: string
      badge?: string
      content?: string
      clear?: string
      placeholder?: string
    }
  }

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>((props, ref) => {
  const { _ } = useTranslation(dictionary)
  const {
    options,
    onValueChange,
    variant,
    defaultValue = [],
    value,
    placeholder = "",
    maxDisplayedItems = 3,
    displayClear = false,
    displaySelectAll = false,
    modalPopover = true,
    className,
    classNames,
    ...rest
  } = props
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsPopoverOpen(true)
    } else if (event.key === "Backspace" && !event.currentTarget.value) {
      const newSelectedValues = [...selectedValues]
      newSelectedValues.pop()
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }
  }

  const toggleOption = (option: string) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option]
    setSelectedValues(newSelectedValues)
    onValueChange(newSelectedValues)
  }

  const clear = () => {
    setSelectedValues([])
    onValueChange([])
  }

  const togglePopover = () => {
    setIsPopoverOpen((prev) => !prev)
  }

  const clearExtraOptions = () => {
    const newSelectedValues = selectedValues.slice(0, maxDisplayedItems)
    setSelectedValues(newSelectedValues)
    onValueChange(newSelectedValues)
  }

  const selectAll = () => {
    const allValues = options.map((option) => option.value)
    setSelectedValues(allValues)
    onValueChange(allValues)
  }
  const unselectAll = () => {
    clear()
  }
  const allSelected = React.useMemo(() => selectedValues.length === options.length, [selectedValues, options])

  React.useLayoutEffect(() => {
    if (value) setSelectedValues(value)
  }, [value])
  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
      <Popover.Trigger asChild>
        <button
          type='button'
          ref={ref}
          {...rest}
          onClick={togglePopover}
          className={cn(
            focusVisibleVariants(),
            disabledVariants(),
            "grid min-h-9 w-full grid-cols-[1fr_auto] items-start rounded-md border border-input bg-card p-1.5 text-left text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-card",
            classNames?.trigger,
            className
          )}
        >
          {selectedValues.length > 0 ? (
            <>
              <div className='flex grow flex-wrap items-start gap-2'>
                {pipe(
                  selectedValues,
                  A.slice(0, maxDisplayedItems),
                  A.map((value) => {
                    const option = A.find(options, (o) => o.value === value)
                    return (
                      <Badge
                        key={value}
                        className={cn(multiSelectVariants({ variant, className: "shadow-none" }), classNames?.badge)}
                      >
                        {option?.labelShort || option?.label}
                        <span
                          className='ml-2 flex size-4 items-center justify-center text-foreground'
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleOption(value)
                          }}
                        >
                          <X className='!size-3.5 opacity-50' aria-hidden />
                          <SrOnly>{_("remove-item")}</SrOnly>
                        </span>
                      </Badge>
                    )
                  })
                )}
                {selectedValues.length > maxDisplayedItems && (
                  <Badge
                    className={cn(
                      "border-foreground/1 bg-transparent text-foreground",
                      multiSelectVariants({ variant }),
                      classNames?.badge
                    )}
                  >
                    {_("more-items", { count: selectedValues.length - maxDisplayedItems })}
                    <span
                      className='ml-2 flex size-4 items-center justify-center text-foreground'
                      onClick={(event) => {
                        event.stopPropagation()
                        clearExtraOptions()
                      }}
                    >
                      <X className='!size-3.5 opacity-50' aria-hidden />
                      <SrOnly>{_("remove-more-items", { count: selectedValues.length - maxDisplayedItems })}</SrOnly>
                    </span>
                  </Badge>
                )}
              </div>
              <span className='flex h-full shrink-0 items-start'>
                {displayClear && (
                  <>
                    <span
                      onClick={(event) => {
                        event.stopPropagation()
                        clear()
                      }}
                      className={cn("flex h-5 items-center border border-transparent", classNames?.clear)}
                    >
                      <X className='mx-2 size-4 text-foreground opacity-50' aria-hidden />
                      <SrOnly>{_("clear")}</SrOnly>
                    </span>
                    <Separator orientation='vertical' className='flex h-full min-h-5' />
                  </>
                )}
                <ChevronsUpDown className='mx-2 my-[3px] size-4 text-foreground opacity-50' aria-hidden />
              </span>
            </>
          ) : (
            <>
              <span
                className={cn("mx-1.5 line-clamp-1 py-[1px] text-sm text-muted-foreground", classNames?.placeholder)}
              >
                {placeholder}
              </span>
              <ChevronsUpDown className='mx-2 my-[3px] size-4 text-foreground opacity-50' aria-hidden />
            </>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Content
        className={cn("w-[var(--radix-popper-anchor-width)] p-0", classNames?.content)}
        align='start'
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Command.Root>
          <Command.Input placeholder={_("search")} onKeyDown={onKeyDown} />
          <Command.List>
            <Command.Empty>{_("no-results-found")}</Command.Empty>
            <Command.Group>
              {displaySelectAll && (
                <Command.Item
                  key='all'
                  onSelect={allSelected ? unselectAll : selectAll}
                  className={cn(
                    "flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <span>{_(allSelected ? "unselect-all" : "select-all")}</span>
                </Command.Item>
              )}
              {A.map(options, (option) => (
                <Command.Item key={option.value} onSelect={() => toggleOption(option.value)} className='relative'>
                  {selectedValues.includes(option.value) && (
                    <span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center'>
                      <Check className='h-4 w-4' />
                    </span>
                  )}
                  {option.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
  )
})

MultiSelect.displayName = "MultiSelect"

const dictionary = {
  fr: {
    search: "Rechercher...",
    "select-all": "Sélectionner tout",
    "unselect-all": "Désélectionner tout",
    close: "Fermer",
    "more-items": "+ {{count}} de plus",
    "remove-more-items": "Désélectionner {{count}} en plus",
    "no-results-found": "Aucun résultat trouvé",
    "remove-item": "Désélectionner",
    "select-options": "Sélectionner des options",
    clear: "Effacer",
  },
  en: {
    search: "Search...",
    "select-all": "Select all",
    "unselect-all": "Unselect all",
    close: "Close",
    "more-items": "+ {{count}} more",
    "remove-more-items": "Remove {{count}} more",
    "no-results-found": "No results found",
    "remove-item": "Remove",
    "select-options": "Select options",
    clear: "Clear",
  },
  de: {
    search: "Suchen...",
    "select-all": "Alles auswählen",
    "unselect-all": "Alles abwählen",
    close: "Schließen",
    "more-items": "+ {{count}} mehr",
    "remove-more-items": "{{count}} mehr abwählen",
    "no-results-found": "Keine Ergebnisse gefunden",
    "remove-item": "Abwählen",
    "select-options": "Optionen auswählen",
    clear: "Löschen",
  },
} satisfies Translation
