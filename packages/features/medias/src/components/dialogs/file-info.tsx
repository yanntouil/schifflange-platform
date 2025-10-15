import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { TranslationPopover, useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { humanFileSize } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { Captions, ClockArrowUp, Contact, FileText, Hash, LetterText, Ruler, Type } from "lucide-react"
import React from "react"

/**
 * FileInfoDialog
 * no medias provider required
 */
export const FileInfoDialog: React.FC<Ui.QuickDialogProps<Api.MediaFileWithRelations>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-xl" }}
      sticky
    >
      {item !== false && <FileInfoContent {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

export const FileInfoContent: React.FC<Ui.QuickDialogSafeProps<Api.MediaFileWithRelations>> = ({ item, close }) => {
  const { translate } = useLanguage()
  const { _, formatDistance } = useTranslation(dictionary)
  const translated = translate(item, servicePlaceholder.mediaFile)
  const relativeCreatedAt = formatDistance(item.createdAt)
  const relativeUpdatedAt = formatDistance(item.updatedAt)
  const fileExtension = item.extension?.toUpperCase() || "Unknown"
  const displayUpdatedAt = item.createdAt !== item.updatedAt

  return (
    <>
      <Dashboard.Field.Root stretch>
        <Dashboard.Field.Item
          name={_("name-label")}
          value={
            <span className='flex grow justify-between'>
              <span className='line-clamp-1'>{translated.name}</span>
              <TranslationPopover item={item} placeholder={servicePlaceholder.mediaFile} className='-my-1'>
                {(t, { displayedName }) => (
                  <div className='space-y-1.5'>
                    <h3 className='text-sm leading-none font-normal'>{displayedName}</h3>
                    <span className='text-xs leading-none font-normal'>{t.name}</span>
                  </div>
                )}
              </TranslationPopover>
            </span>
          }
          icon={<Type aria-hidden />}
        />
        <Dashboard.Field.Item
          name={_("alt-label")}
          value={
            <span className='flex grow justify-between'>
              <span className='line-clamp-1'>{translated.alt || "-"}</span>
              <TranslationPopover item={item} placeholder={servicePlaceholder.mediaFile} className='-my-1'>
                {(t, { displayedName }) => (
                  <div className='space-y-1.5'>
                    <h3 className='text-sm leading-none font-normal'>{displayedName}</h3>
                    <span className='text-xs leading-none font-normal'>{t.alt || "-"}</span>
                  </div>
                )}
              </TranslationPopover>
            </span>
          }
          icon={<LetterText aria-hidden />}
        />
        <Dashboard.Field.Item
          name={_("caption-label")}
          value={
            <span className='flex grow justify-between'>
              <span className='line-clamp-1'>{translated.caption || "-"}</span>
              <TranslationPopover item={item} placeholder={servicePlaceholder.mediaFile} className='-my-1'>
                {(t, { displayedName }) => (
                  <div className='space-y-1.5'>
                    <h3 className='text-sm leading-none font-normal'>{displayedName}</h3>
                    <span className='text-xs leading-none font-normal'>{t.caption || "-"}</span>
                  </div>
                )}
              </TranslationPopover>
            </span>
          }
          icon={<Captions aria-hidden />}
        />
        <Dashboard.Field.Item name={_("extension-label")} value={fileExtension} icon={<FileText aria-hidden />} />
        <Dashboard.Field.Item name={_("size-label")} value={humanFileSize(item.size)} icon={<Ruler aria-hidden />} />
        <Dashboard.Field.Item name={_("file-id-label")} value={`#${item.id}`} icon={<Hash aria-hidden />} />
        <Dashboard.Field.Item
          name={_("created-by-label")}
          value={
            <UserTooltip user={item.createdBy} displayUsername>
              {relativeCreatedAt}
            </UserTooltip>
          }
          icon={<Contact aria-hidden />}
        />
        {displayUpdatedAt && (
          <Dashboard.Field.Item
            name={_("updated-by-label")}
            value={
              <UserTooltip user={item.updatedBy} displayUsername>
                {relativeUpdatedAt}
              </UserTooltip>
            }
            icon={<ClockArrowUp aria-hidden />}
          />
        )}
      </Dashboard.Field.Root>
      <Ui.QuickDialogStickyFooter>
        <Ui.Button className='w-full' onClick={close}>
          {_("close")}
        </Ui.Button>
      </Ui.QuickDialogStickyFooter>
    </>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    title: "File details",
    description: "Complete information about this file, including metadata and accessibility attributes.",
    "name-label": "File name",
    "alt-label": "Alternative text",
    "caption-label": "Caption",
    "extension-label": "File type",
    "size-label": "File size",
    "file-id-label": "File ID",
    "created-by-label": "Created by",
    "updated-by-label": "Last updated by",
    close: "Close",
  },
  fr: {
    title: "Détails du fichier",
    description: "Informations complètes sur ce fichier, incluant les métadonnées et attributs d'accessibilité.",
    "name-label": "Nom du fichier",
    "alt-label": "Texte alternatif",
    "caption-label": "Légende",
    "extension-label": "Type de fichier",
    "size-label": "Taille du fichier",
    "file-id-label": "ID du fichier",
    "created-by-label": "Créé par",
    "updated-by-label": "Dernière modification par",
    close: "Fermer",
  },
  de: {
    title: "Datei-Details",
    description:
      "Vollständige Informationen zu dieser Datei, einschließlich Metadaten und Barrierefreiheitsattributen.",
    "name-label": "Dateiname",
    "alt-label": "Alternativtext",
    "caption-label": "Beschriftung",
    "extension-label": "Dateityp",
    "size-label": "Dateigröße",
    "file-id-label": "Datei-ID",
    "created-by-label": "Erstellt von",
    "updated-by-label": "Zuletzt geändert von",
    close: "Schließen",
  },
}
