# sync-jsonp

## 安装
```bash
npm install then-ajax --save
```
## 使用
```javascript
import {thenAjax, thenPost, thenGet, thenJsonp, IAjaxOptions} from 'then-ajax'
```

## api
### thenAjax(opts): Promise
- `opts.url` (string) 请求 URL
- `opts.data` (object) 数据 data, optional
- `opts.methods` (string) 请求类型 默认值 `get`, optional
- `opts.contentType` (string) header content-type, optional
- `opts.async` (boolean) async, optional
- `opts.timeout` (number) 设置超时时间, optional
- `opts.before` (function) 请求前执行函数, optional
- `opts.jsonp` (string) 设置 jsonp 默认值为 `callback`, optional
- `opts.jsonpcb` (string) 设置 jsonpcb 名称, optional

### thenGet(url, data, opts): Promise
- `url` (string) 请求 URL
- `data` (object) 数据 data, optional
- `opts` (object) 同上，略, optional

### thenPost(url, data, opts): Promise
- `url` (string) 请求 URL
- `data` (object) 数据 data, optional
- `opts` (object) 同上，略, optional

### thenJsonp(url, data, opts): Promise
- `url` (string) 请求 URL
- `data` (object) 数据 data, optional
- `opts` (object) 同上，略, optional

## example
```javascript
import syncJsonp from 'sync-jsonp';

thenAjax({
  dataType: 'json',
  url: 'http://hostname.com/path/to/api'
}).then((data) => {
  console.log('===', data);
});

thenAjax({
  data: {
    a: 2
  },
  dataType: 'json',
  url: 'http://hostname.com/path/to/api',
}).then((data) => {
  console.log('===', data);
});
```

