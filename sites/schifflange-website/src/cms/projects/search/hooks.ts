"use client"

import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"

/**
 * Hook for managing projects search state with nuqs
 */
export function useProjectsSearchState() {
  return useQueryStates(
    {
      search: parseAsString.withDefault(""),
      categories: parseAsArrayOf(parseAsString).withDefault([]),
      years: parseAsArrayOf(parseAsString).withDefault([]),
      tags: parseAsArrayOf(parseAsString).withDefault([]),
      page: parseAsString.withDefault("1"),
    },
    {
      shallow: false,
      throttleMs: 300,
      clearOnDefault: true,
    }
  )
}

/**
 * Type for the search state
 */
export type ProjectsSearchState = ReturnType<typeof useProjectsSearchState>[0]