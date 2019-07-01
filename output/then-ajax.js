/*!
 * then-ajax v0.1.0
 * (c) 2019 - 2019 jackness
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function encodeData(name, value, parentName) {
    var items = [];
    var iName;
    var iValue = value;
    if (parentName) {
        iName = parentName + "[" + name + "]";
    }
    else {
        iName = name;
    }
    if (typeof value === 'object' && value !== null) {
        items = items.concat(setObjData(value, name));
    }
    else {
        iName = encodeURIComponent(iName);
        iValue = encodeURIComponent(iValue);
        items.push(iName + "=" + iValue);
    }
    return items;
}
function setObjData(data, parentName) {
    var arr = [];
    if (Object.prototype.toString.call(data) === '[object Array]') {
        data.forEach(function (value, i) {
            arr = arr.concat(encodeData(typeof value === 'object' ? "" + i : '', value, parentName));
        });
    }
    else if (Object.prototype.toString.call(data) === '[object Object]') {
        Object.keys(data).forEach(function (key) {
            var value = data[key];
            arr = arr.concat(encodeData(key, value, parentName));
        });
    }
    return arr;
}
// 设置字符串的遍码，字符串的格式为：a=1&b=2;
function setStrData(data) {
    var arr = data.split('&');
    arr.forEach(function (item) {
        var iArr = item.split('=');
        var name = encodeURIComponent(iArr[0]);
        var value = encodeURIComponent(iArr[1]);
    });
    return arr;
}
function ajax(options) {
    var url = options.url || '';
    var type = (options.methods || 'get').toLowerCase();
    var data = options.data || null;
    var contentType = options.contentType || '';
    var dataType = options.dataType || '';
    var async = options.async === undefined ? true : options.async;
    var timeOut = options.timeout;
    var before = options.before || (function () { return null; });
    var error = options.error || (function () { return null; });
    var success = options.success || (function () { return null; });
    var jsonp = options.jsonp || 'callback';
    var jsonpcb = options.jsonpcb || '';
    var timeoutBool = false;
    var timeoutFlag = null;
    var xhr = null;
    function setData() {
        if (data) {
            if (typeof data === 'string') {
                data = setStrData(data);
            }
            else if (typeof data === 'object') {
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
        var script = document.createElement('script');
        var timeName = new Date().getTime() + Math.round(Math.random() * 1000);
        var callbackName = "JSONP_" + timeName;
        if (jsonpcb) {
            callbackName = jsonpcb;
        }
        window[callbackName] = function (iData) {
            clearTimeout(timeoutFlag);
            document.body.removeChild(script);
            success(iData);
        };
        script.src = "" + url + (url.indexOf('?') > -1 ? '&' : '?') + jsonp + "=" + callbackName;
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
            }
            else {
                var r_1;
                // 遍历IE中不同版本的ActiveX对象
                var versions = ['Microsoft', 'msxm3', 'msxml2', 'msxml1'];
                versions.forEach(function (ver) {
                    try {
                        var version = ver + ".XMLHTTP";
                        r_1 = new ActiveXObject(version);
                    }
                    catch (er) {
                        // empty
                    }
                });
                return r_1;
            }
        }
        // 创建对象。
        xhr = getXHR();
        xhr.open(type, url, async);
        // 设置请求头
        if (type === 'post' && !contentType) {
            // 若是post提交，则设置content-Type 为application/x-www-four-urlencoded
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
        else if (contentType) {
            xhr.setRequestHeader('Content-Type', contentType);
        }
        // 添加监听
        xhr.onreadystatechange = function () {
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
                    }
                    else {
                        success(xhr.responseText);
                    }
                }
                else {
                    error(xhr.status, xhr.statusText);
                }
            }
        };
        // 发送请求
        xhr.send(type === 'get' ? null : data);
        setTime(); // 请求超时
    }
    // 设置请求超时
    function setTime(callbackName, script) {
        if (timeOut !== undefined) {
            timeoutFlag = setTimeout(function () {
                if (dataType === 'jsonp') {
                    if (callbackName && script) {
                        delete window[callbackName];
                        document.body.removeChild(script);
                    }
                }
                else {
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
    }
    else {
        createXHR();
    }
}

function thenAjax(op) {
    return new Promise(function (resolve, reject) {
        var iParam = Object.assign(op, {
            success: function (data) {
                resolve(data);
            },
            error: function (er) {
                reject(er);
            },
        });
        ajax(iParam);
    });
}
function thenGet(url, data, options) {
    return thenAjax(Object.assign({
        data: data,
        dataType: 'json',
        methods: 'get',
        url: url,
    }, options));
}
function thenPost(url, data, options) {
    return thenAjax(Object.assign({
        data: data,
        dataType: 'json',
        methods: 'post',
        url: url,
    }, options));
}
function thenJsonp(url, data, options) {
    return thenAjax(Object.assign({
        data: data,
        dataType: 'jsonp',
        methods: 'get',
        url: url,
    }, options));
}

exports.ajax = ajax;
exports.default = thenAjax;
exports.thenAjax = thenAjax;
exports.thenGet = thenGet;
exports.thenJsonp = thenJsonp;
exports.thenPost = thenPost;
