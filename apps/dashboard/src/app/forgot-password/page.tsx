import { useAuthStore } from "@/features/auth"
import { D } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import dashboardRouteTo from "../dashboard"
import { Done } from "./done"
import { Request } from "./request"

/**
 * Forgot Password Page
 */
const Page: React.FC = () => {
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
