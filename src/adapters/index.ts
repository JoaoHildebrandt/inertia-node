export namespace InertiaNodeAdapter {
  export interface ConstructorParams {
    headers: Object;
    method: "GET" | "PUT" | "DELETE" | "UPDATE" | string;
    version?: string;
  }

  interface RenderParams {
    props: Object;
    component: string;
  }

  type OnIsInertia = (statusCode: number, headers: Object) => void;
  type onIsNotInertia = (statusCode: number, headers: Object) => void;

  export type Render = (
    props: RenderParams,
    onIsInertia: OnIsInertia,
    onIsNotInertia: onIsNotInertia
  ) => void;
}

export class InertiaNodeAdapter {
  private sharedProps = {};
  public method: "GET" | "PUT" | "DELETE" | "UPDATE" | string;
  public version: string;
  public headers: any = {};
  public statusCode = 200;
  public props: any = {};

  constructor({
    headers,
    method,
    version = "1",
  }: InertiaNodeAdapter.ConstructorParams) {
    this.version = version;
    this.headers = headers;
    this.method = method;
  }

  setHeaders(headers: any) {
    this.headers = { ...this.headers, ...headers };
  }

  setStatusCode(statusCode: any) {
    this.statusCode = statusCode;
  }

  setSharedProps(sharedProps: any) {
    this.sharedProps = { ...this.sharedProps, ...sharedProps };
  }

  makeAssetVersioning = (callback: any) => {
    if (
      this.method === "GET" &&
      this.headers["x-inertia"] &&
      this.headers["x-inertia-version"] !== this.version
    ) {
      callback();
    }
  };

  render: InertiaNodeAdapter.Render = async (
    { props, component },
    onIsInertia,
    onIsNotInertia
  ) => {
    const isInertia = this.headers["x-inertia"];
    const isPartialReload =
      this.headers["x-inertia-partial-data"] &&
      this.headers["x-inertia-partial-component"] === component;
    this.props = { ...this.sharedProps, ...props };

    const dataKey = isPartialReload
      ? this.headers["x-inertia-partial-data"].split(",")
      : Object.keys(this.props);

    for (const key of dataKey) {
      if (typeof this.props[key] === "function") {
        this.props[key] = await this.props[key]();
      } else {
        this.props[key] = this.props[key];
      }
    }

    if (isInertia) {
      onIsInertia(this.statusCode, this.headers);
    } else {
      onIsNotInertia(this.statusCode, this.headers);
    }
  };

  redirect(callback: any) {
    const statusCode = ["PUT", "PATCH", "DELETE"].includes(this.method)
      ? 303
      : 302;

    this.statusCode = statusCode;

    callback(this.headers);
  }
}