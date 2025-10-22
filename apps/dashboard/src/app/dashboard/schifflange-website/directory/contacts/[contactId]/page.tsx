import { Dashboard } from "@compo/dashboard"
import { Contact, ContactProvider, SWRSafeContact } from "@compo/directory"
import React from "react"

/**
 * contact detail page
 */
const Page: React.FC<{ swr: SWRSafeContact }> = ({ swr }) => {
  return (
    <Dashboard.Container>
      <ContactProvider swr={swr}>
        <Contact />
      </ContactProvider>
    </Dashboard.Container>
  )
}

export default Page
