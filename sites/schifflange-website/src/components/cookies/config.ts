import { CookieDeclaration } from "./lib/context/types"

export const cookieDeclarations = {
  domain: typeof window !== "undefined" ? window.location.hostname : "",
  path: "/",
  expiresAfterDays: 182, // 6 months
  categories: ["necessary", "preferences", "analytics", "marketing"],
  apps: [
    {
      name: "authentication",
      categories: ["necessary"],
      cookies: [],
      session: ["required-*"],
      local: ["required-*"],
      default: true,
      required: true,
    },
    {
      name: "interface",
      categories: ["preferences"],
      session: ["filters-*", "sort-*", "toggle-*", "state-*", "theme-*"],
      local: ["filters-*", "sort-*", "toggle-*", "state-*", "theme-*"],
      default: true,
      required: true,
    },
    {
      name: "linkedin", // www.linkedin.com | linkedin.com
      categories: ["marketing"],
      cookies: [
        "__cf_bm",
        "_gcl_au",
        "AMCV_14215E3D5995C57C0A495C55%40AdobeOrg",
        "bcookie",
        "bscookie",
        "dfpfpt",
        "g_state",
        "JSESSIONID",
        "lang",
        "li_gc",
        "li_theme",
        "li_theme_set",
        "lidc",
      ],
      session: [],
      local: [],
      default: true,
      required: false,
    },
  ],
} as const satisfies CookieDeclaration
