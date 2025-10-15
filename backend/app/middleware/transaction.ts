import cache from '@adonisjs/cache/services/main'
import { createError } from '@adonisjs/core/exceptions'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { G } from '@mobily/ts-belt'
import { Option } from '@mobily/ts-belt/Option'

const transactionCache = cache.namespace('transactions')

/**
 * Transaction middleware is used to handle transactions.
 */
export default class TransactionMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // 'Cannot read private member #normalizer from an object whose class did not declare it'

    // case 1: has a transaction - create a new transaction in cache
    const hasTransaction = ctx.request.header('X-Transaction')
    if (G.isString(hasTransaction) && hasTransaction === 'true') {
      const transaction = await setTransaction(ctx)
      return ctx.response.created({ transaction })
    }

    // case 2: has a transaction id - pull the transaction from the cache
    const transactionId = ctx.request.header('X-Transaction-Id')
    if (G.isString(transactionId)) {
      const transaction = await pullTransaction(transactionId)
      if (!transaction) throw E_TRANSACTION_NOT_FOUND
      ctx.request.updateBody({ ...transaction.body, ...ctx.request.body() })
      return next()
    }

    // case 3: no transaction - continue
    return next()
  }
}

/**
 * getTransaction
 * get the transaction from the cache
 */
const pullTransaction = async (key: string): Promise<Option<BodyTransaction>> => {
  return await transactionCache.pull<BodyTransaction>(key)
}

/**
 * setTransaction
 * create a new transaction and save it in the cache
 */
const setTransaction = async (ctx: HttpContext): Promise<string> => {
  const key = cuid()

  await transactionCache.set({
    key,
    grace: '1d',
    value: {
      id: key,
      body: ctx.request.body(),
    },
  })
  return key
}

/**
 * types
 */
type BodyTransaction = {
  id: string
  body: Record<string, any>
}

/**
 * errors
 */
export const E_TRANSACTION_NOT_FOUND = createError(
  'transaction not found',
  'E_TRANSACTION_NOT_FOUND',
  401
)
