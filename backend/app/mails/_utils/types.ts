export type DefaultProps = {
  language: string
  email: string
}
type FC<P extends DefaultProps = DefaultProps> = (props: P) => React.JSX.Element
export type EmailComponent<P extends DefaultProps = DefaultProps> = FC<P> & {
  subject: (language: string) => string
  PreviewProps?: P
}
