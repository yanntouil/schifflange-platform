"use client"

import { Dialog } from "@/components/dialog"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/localize"
import { Form, useForm } from "@compo/form"
import { A, D, O, pipe } from "@mobily/ts-belt"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import React from "react"
import { CookieCategory, useCookies } from "../.."
import { cookieDeclarations } from "../../config"
import { dictionary } from "../../dictionary"
import { FormSwitch } from "../form/switch"
import { Switch } from "../ui/switch"
import { badgeVariants } from "../variants"

/**
 * ConsentDialog
 */
export const ManagePreferences = () => {
  const { _ } = useTranslation(dictionary)
  const { setPreferences, preferences } = useCookies()

  return (
    <Dialog
      open={preferences}
      onOpenChange={setPreferences}
      title={_("manage-preferences.title")}
      description={_("manage-preferences.description")}
    >
      <ManagePreferencesForm onOpenChange={setPreferences} />
    </Dialog>
  )
}

const ManagePreferencesForm = ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {
  const { _ } = useTranslation(dictionary)

  const categories = [...cookieDeclarations.categories]
  const { consent, acceptAll, rejectAll, setConsent, setIsConsented } = useCookies()
  console.log(consent)
  const form = useForm({
    values: React.useMemo(
      () => ({
        ...consent,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    ),
    onSubmit: ({ values }) => {
      setConsent(values)
      onOpenChange(false)
      setIsConsented(true)
    },
  })

  // categories switch
  const onCheckedChange = (value: boolean, category: CookieCategory) =>
    value
      ? form.setValues(
          D.merge(
            form.values,
            pipe(
              [...cookieDeclarations.apps],
              A.filterMap((app) => (A.includes(app.categories, category) ? ([app.name, true] as const) : O.None)),
              D.fromPairs
            )
          )
        )
      : form.setValues(
          D.merge(
            form.values,
            pipe(
              [...cookieDeclarations.apps],
              A.filterMap((app) =>
                A.includes(app.categories, category) ? ([app.name, app.required] as const) : O.None
              ),
              D.fromPairs
            )
          )
        )
  const isChecked = (category: CookieCategory) =>
    pipe(
      cookieDeclarations.apps,
      A.filter((app) => A.includes(app.categories, category)),
      A.every((app) => form.values[app.name])
    )

  return (
    <Form.Root form={form}>
      <AccordionPrimitive.Root type='single' defaultValue={categories[0]} collapsible className='flex flex-col gap-4'>
        {categories.map((category) => (
          <Category
            key={category}
            category={category}
            checked={isChecked(category)}
            onCheckedChange={(value) => onCheckedChange(value, category)}
          />
        ))}
        <div className='flex flex-wrap justify-center gap-4 sm:justify-between'>
          <div className='flex flex-wrap justify-center gap-4 sm:justify-start'>
            <Button
              scheme='outline'
              onClick={() => {
                acceptAll()
                onOpenChange(false)
              }}
            >
              {_("manage-preferences.accept-all")}
            </Button>
            <Button
              scheme='outline'
              onClick={() => {
                rejectAll()
                onOpenChange(false)
              }}
            >
              {_("manage-preferences.reject-all")}
            </Button>
          </div>
          <Button type='submit'>{_("manage-preferences.save")}</Button>
        </div>
      </AccordionPrimitive.Root>
    </Form.Root>
  )
}

const Category = ({
  category,
  checked,
  onCheckedChange,
}: {
  category: CookieCategory
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) => {
  const { _ } = useTranslation(dictionary)
  const apps = cookieDeclarations.apps.filter((app) => A.includes(app.categories, category))
  const required = React.useMemo(
    () =>
      pipe(
        [...cookieDeclarations.apps],
        A.filter((app) => A.includes(app.categories, category)),
        A.every((app) => app.required)
      ),
    [category]
  )
  if (A.isEmpty(apps)) return null
  return (
    <AccordionPrimitive.Item className='rounded-md border border-[#E5D2B9]' value={category}>
      <AccordionPrimitive.Header className='flex flex-wrap items-center gap-2 p-4'>
        <AccordionPrimitive.Trigger className='flex grow gap-4 text-sm font-semibold tracking-wide [&[data-state=open]_svg:last-child]:rotate-180 cursor-pointer'>
          <span
            className='flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F3EADE] border border-[#E5D2B9]'
            aria-hidden
          >
            <ChevronDown className='size-3.5 stroke-[1.5] transition-transform duration-200' />
          </span>
          {_(`categories.${category}.title`)}
        </AccordionPrimitive.Trigger>
        <div className='flex grow items-center justify-end gap-2'>
          {required && <span className={badgeVariants()}>{_("manage-preferences.required")}</span>}
          <Switch size='sm' checked={checked} onCheckedChange={onCheckedChange} disabled={required} />
        </div>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className='flex flex-col overflow-hidden text-sm transition-all data-[state=open]:border-t border-[#E5D2B9]'>
        <div className='flex flex-col gap-4 p-4'>
          <p className='leading-tight text-muted-foreground'>{_(`categories.${category}.description`)}</p>
          {apps.map((app) => (
            <App key={app.name} app={app} />
          ))}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

const App = ({ app }: { app: (typeof cookieDeclarations)["apps"][number] }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <div className='flex flex-col gap-2 py-2'>
      <FormSwitch
        name={app.name}
        label={_(`apps.${app.name}.title`)}
        disabled={app.required}
        badge={_("manage-preferences.required")}
      />
      <p className='leading-tight text-muted-foreground'>{_(`apps.${app.name}.description`)}</p>
    </div>
  )
}
