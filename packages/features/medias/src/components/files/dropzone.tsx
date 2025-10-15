import { useDropZone } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Primitives } from "@compo/ui"
import { cxm } from "@compo/utils"
import { Files } from "lucide-react"
import React from "react"

/**
 * DropZone
 */
type DropZoneProps = { dragOver: ReturnType<typeof useDropZone>["dragOver"] }
export const DropZone: React.FC<DropZoneProps> = ({ dragOver }) => {
  const { _ } = useTranslation(dictionary)
  return dragOver ? (
    <Primitives.Portal>
      <div
        className={cxm(
          "fixed inset-4 z-[100] size-[calc(100%-2rem)] p-2 md:p-8",
          "bg-background/80 animate-in fade-in-0 backdrop-blur-sm",
          "border-accent-dark flex items-center justify-center border border-dashed"
        )}
      >
        <div className='text-muted-foreground flex flex-col items-center justify-center gap-2'>
          <Files aria-hidden className='my-8 size-12 stroke-[1]' />
          <h2 className='text-2xl font-semibold'>{_("title")}</h2>
          <p className='text-sm'>{_("description")}</p>
        </div>
      </div>
    </Primitives.Portal>
  ) : null
}

const dictionary = {
  en: {
    title: "Drop files here",
    description: "Your files will be uploaded to the current folder",
  },
  fr: {
    title: "Déposez vos fichiers ici",
    description: "Vos fichiers seront téléchargés dans le dossier actuel",
  },
  de: {
    title: "Dateien hier ablegen",
    description: "Ihre Dateien werden in den aktuellen Ordner hochgeladen",
  },
}
