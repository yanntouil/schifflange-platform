import { DictionaryFn } from "@compo/localize"

/**
 * UseConfirmParams
 */
export type UseConfirmParams<T = true, V = T> = {
  onConfirm?: (value: V) => void
  onAsyncConfirm?: (value: V) => Promise<boolean | undefined> // return true if the operation failed
  finally?: () => void
  confirmKey?: string
  list?: V[]
  displayName?: (value: V) => string
  t?: DictionaryFn
}

/**
 * ConfirmProps
 */
export type ConfirmProps<T = unknown> = {
  confirmKey?: string | undefined
  list?: T[] | undefined
  displayName?: ((value: T) => string) | undefined
  t?: DictionaryFn
  open: false | T
  onCancel: () => void
  onConfirm: ((value: T) => void) | undefined
  finally?: () => void
  onAsyncConfirm: ((value: T) => Promise<boolean | undefined>) | undefined // return true if the operation failed
}
