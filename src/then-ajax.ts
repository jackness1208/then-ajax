import { AjaxOptions as _AjaxOptions, ajax as _ajax } from './ajax';

export const ajax = _ajax
export interface AjaxOptions extends _AjaxOptions {

}

export function thenAjax(op: AjaxOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    let isTimeout = false;
    let timeoutKey: any;
    if (op.timeout) {
      timeoutKey = setTimeout(() => {
        isTimeout = true;
        reject(new Error('timeout'));
      }, op.timeout);
    }
    const iParam = Object.assign(op, {
      success(data: any) {
        if (isTimeout) {
          return;
        }
        clearTimeout(timeoutKey);
        resolve(data);
      },
      error(er: Error) {
        reject(er);
      }
    });
    ajax(iParam);
  });
}

export function thenGet(url: string, data?: any, options?: AjaxOptions) {
  return thenAjax(Object.assign({
    data,
    dataType: 'json',
    methods: 'get',
    url
  }, options));
}

export function thenPost(url: string, data?: any, options?: AjaxOptions) {
  return thenAjax(Object.assign({
    data,
    dataType: 'json',
    methods: 'post',
    url
  }, options));
}

export function thenJsonp(url: string, data?: any, options?: AjaxOptions) {
  return thenAjax(Object.assign({
    data,
    dataType: 'jsonp',
    methods: 'get',
    url
  }, options));
}
