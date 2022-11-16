export declare namespace InertiaNodeAdapter {
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
    export type Render = (props: RenderParams, onIsInertia: OnIsInertia, onIsNotInertia: onIsNotInertia) => void;
    export {};
}
export declare class InertiaNodeAdapter {
    private sharedProps;
    method: "GET" | "PUT" | "DELETE" | "UPDATE" | string;
    version: string;
    headers: any;
    statusCode: number;
    props: any;
    constructor({ headers, method, version, }: InertiaNodeAdapter.ConstructorParams);
    setHeaders(headers: any): void;
    setStatusCode(statusCode: any): void;
    setSharedProps(sharedProps: any): void;
    makeAssetVersioning: (callback: any) => void;
    render: InertiaNodeAdapter.Render;
    redirect(callback: any): void;
}
