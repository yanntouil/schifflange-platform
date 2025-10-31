import { CreateApi } from "../api"
import { Secure } from "../store"
import { NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../types"
import { Update } from "./payload"
import { Schedule } from "./types"

/**
 * service schedule
 */
export const schedule = (api: CreateApi, secure: Secure, basePath: string) => ({
  update: secure((scheduleId: string, payload: Update) =>
    api.put<{ schedule: Schedule }, WorkspaceErrors | ValidationErrors | NotFoundErrors>(
      `${basePath}/schedules/${scheduleId}`,
      {
        data: payload,
      }
    )
  ),
})
