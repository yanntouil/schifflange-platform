import { cx, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { Blocks, LayoutPanelTop, Newspaper, Presentation } from "lucide-react"
import React from "react"

/**
 * RessourceIcon
 */
export const ResourceIcon: React.FC<{ model: Api.SlugModel; className?: string }> = ({ model, className }) =>
  match(model)
    .with("page", () => <LayoutPanelTop className={cx("text-primary-background", className)} />)
    .with("article", () => <Newspaper className={cx("text-blue-500", className)} />)
    .with("project", () => <Presentation className={cx("text-purple-600", className)} />)
    .with("project-step", () => <Blocks className={cx("text-purple-800", className)} />)
    .exhaustive()
