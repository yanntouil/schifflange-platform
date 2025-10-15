import { type CreateApi } from "../api"
import { Secure } from "../store"
import { AdminErrors, NotFoundErrors, WorkspaceErrors } from "../types"
import { appendQS } from "../utils"
import { Query, QueryInterval } from "./payload"
import { TracesStats } from "./types"

/**
 * trackings service
 */
export const trackings = {
  workspace: (wid: string) => (api: CreateApi, secure: Secure) => ({
    stats: secure((query: Query = {}) =>
      api.get<{ stats: { today: number; last7Days: number; lastMonth: number; ever: number } }, WorkspaceErrors>(
        appendQS(`workspaces/${wid}/trackings/traces`, query)
      )
    ),
    byBrowser: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, WorkspaceErrors>(appendQS(`workspaces/${wid}/trackings/traces/browser`, query))
    ),
    byDevice: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, WorkspaceErrors>(appendQS(`workspaces/${wid}/trackings/traces/device`, query))
    ),
    byOs: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, WorkspaceErrors>(appendQS(`workspaces/${wid}/trackings/traces/os`, query))
    ),
    byHour: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, WorkspaceErrors>(appendQS(`workspaces/${wid}/trackings/traces/hour`, query))
    ),
    byDay: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, WorkspaceErrors>(appendQS(`workspaces/${wid}/trackings/traces/day`, query))
    ),
    byWeek: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, WorkspaceErrors>(appendQS(`workspaces/${wid}/trackings/traces/week`, query))
    ),
    byMonth: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, WorkspaceErrors>(appendQS(`workspaces/${wid}/trackings/traces/month`, query))
    ),
    byYear: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, WorkspaceErrors>(appendQS(`workspaces/${wid}/trackings/traces/year`, query))
    ),
    tracking: (tid: string) => ({
      seed: secure(() => api.get<{ message: string }, WorkspaceErrors>(`workspaces/${wid}/trackings/${tid}/seed`)),
      stats: secure((query: Query = {}) =>
        api.get<
          { stats: { today: number; last7Days: number; lastMonth: number; ever: number } },
          WorkspaceErrors | NotFoundErrors
        >(appendQS(`workspaces/${wid}/trackings/${tid}`, query))
      ),
      byBrowser: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors | NotFoundErrors>(
          appendQS(`workspaces/${wid}/trackings/${tid}/browser`, query)
        )
      ),
      byDevice: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors | NotFoundErrors>(
          appendQS(`workspaces/${wid}/trackings/${tid}/device`, query)
        )
      ),
      byOs: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors | NotFoundErrors>(
          appendQS(`workspaces/${wid}/trackings/${tid}/os`, query)
        )
      ),
      byHour: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors | NotFoundErrors>(
          appendQS(`workspaces/${wid}/trackings/${tid}/hour`, query)
        )
      ),
      byDay: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors | NotFoundErrors>(
          appendQS(`workspaces/${wid}/trackings/${tid}/day`, query)
        )
      ),
      byWeek: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors | NotFoundErrors>(
          appendQS(`workspaces/${wid}/trackings/${tid}/week`, query)
        )
      ),
      byMonth: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors | NotFoundErrors>(
          appendQS(`workspaces/${wid}/trackings/${tid}/month`, query)
        )
      ),
      byYear: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors | NotFoundErrors>(
          appendQS(`workspaces/${wid}/trackings/${tid}/year`, query)
        )
      ),
    }),
    trackings: (trackingIds: string[]) => ({
      stats: (query: Query = {}) =>
        api.get<{ stats: { today: number; last7Days: number; lastMonth: number; ever: number } }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/trackings/traces`, { ...query, trackingIds })
        ),
      byBrowser: (query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/trackings/traces/browser`, { ...query, trackingIds })
        ),
      byDevice: (query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/trackings/traces/device`, { ...query, trackingIds })
        ),
      byOs: (query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/trackings/traces/os`, { ...query, trackingIds })
        ),
      byHour: (query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/trackings/traces/hour`, { ...query, trackingIds })
        ),
      byDay: (query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/trackings/traces/day`, { ...query, trackingIds })
        ),
      byWeek: (query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/trackings/traces/week`, { ...query, trackingIds })
        ),
      byMonth: (query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/trackings/traces/month`, { ...query, trackingIds })
        ),
      byYear: (query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/trackings/traces/year`, { ...query, trackingIds })
        ),
    }),
  }),
  admin: (api: CreateApi, secure: Secure) => ({
    stats: secure((query: Query = {}) =>
      api.get<{ stats: { today: number; last7Days: number; lastMonth: number; ever: number } }, AdminErrors>(
        appendQS(`admin/trackings/traces`, query)
      )
    ),
    byBrowser: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/browser`, query))
    ),
    byDevice: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/device`, query))
    ),
    byOs: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/os`, query))
    ),
    byHour: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/hour`, query))
    ),
    byDay: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/day`, query))
    ),
    byWeek: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/week`, query))
    ),
    byMonth: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/month`, query))
    ),
    byYear: secure((query: Query & QueryInterval = {}) =>
      api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/year`, query))
    ),
    tracking: (tid: string) => ({
      seed: secure(() => api.get<{ message: string }, AdminErrors | NotFoundErrors>(`admin/trackings/${tid}/seed`)),
      stats: secure((query: Query = {}) =>
        api.get<{ stats: { today: number; last7Days: number; lastMonth: number; ever: number } }, AdminErrors>(
          appendQS(`admin/trackings/${tid}`, query)
        )
      ),
      byBrowser: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors | NotFoundErrors>(appendQS(`admin/trackings/${tid}/browser`, query))
      ),
      byDevice: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors | NotFoundErrors>(appendQS(`admin/trackings/${tid}/device`, query))
      ),
      byOs: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors | NotFoundErrors>(appendQS(`admin/trackings/${tid}/os`, query))
      ),
      byHour: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors | NotFoundErrors>(appendQS(`admin/trackings/${tid}/hour`, query))
      ),
      byDay: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors | NotFoundErrors>(appendQS(`admin/trackings/${tid}/day`, query))
      ),
      byWeek: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors | NotFoundErrors>(appendQS(`admin/trackings/${tid}/week`, query))
      ),
      byMonth: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors | NotFoundErrors>(appendQS(`admin/trackings/${tid}/month`, query))
      ),
      byYear: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors | NotFoundErrors>(appendQS(`admin/trackings/${tid}/year`, query))
      ),
    }),
    trackings: (trackingIds: string[]) => ({
      stats: secure((query: Query = {}) =>
        api.get<{ stats: { today: number; last7Days: number; lastMonth: number; ever: number } }, AdminErrors>(
          appendQS(`admin/trackings/traces`, { ...query, trackingIds })
        )
      ),
      byBrowser: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors>(
          appendQS(`admin/trackings/traces/browser`, { ...query, trackingIds })
        )
      ),
      byDevice: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors>(
          appendQS(`admin/trackings/traces/device`, { ...query, trackingIds })
        )
      ),
      byOs: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/os`, { ...query, trackingIds }))
      ),
      byHour: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/hour`, { ...query, trackingIds }))
      ),
      byDay: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/day`, { ...query, trackingIds }))
      ),
      byWeek: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/week`, { ...query, trackingIds }))
      ),
      byMonth: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors>(
          appendQS(`admin/trackings/traces/month`, { ...query, trackingIds })
        )
      ),
      byYear: secure((query: Query & QueryInterval = {}) =>
        api.get<{ stats: TracesStats }, AdminErrors>(appendQS(`admin/trackings/traces/year`, { ...query, trackingIds }))
      ),
    }),
  }),
}
