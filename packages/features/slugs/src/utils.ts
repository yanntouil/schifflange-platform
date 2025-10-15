import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"

/**
 * getSlugSeo
 * return the seo associated with the slug
 */
export const getSlugSeo = (slug: Api.Slug & Api.WithModel) => {
  return getSlugResource(slug).seo
}

/**
 * getSlugResource
 * return the resource associated with the slug
 */
export const getSlugResource = (slug: Api.Slug & Api.WithModel) => {
  return match(slug)
    .with({ model: "page" }, ({ page }) => page)
    .with({ model: "article" }, ({ article }) => article)
    .with({ model: "project" }, ({ project }) => project)
    .with({ model: "project-step" }, ({ projectStep }) => projectStep)
    .exhaustive()
}

/**
 * guards
 */
export const isSlugPage = (slug: Api.Slug & Api.WithModel): slug is Api.Slug & Api.WithPage => {
  return slug.model === "page"
}
export const isSlugArticle = (slug: Api.Slug & Api.WithModel): slug is Api.Slug & Api.WithArticle => {
  return slug.model === "article"
}
export const isSlugProject = (slug: Api.Slug & Api.WithModel): slug is Api.Slug & Api.WithProject => {
  return slug.model === "project"
}
export const isSlugProjectStep = (slug: Api.Slug & Api.WithModel): slug is Api.Slug & Api.WithProjectStep => {
  return slug.model === "project-step"
}

/**
 * getSlugResourceProp
 * return the property name of the resource associated with the slug
 */
export const getSlugResourceProp = (slug: Api.Slug & Api.WithModel) => {
  return match(slug.model)
    .with("page", () => "page" as const)
    .with("article", () => "article" as const)
    .with("project", () => "project" as const)
    .with("project-step", () => "projectStep" as const)
    .exhaustive()
}

/**
 * generate a slug based on a string
 */
export const slugify = (value: string) => {
  const a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·_,:;"
  const b = "aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------"
  const p = new RegExp(a.split("").join("|"), "g")

  return value
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-/]+/g, "") // Remove all non-word characters except /
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}
