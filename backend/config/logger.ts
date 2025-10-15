import folders from '#config/folders'
import env from '#start/env'
import { defineConfig, targets } from '@adonisjs/core/logger'
import app from '@adonisjs/core/services/app'

const root = app.inProduction ? `../${folders.logs}` : folders.logs

const loggerConfig = defineConfig({
  default: 'app',

  /**
   * The loggers object can be used to define multiple loggers.
   * By default, we configure only one logger (named "app").
   */
  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL'),
      transport: {
        targets: targets()
          .pushIf(
            app.inDev,
            targets.pretty({
              colorize: true,
            })
          )
          .pushIf(
            app.inDev,
            targets.file({ mkdir: true, destination: app.makePath(`${root}/live.log`) })
          )
          .pushIf(
            app.inProduction,
            targets.file({ mkdir: true, destination: app.makePath(`${root}/live.log`) })
          )
          .toArray(),
      },
    },
  },
})

export default loggerConfig

/**
 * Inferring types for the list of loggers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
