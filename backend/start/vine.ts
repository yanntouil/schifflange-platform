import db from '@adonisjs/lucid/services/db'
import { A, D } from '@mobily/ts-belt'
import vine, { VineArray, VineDate, VineRecord, VineString } from '@vinejs/vine'
import { FieldContext, SchemaTypes } from '@vinejs/vine/types'
export type { Infer } from '@vinejs/vine/types'

/**
 * validationFailure
 * [{ 'field-name': 'validation-rule', ... }]
 */
export const validationFailure = (errors: Record<string, string>[]) => ({
  name: 'E_VALIDATION_FAILURE',
  message: 'Validation failed',
  status: 400,
  errors: errors.flatMap((error) => A.map(D.toPairs(error), ([field, rule]) => ({ field, rule }))),
})

/**
 * uniqueRule
 */
export type UniqueOptions = {
  table: string
  column: string
}
export const uniqueRule = vine.createRule(
  async (value: unknown, options: UniqueOptions, field: FieldContext) => {
    if (typeof value !== 'string') return
    const row = await db
      .from(options.table)
      .select(options.column)
      .where(options.column, value)
      .first()
    if (row) field.report('The {{ field }} field is not unique', 'unique', field)
  },
  { isAsync: true }
)

/**
 * existsRule
 */
export type ExistsOptions = {
  table: string
  column: string
}
export const existsRule = vine.createRule(
  async (
    value: unknown,
    options: {
      table: string
      column: string
    },
    field: FieldContext
  ) => {
    if (typeof value !== 'string') return
    const row = await db
      .from(options.table)
      .select(options.column)
      .where(options.column, value)
      .first()
    if (!row) field.report('The {{ field }} field does not exist', 'exists', field)
  },
  { isAsync: true }
)

/**
 * requiredIfEveryMissingRule
 */
export const requiredIfEveryMissingRule = vine.createRule(
  async (value: unknown, fields: string[], field: FieldContext) => {
    if (vine.helpers.isMissing(value)) {
      if (
        fields.every((otherField) =>
          vine.helpers.isMissing(vine.helpers.getNestedValue(otherField, field))
        )
      ) {
        field.report('The {{ field }} field is required', 'required', field)
      }
    }
  },
  { implicit: true }
)

/**
 * Extend VineJS with custom rules
 */
declare module '@vinejs/vine' {
  interface VineString {
    unique(options: { table: string; column: string }): this
    exists(options: { table: string; column: string }): this
    requiredIfEveryMissing(fields: string[]): this
  }
  interface VineDate {
    requiredIfEveryMissing(fields: string[]): this
  }
  interface VineRecord<Schema extends SchemaTypes> {
    requiredIfEveryMissing(fields: string[]): this
  }
  interface VineArray<Schema extends SchemaTypes> {
    requiredIfEveryMissing(fields: string[]): this
  }
}
VineString.macro('unique', function (this: VineString, options: UniqueOptions) {
  return this.use(uniqueRule(options))
})
VineString.macro('exists', function (this: VineString, options: ExistsOptions) {
  return this.use(existsRule(options))
})
VineString.macro('requiredIfEveryMissing', function (this: VineString, fields: string[]) {
  return this.use(requiredIfEveryMissingRule(fields))
})
VineDate.macro('requiredIfEveryMissing', function (this: VineDate, fields: string[]) {
  return this.use(requiredIfEveryMissingRule(fields))
})
VineRecord.macro(
  'requiredIfEveryMissing',
  function (this: VineRecord<SchemaTypes>, fields: string[]) {
    return this.use(requiredIfEveryMissingRule(fields))
  }
)
VineArray.macro(
  'requiredIfEveryMissing',
  function (this: VineArray<SchemaTypes>, fields: string[]) {
    return this.use(requiredIfEveryMissingRule(fields))
  }
)
