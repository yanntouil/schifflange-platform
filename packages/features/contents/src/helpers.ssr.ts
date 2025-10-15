import { A, G, O } from "@compo/utils"
import { Api } from "@services/site"

/**
 * async helpers
 */
export const asyncHelpers = {
  extractFile: (
    item: { files: (Api.MediaFile & { translations: Api.MediaFileTranslations })[] },
    id: Option<string>
  ) => {
    const file = A.find(item.files, (file) => file.id === id)
    return file ? file : O.None
  },
  extractFiles: (
    item: { files: (Api.MediaFile & { translations: Api.MediaFileTranslations })[] },
    ids: Option<string>[]
  ) => {
    return A.filterMap(ids, (id) => (G.isNotNullable(id) ? asyncHelpers.extractFile(item, id) : O.None))
  },
}
