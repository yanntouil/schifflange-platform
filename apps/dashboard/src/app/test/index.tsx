import { useTranslation } from "@compo/localize"
import React from "react"
import { EventCreationUI } from "./component"

const TestRoute: React.FC = () => {
  const { format } = useTranslation()
  const [date, setDate] = React.useState<Date | null>(null)
  return (
    <div>
      <h1>Test</h1>
      <EventCreationUI />
    </div>
  )
}

export default TestRoute
