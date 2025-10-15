import { extractGroupProps, extractInputProps, FormGroup, FormGroupProps, useFieldContext } from "@compo/form"
import { useMatchable, useSortable } from "@compo/hooks"
import { Translation, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { cxm, everyAreNotEmpty, oneIsNotEmpty, pipe, placeholder, S } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { Check, ChevronsUpDown, Loader2, UserRoundSearch } from "lucide-react"
import React from "react"
import { UserAvatar } from "../avatar"

/**
 * FormUserSelect
 */
export type FormSelectUserProps = FormGroupProps &
  FieldSelectUserProps & { classnames?: FormGroupProps["classNames"] & FieldSelectUserProps["classNames"] }
export const FormSelectUser: React.FC<FormSelectUserProps> = ({ users, getImageUrl, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)}>
      <FieldUserSelect {...extractInputProps(props)} users={users} getImageUrl={getImageUrl} />
    </FormGroup>
  )
}

/**
 * FieldUserSelect
 */
type FieldSelectUserProps = {
  omitUsersId?: string[]
  placeholder?: string
  disabled?: boolean
  users: Api.User[]
  getImageUrl: Api.GetImageUrl
  classNames?: {
    button?: string
    command?: string
    commandList?: string
    commandEmpty?: string
    commandGroup?: string
    commandItem?: string
  }
}
const FieldUserSelect: React.FC<FieldSelectUserProps> = ({ omitUsersId = [], users, classNames, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { value, setFieldValue, disabled: ctxDisabled, id } = useFieldContext<string | null>()
  const [open, setOpen] = React.useState(false)

  const [matchable, matchIn] = useMatchable<Api.User>(`${id}-search`, ["profile.firstname", "profile.lastname"])
  const [sortable, sortBy] = useSortable<Api.User>(
    `${id}-sort`,
    {
      firstname: [(item) => item.profile.firstname, "asc", "alphabet"],
    },
    "firstname"
  )

  // Filter out omitted users and apply search/sort
  const availableUsers = React.useMemo(() => {
    return users.filter((user) => !omitUsersId.includes(user.id))
  }, [users, omitUsersId])

  const filtered = React.useMemo(
    () => pipe(availableUsers, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [availableUsers, matchIn, matchable.search, sortBy]
  )

  const selectedUser = React.useMemo(() => {
    return availableUsers.find((user) => user.id === value)
  }, [availableUsers, value])

  // States for loading and search
  const [isSearching, setIsSearching] = React.useState(false)
  const [hasNextPage] = React.useState(false) // No pagination needed as per requirement
  const [isLoadingMore] = React.useState(false)
  const [inViewRef] = React.useState<HTMLDivElement | null>(null)

  // Update search with debounce effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      matchable.setSearch(matchable.search)
      setIsSearching(false)
    }, 300)

    if (matchable.search) {
      setIsSearching(true)
    }

    return () => clearTimeout(timeoutId)
  }, [matchable.search])

  return (
    <Ui.Popover.Root open={open} onOpenChange={setOpen}>
      <Ui.Popover.Trigger asChild>
        <Ui.Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cxm("w-full justify-between", variants.inputBackground(), classNames?.button)}
          disabled={ctxDisabled || props.disabled}
        >
          {selectedUser
            ? placeholder(
                `${selectedUser.profile.firstname} ${selectedUser.profile.lastname}`,
                _("fullname-placeholder")
              )
            : props.placeholder}
          <ChevronsUpDown className='ml-2 !size-3.5 shrink-0 opacity-50' />
        </Ui.Button>
      </Ui.Popover.Trigger>
      <Ui.Popover.Content className='w-[var(--radix-popover-trigger-width)] p-0'>
        <Ui.Command.Root className={cxm("bg-card", classNames?.command)}>
          <Ui.Command.Input
            placeholder={_("search-placeholder")}
            value={matchable.search}
            onValueChange={matchable.setSearch}
          />
          <Ui.Command.List className={classNames?.commandList}>
            {isSearching ? (
              <div className='text-muted-foreground flex items-center justify-center gap-2 px-4 py-4'>
                <Loader2 className='size-4 animate-spin' />
                <div className='text-sm'>{_("searching")}</div>
              </div>
            ) : filtered.length === 0 ? (
              <Ui.Command.Empty
                className={cxm(
                  "text-muted-foreground flex flex-col items-center justify-center gap-2 px-4 py-4",
                  classNames?.commandEmpty
                )}
              >
                <UserRoundSearch className='size-6 stroke-[1]' aria-hidden />
                <div className='text-sm'>{_("empty-result")}</div>
              </Ui.Command.Empty>
            ) : (
              <Ui.Command.Group className={classNames?.commandGroup}>
                {filtered.map((user) => (
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
                    className={cxm("flex items-center gap-3 px-3 py-2", classNames?.commandItem)}
                  >
                    <Check className={cxm("size-4 shrink-0", value === user.id ? "opacity-100" : "opacity-0")} />
                    <UserAvatar user={user} size='size-8' getImageUrl={props.getImageUrl} />
                    <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                      <div className='text-sm font-medium leading-none truncate'>
                        {placeholder(`${user.profile.firstname} ${user.profile.lastname}`, _("fullname-placeholder"))}
                      </div>
                      {oneIsNotEmpty(user.profile.position, user.profile.company) && (
                        <div className='text-xs'>
                          {user.profile.position}
                          {everyAreNotEmpty(user.profile.position, user?.profile.company) ? " - " : " "}
                          {user.profile.company}
                        </div>
                      )}
                    </div>
                  </Ui.Command.Item>
                ))}
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
} satisfies Translation
