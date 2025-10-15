'use client'

import { usePersistedState } from '@compo/hooks'
import { A, z } from '@compo/utils'
import React from 'react'
import { localizeConfig } from './config'
import { LocalizeContext } from './context'
import { LocalizeLanguage } from './types'
import { getDefaultLanguage } from './utils'

/**
 * provider
 */
export const LocalizeProvider: React.FC<
  React.PropsWithChildren<{ initialLanguage?: LocalizeLanguage }>
> = ({ children, initialLanguage }) => {
  // state
  const [currentLanguage, setLanguage] = usePersistedState<LocalizeLanguage>(
    initialLanguage || getDefaultLanguage(),
    'localize-language',
    z.enum(localizeConfig.languages),
    typeof window !== 'undefined' ? localStorage : undefined
  )

  const isLocalizeLanguage = (language: string): language is LocalizeLanguage =>
    A.includes([...localizeConfig.languages], language as LocalizeLanguage)

  // update the language on the document element
  React.useEffect(() => {
    document.documentElement.lang = currentLanguage
  }, [currentLanguage])

  return (
    <LocalizeContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        languages: localizeConfig.languages,
        isLocalizeLanguage,
      }}
    >
      {children}
    </LocalizeContext.Provider>
  )
}
