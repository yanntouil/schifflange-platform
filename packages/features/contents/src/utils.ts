import { localizeConfig, type LocalizeLanguage } from "@compo/localize"
import { A, D, G, ImplicitAny, O, Option, pipe } from "@compo/utils"
import { type Api, type Payload } from "@services/dashboard"
import { ExportedItem } from "./types.sync"

/**
 * makeCreatePayloadTranslations
 * helper to prepare translations payload
 */
const makeCreatePayloadTranslations = (languages: Api.Language[], defaultProps: ExportedItem["translations"]) =>
  pipe(
    languages,
    A.map((language) => {
      const props = defaultProps[language.code as LocalizeLanguage]
      if (G.isNullable(props)) throw new Error(`No props for language ${language.code} in defaultProps`)
      return [
        language.id,
        {
          props,
        },
      ] as const
    }),
    D.fromPairs
  )

/**
 * MakableItem
 * declare type of an item that can be made
 */
type MakableItem = {
  order?: number
  state?: Api.ContentItemState
} & Omit<ExportedItem, "category">

/**
 * createPayload
 * helper to prepare a payload for the create item endpoint
 */
export const createPayload = (baseItem: MakableItem, languages: Api.Language[]): Payload.Contents.CreateItem => {
  return {
    ...baseItem,
    type: baseItem.type,
    props: baseItem.props,
    translations: makeCreatePayloadTranslations(languages, baseItem.translations),
  }
}

/**
 * duplicatePayload
 * helper to prepare a payload for the duplicate item endpoint
 */
export const duplicatePayload = (item: Api.ContentItem): Payload.Contents.CreateItem => {
  return {
    type: item.type,
    props: item.props as Record<string, unknown>,
    files: compactFiles(item.files),
    slugs: A.map(item.slugs, D.prop("id")),
    order: item.order + 1,
    state: "draft",
    translations: A.reduce(
      item.translations,
      {} as Record<string, { props?: Record<string, unknown> }>,
      (acc, translation) =>
        D.set(acc, translation.languageId, {
          props: translation.props as Record<string, unknown>,
        })
    ),
  }
}

/**
 * makeCommonItemProps
 * helper to prepare common item props
 */
const makeCommonItemProps = (item: Api.ContentItem) =>
  D.selectKeys(item, [
    "id",
    "order",
    "state",
    "files",
    "slugs",
    "createdBy",
    "createdAt",
    "updatedBy",
    "updatedAt",
  ]) as Omit<Api.ContentItem, "type" | "props" | "translations">

/**
 * secureTranslations
 * return a secure item with each language of languages inside
 * secure existing keys from translations or use placeholders
 * !caution: the type is not secure
 */
const secureTranslations = <L extends Record<string, unknown>>(
  translations: Api.ContentItemTranslation[],
  placeholders: Record<LocalizeLanguage, L>,
  languages: Api.Language[]
): ({ languageId: string } & { props: L })[] => {
  return A.map(languages, (current) => {
    const placeholder =
      D.get(placeholders, current.code as LocalizeLanguage) || placeholders[localizeConfig.defaultLanguage]
    const value = A.find(translations, ({ languageId }) => languageId === current.id)?.props
    if (G.isNullable(value)) return { languageId: current.id, props: placeholder }
    const partial = D.selectKeys(value, D.keys(placeholder) as (keyof typeof value)[]) as ImplicitAny as {
      props: Partial<L>
    }
    return {
      languageId: current.id,
      props: {
        ...placeholder,
        ...partial,
      },
    }
  }) as ({ languageId: string } & { props: L })[]
}

/**
 * makeItem
 * return a typed item from an ApiContentItem store in database
 * !caution: only keys of each props and translations props are secure not the real type
 */
type ApiContentItemWithType<T extends string> = Omit<Api.ContentItem, "type"> & { type: T }
export const makeItem = <T extends string, DF extends Record<string, unknown>, DT extends Record<string, unknown>>(
  item: ApiContentItemWithType<T>,
  defaultProps: DF,
  defaultTranslationsProps: Record<LocalizeLanguage, DT>,
  languages: Api.Language[]
) => {
  return {
    ...makeCommonItemProps(item),
    type: item.type,
    props: {
      ...defaultProps,
      ...D.selectKeys(item.props, D.keys(defaultProps) as (keyof typeof item.props)[]),
    } as typeof defaultProps,
    translations: secureTranslations(item.translations, defaultTranslationsProps, languages),
  }
}

/**
 * extractFile
 * helper to extract a file from an item
 */
export const extractItemFile = (item: { files: Api.MediaFile[] }, id: Option<string>) => {
  if (G.isNullable(id)) return null
  return A.find(item.files, (file) => file.id === id) ?? null
}

/**
 * extractItemFiles
 * helper to extract files from an item
 */
export const extractItemFiles = (item: { files: Api.MediaFile[] }, ids: Option<string>[]) => {
  return A.filterMap(ids, (id) => {
    const file = extractItemFile(item, id)
    if (G.isNullable(file)) return O.None
    return file
  })
}

/**
 * compactFiles
 * helper to compact files from multiple form fields
 */
export const compactFiles = (...files: (Api.MediaFile | null | Api.MediaFile[])[]): string[] => {
  return A.reduce(files, [] as string[], (acc, file) => {
    if (G.isNullable(file)) return acc
    if (G.isArray(file))
      return A.reduce(file, acc, (acc, file) => {
        if (G.isNullable(file)) return acc
        return A.append(acc, file.id) as string[]
      })
    return A.append(acc, file.id) as string[]
  })
}

/**
 * spreadFiles
 * helper to spread files from multiple form fields
 */
export const spreadFiles = (...files: (Api.MediaFile | null | Api.MediaFile[])[]): Api.MediaFile[] => {
  return A.reduce(files, [] as Api.MediaFile[], (acc, file) => {
    if (G.isNullable(file)) return acc
    if (G.isArray(file))
      return A.reduce(file, acc, (acc, file) => {
        if (G.isNullable(file)) return acc
        return A.append(acc, file)
      })
    return A.append(acc, file)
  })
}

/**
 * findTranslation
 * Helper to find a translation in an array of content item translations
 * Return the translation props if found, otherwise return the placeholder
 */
export const findTranslation = <T extends Record<string, unknown>>(
  translations: Api.ContentItemTranslation[],
  languageId: string,
  placeholder: T
): T => {
  const found = A.find(translations, (t) => t.languageId === languageId)
  if (G.isNullable(found)) return placeholder

  // Merge placeholder with found props to ensure all keys are present
  return {
    ...placeholder,
    ...D.selectKeys(found.props, D.keys(placeholder) as (keyof typeof found.props)[]),
  } as T
}
