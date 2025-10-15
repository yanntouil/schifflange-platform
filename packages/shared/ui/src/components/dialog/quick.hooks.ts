import * as React from "react"

/**
 * useDialog
 */
type QuickDialogParams<T = true, M = T> = {
  // use mutate to operate a mutation inside a provider
  mutate?: (value: M) => Promise<void>
  // callback when dialog is closed
  onClose?: () => void
  // callback when dialog is closed use to replace focus on right place
  onCloseAutoFocus?: () => void
  // callback when dialog is opened or closed
  onOpenChange?: (open: boolean) => void
}
export const useQuickDialog = <Item = true, MutateValue = Item>(params: QuickDialogParams<Item, MutateValue> = {}) => {
  const { onClose, mutate, onCloseAutoFocus } = params

  // internal state
  const [item, setItem] = React.useState<Item | false>(false)
  const open = item !== false

  // setItemWithHook must be used to set value of item and trigger optional onOpenChange
  const setItemWithHook = React.useCallback(
    (value: Item | false) => {
      setItem(value)
      params.onOpenChange?.(value !== false)
    },
    [params.onOpenChange]
  )

  // onOpenChange can only be used to close dialog
  const onOpenChange = React.useCallback(
    (state: boolean) => {
      if (state !== false) return
      setItem(state as Item | false)
      onClose?.()
      onCloseAutoFocus?.()
      params.onOpenChange?.(state)
    },
    [onClose, onCloseAutoFocus, params.onOpenChange]
  )

  // shortcut to close dialog
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange])

  // use props like this [fn, dialogProps]
  const props = { open, onOpenChange, close, setItem: setItemWithHook, item, mutate }
  return [setItemWithHook, props] as const satisfies readonly [
    (value: Item | false) => void,
    QuickDialogProps<Item, MutateValue>,
  ]
}

/**
 * props share inside dialog
 * item is T | false
 */
export type QuickDialogProps<T = true, M = T> = {
  // props use to control dialog
  open: boolean
  onOpenChange: (state: boolean) => void
  close: () => void
  onCloseAutoFocus?: () => void
  // props use to manage item
  setItem: (value: T | false) => void
  item: T | false
  // props use to propagate mutatation to the parent
  mutate?: (value: M) => Promise<void>
}

/**
 * props share inside content with trust item type
 * item !== false > item is T
 */
export type QuickDialogSafeProps<T = void, M = T> = T extends void
  ? {
      onOpenChange: (state: boolean) => void
      close: () => void
      setItem: (value: T | false) => void
      mutate?: (value: M) => Promise<void>
    }
  : {
      onOpenChange: (state: boolean) => void
      close: () => void
      item: T
      setItem: (value: T | false) => void
      mutate?: (value: M) => Promise<void>
    }
