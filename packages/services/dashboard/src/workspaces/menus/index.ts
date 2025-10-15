import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { Create, CreateItem, ReorderItems, Update, UpdateItem } from "./payload"
import { Menu, MenuItemWithRelations, WithMenuItems } from "./types"

export const menus = (api: CreateApi, secure: Secure, wid: string) => ({
  all: secure(() => api.get<{ menus: (Menu & WithMenuItems)[] }, WorkspaceErrors>(`workspaces/${wid}/menus`)),
  create: secure((payload: Create) =>
    api.post<{ menu: Menu & WithMenuItems }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/menus`, {
      data: payload,
    })
  ),
  id: (mid: string) => ({
    read: secure(() =>
      api.get<{ menu: Menu & WithMenuItems }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/menus/${mid}`)
    ),
    update: secure((payload: Update) =>
      api.put<{ menu: Menu & WithMenuItems }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/menus/${mid}`,
        { data: payload }
      )
    ),
    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/menus/${mid}`)),
    items: {
      create: secure((payload: CreateItem) =>
        api.post<
          { item: MenuItemWithRelations; sortedIds: string[] },
          WorkspaceErrors | ValidationErrors | NotFoundErrors
        >(`workspaces/${wid}/menus/${mid}/items`, {
          data: payload,
        })
      ),
      reorder: secure((payload: ReorderItems) =>
        api.put<{ sortedIds: string[] }, WorkspaceErrors | ValidationErrors | NotFoundErrors>(
          `workspaces/${wid}/menus/${mid}/items`,
          {
            data: payload,
          }
        )
      ),
      moveIn: secure(() =>
        api.put<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/items/move`, {
          data: { menuId: mid },
        })
      ),
      id: (iid: string) => ({
        read: secure(() =>
          api.get<{ item: MenuItemWithRelations }, WorkspaceErrors | NotFoundErrors>(
            `workspaces/${wid}/menus/${mid}/items/${iid}`
          )
        ),
        update: secure((payload: UpdateItem) =>
          api.put<{ item: MenuItemWithRelations }, WorkspaceErrors | ValidationErrors | NotFoundErrors>(
            `workspaces/${wid}/menus/${mid}/items/${iid}`,
            {
              data: payload,
            }
          )
        ),
        delete: secure(() =>
          api.delete<{ sortedIds: string[] }, WorkspaceErrors | NotFoundErrors>(
            `workspaces/${wid}/menus/${mid}/items/${iid}`
          )
        ),
        reorder: secure((payload: ReorderItems) =>
          api.put<{ sortedIds: string[] }, WorkspaceErrors | ValidationErrors | NotFoundErrors>(
            `workspaces/${wid}/menus/${mid}/items/${iid}/items`,
            {
              data: payload,
            }
          )
        ),
        moveIn: secure(() =>
          api.put<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/items/move`, {
            data: { parentId: iid },
          })
        ),
      }),
    },
  }),
})
