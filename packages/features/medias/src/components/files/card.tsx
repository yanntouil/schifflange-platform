import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useLightbox } from "@compo/lightbox"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { cxm, humanFileSize, makeBreakable } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useMedias } from "../../medias.context"
import { FileMenu } from "./menu"
import { FileThumbnail } from "./thumbnail"

/**
 * ItemFile
 */
type Props = {
  item: Api.MediaFileWithRelations
  disabled?: boolean
  selectOnClick?: boolean
  onQuickSelect?: (items: Api.MediaFileWithRelations[]) => void
}

/**
 * FileCard
 */
export const FileCard: React.FC<Props> = ({ item, disabled, onQuickSelect, selectOnClick }) => {
  const { translate } = useLanguage()
  const translated = translate(item, servicePlaceholder.mediaFile)

  const { selectable, canSelectFile } = useMedias()
  const { displayPreview, hasPreview } = useLightbox()
  return (
    <Dashboard.Card.Root
      key={item.id}
      {...(canSelectFile && !disabled
        ? smartClick(
            item,
            selectable,
            selectOnClick ? true : hasPreview(item.id) ? () => displayPreview(item.id) : undefined
          )
        : {})}
      onDoubleClick={() => onQuickSelect?.([item])}
      menu={<FileMenu item={item} />}
      className={cxm("relative aspect-square overflow-hidden border", variants.disabled({ disabled }))}
      canSelect={canSelectFile}
    >
      <FileThumbnail file={item} />

      <Dashboard.Card.Selection
        item={item}
        // @ts-expect-error
        selectable={selectable}
        classNames={{ wrapper: "absolute top-2 left-2" }}
      />
      <div className='bg-card/75 absolute inset-x-0 bottom-0 space-y-0.5 p-4 backdrop-blur-[2px]'>
        <Dashboard.Card.Title className='line-clamp-2'>{makeBreakable(translated.name)}</Dashboard.Card.Title>
        <Dashboard.Card.Description>
          {humanFileSize(item.size)} - {item.extension}
        </Dashboard.Card.Description>
        <Dashboard.Card.Menu menu={<FileMenu item={item} />} classNames={{ wrapper: "absolute right-4 top-2" }} />
      </div>
    </Dashboard.Card.Root>
  )
}

/**
 * FileCardSkeleton
 * Skeleton loader for file cards during loading
 */
export const FileCardSkeleton: React.FC = () => {
  return (
    <div className='border-border bg-card relative aspect-square overflow-hidden rounded-lg border'>
      {/* Thumbnail skeleton */}
      <div className='bg-muted absolute inset-0'>
        <Ui.Skeleton className='h-full w-full' />
      </div>

      {/* Bottom info section skeleton */}
      <div className='bg-card/75 absolute inset-x-0 bottom-0 space-y-2 p-4 backdrop-blur-[2px]'>
        {/* Title skeleton */}
        <Ui.Skeleton className='h-4 w-3/4' />

        {/* Description skeleton */}
        <Ui.Skeleton className='h-3 w-1/2' />
      </div>

      {/* Menu button skeleton */}
      <div className='absolute top-2 right-4'>
        <Ui.Skeleton className='h-8 w-8 rounded' />
      </div>
    </div>
  )
}
