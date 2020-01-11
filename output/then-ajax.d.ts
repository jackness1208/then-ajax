import { AjaxOptions as _AjaxOptions, ajax as _ajax } from './ajax';
export declare const ajax: typeof _ajax;
export interface AjaxOptions extends _AjaxOptions {
}
export declare function thenAjax(op: AjaxOptions): Promise<any>;
export declare function thenGet(url: string, data?: any, options?: AjaxOptions): Promise<any>;
export declare function thenPost(url: string, data?: any, options?: AjaxOptions): Promise<any>;
export declare function thenJsonp(url: string, data?: any, options?: AjaxOptions): Promise<any>;
