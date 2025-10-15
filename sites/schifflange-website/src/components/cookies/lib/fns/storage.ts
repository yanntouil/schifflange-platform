import { A, F, O, S, T, pipe } from "@compo/utils"
import { cookieDeclarations } from "../"

/**
 * Storage
 */
export const storage =
  typeof window !== "undefined"
    ? {
        /**
         * Local storage
         */
        local: {
          get: (key: string) => localStorage.getItem(key),
          set: (key: string, value: string) => localStorage.setItem(key, value),
          delete: (key: string) => {
            if (key.includes("*")) {
              const prefix = key.replace("*", "")
              for (let i = 0; i < localStorage.length; i++) {
                const localStorageKey = localStorage.key(i)
                if (localStorageKey && localStorageKey.startsWith(prefix)) {
                  localStorage.removeItem(localStorageKey)
                }
              }
            } else {
              localStorage.removeItem(key)
            }
          },
        },

        /**
         * Session storage
         */
        session: {
          get: (key: string) => sessionStorage.getItem(key),
          set: (key: string, value: string) => sessionStorage.setItem(key, value),
          delete: (key: string) => {
            if (key.includes("*")) {
              const prefix = key.replace("*", "")
              for (let i = 0; i < sessionStorage.length; i++) {
                const sessionStorageKey = sessionStorage.key(i)
                if (sessionStorageKey && sessionStorageKey.startsWith(prefix)) {
                  sessionStorage.removeItem(sessionStorageKey)
                }
              }
            } else {
              sessionStorage.removeItem(key)
            }
          },
        },

        /**
         * Cookies
         */
        cookie: {
          get: (key: string): string | null => {
            const value = `; ${document.cookie}`
            const parts = value.split(`; ${key}=`)
            if (parts.length === 2) return parts.pop()?.split(";").shift() || null
            return null
          },
          set: (key: string, value: string) => {
            const date = T.addDays(new Date(), cookieDeclarations.expiresAfterDays)
            document.cookie = `${key}=${value}; expires=${date.toUTCString()}; path=${cookieDeclarations.path}`
          },
          delete: (key: string) => {
            if (key.includes("*")) {
              const prefix = key.replace("*", "")
              const allCookies = pipe(
                document.cookie || "",
                S.split(";"),
                A.filterMap((cookie) => S.split(cookie, "=")[0]?.trim() ?? O.None)
              )
              allCookies.forEach((cookie) => {
                if (cookie.startsWith(prefix)) {
                  document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookieDeclarations.path}`
                }
              })
            } else {
              document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookieDeclarations.path}`
            }
          },
        },
      }
    : {
        local: {
          get: F.ignore,
          set: F.ignore,
          delete: F.ignore,
        },
        session: {
          get: F.ignore,
          set: F.ignore,
          delete: F.ignore,
        },
        cookie: {
          get: F.ignore,
          set: F.ignore,
          delete: F.ignore,
        },
      }
