import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { CreateFile, CreateFolder, CropFile, UpdateFile, UpdateFolder } from "./payload"
import { MediaFileWithRelations, MediaFolderWithContent, MediaFolderWithRelations } from "./types"

export const medias = (api: CreateApi, secure: Secure, wid: string) => ({
  // Root endpoints
  root: secure(() =>
    api.get<
      {
        folders: MediaFolderWithRelations[]
        files: MediaFileWithRelations[]
      },
      WorkspaceErrors
    >(`workspaces/${wid}/medias`)
  ),

  // Folders endpoints
  folders: {
    all: secure(() =>
      api.get<
        {
          folders: MediaFolderWithRelations[]
        },
        WorkspaceErrors
      >(`workspaces/${wid}/medias/folders`)
    ),
    create: secure((payload: CreateFolder, parentId?: string) =>
      api.post<
        {
          folder: MediaFolderWithContent
        },
        WorkspaceErrors | ValidationErrors
      >(parentId ? `workspaces/${wid}/medias/folders/${parentId}/folders` : `workspaces/${wid}/medias/folders`, {
        data: payload,
      })
    ),
    id: (folderId: string) => ({
      read: secure(() =>
        api.get<
          {
            folder: MediaFolderWithContent
          },
          WorkspaceErrors | NotFoundErrors
        >(`workspaces/${wid}/medias/folders/${folderId}`)
      ),
      update: secure((payload: UpdateFolder) =>
        api.put<
          {
            folder: MediaFolderWithContent
          },
          WorkspaceErrors | NotFoundErrors | ValidationErrors
        >(`workspaces/${wid}/medias/folders/${folderId}`, {
          method: "put",
          data: payload,
        })
      ),
      delete: secure(() =>
        api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/medias/folders/${folderId}`)
      ),
    }),
  },

  // Files endpoints
  files: {
    create: secure((payload: CreateFile, folderId?: string) =>
      api.transaction<
        {
          file: MediaFileWithRelations
        },
        WorkspaceErrors<"E_REQUEST_ENTITY_TOO_LARGE"> | ValidationErrors
      >(folderId ? `workspaces/${wid}/medias/folders/${folderId}/files` : `workspaces/${wid}/medias/files`, {
        data: payload,
        method: "post",
      })
    ),
    id: (fileId: string) => ({
      read: secure(() =>
        api.get<
          {
            file: MediaFileWithRelations
          },
          WorkspaceErrors | NotFoundErrors
        >(`workspaces/${wid}/medias/files/${fileId}`)
      ),
      update: secure((payload: UpdateFile) =>
        api.transaction<
          {
            file: MediaFileWithRelations
          },
          WorkspaceErrors | NotFoundErrors | ValidationErrors
        >(`workspaces/${wid}/medias/files/${fileId}`, {
          method: "put",
          data: payload,
        })
      ),
      delete: secure(() =>
        api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/medias/files/${fileId}`)
      ),
      copy: secure(() =>
        api.post<
          {
            file: MediaFileWithRelations
          },
          WorkspaceErrors | NotFoundErrors | ValidationErrors
        >(`workspaces/${wid}/medias/files/${fileId}`)
      ),
      crop: secure((payload: CropFile) =>
        api.put<
          {
            file: MediaFileWithRelations
          },
          WorkspaceErrors | NotFoundErrors | ValidationErrors
        >(`workspaces/${wid}/medias/files/${fileId}/crop`, {
          data: payload,
        })
      ),
      uncrop: secure(() =>
        api.delete<
          {
            file: MediaFileWithRelations
          },
          WorkspaceErrors | NotFoundErrors
        >(`workspaces/${wid}/medias/files/${fileId}/crop`)
      ),
      cropAs: secure((payload: CropFile) =>
        api.post<
          {
            file: MediaFileWithRelations
          },
          WorkspaceErrors | NotFoundErrors | ValidationErrors
        >(`workspaces/${wid}/medias/files/${fileId}/crop`, {
          data: payload,
        })
      ),
    }),
  },
})
