/**
 * Folders
 * @description this file contains the folders for the project
 */
import app from '@adonisjs/core/services/app'

export default {
  /**
   * Logs
   */
  logs: 'logs',

  /**
   * Storage use by file system
   */
  localDriveRoot: app.inProduction ? `../` : '',
  storage: 'storage',
  temp: 'temp-storage',
  public: 'public-storage',

  /**
   * Folders
   */
  user: {
    root: 'users',
    profile: 'profile',
  },
  workspace: {
    root: 'workspaces',
    profile: 'profile',
  },
}
