import { useAuthStore } from "@/features/auth"
import { useTranslation } from "@compo/localize"
import { D } from "@compo/utils"
import React from "react"
import { useTitle } from "react-use"
import { Redirect } from "wouter"
import dashboardRouteTo from "../dashboard"
import { Done } from "./done"
import { Request } from "./request"

/**
 * Forgot Password Page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  useTitle(_("page-title"))
  const [step, setStep] = React.useState<"request" | "done">("request")
  const isAuthenticated = useAuthStore(D.prop("isAuthenticated"))
  if (isAuthenticated) {
    return <Redirect to={dashboardRouteTo()} />
  }

  if (step === "request") {
    return <Request setStepDone={() => setStep("done")} />
  }
  return <Done />
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    "page-title": "Schifflange Dashboard - Forgot Password",
  },
  fr: {
    "page-title": "Schifflange Dashboard - Mot de passe oublié",
  },
  de: {
    "page-title": "Schifflange Dashboard - Passwort vergessen",
  },
}
