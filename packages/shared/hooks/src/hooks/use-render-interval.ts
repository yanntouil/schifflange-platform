import { N } from "@compo/utils"
import React from "react"
import { useInterval } from "./use-interval"

/**
 * useRenderInterval
 * @description
 * This hook is used to force a component to re-render every ms milliseconds
 * @param ms - The interval in milliseconds
 * @returns void
 */
export const useRenderInterval = (ms = 2000) => {
  const [, setCount] = React.useState(0)
  useInterval(() => setCount(N.succ), ms)
}
