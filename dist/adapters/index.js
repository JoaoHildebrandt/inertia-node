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
exports.InertiaNodeAdapter = void 0;
class InertiaNodeAdapter {
    constructor({ headers, method, version = "1", }) {
        this.sharedProps = {};
        this.headers = {};
        this.statusCode = 200;
        this.props = {};
        this.makeAssetVersioning = (callback) => {
            if (this.method === "GET" &&
                this.headers["x-inertia"] &&
                this.headers["x-inertia-version"] !== this.version) {
                callback();
            }
        };
        this.render = ({ props, component }, onIsInertia, onIsNotInertia) => __awaiter(this, void 0, void 0, function* () {
            const isInertia = this.headers["x-inertia"];
            const isPartialReload = this.headers["x-inertia-partial-data"] &&
                this.headers["x-inertia-partial-component"] === component;
            this.props = Object.assign(Object.assign({}, this.sharedProps), props);
            const dataKey = isPartialReload
                ? this.headers["x-inertia-partial-data"].split(",")
                : Object.keys(this.props);
            for (const key of dataKey) {
                if (typeof this.props[key] === "function") {
                    this.props[key] = yield this.props[key]();
                }
                else {
                    this.props[key] = this.props[key];
                }
            }
            if (isInertia) {
                onIsInertia(this.statusCode, this.headers);
            }
            else {
                onIsNotInertia(this.statusCode, this.headers);
            }
        });
        this.version = version;
        this.headers = headers;
        this.method = method;
    }
    setHeaders(headers) {
        this.headers = Object.assign(Object.assign({}, this.headers), headers);
    }
    setStatusCode(statusCode) {
        this.statusCode = statusCode;
    }
    setSharedProps(sharedProps) {
        this.sharedProps = Object.assign(Object.assign({}, this.sharedProps), sharedProps);
    }
    redirect(callback) {
        const statusCode = ["PUT", "PATCH", "DELETE"].includes(this.method)
            ? 303
            : 302;
        this.statusCode = statusCode;
        callback(this.headers);
    }
}
exports.InertiaNodeAdapter = InertiaNodeAdapter;
