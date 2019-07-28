import {thenAjax, thenJsonp } from '../../../../output/then-ajax';
import wDemo from '../../components/widget/demo/demo';
import './index.scss';
wDemo();

thenAjax({
  dataType: 'json',
  timeout: 1,
  url: 'http://www.yy.com/yyweb/user/queryUserInfo.json'
}).then((data) => {
  console.log('01 thenAjax', data);
}).catch((er) => {
  console.log('01 error', er.message);
});

thenAjax({
  data: {
    a: 2
  },
  dataType: 'json',
  url: 'http://www.yy.com/yyweb/user/queryUserInfo.json'
}).then((data) => {
  console.log('02 thenAjax', data);
}).catch((er) => {
  console.log('02 error', er);
});

thenJsonp('http://www.yy.com/yyweb/user/queryUserInfo.json').then((data) => {
  console.log('03 thenJsonp', data);
}).catch((er) => {
  console.log('03 error', er);
});

thenJsonp('http://www.yy.com/yyweb/user/queryUserInfo.json', undefined, { timeout: 1}).then((data) => {
  console.log('04 thenJsonp', data);
}).catch((er) => {
  console.log('04 error', er);
});

// thenJsonp(
//   'http://www.yy.com/yyweb/user/queryUserInfo.json',
//   undefined,
//   { jsonp: 'abc', jsonpcb: 'zxc' }
// ).then((data) => {
//   console.log('===', 'jsonp', data);
// });
