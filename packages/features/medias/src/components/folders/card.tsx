import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { Ui, variants } from "@compo/ui"
import { cxm, makeBreakable } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { Folder, FolderLock } from "lucide-react"
import React from "react"
import { useMedias } from "../../medias.context"
import { FolderMenu } from "./menu"

/**
 * ItemFolder
 */
type Props = {
  item: Api.MediaFolderWithRelations
  disabled?: boolean
}

/**
 * FolderCard
 * Display a folder as a card
 */
export const FolderCard: React.FC<Props> = ({ item, disabled }) => {
  const { displayFolder, selectable, canSelectFolder } = useMedias()
  return (
    <Dashboard.Card.Root
      {...(canSelectFolder && !disabled
        ? smartClick(item, selectable, () => displayFolder(item))
        : { onClick: () => displayFolder(item) })}
      menu={<FolderMenu item={item} />}
      className={cxm("bg-muted relative aspect-square", variants.disabled({ disabled }))}
      disabled={disabled}
      canSelect={canSelectFolder}
    >
      <div
        className='absolute inset-0 flex size-full items-center justify-center p-4 pb-[72px] [&>svg]:size-12 [&>svg]:stroke-[1]'
        aria-hidden
      >
        {item.lock ? <FolderLock /> : <Folder />}
      </div>
      <Dashboard.Card.Selection
        item={item}
        // @ts-expect-error
        selectable={selectable}
        classNames={{ wrapper: "absolute top-2 left-2" }}
      />
      <div className='bg-card/90 absolute inset-x-0 bottom-0 space-y-0.5 p-4 backdrop-blur-[2px]'>
        <Dashboard.Card.Title className='line-clamp-2'>{makeBreakable(item.name)}</Dashboard.Card.Title>
        <Dashboard.Card.Menu menu={<FolderMenu item={item} />} classNames={{ wrapper: "absolute right-4 top-2" }} />
      </div>
    </Dashboard.Card.Root>
  )
}

/**
 * FolderCardSkeleton
 * Skeleton loader for folder cards during loading
 */
export const FolderCardSkeleton: React.FC = () => {
  return (
    <div className='border-border bg-muted relative aspect-square overflow-hidden rounded-lg border'>
      {/* Folder icon skeleton */}
      <div className='absolute inset-0 flex size-full items-center justify-center p-4 pb-[72px]'>
        <Ui.Skeleton className='h-12 w-12 rounded' />
      </div>

      {/* Bottom info section skeleton */}
      <div className='bg-card/90 absolute inset-x-0 bottom-0 space-y-2 p-4 backdrop-blur-[2px]'>
        {/* Title skeleton */}
        <Ui.Skeleton className='h-4 w-3/4' />
      </div>

      {/* Menu button skeleton */}
      <div className='absolute top-2 right-4'>
        <Ui.Skeleton className='h-8 w-8 rounded' />
      </div>
    </div>
  )
}
