import { RootRoute } from "@/app"
import "@/styles/index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { AppProvider } from "./provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <RootRoute />
    </AppProvider>
  </StrictMode>
)
