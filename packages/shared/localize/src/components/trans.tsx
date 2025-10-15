"use client"

import React from "react"
import { useTranslation } from "../hook"
import { Translation } from "../types"

interface Props {
  dictionary: Translation
  children: (t: ReturnType<typeof useTranslation>) => React.ReactNode
}
export const Trans: React.FC<Props> = ({ dictionary, children }) => {
  const t = useTranslation(dictionary)
  return <>{children(t)}</>
}
