"use client"

import { Except, FetchResult, FetchResultDeclaration, InferDeclaration, NoResponse } from "adnf"
import React from "react"
import useDefaultSWR, { SWRConfiguration } from "swr"
import { assert, ImplicitAny, makeQS } from "@compo/utils"

export const useSWR = <V, E, C extends SWRConfiguration<V, FetchResultError<E>>>(
  declaration?: FetchResultDeclaration<V, E> | null,
  config: C & { revalidate?: boolean; toast?: boolean; cacheKey?: string } = {} as C
) => {
  const { revalidate = true, cacheKey = "no-cache-key", ..._swrConfig } = config
  const swrConfig = _swrConfig as C

  // See https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
  const revalidateConfig = revalidate
    ? {} // do not overwrite swr context config
    : {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      }

  return useDefaultSWR<V, FetchResultError<E>, string | string[] | null, C>(
    declaration ? [declaration.key, cacheKey] : null,
    async () => {
      // await delay({ duration: "slow" })
      return assert(declaration).fetch().then(throwResult)
    },
    { ...swrConfig, ...revalidateConfig } as Parameters<
      typeof useDefaultSWR<V, FetchResultError<E>, string | string[] | null, C>
    >[2]
  )
}

/**
 * throwFailed:
 * Transform FetchResult to compat SWR result
 */

export const throwResult = <V, E>(result: FetchResult<V, E>) => {
  if (result.failed) throw FetchResultError(result)
  return result.value
}

export const FetchResultError = <E>(error: NoResponse | Except<E>): FetchResultError<E> => {
  return Object.assign(error.error, {
    except: error.except,
    status: error.response?.status ?? null,
  })
}

export const isNativeError = (v: ImplicitAny): v is Error => v instanceof Error
export const isSWRError = <E>(error: Error): error is FetchResultError<E> => {
  return isNativeError(error) && "except" in error
}

/**
 * Types
 */

export type FetchResultError<E> = Error & {
  except: null | E
  status: null | number
}

export type InferExcept<T> = InferDeclaration<T>["Except"]
export type InferSWRError<T> = FetchResultError<InferExcept<T>>

/**
 * useMemoKey
 */
export const useMemoKey = <T extends Record<string, unknown>>(key: string, params: T) => {
  return React.useMemo(() => `${key}-${makeQS(params)}`, [key, params])
}
