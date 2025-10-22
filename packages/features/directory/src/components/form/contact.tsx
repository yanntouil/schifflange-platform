import { extractGroupProps, extractInputProps, FormGroup, FormGroupProps, useFieldContext } from "@compo/form"
import { useMatchable, useSortable } from "@compo/hooks"
import { Translation, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { cxm, everyAreNotEmpty, getInitials, makeColorsFromString, pipe, placeholder, S } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { Check, ChevronsUpDown, ImageOff, Loader2, UserPlus, UserRoundSearch } from "lucide-react"
import React from "react"
import { useDirectoryService } from "../..//service.context"
import { useSwrContacts } from "../../swr.contacts"
import { ContactsCreateDialog } from "../contacts.create"

/**
 * FormContactSelect
 */
export type FormSelectContactProps = FormGroupProps &
  FieldSelectContactProps & { classnames?: FormGroupProps["classNames"] & FieldSelectContactProps["classNames"] }
export const FormSelectContact: React.FC<FormSelectContactProps> = ({ ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)}>
      <FieldContactSelect {...extractInputProps(props)} />
    </FormGroup>
  )
}

/**
 * FieldContactSelect
 */
type FieldSelectContactProps = {
  omitContactsId?: string[]
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
const FieldContactSelect: React.FC<FieldSelectContactProps> = ({ omitContactsId = [], classNames, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { value, setFieldValue, disabled: ctxDisabled, id } = useFieldContext<string | null>()
  const { contacts, append } = useSwrContacts()
  const { getImageUrl } = useDirectoryService()

  const [open, setOpen] = React.useState(false)

  const [matchable, matchIn] = useMatchable<Api.Contact>(`${id}-search`, ["firstName", "lastName"])
  const [, sortBy] = useSortable<Api.Contact>(
    `${id}-sort`,
    {
      firstname: [(item) => item.firstName, "asc", "alphabet"],
    },
    "firstname"
  )

  // Filter out omitted contacts and apply search/sort
  const availableContacts = React.useMemo(() => {
    return contacts.filter((contact) => !omitContactsId.includes(contact.id))
  }, [contacts, omitContactsId])

  const filtered = React.useMemo(
    () => pipe(availableContacts, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [availableContacts, matchIn, matchable.search, sortBy]
  )

  const selectedContact = React.useMemo(() => {
    return availableContacts.find((contact) => contact.id === value)
  }, [availableContacts, value])

  // States for loading and search
  const [isSearching, setIsSearching] = React.useState(false)

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
  const [createContact, createContactProps] = Ui.useQuickDialog<void, Api.Contact>({
    mutate: async (contact) => {
      append(contact)
      setFieldValue(contact.id)
    },
  })

  return (
    <>
      <Ui.Popover.Root open={open} onOpenChange={setOpen}>
        <Ui.Popover.Trigger asChild>
          <Ui.Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cxm("w-full justify-between", variants.inputBackground(), classNames?.button)}
            disabled={ctxDisabled || props.disabled}
          >
            {selectedContact
              ? placeholder(`${selectedContact.firstName} ${selectedContact.lastName}`, _("fullname-placeholder"))
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
                  {filtered.map((contact) => (
                    <ContactOption
                      key={contact.id}
                      contact={contact}
                      isSelected={value === contact.id}
                      onSelect={(contactId) => {
                        setFieldValue(contactId === value ? null : contactId)
                        setOpen(false)
                      }}
                      getImageUrl={getImageUrl}
                      className={classNames?.commandItem}
                    />
                  ))}
                </Ui.Command.Group>
              )}
            </Ui.Command.List>
          </Ui.Command.Root>
        </Ui.Popover.Content>
      </Ui.Popover.Root>
      <div className='flex justify-end'>
        <Ui.Button type='button' variant='ghost' size='sm' onClick={() => createContact()}>
          <UserPlus className='size-4' aria-hidden />
          {_("create-new")}
        </Ui.Button>
      </div>
      <ContactsCreateDialog {...createContactProps} noRedirect />
    </>
  )
}

/**
 * ContactOption
 */
type ContactOptionProps = {
  contact: Api.Contact
  isSelected: boolean
  onSelect: (contactId: string) => void
  getImageUrl: Api.GetImageUrl
  className?: string
}
const ContactOption: React.FC<ContactOptionProps> = ({ contact, isSelected, onSelect, getImageUrl, className }) => {
  const { _ } = useTranslation(dictionary)
  const fullName = placeholder(`${contact.firstName} ${contact.lastName}`, _("fullname-placeholder"))
  const image = getImageUrl(contact.squareImage, "thumbnail") ?? undefined
  const hasDetails = everyAreNotEmpty(contact.politicalParty, contact.emails[0]?.value)

  const { scheme } = Ui.useTheme()
  const initials = getInitials(contact.firstName, contact.lastName)
  const [light, dark] = makeColorsFromString(fullName)
  const style = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }
  return (
    <Ui.Command.Item
      value={contact.id}
      keywords={[contact.firstName, contact.lastName, fullName]}
      onSelect={() => onSelect(contact.id)}
      className={cxm("flex items-center gap-3 px-3 py-2", className)}
    >
      <Check className={cxm("size-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
      <Ui.Image src={image} alt={fullName} className='bg-muted size-8 rounded-full object-cover object-center'>
        {image ? (
          <ImageOff aria-hidden className='text-muted-foreground !size-3' />
        ) : (
          <span className='size-8 rounded-full flex items-center justify-center text-[10px] font-medium' style={style}>
            {initials}
          </span>
        )}
      </Ui.Image>
      <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
        <div className='text-sm font-medium leading-none truncate'>{fullName}</div>
        {hasDetails && (
          <div className='text-xs text-muted-foreground truncate'>
            {contact.politicalParty && <span>{contact.politicalParty}</span>}
            {everyAreNotEmpty(contact.politicalParty, contact.emails[0]?.value) && <span> • </span>}
            {contact.emails[0]?.value && <span>{contact.emails[0].value}</span>}
          </div>
        )}
      </div>
    </Ui.Command.Item>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "search-placeholder": "Rechercher un contact...",
    "fullname-placeholder": "Contact anonyme",
    "empty-result": "Aucun contact trouvé pour cette recherche",
    searching: "Recherche en cours...",
    "create-new": "Créer un nouveau contact",
  },
  en: {
    "search-placeholder": "Search a contact...",
    "fullname-placeholder": "Anonymous contact",
    "empty-result": "No contact found for this search",
    searching: "Searching...",
    "create-new": "Create a new contact",
  },
  de: {
    "search-placeholder": "Kontakt suchen...",
    "fullname-placeholder": "Anonymer Kontakt",
    "empty-result": "Kein Kontakt für diese Suche gefunden",
    searching: "Suche läuft...",
    "create-new": "Neuen Kontakt erstellen",
  },
} satisfies Translation
