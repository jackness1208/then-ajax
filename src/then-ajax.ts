import ajax, { IAjaxOptions } from './ajax';

function thenAjax(op: IAjaxOptions): Promise<any> {
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

function thenGet(url: string, data?: any, options?: IAjaxOptions) {
  return thenAjax(Object.assign({
    data,
    dataType: 'json',
    methods: 'get',
    url
  }, options));
}

function thenPost(url: string, data?: any, options?: IAjaxOptions) {
  return thenAjax(Object.assign({
    data,
    dataType: 'json',
    methods: 'post',
    url
  }, options));
}

function thenJsonp(url: string, data?: any, options?: IAjaxOptions) {
  return thenAjax(Object.assign({
    data,
    dataType: 'jsonp',
    methods: 'get',
    url
  }, options));
}

export {
  thenAjax,
  ajax,
  IAjaxOptions,
  thenGet,
  thenPost,
  thenJsonp
};
