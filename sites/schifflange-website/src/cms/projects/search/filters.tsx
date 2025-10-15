"use client"

import { ChevronDownSvg } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/localize"
import { A, D } from "@compo/utils"
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu"
import { type Api } from "@services/site"
import React from "react"

/**
 * Categories Filter Dropdown
 * Multi-select dropdown for filtering projects by categories
 */
interface CategoriesFilterProps {
  categories: Api.ProjectCategory[]
  selectedCategories: string[]
  onCategoriesChange: (categories: string[]) => void
}

export function CategoriesFilter({ categories, selectedCategories, onCategoriesChange }: CategoriesFilterProps) {
  const { _ } = useTranslation(dictionary)

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]
    onCategoriesChange(newCategories)
  }
  const selectedCount = selectedCategories.length

  const sortedCategories = React.useMemo(
    // sort categories by name
    () =>
      A.sort(categories, (a, b) => {
        const Asort = `${a.order}`.padStart(5, "0") + a.translations.title
        const Bsort = `${b.order}`.padStart(5, "0") + b.translations.title
        return Asort.localeCompare(Bsort)
      }),
    [categories]
  )
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button scheme='filter' size='none'>
          <span className='grow text-left'>{_("categories")}</span>
          <ChevronDownSvg className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[var(--radix-popper-anchor-width)]'>
        {categories.length === 0 ? (
          <div className='px-2 py-4 text-sm text-muted-foreground'>{_("no-categories-available")}</div>
        ) : (
          A.map(sortedCategories, (category) => (
            <DropdownMenuCheckboxItem
              key={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => handleCategoryToggle(category.id)}
            >
              {category.translations.title}
            </DropdownMenuCheckboxItem>
          ))
        )}
        {selectedCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => onCategoriesChange([])}>
              {_("categories-clear")}
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Tags Filter Dropdown
 * Multi-select dropdown for filtering projects by tags
 */
const sortedType: Api.ProjectTagType[] = ["non-formal-education", "child-family-services"]
interface TagsFilterProps {
  tags: Api.ProjectTag[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}
export function TagsFilter({ tags, selectedTags, onTagsChange }: TagsFilterProps) {
  const { _ } = useTranslation(dictionary)

  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId) ? selectedTags.filter((id) => id !== tagId) : [...selectedTags, tagId]
    onTagsChange(newTags)
  }

  const selectedCount = selectedTags.length

  const tagsByType = React.useMemo(() => {
    // group tags by type
    const tagByType = A.reduce(tags, {} as Record<Api.ProjectTagType, Api.ProjectTag[]>, (acc, tag) =>
      D.set(acc, tag.type, A.append(D.get(acc, tag.type) ?? [], tag))
    )
    // sort tags by name
    const sortedTags = D.map(tagByType, (tags) =>
      A.sort(tags, (a, b) => {
        const Asort = `${a.order}`.padStart(5, "0") + a.translations?.name
        const Bsort = `${b.order}`.padStart(5, "0") + b.translations?.name
        return Asort.localeCompare(Bsort)
      })
    )
    // sort types by name custom priority
    return A.map(sortedType, (type) => [type, sortedTags[type] ?? []] as const)
  }, [tags])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button scheme='filter' size='none'>
          <span className='grow text-left'>{_("tags")}</span>
          <ChevronDownSvg className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[var(--radix-popper-anchor-width)]'>
        {tags.length === 0 ? (
          <div className='px-2 py-4 text-sm text-muted-foreground'>{_("no-tags-available")}</div>
        ) : (
          A.map(tagsByType, ([type, tags]) => (
            <React.Fragment key={type}>
              {tags.length > 0 && (
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{_(`tag-type-${type}`)}</DropdownMenuLabel>
                  {A.map(tags, (tag) => (
                    <DropdownMenuCheckboxItem
                      key={tag.id}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={() => handleTagToggle(tag.id)}
                    >
                      {tag.translations?.name || tag.type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              )}
            </React.Fragment>
          ))
        )}
        {selectedCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => onTagsChange([])}>
              {_("tags-clear-all")}
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Years Filter Dropdown
 * Multi-select dropdown for filtering projects by publication years
 */
interface YearsFilterProps {
  years: string[]
  selectedYears: string[]
  onYearsChange: (years: string[]) => void
}

export function YearsFilter({ years, selectedYears, onYearsChange }: YearsFilterProps) {
  const { _ } = useTranslation(dictionary)

  const handleYearToggle = (year: string) => {
    const newYears = selectedYears.includes(year) ? selectedYears.filter((y) => y !== year) : [...selectedYears, year]
    onYearsChange(newYears)
  }

  const selectedCount = selectedYears.length

  // Sort years in descending order (newest first)
  const sortedYears = [...years].sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button scheme='filter' size='none'>
          <span className='grow text-left'>{_("years")}</span>
          <ChevronDownSvg className='size-4' aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[var(--radix-popper-anchor-width)]'>
        {sortedYears.length === 0 ? (
          <div className='px-2 py-4 text-sm text-muted-foreground'>{_("no-years-available")}</div>
        ) : (
          sortedYears.map((year) => (
            <DropdownMenuCheckboxItem
              key={year}
              checked={selectedYears.includes(year)}
              onCheckedChange={() => handleYearToggle(year)}
            >
              {year}
            </DropdownMenuCheckboxItem>
          ))
        )}
        {selectedCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => onYearsChange([])}>
              {_("years-clear-all")}
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    // Categories
    categories: "Action Areas",
    "no-categories-available": "No action area available",
    "categories-clear": "Clear all action areas",

    // Tags
    tags: "Target Audience",
    "tag-type-non-formal-education": "Non-formal education",
    "tag-type-child-family-services": "Child and family services",
    "no-tags-available": "No target audience available",
    "tags-clear-all": "Clear all target audiences",

    // Years
    years: "Years",
    "no-years-available": "No years available",
    "years-clear-all": "Clear all years",
  },
  fr: {
    // Categories
    categories: "Domaines d'actions",
    "no-categories-available": "Aucun domaine d'action disponible",
    "categories-clear": "Effacer toutes les domaines d'actions",

    // Tags
    tags: "Public cible",
    "tag-type-non-formal-education": "Éducation non formelle",
    "tag-type-child-family-services": "Services pour enfants et familles",
    "no-tags-available": "Aucun public cible disponible",
    "tags-clear-all": "Effacer tous les publics cibles",

    // Years
    years: "Années",
    "no-years-available": "Aucune année disponible",
    "years-clear-all": "Effacer toutes les années",
  },
  de: {
    // Categories
    categories: "Handlungsbereiche",
    "no-categories-available": "Kein Handlungsbereich verfügbar",
    "categories-clear": "Alle Handlungsbereiche löschen",

    // Tags
    tags: "Zielgruppe",
    "tag-type-non-formal-education": "Nicht-formale Bildung",
    "tag-type-child-family-services": "Kinder- und Familienleistungen",
    "no-tags-available": "Keine Zielgruppe verfügbar",
    "tags-clear-all": "Alle Zielgruppen löschen",

    // Years
    years: "Jahre",
    "no-years-available": "Keine Jahre verfügbar",
    "years-clear-all": "Alle Jahre löschen",
  },
}
