import { CronJob } from 'cron'
import logger from '@adonisjs/core/services/logger'
import { JobConfig } from '#types/job'

export default class SchedulerService {
  private jobs: JobConfig[] = []

  addJob(jobConfig: JobConfig) {
    this.jobs.push(jobConfig)
  }

  scheduleSingleJob(jobConfig: JobConfig) {
    const cronJob = new CronJob(jobConfig.cronExpression, async () => {
      try {
        logger.info(`[Scheduler] Starting job: ${jobConfig.key}`)
        await jobConfig.job.run()
        logger.info(`[Scheduler] Completed job: ${jobConfig.key}`)
      } catch (error) {
        logger.error(`[Scheduler] Error in job ${jobConfig.key}:`, error)
      }
    })

    cronJob.start()
  }

  scheduleAllJobs() {
    this.jobs.forEach((jobConfig) => {
      this.scheduleSingleJob(jobConfig)
    })
    logger.info(
      `[Scheduler] ${this.jobs.length} registered ${this.jobs.length === 1 ? 'job has' : 'jobs have'} been scheduled`
    )
  }

  getJobs() {
    return this.jobs.map((job) => ({
      key: job.key,
      cronExpression: job.cronExpression,
    }))
  }
}