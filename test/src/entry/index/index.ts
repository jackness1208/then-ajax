import {thenAjax, thenJsonp } from '../../../../output/then-ajax';
import wDemo from '../../components/widget/demo/demo';
import './index.scss';
wDemo();

thenAjax({
  dataType: 'json',
  url: 'http://www.yy.com/yyweb/user/queryUserInfo.json'
}).then((data) => {
  console.log('===', data);
});

thenAjax({
  data: {
    a: 2
  },
  dataType: 'json',
  url: 'http://www.yy.com/yyweb/user/queryUserInfo.json',
}).then((data) => {
  console.log('===', data);
});

thenJsonp('http://www.yy.com/yyweb/user/queryUserInfo.json').then((data) => {
  console.log('===', 'jsonp', data);
});

thenJsonp(
  'http://www.yy.com/yyweb/user/queryUserInfo.json',
  undefined,
  { jsonp: 'abc', jsonpcb: 'zxc' }
).then((data) => {
  console.log('===', 'jsonp', data);
});
