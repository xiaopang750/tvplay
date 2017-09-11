import waterfall from 'async/waterfall';
import parallel from 'async/parallel';
import curry from 'ramda/src/curry';
import {fetch} from '../fetch';
import {getLetvKey} from '../decrypt';
import {buildPlayStreams} from '../util';

const getVid = curry((url, cb) => {
  let err = null;
  let vid;
  try {
    vid = url.match(/(\d+).html/)[1];
  } catch (e) {
    err = `获取vid 失败 ${e.message}`;
  }
  cb(err, vid);
});

const getLetvInfo = curry((vid, cb) => {
  let stime = new Date().getTime() / 1000;
  let err = null;
  fetch({
    url: `http://player-pc.le.com/mms/out/video/playJson.json?platid=3&splatid=304&tss=no&id=${vid}&detect=1&dvtype=1000&accessyx=1&domain=www.le.com&tkey=${getLetvKey(stime)}&devid=7F3A0FC5E1C30379ED1104DC7B6F55057AE7149B&source=1001&lang=cn&region=cn&isHttps=0`
  }, (playInfo) => {
    try {
      playInfo = JSON.parse(playInfo);
    } catch (e) {
      err = `获取playInfo失败 ${e.message}`;
    }
    cb(err, playInfo);
  });
});

const getTmpUrls = curry((playInfo, cb) => {
  let err = null;
  let tmpUrls = [];
  let vdMap = new Map([
    ['350', 1],
    ['1000', 2],
    ['1300', 3]
  ]);
  try {
    let mainInfo = playInfo.msgs.playurl;
    let domain = mainInfo.domain[0];
    for (let vd of Object.keys(mainInfo.dispatch)) {
      let info = {};
      let tail = mainInfo.dispatch[vd][0];
      let tmpUrl = `${domain}${tail}&format=1&expect=3&p1=0&p2=06&termid=2&ostype=un&hwtype=ipad&vid=${mainInfo.vid}&`;
      info.tmpUrl = tmpUrl;
      info.bittype = vdMap.get(vd);
      tmpUrls.push(info);
    }
  } catch (e) {
    err = `获取tmpUrls失败 ${e.message}`;
  }
  cb(err, tmpUrls);
});

const getRealUrl = curry((tmpUrl, bittype, cb) => {
  let err = null;
  let realUrl;
  fetch({
    url: tmpUrl
  }, (playInfo) => {
    try {
      playInfo = JSON.parse(playInfo);
      realUrl = playInfo.location;
    } catch (e) {
      err = `获取真实playInfo失败 ${e.message}`;
    }
    cb(err, {
      url: realUrl,
      bittype
    });
  });
});

const getRealUrls = curry((tmpInfos, cb) => {
  let tasks = [];
  for (let tmpInfo of tmpInfos) {
    let {tmpUrl, bittype} = tmpInfo;
    tasks.push(getRealUrl(tmpUrl, bittype));
  }
  parallel(tasks, (err, results) => {
    results = results.filter(item => item.url);
    let {definitions, highestDefintion} = buildPlayStreams(results);
    cb(null, {
      err,
      definitions,
      highestDefintion
    });
  });
});

const getDefinitions = (url, cb) => {
  waterfall([
    getVid(url),
    getLetvInfo(),
    getTmpUrls(),
    getRealUrls(),
  ], (err, result) => {
    cb(err, {
      singleVideoDefintions: result
    });
  });
};

export {
  getDefinitions
};
