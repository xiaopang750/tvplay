// TODO SOHU UGC

import waterfall from 'async/waterfall';
import curry from 'ramda/src/curry';
import {fetch} from '../fetch';
import {buildPlayStreams} from '../util';

const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';

const getUid = () => {
  let t = Math.floor(768);
  let e = Math.floor(1024);
  let i = Math.floor(Math.sqrt(t * t + e * e)) || 0;
  let n = Math.round(2) || 1;
  let a = new Date().getTime() * 1000;
  let s = a + n + i + Math.round(1e3 * Math.random());
  return s;
};

const getPageInfo = curry((url, uid, cb) => {
  let vid;
  let tm = new Date().getTime();
  let err = null;
  fetch({
    url,
    headers: {
      'User-Agent': IPAD_UA
    }
  }, (bodyStr) => {
    try {
      vid = bodyStr.match(/vid[=:]"?(\d+)/)[1];
    } catch (e) {
      console.log(`获取页面 vid 失败:${e.message}`);
    }
    cb(err, {
      url,
      vid,
      uid,
      tm
    });
  });
});

const verify = curry((pageInfo, cb) => {
  let {url, tm, uid, vid} = pageInfo;
  url = url.match(/[^?]+/)[0];
  fetch({
    url: `http://z.m.tv.sohu.com/h5_cc.gif?t=${tm}&uid=${uid}&vid=${vid}&url=${encodeURIComponent(url)}&refer=&screen=768x1024&os=ios&platform=ipad&passport=&position=play_verify&op=click&details=%7B%7D&nid=`,
    headers: {
      Cookie: 'SOHUSVP=CYkfNIYACgckJayhsTAuKh2JF9MSGCv2ms4dFMXlxos',
      Referer: url,
      'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    }
  }, () => {
    cb(null, pageInfo);
  });
});

const wait = curry((time, pageInfo, cb) => {
  setTimeout(() => {
    cb(null, pageInfo);
  }, time);
});

const getPlayInfo = curry((pageInfo, cb) => {
  let {vid, uid, tm} = pageInfo;
  let err = null;
  fetch({
    url: `http://m.tv.sohu.com/phone_playinfo?callback=&vid=${vid}&site=1&appid=tv&api_key=f351515304020cad28c92f70f002261c&plat=17&sver=1.0&partner=1&uid=${uid}&muid=1487839109370793&_c=1&pt=2&qd=680&src=10150001&_=${tm}`
  }, (result) => {
    try {
      result = JSON.parse(result);
    } catch (e) {
      err = `获取playInfo 失败 ${e.message}`;
    }
    cb(err, result);
  });
});

const getResult = curry((playInfo, cb) => {
  let m3u8List = [];
  let err = null;
  try {
    let data = playInfo.data;
    let m3u8s = data.urls.m3u8;
    let vdMap = new Map([
      ['nor', '2'],
      ['hig', '3'],
      ['sup', '4'],
    ]);
    for (let sohuVd of Object.keys(m3u8s)) {
      let json = {};
      json.bittype = vdMap.get(sohuVd);
      if (json.bittype) {
        json.url = m3u8s[sohuVd][0];
        if (json.url) {
          m3u8List.push(json);
        }
      }
    }
  } catch (e) {
    err = `getResult失败 ${e.message}`;
  }
  let {definitions, highestDefintion} = buildPlayStreams(m3u8List);
  cb(err, {
    err,
    definitions,
    highestDefintion
  });
});

const getDefinitions = (url, cb) => {
  waterfall([
    getPageInfo(url, getUid()),
    verify(),
    wait(1000),
    getPlayInfo(),
    getResult()
  ], (err, result) => {
    cb(err, {
      singleVideoDefintions: result
    });
  });
};

export {
  getDefinitions
};
