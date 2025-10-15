export type FormValues = {
  props: {
    level: string
  }
  translations: Record<
    string,
    {
      props: {
        title: string
        subtitle: string
        description: string
      }
    }
  >
}
