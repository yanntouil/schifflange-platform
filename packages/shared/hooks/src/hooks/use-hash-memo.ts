import { Primitive } from "@compo/utils"
import React from "react"
import stableHash from "stable-hash"

export const useHashMemo = <V>(value: V, hash: (value: V) => Primitive = stableHash): V => {
  // stabilize hash fn
  const [stableHash] = React.useState(() => hash)

  const stableKey = React.useMemo(() => stableHash(value), [stableHash, value])
  const stableValue = React.useMemo(
    () => value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stableKey]
  )

  return stableValue
}
