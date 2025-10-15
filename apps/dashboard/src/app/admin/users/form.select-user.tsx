import { Api, service } from "@/services"
import { extractGroupProps, extractInputProps, FormGroup, FormGroupProps, useFieldContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { placeholder } from "@compo/utils"
import { Check, ChevronsUpDown, Loader2, UserRoundSearch } from "lucide-react"
import React from "react"
import { useInView } from "react-intersection-observer"
import { UserAvatar } from "./users.avatar"

/**
 * FormUserSelect
 */
export type FormSelectUserProps = FormGroupProps &
  FieldSelectUserProps & { classnames?: FormGroupProps["classNames"] & FieldSelectUserProps["classNames"] }
export const FormSelectUser: React.FC<FormSelectUserProps> = ({ ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)}>
      <FieldUserSelect {...extractInputProps(props)} />
    </FormGroup>
  )
}

/**
 * useUserSearch
 * hook for searching users with debounce and filtering
 */
const useUserSearch = (searchQuery: string, omitUsersId: string[], selectedValue?: string | null) => {
  const [users, setUsers] = React.useState<Api.Admin.User[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [hasNextPage, setHasNextPage] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [currentQuery, setCurrentQuery] = React.useState("")

  const searchUsers = React.useCallback(
    async (query: string, page: number = 1, append: boolean = false) => {
      if (page === 1) {
        setIsSearching(true)
        setCurrentQuery(query)
        setCurrentPage(1)
      } else {
        setIsLoadingMore(true)
      }

      const result = await service.admin.users.list({
        search: query.trim() || undefined,
        limit: 10,
        page,
      })

      if (page === 1) {
        setIsSearching(false)
      } else {
        setIsLoadingMore(false)
      }

      if (result.ok) {
        // Filter out omitted users and inactive users
        const filtered = result.data.users.filter((user) => user.status === "active" && !omitUsersId.includes(user.id))

        if (append) {
          setUsers((prev) => [...prev, ...filtered])
        } else {
          setUsers(filtered)
        }

        // Check if there are more pages
        setHasNextPage(result.data.users.length === 10)
        setCurrentPage(page)
      }
    },
    [omitUsersId]
  )

  const loadMore = React.useCallback(() => {
    if (!isLoadingMore && hasNextPage) {
      searchUsers(currentQuery, currentPage + 1, true)
    }
  }, [searchUsers, currentQuery, currentPage, isLoadingMore, hasNextPage])

  React.useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        searchUsers(searchQuery)
      },
      searchQuery.length > 0 ? 300 : 0
    )

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchUsers])

  // Charger les utilisateurs dès le début
  React.useEffect(() => {
    searchUsers("")
  }, [searchUsers])

  const selectedUser = React.useMemo(
    () => (selectedValue && selectedValue.trim() ? users.find((user) => user.id === selectedValue) : undefined),
    [users, selectedValue]
  )

  return { users, isSearching, isLoadingMore, hasNextPage, loadMore, selectedUser }
}

/**
 * FieldUserSelect
 */
type FieldSelectUserProps = {
  omitUsersId?: string[]
  placeholder?: string
  disabled?: boolean
  classNames?: {
    button?: string
    command?: string
    commandList?: string
    commandEmpty?: string
    commandGroup?: string
    commandItem?: string
  }
}
const FieldUserSelect: React.FC<FieldSelectUserProps> = ({ omitUsersId = [], classNames, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { value, setFieldValue, disabled: ctxDisabled } = useFieldContext<string | null>()
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const { users, isSearching, isLoadingMore, hasNextPage, loadMore, selectedUser } = useUserSearch(searchQuery, omitUsersId, value)

  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  })

  React.useEffect(() => {
    if (inView && hasNextPage && !isLoadingMore) {
      loadMore()
    }
  }, [inView, hasNextPage, isLoadingMore, loadMore])

  return (
    <Ui.Popover.Root open={open} onOpenChange={setOpen}>
      <Ui.Popover.Trigger asChild>
        <Ui.Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cxm("w-full justify-between", variants.inputBackground(), classNames?.button)}
          disabled={ctxDisabled || props.disabled}
        >
          {selectedUser
            ? placeholder(`${selectedUser.profile.firstname} ${selectedUser.profile.lastname}`, _("fullname-placeholder"))
            : props.placeholder}
          <ChevronsUpDown className="ml-2 !size-3.5 shrink-0 opacity-50" />
        </Ui.Button>
      </Ui.Popover.Trigger>
      <Ui.Popover.Content className="w-[var(--radix-popover-trigger-width)] p-0">
        <Ui.Command.Root className={cxm("bg-card", classNames?.command)}>
          <Ui.Command.Input placeholder={_("search-placeholder")} value={searchQuery} onValueChange={setSearchQuery} />
          <Ui.Command.List className={classNames?.commandList}>
            {isSearching ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 px-4 py-4">
                <div className="text-sm">{_("searching")}</div>
              </div>
            ) : users.length === 0 ? (
              <Ui.Command.Empty className="text-muted-foreground flex flex-col items-center justify-center gap-2 px-4 py-4">
                <UserRoundSearch className="size-6 stroke-[1]" aria-hidden />
                <div className="text-sm">{_("empty-result")}</div>
              </Ui.Command.Empty>
            ) : null}
            {users.length > 0 && (
              <Ui.Command.Group className={classNames?.commandGroup}>
                {users.map((user) => (
                  <Ui.Command.Item
                    key={user.id}
                    value={user.id}
                    keywords={[
                      user.profile.firstname,
                      user.profile.lastname,
                      placeholder(`${user.profile.firstname} ${user.profile.lastname}`, _("fullname-placeholder")),
                    ]}
                    onSelect={(currentValue) => {
                      setFieldValue(currentValue === value ? null : currentValue)
                      setOpen(false)
                    }}
                    className={classNames?.commandItem}
                  >
                    <Check className={cxm("mr-2 size-4", value === user.id ? "opacity-100" : "opacity-0")} />
                    <UserAvatar user={user} size="size-8" />
                    <div className="space-y-0.5">
                      <div className="text-sm leading-none font-semibold">
                        {placeholder(`${user.profile.firstname} ${user.profile.lastname}`, _("fullname-placeholder"))}
                      </div>
                      <div className="text-xs leading-none">{user.email}</div>
                    </div>
                  </Ui.Command.Item>
                ))}

                {/* Infinite scroll trigger */}
                {hasNextPage && (
                  <div ref={inViewRef} className="flex items-center justify-center p-2">
                    {isLoadingMore && (
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Loader2 className="size-4 animate-spin" />
                        {_("loading-more")}
                      </div>
                    )}
                  </div>
                )}
              </Ui.Command.Group>
            )}
          </Ui.Command.List>
        </Ui.Command.Root>
      </Ui.Popover.Content>
    </Ui.Popover.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "search-placeholder": "Rechercher un utilisateur...",
    "fullname-placeholder": "Utilisateur anonyme",
    "empty-result": "Aucun utilisateur trouvé pour cette recherche",
    searching: "Recherche en cours...",
    "loading-more": "Chargement...",
  },
  en: {
    "search-placeholder": "Search a user...",
    "fullname-placeholder": "Anonymous user",
    "empty-result": "No user found for this search",
    searching: "Searching...",
    "loading-more": "Loading...",
  },
  de: {
    "search-placeholder": "Benutzer suchen...",
    "fullname-placeholder": "Anonymer Benutzer",
    "empty-result": "Kein Benutzer für diese Suche gefunden",
    searching: "Suche läuft...",
    "loading-more": "Lädt...",
  },
}
