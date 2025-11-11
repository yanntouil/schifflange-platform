import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, O } from "@compo/utils"
import { Api, useDashboardService } from "@services/dashboard"
import React from "react"
import { prepareSlide } from "../utils"

/**
 * useSlides
 * @description Prepare the slides data for the lightbox
 * @param files
 * @returns void
 */
export const useSlides = (files: Api.MediaFileWithRelations[]) => {
  const { translate } = useLanguage()
  const {
    service: { makePath },
  } = useDashboardService()
  const slides = React.useMemo(() => {
    const prepareSlideWrapper = (file: Api.MediaFileWithRelations) => {
      return prepareSlide(file, translate, makePath)
    }
    return A.filterMap(files, (file) => {
      const slide = prepareSlideWrapper(file)
      return slide || O.None
    }) as Ui.SlideData[]
  }, [files, translate, makePath])

  Ui.useSlides(slides)
}
