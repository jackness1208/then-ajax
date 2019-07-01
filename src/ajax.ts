type callback = (...args: any[]) => any;
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

function encodeData(name: string, value: any, parentName?: string) {
  let items: any[] = [];
  let iName: string;
  let iValue: any = value;
  if (parentName) {
    iName = `${parentName}[${name}]`;
  } else {
    iName = name;
  }

  if (typeof value === 'object' && value !== null) {
    items = items.concat(setObjData(value, name));
  } else {
    iName = encodeURIComponent(iName);
    iValue = encodeURIComponent(iValue);
    items.push(`${iName}=${iValue}`);
  }
  return items;
}

function setObjData(data: any, parentName?: string) {
  let arr: any[] = [];
  if (Object.prototype.toString.call(data) === '[object Array]') {
    data.forEach((value: any, i: number) => {
      arr = arr.concat(encodeData(
        typeof value === 'object' ? `${i}` : '',
        value,
        parentName
      ));
    });
  } else if (Object.prototype.toString.call(data) === '[object Object]') {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      arr = arr.concat(encodeData(key, value, parentName));
    });
  }
  return arr;
}

// 设置字符串的遍码，字符串的格式为：a=1&b=2;
function setStrData(data: string) {
  const arr = data.split('&');
  const r = [];
  arr.forEach((item) => {
    const iArr = item.split('=');
    const name = encodeURIComponent(iArr[0]);
    const value = encodeURIComponent(iArr[1]);
    r.push(`${name}=${value}`);
  });
  return arr;
}

function ajax(options: IAjaxOptions) {
  let url = options.url || '';
  const type = (options.methods || 'get').toLowerCase();
  let data = options.data || null;
  const contentType = options.contentType || '';
  const dataType = options.dataType || '';
  const async = options.async === undefined ? true : options.async;
  const timeOut = options.timeout;
  const before = options.before || (() => null);
  const error = options.error || (() => null);
  const success = options.success || (() => null);
  const jsonp = options.jsonp || 'callback';
  const jsonpcb = options.jsonpcb || '';

  let timeoutBool = false;
  let timeoutFlag: any = null;
  let xhr: any = null;

  function setData() {
    if (data) {
      if (typeof data === 'string') {
        data = setStrData(data);
      } else if (typeof data === 'object') {
        data = setObjData(data);
      }
      data = data.join('&').replace('/%20/g', '+');
      // 若是使用get方法或JSONP，则手动添加到URL中
      if (type === 'get' || dataType === 'jsonp') {
        url += url.indexOf('?') > -1 ? (url.indexOf('=') > -1 ? '&' + data : data) : '?' + data;
      }
    }
  }

  // JSONP
  function createJsonp() {
    const script = document.createElement('script');
    const timeName = new Date().getTime() + Math.round(Math.random() * 1000);

    let callbackName = `JSONP_${timeName}`;
    if (jsonpcb) {
      callbackName = jsonpcb;
    }

    window[callbackName] = (iData: any) => {
      clearTimeout(timeoutFlag);
      document.body.removeChild(script);
      success(iData);
    };
    script.src = `${url}${url.indexOf('?') > -1 ? '&' : '?'}${jsonp}=${callbackName}`;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    setTime(callbackName, script);
  }

  // XHR
  function createXHR() {
    // 由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
    // 所以创建XHR对象，需要在这里做兼容处理。
    function getXHR() {
      if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
      } else {
        let r: any;
        // 遍历IE中不同版本的ActiveX对象
        const versions = ['Microsoft', 'msxm3', 'msxml2', 'msxml1'];
        versions.forEach((ver) => {
          try {
            const version = `${ver}.XMLHTTP`;
            r = new ActiveXObject(version);
          } catch (er) {
            // empty
          }
        });
        return r;
      }
    }
    // 创建对象。
    xhr = getXHR();
    xhr.open(type, url, async);
    // 设置请求头
    if (type === 'post' && !contentType) {
      // 若是post提交，则设置content-Type 为application/x-www-four-urlencoded
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    } else if (contentType) {
      xhr.setRequestHeader('Content-Type', contentType);
    }
    // 添加监听
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (timeOut !== undefined) {
          // 由于执行abort()方法后，有可能触发onreadystatechange事件，
          // 所以设置一个timeout_bool标识，来忽略中止触发的事件。
          if (timeoutBool) {
            return;
          }
          clearTimeout(timeoutFlag);
        }
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          if (dataType === 'json') {
            success(JSON.parse(xhr.responseText));
          } else {
            success(xhr.responseText);
          }
        } else {
          error(xhr.status, xhr.statusText);
        }
      }
    };
    // 发送请求
    xhr.send(type === 'get' ? null : data);
    setTime(); // 请求超时
  }

  // 设置请求超时
  function setTime(callbackName?: string, script?: Element) {
    if (timeOut !== undefined) {
      timeoutFlag = setTimeout(() => {
        if (dataType === 'jsonp') {
          if (callbackName && script) {
            delete window[callbackName];
            document.body.removeChild(script);
          }
        } else {
          timeoutBool = true;
          if (xhr) {
            xhr.abort();
          }
        }
      }, timeOut);
    }
  }

  setData();
  before();
  if (dataType === 'jsonp') {
    createJsonp();
  } else {
    createXHR();
  }
}

export default ajax;
export {
  IAjaxOptions
};
