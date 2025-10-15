/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  DEBUG: Env.schema.boolean(),
  REPORT_ERRORS: Env.schema.boolean(),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

  APP_NAME: Env.schema.string(),
  APP_URL: Env.schema.string(),
  DASHBOARD_URL: Env.schema.string(),

  /**
   * Variables for configuring cors package
   */
  CORS_HOSTS: Env.schema.string(),

  /**
   * Variables for configuring limiter package
   */
  LIMITER_STORE: Env.schema.enum(['redis', 'database', 'memory'] as const),
  LIMITER_DEFAULT_LIMIT: Env.schema.number(),
  LIMITER_AUTH_LIMIT: Env.schema.number(),
  LIMITER_RISKED_LIMIT: Env.schema.number(),

  /**
   * Variables for configuring database connection
   */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /**
   * Variables for configuring redis connection
   */
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string(),

  /**
   * Variables for configuring mail package
   */
  MAIL_FROM_NAME: Env.schema.string(),
  MAIL_FROM_EMAIL: Env.schema.string(),
  MAIL_REDIRECT: Env.schema.boolean(),
  MAIL_REDIRECT_TO: Env.schema.string(),
  MAIL_APP_NAME: Env.schema.string(),
  MAIL_APP_SUPPORT_EMAIL: Env.schema.string(),
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),

  /**
   * Variables for configuring the drive package
   */
  DRIVE_DISK: Env.schema.enum(['fs'] as const),
  AWS_ACCESS_KEY_ID: Env.schema.string(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string(),
  AWS_REGION: Env.schema.string(),
  S3_BUCKET: Env.schema.string(),

  /**
   * Variables for configuring session package
   */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /**
   * Variables for configuring scheduler configuration
   */
  SCHEDULER_ENABLED: Env.schema.boolean.optional(),

  /**
   * Variables for configuring cleanup configuration
   */
  EMAIL_LOGS_RETENTION_DAYS: Env.schema.number.optional(),
  EMAIL_LOGS_CLEANUP_SCHEDULE: Env.schema.string.optional(),
  EMAIL_RETRY_MAX_ATTEMPTS: Env.schema.number.optional(),
  EMAIL_RETRY_MAX_AGE_HOURS: Env.schema.number.optional(),
  EMAIL_RETRY_SCHEDULE: Env.schema.string.optional(),
  AUTH_TOKEN_RETENTION_DAYS: Env.schema.number.optional(),
  AUTH_TOKEN_CLEANUP_SCHEDULE: Env.schema.string.optional(),
  AUTH_INACTIVE_ACCOUNT_RETENTION_DAYS: Env.schema.number.optional(),
  AUTH_INACTIVE_ACCOUNT_CLEANUP_SCHEDULE: Env.schema.string.optional(),
  AUTH_REGISTRATION_ATTEMPT_RETENTION_HOURS: Env.schema.number.optional(),
  AUTH_REGISTRATION_ATTEMPT_CLEANUP_SCHEDULE: Env.schema.string.optional(),
  AUTH_SESSION_RETENTION_DAYS: Env.schema.number.optional(),
  AUTH_SESSION_CLEANUP_SCHEDULE: Env.schema.string.optional(),
})
