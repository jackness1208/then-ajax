declare type callback = (...args: any[]) => any;
export interface AjaxOptions {
    data?: any;
    url?: string;
    methods?: string;
    contentType?: string;
    dataType?: string;
    async?: boolean;
    timeout?: number;
    before?: callback;
    error?: callback;
    success?: callback;
    jsonp?: string;
    jsonpcb?: string;
    withCredentials?: boolean;
}
export declare function ajax(options: AjaxOptions): void;
export {};
