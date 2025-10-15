type NextSCParams = {
  lang: string;
};
type NextPageSC<
  Params extends Record<string, unknown> = unknown,
  Props extends Record<string, unknown> = unknown,
  Search extends Record<string, unknown> = unknown,
> = (
  props: {
    params: Promise<Params & { lang: string }>;
    searchParams: Promise<Search>;
  } & Props,
) => Promise<JSX.Element>;
type NextSC<
  Params extends Record<string, unknown> = unknown,
  Props extends Record<string, unknown> = unknown,
> = (
  props: { params: Promise<Params & { lang: string }> } & Props,
) => Promise<JSX.Element>;
type NextLayoutSC<
  Params extends Record<string, unknown> = unknown,
  Props extends Record<string, unknown> = unknown,
> = (
  props: {
    params: Promise<Params & { lang: string }>;
    children: React.ReactNode;
  } & Props,
) => Promise<JSX.Element>;
