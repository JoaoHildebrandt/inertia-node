type InertiaHTMLPageProps = {
  version: string;
  component: string;
  props: unknown;
  url: string;
};

export const encodedPageProps = (props: InertiaHTMLPageProps) =>
  JSON.stringify(props).replace(/"/g, "&quot;").replace(/'/g, "&#039;");
