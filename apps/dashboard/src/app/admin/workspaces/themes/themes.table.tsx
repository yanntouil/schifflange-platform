import { Api, service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, placeholder } from "@compo/utils"
import { getCoreRowModel, Row, useReactTable, type ColumnDef } from "@tanstack/react-table"
import React from "react"
import { useThemes } from "./context"
import { themesStore, useThemesStore } from "./store"
import { ThemeMenu } from "./themes.menu"

type ThemesTableProps = {
  themes: Api.Admin.WorkspaceTheme[]
}

/**
 * ThemesTable
 * display a table of themes with a menu and a checkbox (tanstack table)
 */
export const ThemesTable: React.FC<ThemesTableProps> = ({ themes }) => {
  const { _ } = useTranslation(dictionary)
  const columnSizing = Dashboard.useTableColumnSizing(
    useThemesStore((state) => state.columnSizing),
    themesStore.actions.setColumnSizing
  )
  const table = useReactTable<DataItem>({
    data: useData(themes),
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnSizing: columnSizing.state,
    },
    onColumnSizingChange: columnSizing.onChange,
    defaultColumn: Dashboard.makeColumnSize(),
    initialState: {
      columnPinning: {
        right: ["menu"],
      },
      columnSizing: columnSizing.initial,
    },
  })
  const { selectable } = useThemes()
  return (
    <Dashboard.Table.Tanstack table={table} t={_}>
      {(row) => (
        <Dashboard.Table.Row
          key={row.id}
          menu={<ThemeMenu theme={row.original.theme} />}
          item={row.original.theme}
          selectable={selectable}
          {...smartClick(row.original.theme, selectable)}
          cells={row.getVisibleCells()}
        />
      )}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * prepare data and data types
 */
const useData = (themes: Api.Admin.WorkspaceTheme[]) =>
  React.useMemo(
    () =>
      A.map(themes, (theme) => ({
        id: theme.id,
        theme,
      })),
    [themes]
  )
type DataItem = ReturnType<typeof useData>[number]
type ColumnProps = { row: Row<DataItem> }

/**
 * configure columns rendering
 */
const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useThemes()
  return <Dashboard.Table.Checkbox item={row.original.theme} selectable={selectable} />
}

const ColumnName: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { theme } = row.original
  const name = placeholder(theme.name, _("name-placeholder"))
  return (
    <div className="flex items-center gap-3">
      <Ui.Image
        className="bg-muted size-8 overflow-hidden rounded-lg"
        src={service.getImageUrl(theme.image, "thumbnail") ?? undefined}
        alt={theme.name}
      />
      <div className="grow space-y-0.5 truncate">
        <div className="text-foreground font-medium">{name}</div>
        {/* <div className="text-muted-foreground line-clamp-1 text-xs">{placeholder(theme.description, _("description-placeholder"))}</div> */}
      </div>
    </div>
  )
}

const ColumnDefault: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { theme } = row.original
  return (
    theme.isDefault && (
      <Ui.Badge variant="default" className="ml-2 text-xs">
        {_("default")}
      </Ui.Badge>
    )
  )
}

/**
 * define columns
 */
const columns: ColumnDef<DataItem>[] = [
  {
    id: "select",
    cell: ({ row }) => <ColumnSelect row={row} />,
    size: 28,
    enableResizing: false,
  },
  {
    header: "name-label",
    id: "name",
    cell: ({ row }) => <ColumnName row={row} />,
    size: 400,
    minSize: 200,
    maxSize: 2400,
  },
  {
    id: "default",
    cell: ({ row }) => <ColumnDefault row={row} />,
    ...Dashboard.makeColumnSize({ size: 60 }),
  },
  {
    id: "menu",
    cell: ({ row }) => <Dashboard.Table.Menu menu={<ThemeMenu theme={row.original.theme} />} />,
    size: 56,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "name-label": "Theme",
    "name-placeholder": "Unnamed theme",
    "description-placeholder": "No description",
    "default-label": "Default theme",
    default: "Default",
  },
  fr: {
    "name-label": "Thème",
    "name-placeholder": "Thème sans nom",
    "description-placeholder": "Aucune description",
    "default-label": "Thème par défaut",
    default: "Défaut",
  },
  de: {
    "name-label": "Thema",
    "name-placeholder": "Unbenanntes Thema",
    "description-placeholder": "Keine Beschreibung",
    "default-label": "Standard-Thema",
    default: "Standard",
  },
}
