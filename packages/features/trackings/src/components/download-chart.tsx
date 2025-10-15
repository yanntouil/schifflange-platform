import { useTranslation, type Translation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { ChevronDown, Download, FileImage, FileSpreadsheet } from "lucide-react"
import React from "react"

/**
 * DownloadChart
 */
export const DownloadChart: React.FC<{
  onDownloadAsImage: () => void
  onDownloadAsCsv: () => void
}> = ({ onDownloadAsImage, onDownloadAsCsv }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button size='sm' variant='outline' className=''>
          <Download aria-hidden />
          <span className='sr-only @xl:not-sr-only'>{_("export")}</span>
          <ChevronDown className='text-muted-foreground/50 !size-3 transition-transform duration-300 group-data-[state=open]:rotate-180' />
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content align='start'>
        <Ui.DropdownMenu.Item onClick={onDownloadAsImage}>
          <FileImage aria-hidden />
          {_("export-as-image")}
        </Ui.DropdownMenu.Item>
        <Ui.DropdownMenu.Item onClick={onDownloadAsCsv}>
          <FileSpreadsheet aria-hidden />
          {_("export-as-csv")}
        </Ui.DropdownMenu.Item>
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * translation
 */
const dictionary = {
  fr: {
    export: "Exporter les statistiques",
    "export-as-image": "Exporter en image",
    "export-as-csv": "Exporter en CSV",
  },
  de: {
    export: "Statistiken exportieren",
    "export-as-image": "Als Bild exportieren",
    "export-as-csv": "Als CSV exportieren",
  },
  en: {
    export: "Export statistics",
    "export-as-image": "Export as image",
    "export-as-csv": "Export as CSV",
  },
} satisfies Translation
