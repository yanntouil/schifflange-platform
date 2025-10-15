import { useAuthStore } from "@/features/auth/store"

export const useAuth = () => {
  const { isInit, isAuthenticated, me, session } = useAuthStore()
  if (!isInit) throw new Error("Auth store is not initialized")
  if (!isAuthenticated || !me || !session) throw new Error("User is not authenticated")
  return { me, session }
}
