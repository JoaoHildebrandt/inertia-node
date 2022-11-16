"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.koaInertia = void 0;
const adapters_1 = require("../adapters");
const helpers_1 = require("../helpers");
const koaInertia = ({ page, version = "1" }) => ({ request, res, }, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inertiaAdapter = new adapters_1.InertiaNodeAdapter({
        method: request.method,
        headers: request.headers,
        version,
    });
    inertiaAdapter.makeAssetVersioning(() => res.writeHead(409, { "X-Inertia-Location": request.url }).end());
    const render = (params) => inertiaAdapter.render(params, () => res
        .writeHead(inertiaAdapter.statusCode, Object.assign(Object.assign({}, inertiaAdapter.headers), { "Content-Type": "application/json", "X-Inertia": "true", Vary: "Accept" }))
        .end(JSON.stringify({
        component: params.component,
        props: params.props,
        url: request.originalUrl || request.url,
        version: inertiaAdapter.version,
    })), () => res
        .writeHead(inertiaAdapter.statusCode, Object.assign(Object.assign({}, inertiaAdapter.headers), { "Content-Type": "text/html" }))
        .end(page((0, helpers_1.encodedPageProps)({
        component: params.component,
        props: params.props,
        url: request.originalUrl || request.url,
        version: inertiaAdapter.version,
    }))));
    const redirect = (url) => inertiaAdapter.redirect(() => res
        .writeHead(inertiaAdapter.statusCode, Object.assign(Object.assign({}, inertiaAdapter.headers), { Location: url }))
        .end());
    request.inertia = {
        render,
        redirect,
    };
    return yield next();
});
exports.koaInertia = koaInertia;
