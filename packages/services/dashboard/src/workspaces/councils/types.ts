import { councils } from "."
import { MediaFileWithRelations, Translatable, User } from "../../types"
import { Video } from "../../videos/types"

export type Council = {
  id: string
  files: MediaFileWithRelations[]
  date: string // isoDate
  video: Video
  createdAt: string // isoDate
  createdBy: User | null
  updatedAt: string // isoDate
  updatedBy: User | null
} & Translatable<CouncilTranslation>

export type CouncilTranslation = {
  languageId: string
  report: MediaFileWithRelations | null
  agenda: string
}
export type CouncilsService = ReturnType<typeof councils>
