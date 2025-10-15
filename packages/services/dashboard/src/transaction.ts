import { FetchOptions, FetchResult } from "adnf"

/**
 * hasFile
 */
const hasFile = (data: any): boolean => {
  if (!data || typeof data !== "object") return false
  if (data instanceof File || data instanceof Blob) return true
  if (Array.isArray(data)) return data.some((item) => item instanceof File || item instanceof Blob)
  return Object.values(data).some((value) => hasFile(value))
}

/**
 * SplitPayloadResult
 * split the payload into form and data
 */
type SplitPayloadResult<P extends Record<string, any>> = {
  form: FormData | null
  data: Partial<P> | null
}

/**
 * splitPayload
 * split the payload into form and data
 */
const splitPayload = <P extends Record<string, any>>(payload: P): SplitPayloadResult<P> => {
  const files: Record<string, File | File[] | Blob | Blob[]> = {}
  const data: Partial<P> = {}

  // merge files and data
  for (const [key, value] of Object.entries(payload)) {
    if (
      value instanceof File ||
      value instanceof Blob ||
      (Array.isArray(value) && value.every((item) => item instanceof File || item instanceof Blob))
    ) {
      files[key] = value // store files separately
    } else {
      data[key as keyof P] = value // store other data normally
    }
  }
  // if there is no files, we can return the data
  if (Object.keys(files).length === 0) {
    return { form: null, data }
  }

  // we need to convert the form to a FormData
  const form = new FormData()
  for (const [key, value] of Object.entries(files)) {
    // value can be an array of files
    if (Array.isArray(value)) {
      value.forEach((file) => form.append(key, file))
    } else {
      form.append(key, value)
    }
  }

  // if each data can be send in a formData (string, number), we need to send it in a formData
  if (Object.values(data).every((value) => typeof value === "string" || typeof value === "number")) {
    for (const [key, value] of Object.entries(data)) {
      form.append(key, value)
    }
    return { form, data: null }
  }

  return { form, data }
}

/**
 * addTransaction
 * add a transaction to the request api
 * transaction merge the payload into a single request
 */
export const withTransaction =
  (apiFetch: ResultFetch): (<V, E>(endpoint: string, options: FetchOptions) => Promise<FetchResult<V, E>>) =>
  async <V, E>(endpoint: string, options: FetchOptions): Promise<FetchResult<V, E>> => {
    const payload = options.data
    if (!payload) return apiFetch(endpoint, options)

    // in case of file, we need to split the payload
    const { form, data } = splitPayload(payload)

    // case 1 : has form and data
    if (form && data) {
      // make a request with transaction for the data
      const transaction = await apiFetch<{ transaction: string }>(endpoint, {
        ...options,
        data,
        headers: { "X-Transaction": "true", ...options.headers },
      })
      if (!transaction.ok) return transaction as FetchResult<V, E>
      const transactionId = transaction.data.transaction
      // make a request with retreived transactionId for files
      const response = await apiFetch<V, E>(endpoint, {
        ...options,
        data: undefined,
        form,
        headers: { "X-Transaction-Id": transactionId, ...options.headers },
      })
      return response
    }

    // case 2 : has form and no data
    if (form && data === null) {
      return apiFetch(endpoint, { ...options, data: undefined, form })
    }

    // case 3 : has no form and data
    return apiFetch(endpoint, options)
  }

/**
 * types
 */

type Resource = string | string[]
type ResultFetch = <V = unknown, E = unknown>(resource: Resource, options?: FetchOptions) => Promise<FetchResult<V, E>>
