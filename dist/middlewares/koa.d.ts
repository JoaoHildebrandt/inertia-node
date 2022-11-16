import Koa from "koa";
import { InertiaRequest } from "../contracts";
declare type KoaInertiaMiddlewareParams = {
    page: (inertiaProps: string) => string;
    version?: string;
};
declare module "koa" {
    interface Request {
        inertia: InertiaRequest;
    }
}
export declare const koaInertia: ({ page, version }: KoaInertiaMiddlewareParams) => ({ request, res, }: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => Promise<void>;
export {};
