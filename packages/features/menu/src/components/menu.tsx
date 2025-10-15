import React from "react"
import { useMenu } from "../menu.context"
import { Footer } from "./menu/footer"
import { Header } from "./menu/header"

/**
 * Menu
 * This component is used to organize and manage menu items
 */
export const Menu: React.FC = () => {
  const { swr } = useMenu()
  const { menu } = swr

  return (
    <>
      {menu.location === "header" && <Header />}
      {menu.location === "footer" && <Footer />}
    </>
  )
}
