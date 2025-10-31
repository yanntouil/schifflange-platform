import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { FileTextIcon, GlobeIcon, LucideProps } from "lucide-react"
import React from "react"

/**
 * EventStateIcon
 */
export const EventStateIcon: React.FC<{ state: Api.EventState } & LucideProps> = ({ state, ...props }) =>
  match(state)
    .with("published", () => <GlobeIcon aria-hidden {...props} />)
    .with("draft", () => <FileTextIcon aria-hidden {...props} />)
    .otherwise(() => <></>)
