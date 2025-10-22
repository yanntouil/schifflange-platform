import { SWRSafeContact } from "./swr.contact"

/**
 * ManageContact type
 */
export type ManageContact = ReturnType<typeof useManageContact>[0]

/**
 * useManageContact
 */
export const useManageContact = (swr: SWRSafeContact) => {
  const manageFn = {
    //
  }
  const manageProps = {
    //
  }
  return [manageFn, manageProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      //
    },
  },
  fr: {
    confirm: {
      //
    },
  },
  de: {
    confirm: {
      //
    },
  },
}
