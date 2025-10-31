import { events } from "."
import { WithContent } from "../../contents/types"
import { WithPublication } from "../../publications/types"
import { WithSchedule } from "../../schedules/types"
import { WithSeo } from "../../seos/types"
import { WithTracking } from "../../trackings/types"
import { MediaFile, Translatable, User } from "../../types"
import { WithSlug } from "../slugs/types"

export type EventState = "draft" | "published"

export type Event = {
  id: string
  props: Record<string, unknown> // props of the event defined by the frontend
  state: EventState
  categories: EventCategory[]
  createdAt: string
  createdBy: User
  updatedAt: string
  updatedBy: User
} & Translatable<EventTranslation>
export type EventTranslation = {
  languageId: string
  props: Record<string, unknown> // props of the event translation defined by the frontend
}
export type EventWithRelations = Event &
  WithSeo &
  WithContent &
  WithSchedule &
  WithSlug &
  WithTracking &
  WithPublication

export type EventCategory = {
  id: string
  order: number
  totalEvents: number
  createdAt: string
  createdBy: User
  updatedAt: string
  updatedBy: User
} & Translatable<EventCategoryTranslation>

export type WithEvents = {
  events: Event[]
}

export type EventCategoryTranslation = {
  languageId: string
  title: string
  description: string
  image: MediaFile | null
}
export type EventsService = ReturnType<typeof events>
