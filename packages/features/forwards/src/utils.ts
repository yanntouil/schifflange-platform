import { type Api } from "@services/dashboard"

/**
 * getSlugSeo
 */
export const getSlugSeo = (slug: Api.Slug & Api.WithModel) => {
  return (slug.model === "page" ? slug.page?.seo : slug.article?.seo) as Api.Seo
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
