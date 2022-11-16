export declare namespace InertiaNodeAdapter {
    export interface ConstructorProps {
        headers: Object;
        method: "GET" | "PUT" | "DELETE" | "UPDATE" | string;
        version?: string;
    }
    interface RenderProps {
        props: Object;
        component: string;
    }
    type OnIsInertia = (statusCode: number, headers: Object) => void;
    type onIsNotInertia = (statusCode: number, headers: Object) => void;
    export type Render = (props: RenderProps, onIsInertia: OnIsInertia, onIsNotInertia: onIsNotInertia) => void;
    export {};
}
export declare type InertiaRequest = {
    render: (params: {
        props: Object;
        component: string;
    }) => void;
    redirect: (url: string) => void;
};
