import { UseBoundStore } from "zustand"
import { ReadonlyStoreApi, useAuthStore } from "."

/**
 * make auth depend store
 * this function is used to make a depend store for the auth store
 * when the user is logged in, the store will be a reset to the initial state
 * @param storeHook - the store hook to make the depend store
 * @param resetFn - the reset function to reset the store
 * @returns the depend store
 */

export const makeAuthDependStore = <S extends { key: string | null } & Record<string, any>>(
  storeHook: UseBoundStore<ReadonlyStoreApi<S>>,
  resetFn: (key: string | null) => void
) => {
  const useDependentStore = (...p: Parameters<typeof storeHook>) => {
    const { me } = useAuthStore()
    const id = me?.id ?? null
    const key = storeHook.getState().key

    React.useEffect(() => {
      if (id !== key) {
        resetFn(id)
      }
    }, [id, key])

    return storeHook(...p)
  }

  return useDependentStore as UseBoundStore<ReadonlyStoreApi<S>>
}
