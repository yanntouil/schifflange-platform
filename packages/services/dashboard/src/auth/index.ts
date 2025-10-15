import { type CreateApi } from "../api"
import { notifications } from "../notifications"
import { type Secure } from "../store"
import type {
  AuthErrors,
  AuthPayload,
  CommonErrors,
  Language,
  Me,
  NoContent,
  NotFoundErrors,
  UserSession,
  ValidationErrors,
} from "../types"

/**
 * service
 */
export const auth = (api: CreateApi, secure: Secure) => ({
  notifications: notifications(api, secure),
  login: secure((payload: AuthPayload.Login) =>
    api.post<
      { user: Me; session: UserSession },
      | CommonErrors<"E_INVALID_CREDENTIALS" | "E_ACCOUNT_NOT_ACTIVE" | "E_ACCOUNT_DELETED" | "E_ACCOUNT_SUSPENDED">
      | ValidationErrors
    >("auth/login", { data: payload })
  ),
  register: secure((payload: AuthPayload.Register) =>
    api.post<NoContent, CommonErrors | ValidationErrors>("auth/register", {
      data: payload,
    })
  ),
  logout: secure(() => api.post<NoContent, AuthErrors>("auth/logout")),
  session: secure(() =>
    api.get<
      { auth: true; user: Me; session: UserSession; languages: Language[] } | { auth: false; languages: Language[] },
      CommonErrors
    >("auth/session")
  ),
  sessions: secure(() => api.get<{ sessions: UserSession[] }, AuthErrors>("auth/sessions")),
  deactivateSession: secure((id: string) => api.delete<NoContent, AuthErrors | NotFoundErrors>("auth/sessions/" + id)),
  verifyToken: secure((payload: AuthPayload.VerifyToken) =>
    api.post<
      { user: Me; session: UserSession; type: string },
      CommonErrors<"E_INVALID_TOKEN" | "E_TOKEN_EXPIRED"> | ValidationErrors
    >("auth/verify-token", { data: payload })
  ),
  update: secure((payload: AuthPayload.Update) =>
    api.put<{ user: Me }, AuthErrors<"E_UNAUTHORIZED_ACCESS"> | ValidationErrors>("auth", {
      data: payload,
    })
  ),
  delete: secure(() => api.delete<NoContent, AuthErrors>("auth")),
  updateProfile: secure((payload: AuthPayload.UpdateProfile) =>
    api.transaction<{ user: Me }, AuthErrors<"E_UNAUTHORIZED_ACCESS"> | ValidationErrors>("auth/profile", {
      method: "put",
      data: payload,
    })
  ),
  forgotPassword: secure((payload: AuthPayload.ForgotPassword) =>
    api.post<NoContent, CommonErrors & ValidationErrors>("auth/forgot-password", { data: payload })
  ),
})
