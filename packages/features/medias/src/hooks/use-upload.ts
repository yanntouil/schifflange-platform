import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A } from "@compo/utils"
import { useMedias } from "../medias.context"
import { useMediasService } from "../service.context"

/**
 * useUpload
 */
export const useUpload = () => {
  const { _ } = useTranslation(dictionary)
  const { swr } = useMedias()
  const { service } = useMediasService()
  const folderId = swr.folderId || undefined
  return async (files: File[]) => {
    if (A.isEmpty(files)) return

    const total = files.length
    let successCount = 0
    let errorCount = 0
    const errors: { name: string; reason: "too-large" | "failed" }[] = []

    const toastId = Ui.toast.loading(_("progress", { counter: 0, total }))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const counter = i + 1

      const result = await service.files.create({ file }, folderId)

      if (result.failed) {
        errorCount++
        const reason = result.except?.name === "E_REQUEST_ENTITY_TOO_LARGE" ? "too-large" : "failed"
        errors.push({ name: file.name, reason })
      } else {
        successCount++
        swr.appendFile(result.data.file)
      }

      // Update progress (but not on last item)
      if (counter < total) {
        Ui.toast.loading(_("progress", { counter, total }), { id: toastId })
      }
    }

    // Dismiss loading toast
    Ui.toast.dismiss(toastId)

    // Show final result
    if (errorCount === 0) {
      Ui.toast.success(_("success"))
    } else if (successCount === 0) {
      Ui.toast.error(_("error"))
    } else {
      // Partial success
      Ui.toast.success(_("partial-success", { success: successCount, total }))
    }

    // Show specific errors
    if (errors.length > 0) {
      const tooLargeFiles = errors.filter((e) => e.reason === "too-large")
      const failedFiles = errors.filter((e) => e.reason === "failed")

      if (tooLargeFiles.length > 0) {
        const names = tooLargeFiles
          .slice(0, 3)
          .map((e) => e.name)
          .join(", ")
        const more = tooLargeFiles.length > 3 ? ` +${tooLargeFiles.length - 3}` : ""
        Ui.toast.error(_("error-too-large"), { description: names + more })
      }

      if (failedFiles.length > 0) {
        const names = failedFiles
          .slice(0, 3)
          .map((e) => e.name)
          .join(", ")
        const more = failedFiles.length > 3 ? ` +${failedFiles.length - 3}` : ""
        Ui.toast.error(_("partial-error"), { description: names + more })
      }
    }
  }
}

const dictionary = {
  en: {
    progress: "Uploading {{counter}} / {{total}} files",
    success: "All files uploaded successfully",
    error: "Failed to upload files",
    "partial-success": "{{success}} of {{total}} files uploaded successfully",
    "partial-error": "Some files could not be uploaded",
    "error-too-large": "Files too large to upload",
  },
  fr: {
    progress: "Import de {{counter}} / {{total}} fichiers",
    success: "Tous les fichiers ont été importés avec succès",
    error: "Échec de l'import des fichiers",
    "partial-success": "{{success}} fichiers sur {{total}} importés avec succès",
    "partial-error": "Certains fichiers n'ont pas pu être importés",
    "error-too-large": "Fichiers trop volumineux pour être importés",
  },
  de: {
    progress: "Lade {{counter}} / {{total}} Dateien hoch",
    success: "Alle Dateien erfolgreich hochgeladen",
    error: "Fehler beim Hochladen der Dateien",
    "partial-success": "{{success}} von {{total}} Dateien erfolgreich hochgeladen",
    "partial-error": "Einige Dateien konnten nicht hochgeladen werden",
    "error-too-large": "Dateien zu groß zum Hochladen",
  },
}
