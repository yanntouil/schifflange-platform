import { useTranslation } from "@compo/localize"
import React from "react"
import { useTitle } from "react-use"
import { Done } from "./done"
import { Request } from "./request"

/**
 * Register Page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  useTitle(_("page-title"))
  const [step, setStep] = React.useState<"request" | "done">("request")
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
    "page-title": "Schifflange Dashboard - Register",
  },
  fr: {
    "page-title": "Schifflange Dashboard - Inscription",
  },
  de: {
    "page-title": "Schifflange Dashboard - Registrierung",
  },
}
