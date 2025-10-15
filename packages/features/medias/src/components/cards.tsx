import { A, cxm } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { FileCard, FileCardSkeleton } from "./files/card"
import { FolderCard, FolderCardSkeleton } from "./folders/card"

/**
 * Cards
 * Display a list of files and folders as cards
 */
export const Cards: React.FC<{
  files: Api.MediaFileWithRelations[]
  folders: Api.MediaFolderWithRelations[]
  className?: string
  disabledIds?: string[]
  hiddenIds?: string[]
  selectOnClick?: boolean
  onQuickSelect?: (items: Api.MediaFileWithRelations[]) => void
}> = ({ files, folders, className, disabledIds, hiddenIds, selectOnClick, onQuickSelect }) => {
  // Memoize filtered data to avoid infinite re-renders with arrays
  const visibleFolders = React.useMemo(() => {
    if (!hiddenIds) return folders
    return A.filter(folders, (folder) => !A.includes(hiddenIds, folder.id))
  }, [folders, hiddenIds])
  const visibleFiles = React.useMemo(() => {
    if (!hiddenIds) return files
    return A.filter(files, (file) => !A.includes(hiddenIds, file.id))
  }, [files, hiddenIds])
  return (
    <div
      className={cxm(
        "grid grid-cols-1 gap-4 @xl/collection:grid-cols-2 @4xl/collection:grid-cols-3 @6xl/collection:grid-cols-4 @7xl/collection:grid-cols-5",
        className
      )}
    >
      {visibleFolders.map((folder) => (
        <FolderCard key={folder.id} item={folder} disabled={A.includes(disabledIds ?? [], folder.id)} />
      ))}
      {visibleFiles.map((file) => (
        <FileCard
          key={file.id}
          item={file}
          disabled={A.includes(disabledIds ?? [], file.id)}
          selectOnClick={selectOnClick}
          onQuickSelect={onQuickSelect}
        />
      ))}
    </div>
  )
}

/**
 * CardsSkeleton
 * Display skeleton loaders while content is loading
 */
export const CardsSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className='grid grid-cols-1 gap-4 @xl/collection:grid-cols-2 @4xl/collection:grid-cols-3 @6xl/collection:grid-cols-4 @7xl/collection:grid-cols-5'>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {/* Mix folders and files skeletons for realistic loading */}
          {index % 3 === 0 ? <FolderCardSkeleton /> : <FileCardSkeleton />}
        </React.Fragment>
      ))}
    </div>
  )
}
