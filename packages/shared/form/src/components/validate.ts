import { A, D, G, S, T, pipe } from "@compo/utils"

/**
 * validator
 */
const validatorFn = <T extends Record<string, unknown>, U extends Record<string, unknown> = ValidationSchema<T>>(
  schema: U
) => {
  return (values: T): ValidationResult => {
    const result: ValidationResult = {}

    for (const key in schema) {
      const fieldRules = schema[key] as Option<ValidationFunction<T[string], T>[]>

      if (fieldRules && key in values) {
        const fieldValue = values[key]
        result[key] =
          fieldRules.map((rule) => rule(fieldValue, values)).filter((error) => (G.isString(error) ? error : null))[0] ||
          null
      }
    }

    return result
  }
}

/**
 * types
 */
type ValidationResult = { [key: string]: string | null }
type ValidationFunction<T, TX> = (value: T, values: TX) => string | null | false

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationFunction<T[K], T>[]
}

/**
 * helpers
 */
const min = (min: number, error: string) => (value: string | number | any[]) =>
  (G.isString(value) || G.isArray(value) ? value.length >= min : value >= min) ? null : error
const max = (max: number, error: string) => (value: string | number | any[]) =>
  (G.isString(value) || G.isArray(value) ? value.length <= max : value <= max) ? null : error
const isEmail = (error: string) => (value: string) =>
  G.isString(value) && validationRegex.mail.test(value) ? null : error
const minOrEqual = (min: number, equal: number, error: string) => (value: string | number | any[]) =>
  (
    G.isString(value) || G.isArray(value)
      ? value.length >= min || value.length === equal
      : value >= min || value === equal
  )
    ? null
    : error
const isTrue = (error: string) => (value: boolean) => (value === true ? null : error)
const isBeforeIso = (isoDate: string, error: string) => (value: string) =>
  T.isBefore(T.parseISO(value), T.parseISO(isoDate)) ? null : error
const isAfterIso = (isoDate: string, error: string) => (value: string) =>
  T.isAfter(T.parseISO(value), T.parseISO(isoDate)) ? null : error
const isSetAndBeforeIso =
  <K extends string, V extends Record<K, string>>(key: K, error: string) =>
  (value: string, values: V) =>
    S.isNotEmpty(value) && S.isNotEmpty(values[key]) && !T.isBefore(T.parseISO(value), T.parseISO(values[key]))
      ? error
      : null
const isSetAndAfterIso =
  <K extends string, V extends Record<K, string>>(key: K, error: string) =>
  (value: string, values: V) =>
    S.isNotEmpty(value) && S.isNotEmpty(values[key]) && !T.isAfter(T.parseISO(value), T.parseISO(values[key]))
      ? error
      : null

/**
 * validationRegex
 */
const validationRegex = {
  // Norme RFC2822
  // eslint-disable-next-line no-control-regex
  mail: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
  // Phone (+352) 123 456 789 | +352 123 456 789 | +352 123 456-7 | 00352 123 456 789
  phone: /^([(]{1}[+]{1}[\d]+[)]{1})?([+]{1}[\d]+)?([\d\-\s])+$/,
  creditCard: {
    number: /^[\d]{4}[-\s]?[\d]{4}[-\s]?[\d]{4}[-\s]?[\d]{4}$/,
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/,
    amex: /^3[47][0-9]{13}$/,
    diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    exp: /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/?(0[1-9]|1[0-2])$/, // MM/YY
    cvv: /^[0-9]{3,4}$/,
  },
}

/**
 * hasValidationErrors
 */
const hasValidationErrors = (res: ValidationResult) => pipe(res, D.values, A.some(G.isNotNullable))

/**
 * exports
 */
const validator = Object.assign(validatorFn, {
  hasValidationErrors,
  min,
  max,
  isEmail,
  minOrEqual,
  isTrue,
  isBeforeIso,
  isAfterIso,
  isSetAndBeforeIso,
  isSetAndAfterIso,
  regex: validationRegex,
})
export { validator }

/**
 * Example of use
 *
 * * Define the values to validate
 * const valuesToValidate = {
 *   name: "Contenu du champ",
 *   email: "email@example.com",
 *   // ...other form values
 * }
 * * Define validation rules
 * const validateFields = validator<typeof valuesToValidate>({
 *   name: [min(100, "invalid-length"), max(300, "invalid-length")],
 *   email: [isEmail("invalid-email")],
 *   * ...other validation rules
 * })
 *
 * * Use the validation function to validate values
 * const validationErrors = validateFields(valuesToValidate)
 * * `validationErrors` contains validation errors for each field
 */
