import ajax, { IAjaxOptions } from './ajax';
declare function thenAjax(op: IAjaxOptions): Promise<any>;
declare function thenGet(url: string, data?: any, options?: IAjaxOptions): Promise<any>;
declare function thenPost(url: string, data?: any, options?: IAjaxOptions): Promise<any>;
declare function thenJsonp(url: string, data?: any, options?: IAjaxOptions): Promise<any>;
export { thenAjax, ajax, IAjaxOptions, thenGet, thenPost, thenJsonp };
