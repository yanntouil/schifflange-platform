import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Schedule from '#models/schedule'
import { luxonOrJsDate } from '#utils/date'
import { updateScheduleValidator } from '#validators/schedules'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'

/**
 * SchedulesController
 */
export default class SchedulesController {
  /**
   * update
   * update the schedule of an event
   * @put workspaces/:workspaceId/schedules/:scheduleId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { schedule: Schedule }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ request, response }: HttpContext) {
    const schedule = await Schedule.query()
      .where('id', request.param('scheduleId'))
      .preload('rules')
      .first()
    if (G.isNullable(schedule)) throw E_RESOURCE_NOT_FOUND

    const { rules, ...payload } = await request.validateUsing(updateScheduleValidator)
    await schedule.merge({ ...payload }).save()

    if (G.isNotNullable(rules)) {
      // remove each rules before to create new ones
      await Promise.all(A.map(schedule.rules, async (rule) => rule.delete()))
      await Promise.all(
        A.map(
          rules,
          async ({
            startDate,
            endDate,
            startDateTime,
            endDateTime,
            until,
            excludedDates,
            ...rule
          }) =>
            schedule.related('rules').create({
              ...rule,
              startDate: luxonOrJsDate(startDate),
              endDate: luxonOrJsDate(endDate),
              startDateTime: luxonOrJsDate(startDateTime),
              endDateTime: luxonOrJsDate(endDateTime),
              until: luxonOrJsDate(until),
              excludedDates: excludedDates ? excludedDates.map((d) => luxonOrJsDate(d)!) : [],
            })
        )
      )
      await schedule.load('rules')
    }

    response.ok({ schedule: schedule.serialize() })
  }
}
