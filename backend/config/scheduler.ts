import env from '#start/env'

/**
 * Configuration for the task scheduler
 */
export default {
  /**
   * Whether the scheduler is enabled
   * Default: true in production, false in test
   */
  enabled: env.get('SCHEDULER_ENABLED') ?? env.get('NODE_ENV') !== 'test',

  /*
  |--------------------------------------------------------------------------
  | Scheduler log level
  |--------------------------------------------------------------------------
  |
  | The log level for scheduler related logs
  |
  */
  logLevel: env.get('SCHEDULER_LOG_LEVEL', 'info'),
}
