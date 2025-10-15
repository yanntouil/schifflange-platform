import { cx, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { LayoutPanelTop, Newspaper } from "lucide-react"
import React from "react"

/**
 * RessourceIcon
 */
export const ResourceIcon: React.FC<{ model: Api.SlugModel; className?: string }> = ({ model, className }) =>
  match(model)
    .with("page", () => <LayoutPanelTop className={cx("text-primary-background", className)} />)
    .with("article", () => <Newspaper className={cx("text-blue-500", className)} />)
    .exhaustive()
