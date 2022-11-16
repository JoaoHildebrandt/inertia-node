import Koa from "koa";
import { InertiaNodeAdapter } from "../adapters";
import { encodedPageProps } from "../helpers";
import { InertiaRequest } from "../contracts";

type KoaInertiaMiddlewareParams = {
  page: (inertiaProps: string) => string;
  version?: string;
};

declare module "koa" {
  interface Request {
    inertia: InertiaRequest;
  }
}

export const koaInertia =
  ({ page, version = "1" }: KoaInertiaMiddlewareParams) =>
  async (
    {
      request,
      res,
    }: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
    next: Koa.Next
  ): Promise<void> => {
    const inertiaAdapter = new InertiaNodeAdapter({
      method: request.method,
      headers: request.headers,
      version,
    });

    inertiaAdapter.makeAssetVersioning(() =>
      res.writeHead(409, { "X-Inertia-Location": request.url }).end()
    );

    const render = (params: { props: Object; component: string }) =>
      inertiaAdapter.render(
        params,
        () =>
          res
            .writeHead(inertiaAdapter.statusCode, {
              ...inertiaAdapter.headers,
              "Content-Type": "application/json",
              "X-Inertia": "true",
              Vary: "Accept",
            })
            .end(
              JSON.stringify({
                component: params.component,
                props: params.props,
                url: request.originalUrl || request.url,
                version: inertiaAdapter.version,
              })
            ),
        () =>
          res
            .writeHead(inertiaAdapter.statusCode, {
              ...inertiaAdapter.headers,
              "Content-Type": "text/html",
            })
            .end(
              page(
                encodedPageProps({
                  component: params.component,
                  props: params.props,
                  url: request.originalUrl || request.url,
                  version: inertiaAdapter.version,
                })
              )
            )
      );

    const redirect = (url: string) =>
      inertiaAdapter.redirect(() =>
        res
          .writeHead(inertiaAdapter.statusCode, {
            ...inertiaAdapter.headers,
            Location: url,
          })
          .end()
      );

    request.inertia = {
      render,
      redirect,
    };

    return await next();
  };
