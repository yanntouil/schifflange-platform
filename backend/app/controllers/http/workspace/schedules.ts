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
    // "insert into `schedule_rules` (`all_day`, `by_weekday`, `end_date`, `end_date_time`, `excluded_dates`, `freq`, `id`, `interval`, `is_recurring`, `schedule_id`, `start_date`, `start_date_time`, `until`) values (false, '[]', NULL, NULL, , 'DAILY', 'af0a4ec2-9fd8-4128-82e4-eccc20b8b2c3', 1, false, '89f683dc-6888-47a0-bce2-28b13c8f2ce1', NULL, NULL, NULL) - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near ' 'DAILY', 'af0a4ec2-9fd8-4128-82e4-eccc20b8b2c3', 1, false, '89f683dc-6888-47...' at line 1"

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
