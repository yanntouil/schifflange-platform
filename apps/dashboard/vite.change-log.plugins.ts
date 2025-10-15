import { ViteDevServer } from "vite"

/**
 * changeLog
 */
export const changeLog = () => {
  return {
    name: "reload-logger",
    configureServer: (server: ViteDevServer) => {
      server.watcher.on("change", () => changeLogMessage(server))
    },
  }
}

/**
 * helpers
 */
const changeLogMessage = (server: ViteDevServer) => {
  const address = server.httpServer?.address()
  const port = typeof address === "string" ? "0" : address?.port
  const host = typeof address === "string" ? address : address?.address === "0.0.0.0" ? "127.0.0.1" : address?.address
  const greenColor = "\x1b[32m"
  const blueColor = "\x1b[34m"
  const resetColor = "\x1b[0m"
  const message = [
    `Update at ${blueColor}${new Date().toLocaleTimeString()}${resetColor}`,
    `Server: ${greenColor}http://${host}:${port}${resetColor}`,
  ]
  if (server.config.server.hmr) message.push("Watch Mode: HMR")
  logInRectangle(message, 25, 3)
}
const stripAnsiCodes = (str: string) => {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, "")
}
const logInRectangle = (messages: string[], size = 30, padding = 1) => {
  if (!Array.isArray(messages)) messages = [messages]
  const paddingLine = " ".repeat(size)
  messages = [paddingLine, ...messages, paddingLine]
  const maxLength = Math.max(...messages.map((msg) => stripAnsiCodes(msg).length))
  const paddedLength = maxLength + padding * 2
  const topBorder = `╭${"─".repeat(paddedLength + 2)}╮`
  const bottomBorder = `╰${"─".repeat(paddedLength + 2)}╯`
  const messageLines = messages.map((msg) => {
    const strippedMsgLength = stripAnsiCodes(msg).length
    const leftPadding = " ".repeat(padding)
    const rightPadding = " ".repeat(paddedLength - strippedMsgLength - padding)
    return `│ ${leftPadding}${msg}${rightPadding} │`
  })
  const fullMessage = [topBorder, ...messageLines, bottomBorder].join("\n")
  console.log(fullMessage)
}
