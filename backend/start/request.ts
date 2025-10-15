import { tryOrUndefinedSync } from '#utils/try-catch'
import { Request } from '@adonisjs/core/http'
import { D, G } from '@mobily/ts-belt'
import vine, { VineValidator } from '@vinejs/vine'
import { Infer, SchemaTypes } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * pagination
 */
const paginationValidator = vine.compile(
  vine.object({
    page: vine.number().optional(),
    limit: vine.number().optional(),
  })
)
type PaginationOptions = {
  page: number
  limit: number
}
const defaultPaginationOptions: PaginationOptions = {
  page: 1,
  limit: 10,
}
Request.macro(
  'pagination',
  async function (this: Request, options: Partial<PaginationOptions> = {}) {
    const mergeOptions = { ...defaultPaginationOptions, ...options }
    const data = await this.validateUsing(paginationValidator)
    const page = data.page ?? mergeOptions.page
    const limit = data.limit ?? mergeOptions.limit
    return [page < 1 ? 1 : page, limit < 1 ? 10 : limit]
  }
)

/**
 * filterBy
 */
Request.macro('filterBy', function <
  Schema extends SchemaTypes,
  MetaData extends undefined | Record<string, any>,
>(this: Request, validator: VineValidator<Schema, MetaData>) {
  const data =
    tryOrUndefinedSync(() => {
      const parsed = JSON.parse(this.input('filterBy')) as Record<string, any> | unknown
      return G.isObject(parsed) ? parsed : undefined
    }) ?? {}

  return validator.validate(data, {} as any)
})

/**
 * sortBy
 */
type SortByOptions = {
  field: string | undefined
  direction: 'asc' | 'desc' | undefined
}
const defaultSortByOptions: SortByOptions = {
  field: 'createdAt',
  direction: 'desc',
}
Request.macro('sortBy', function <
  Schema extends SchemaTypes,
  MetaData extends undefined | Record<string, any>,
>(this: Request, validator: VineValidator<Schema, MetaData>, sortDefault: Infer<Schema> = defaultSortByOptions) {
  const data =
    tryOrUndefinedSync(() => {
      const parsed = JSON.parse(this.input('sortBy')) as Record<string, any> | unknown
      return G.isObject(parsed) ? parsed : undefined
    }) ?? sortDefault

  return validator.validate(data, {} as any)
})

/**
 * search
 */
const searchValidator = vine.compile(
  vine.object({
    search: vine.string().trim().optional(),
  })
)
Request.macro('search', function (this: Request) {
  return this.validateUsing(searchValidator).then((data) =>
    data.search === 'undefined' ? undefined : data.search || undefined
  )
})

/**
 * dateOrInterval
 */
const luxonOrJsDate = (date: Date | DateTime | unknown): DateTime<true> | null => {
  if (G.isDate(date)) {
    const luxonDate = DateTime.fromJSDate(date)
    if (luxonDate.isValid) return luxonDate
    return null
  }
  if (DateTime.isDateTime(date)) {
    if (date.isValid) return date
    return null
  }
  return null
}
const dateOrIntervalValidator = vine.compile(
  vine.object({
    from: vine.date().optional(),
    to: vine.date().optional(),
    date: vine.date().optional(),
  })
)
Request.macro('dateOrInterval', async function (this: Request) {
  return this.validateUsing(dateOrIntervalValidator).then((data) => {
    const parsed = D.map(data, luxonOrJsDate)
    if (parsed.date) {
      return {
        from: parsed.date.startOf('day'),
        to: parsed.date.endOf('day'),
      }
    }
    return {
      from: parsed.from,
      to: parsed.to,
    }
  })
})

/**
 * limit
 */
const limitValidator = vine.compile(
  vine.object({
    limit: vine.number().optional(),
  })
)
Request.macro('limit', async function (this: Request) {
  const data = await this.validateUsing(limitValidator)
  return data.limit || undefined
})

declare module '@adonisjs/core/http' {
  interface Request {
    pagination(options?: Partial<PaginationOptions>): Promise<[number, number]>
    filterBy<Schema extends SchemaTypes, MetaData extends undefined | Record<string, any>>(
      validator: VineValidator<Schema, MetaData>
    ): Promise<Infer<Schema>>
    sortBy<Schema extends SchemaTypes, MetaData extends undefined | Record<string, any>>(
      validator: VineValidator<Schema, MetaData>,
      sortDefault?: Infer<Schema>
    ): Promise<Infer<Schema>>
    search(): Promise<string | undefined>
    limit(): Promise<number | undefined>
    dateOrInterval(): Promise<{ from: DateTime<true> | null; to: DateTime<true> | null }>
  }
}
