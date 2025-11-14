import { match } from "@compo/utils"
import React from "react"
import { useMenu } from "../menu.context"
import { Footer } from "./menu/footer"
import { Header } from "./menu/header"
import { Top } from "./menu/top"

/**
 * Menu
 * This component is used to organize and manage menu items
 */
export const Menu: React.FC = () => {
  const { swr } = useMenu()
  const { menu } = swr

  return (
    <>
      {match(menu.location)
        .with("header", () => <Header />)
        .with("footer", () => <Footer />)
        .with("top", () => <Top />)
        .exhaustive()}
    </>
  )
}
