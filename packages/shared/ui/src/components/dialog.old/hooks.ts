import * as React from "react"

/**
 * useDialog
 */
export const useDialog = <T = true, M = T>(
  props: {
    mutate?: (value: M) => Promise<void>
    onClose?: () => void
    onCloseAutoFocus?: () => void
    onOpenChange?: (open: boolean) => void
  } = {}
) => {
  const { onClose, mutate, onCloseAutoFocus } = props

  // internal state
  const [open, setOpen] = React.useState<T | false>(false)

  // change value of item
  const setItem = (value: T | false) => {
    setOpen(value)
    props.onOpenChange?.(value !== false)
  }

  // close dialog
  const onOpenChange = (state: boolean) => {
    setOpen(state as T | false)
    onClose?.()
    onCloseAutoFocus?.()
    props.onOpenChange?.(state)
  }

  // shortcut to close dialog
  const close = () => onOpenChange(false)

  return [
    setItem,
    {
      open: open !== false,
      onOpenChange,
      setItem,
      mutate,
      close,
      item: open,
    },
  ] as const
}

export type UseDialogProps<T = true, M = T> = {
  open: boolean
  onOpenChange: (state: boolean) => void
  close: () => void
  onCloseAutoFocus?: () => void
  setItem: (value: T | false) => void
  mutate?: (value: M) => Promise<void>
  item: T | false
}
export type UseDialogFormProps<T = void, M = T> = T extends void
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
