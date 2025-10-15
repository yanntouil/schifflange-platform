import { Api, service } from "@/services"
import { Ui } from "@compo/ui"
import { makeColorsFromString } from "@compo/utils"
import { Layers2 } from "lucide-react"
import React from "react"

/**
 * WorkspaceAvatar
 * display the avatar of the workspace
 */
export const WorkspaceAvatar: React.FC<{
  workspace: Api.Workspace
  classNames?: { wrapper?: string; image?: string; fallback?: string }
  size?: string
}> = ({ workspace, classNames, size = "size-8" }) => {
  const { id, name, image } = workspace
  const initial = name[0]?.toUpperCase()
  const [light, dark] = makeColorsFromString(name ?? id)
  const { scheme } = Ui.useTheme()
  const style = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }
  const imageCx = cxm("rounded-sm flex-none", size)
  return (
    <Ui.Image
      src={service.getImageUrl(image, "thumbnail") as string}
      classNames={{ wrapper: cxm(imageCx, classNames?.wrapper), image: cxm(imageCx, classNames?.image) }}
      alt={name}
    >
      <span className={cxm(imageCx, "flex items-center justify-center text-[10px] font-medium", classNames?.fallback)} style={style}>
        {initial ?? <Layers2 className="size-3" aria-hidden />}
      </span>
    </Ui.Image>
  )
}
