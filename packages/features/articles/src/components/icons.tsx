import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { FileTextIcon, GlobeIcon, LucideProps } from "lucide-react"
import React from "react"

/**
 * ArticlesStateIcon
 */
export const ArticlesStateIcon: React.FC<{ state: Api.ArticleState } & LucideProps> = ({ state, ...props }) =>
  match(state)
    .with("published", () => <GlobeIcon aria-hidden {...props} />)
    .with("draft", () => <FileTextIcon aria-hidden {...props} />)
    .otherwise(() => <></>)
