/**
 * Env
 */

export const env = {
  mode: process.env.NODE_ENV,
  dev: process.env.NODE_ENV && process.env.NODE_ENV.startsWith('dev'),
}
