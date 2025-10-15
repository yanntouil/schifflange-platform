export abstract class BaseJob {
  abstract run(): Promise<any> | any
}

export interface JobConfig {
  key: string
  cronExpression: string
  job: BaseJob
}