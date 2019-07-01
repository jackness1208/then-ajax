declare type callback = (...args: any[]) => any;
interface IAjaxOptions {
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
}
declare function ajax(options: IAjaxOptions): void;
export default ajax;
export { IAjaxOptions };
