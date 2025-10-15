import React from "react"
import { Done } from "./done"
import { Request } from "./request"

/**
 * Register Page
 */
const Page: React.FC = () => {
  const [step, setStep] = React.useState<"request" | "done">("request")
  if (step === "request") {
    return <Request setStepDone={() => setStep("done")} />
  }
  return <Done />
}

export default Page
