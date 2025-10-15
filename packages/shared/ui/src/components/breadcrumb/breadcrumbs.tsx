import { useMediaIsMobile } from "@compo/hooks"
import { Translation, useTranslation } from "@compo/localize"
import { A, G } from "@mobily/ts-belt"
import { ArrowLeft, ChevronsUpDown } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { Breadcrumb } from "."
import { cxm } from "@compo/utils"
import { disabledVariants } from "../../variants/disabled"
import { buttonVariants } from "../button"
import { DropdownMenu } from "../menu/dropdown-menu"
import { SrOnly } from "../sr-only"

/**
 * types
 */
export type BreadcrumbType =
  | [React.ReactNode, string] // label, internal link
  | [React.ReactNode, () => void] // label, onClick

/**
 * Breadcrumbs
 */
export type BreadcrumbsProps = {
  breadcrumbs: BreadcrumbType[]
  isLoading?: boolean
  className?: string
} & React.ComponentPropsWithoutRef<typeof Breadcrumb.Root>
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs, isLoading, className, ...props }) => {
  const { _ } = useTranslation(dictionary)

  const isMobile = useMediaIsMobile()

  if (breadcrumbs.length === 0) return <Breadcrumb.Root className={cxm("grow", className)} {...props} />
  const prev = (breadcrumbs.length >= 2 ? breadcrumbs[breadcrumbs.length - 2] : breadcrumbs[0]) as BreadcrumbType
  const first = (breadcrumbs.length >= 2 ? breadcrumbs[0] : null) as BreadcrumbType | null
  const last = breadcrumbs[breadcrumbs.length - 1] as BreadcrumbType
  const beforeLast = (breadcrumbs.length >= 3 ? breadcrumbs[breadcrumbs.length - 2] : null) as BreadcrumbType | null
  const middle: BreadcrumbType[] = breadcrumbs.length >= 4 ? breadcrumbs.slice(1, breadcrumbs.length - 2) : []
  return (
    <Breadcrumb.Root className={cxm("grow", className)} {...props}>
      {isMobile ? (
        <Breadcrumb.List className='grow [&>*>*]:grow [&>*]:grow'>
          <Breadcrumb.Item>
            <BreadcrumbsDropdown breadcrumbs={breadcrumbs}>
              <Breadcrumb.Page className='flex grow items-center gap-4'>{last[0]}</Breadcrumb.Page>
              <ChevronsUpDown className='size-4 text-muted-foreground' aria-label='Display more breadcrumbs' />
            </BreadcrumbsDropdown>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      ) : (
        <Breadcrumb.List>
          <BreadcrumbBack breadcrumb={prev} disabled={breadcrumbs.length <= 1} />
          {G.isNotNullable(first) && (
            <>
              <BreadcrumbsButtonOrLink breadcrumb={first} />
              <Breadcrumb.Separator />
            </>
          )}
          {A.isNotEmpty(middle) && (
            <>
              <Breadcrumb.Item>
                <BreadcrumbsDropdown breadcrumbs={middle}>
                  <Breadcrumb.Ellipsis className='size-4' />
                  <SrOnly>{_("more")}</SrOnly>
                </BreadcrumbsDropdown>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
            </>
          )}
          {G.isNotNullable(beforeLast) && (
            <>
              <BreadcrumbsButtonOrLink breadcrumb={beforeLast} />
              <Breadcrumb.Separator />
            </>
          )}
          <Breadcrumb.Item>
            <Breadcrumb.Page>{isLoading ? <Breadcrumb.Loading /> : last[0]}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      )}
    </Breadcrumb.Root>
  )
}

const BreadcrumbBack: React.FC<{ breadcrumb: BreadcrumbType; disabled: boolean }> = ({ breadcrumb, disabled }) => {
  const { _ } = useTranslation(dictionary)
  const [label, fnOrPath] = breadcrumb
  const Inner = (
    <>
      <ArrowLeft className='size-4' aria-hidden />
      <SrOnly>{_("back")}</SrOnly>
    </>
  )
  return (
    <Breadcrumb.Item>
      <Breadcrumb.Link
        asChild
        className={cxm(
          disabledVariants({ disabled: disabled }),
          buttonVariants({ variant: "outline", size: "xxs", icon: true }),
          "[&_svg]:size-3.5"
        )}
      >
        {G.isFunction(fnOrPath) ? (
          <button type='button' onClick={fnOrPath} disabled={disabled}>
            {Inner}
          </button>
        ) : (
          <Link to={fnOrPath}>{Inner}</Link>
        )}
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  )
}

const BreadcrumbsButtonOrLink: React.FC<{ breadcrumb: BreadcrumbType; className?: string }> = ({
  breadcrumb,
  className,
}) => {
  const [label, fnOrPath] = breadcrumb
  return (
    <Breadcrumb.Link asChild className={className}>
      {G.isFunction(fnOrPath) ? (
        <button type='button' onClick={fnOrPath}>
          {label}
        </button>
      ) : (
        <Link to={fnOrPath}>{label}</Link>
      )}
    </Breadcrumb.Link>
  )
}

const BreadcrumbsDropdown: React.FC<{ breadcrumbs: BreadcrumbType[] } & React.ComponentPropsWithoutRef<"button">> = ({
  breadcrumbs,
  className,
  children,
  ...props
}) => {
  return (
    <DropdownMenu.Quick
      align='start'
      menu={
        <>
          {A.mapWithIndex(breadcrumbs, (index, [label, link]) =>
            G.isFunction(link) ? (
              <DropdownMenu.Item key={index} onClick={link}>
                {label}
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item key={index} asChild>
                <Link to={link}>{label}</Link>
              </DropdownMenu.Item>
            )
          )}
        </>
      }
    >
      <button className={cxm("flex items-center gap-1", className)} {...props}>
        {children}
      </button>
    </DropdownMenu.Quick>
  )
}

const dictionary = {
  en: {
    back: "Back",
    more: "Display more breadcrumbs",
  },
  fr: {
    back: "Retour",
    more: "Afficher plus de chemins",
  },
  de: {
    back: "Zurück",
    more: "Mehr Pfad anzeigen",
  },
} satisfies Translation
