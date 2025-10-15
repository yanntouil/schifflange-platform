import { G } from "@mobily/ts-belt"
import * as React from "react"
import { confirmable, createConfirmation } from "react-confirm"
import { Confirmable, ConfirmableProps } from "./components"
import { ConfirmProps, UseConfirmParams } from "./types"

/**
 * useConfirm
 */
export const useConfirm = <T = true, V = T>({ onConfirm, onAsyncConfirm, ...params }: UseConfirmParams<T, V>) => {
  const [open, setOpen] = React.useState<T | false>(false)
  return [
    (value: T) => setOpen(value),
    {
      open,
      onCancel: () => setOpen(false),
      onConfirm: G.isNotNullable(onConfirm)
        ? (value: V) => {
            setOpen(false)
            onConfirm(value)
          }
        : undefined,
      onAsyncConfirm: G.isNotNullable(onAsyncConfirm)
        ? (value: V) => {
            setOpen(false)
            return onAsyncConfirm(value)
          }
        : undefined,
      ...params,
    } as ConfirmProps,
  ] as const
}

/**
 * confirmAlert
 */
export const confirmAlert = createConfirmation(confirmable<ConfirmableProps, boolean>(Confirmable))
