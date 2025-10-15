"use client"

import { D } from "@compo/utils"
import { params } from "adnf"
import * as React from "react"
import { useLocation, useSearch as useWouterSearch } from "wouter"

export const useQuery = () => {
  const search = useWouterSearch()
  const [location, navigate] = useLocation()

  const getSearchParams = React.useCallback(() => {
    const query = new URLSearchParams(search)
    return query as unknown as Iterable<readonly [PropertyKey, string | undefined]>
  }, [search])

  const searchParams = React.useMemo(() => {
    return Object.fromEntries(getSearchParams()) as Record<string, string | undefined>
  }, [getSearchParams])

  const setParams = (paramObj: Record<string, string | undefined>, replace = false) => {
    navigate(params(location, replace ? paramObj : { ...searchParams, ...paramObj }))
  }

  const setParam = (key: string, value: string | undefined) => {
    setParams({ [key]: value })
  }

  const deleteParam = (matchKey: string | RegExp) => {
    const match = (key: string) => (typeof matchKey === "string" ? matchKey === key : matchKey.test(key))
    setParams(
      D.rejectWithKey(searchParams, (key) => match(key)),
      true
    )
  }

  return {
    search,
    getSearchParams,
    searchParams,
    setParams,
    setParam,
    deleteParam,
  }
}

export const useQueryParam = <V, D>(key: string, parser: Parser<V, D>) => {
  const { searchParams, setParam, deleteParam } = useQuery()
  const paramValue = searchParams[key]

  const value = React.useMemo(() => {
    if (paramValue === undefined) return parser.defaultValue as D
    return parser.parse(paramValue)
  }, [paramValue, parser])

  const setValue = (value: V | undefined) => {
    if (value === undefined) {
      deleteParam(key)
    } else {
      setParam(key, parser.encode(value))
    }
  }

  return [value, setValue] as const
}

/**
 * String parser
 */

const createParser = <PV, PD = undefined>(parser: Parser<PV, PD>) => {
  return {
    ...parser,
    defaultValue: parser.defaultValue as PD,
    withDefault: <D>(defaultValue: D) => {
      return createParser<PV, D>({ ...parser, defaultValue })
    },
  }
}

export const parseAsString = createParser({
  parse: (value) => value,
  encode: (value) => value,
})

type Parser<V, D> = {
  parse: (value: string) => V
  encode: (value: V) => string | undefined
  defaultValue?: D
}

// export const parseAsNumber = createParser({
//   parse: (value) => {
//     const number = +value
//     if (typeof number === "number" && !isNaN(number)) return number
//   },
// })

// export const parseAsBoolean = createParser({
//   defaultValue: false,
//   parse: (value) => value === "true",
// })

// export const parseAsLiteral = <U extends string[]>(literals: U) => {
//   return createParser<U[number] | undefined>({
//     parse: (value) => (literals.includes(value) ? value : undefined),
//   })
// }

// const result = parseAsLiteral(["a", "b"] as const)
//   .withDefault("a")
//   .parse("C")

// type ParamParser<V> = (value: string) => V
// type Parser<V, D> = {
//   parse: (value: string) => V
//   encode: (value: V) => string | undefined
//   defaultValue?: D
// }

// const createParser = <V, D>(parser: { parse: ParamParser<V>; defaultValue?: D }) => {
//   return {
//     parse: ((value: string | undefined) => {
//       return typeof value === "string" ? parser.parse(value) : parser.defaultValue
//     }) as ParamParser<V | D>,
//     withDefault: <D>(defaultValue: D) => {
//       return createParser<V, D>({ ...parser, defaultValue })
//     },
//   }
// }

// const parseAsNumber = createParser<number, undefined>({
//   parse: (value) => {
//     const number = +value
//     if (typeof number === "number" && !isNaN(number)) return number
//   },
// })

// const a = parseAsNumber.parse("test")
// const b = parseAsNumber.withDefault(29).parse("test")

// type ParamParser<V> = (value: string) => V

// type Parser<V, D> = {
//   parse: ParamParser<V>
//   defaultValue?: D
// }

// export const useQuery = () => {
//   const search = useWouterSearch()
//   const [location, navigate] = useLocation()

//   const getSearchParams = React.useCallback(() => new URLSearchParams(search), [search])

//   const produce = <R>(draft: (searchParams: URLSearchParams) => R): R => {
//     const searchParams = getSearchParams()
//     const result = draft(searchParams)
//     const strSearchParams = searchParams.toString()
//     navigate(location + (strSearchParams ? `?${strSearchParams}` : ""))
//     return result
//   }

//   const set = (name: string, value: string) => {
//     return produce((searchParams) => searchParams.set(name, value))
//   }

//   const del = (name: string | RegExp) => {
//     const match = (key: string) => (typeof name === "string" ? key === name : name.test(key))
//     return produce((searchParams) => {
//       getSearchParams().forEach((_, key) => {
//         if (match(key)) searchParams.delete(key)
//       })
//     })
//   }

//   const append = (name: string, value: string) => {
//     return produce((searchParams) => searchParams.append(name, value))
//   }

//   const has = (name: string) => {
//     return getSearchParams().has(name)
//   }

//   const get = (name: string) => {
//     return getSearchParams().get(name)
//   }

//   return {
//     produce,
//     delete: del,
//     append,
//     set,
//     get,
//     has,
//   }
// }

// export const useQueryParam = (key: string, fallback?: string) => {
//   const search = useQuery()
//   const value = search.get(key) ?? fallback

//   const set = (value: Option<string>) => {
//     if (G.isNullable(value)) {
//       search.delete(key)
//     } else {
//       search.set(key, value)
//     }
//   }

//   const del = () => set(undefined)

//   return [value, set, del] as const
// }
