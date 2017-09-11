import waterfall from 'async/waterfall';
import curry from 'ramda/src/curry';
import parallel from 'async/parallel';
import {fetch} from '../fetch';
import {buildPlayStreams} from '../util';

const getVid = curry((url, cb) => {
  let vid;
  let err = null;
  try {
    vid = url.match(/(\d+).html/)[1];
  } catch (e) {
    err = `获取vid失败: ${e.message}`;
  }
  cb(err, vid);
});

const getPlayInfo = curry((vid, cb) => {
  let err = null;
  fetch({
    url: `http://pcweb.api.mgtv.com/player/video?video_id=${vid}`
  }, (playInfo) => {
    try {
      playInfo = JSON.parse(playInfo);
    } catch (e) {
      err = `获取playInfo失败: ${e.message}`;
    }
    cb(err, playInfo);
  });
});

const getTmpUrlInfos = curry((playInfo, cb) => {
  let tmpUrlsInfos = [];
  let err = null;
  try {
    let vdMap = new Map([
      ['标清', '2'],
      ['高清', '3'],
      ['超清', '4']
    ]);
    let mainInfos = playInfo.data.stream;
    for (let tmpInfo of mainInfos) {
      let json = {};
      let bittype = vdMap.get(tmpInfo.name);
      json.bittype = bittype;
      if (json.bittype && tmpInfo.url) {
        tmpUrlsInfos.push({
          tmpUrl: `http://disp.titan.mgtv.com${tmpInfo.url}`,
          bittype
        });
      }
    }
  } catch (e) {
    err = `获取tmpInfos失败 ${e.message}`;
  }
  cb(err, tmpUrlsInfos);
});

const getRealUrl = curry((tmpUrl, bittype, cb) => {
  let err = null;
  let realUrl;
  fetch({
    url: tmpUrl
  }, (playInfo) => {
    try {
      playInfo = JSON.parse(playInfo);
      realUrl = playInfo.info;
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

const getPlayAds = (url, cb) => {
  let vid = url.match(/(\d+).html/)[1];
  let err = null;
  let p = encodeURIComponent(JSON.stringify({
    _v: '1.0',
    m: {p: '4482'},
    c: {type: 23, version: '', os: '', mac: '', lt: 0, ctmid: '', anid: '', imei: '', brand: '', mn: '', ts: new Date().getTime()},
    ex: {x: 'y'}}));
  let v = encodeURIComponent(JSON.stringify({
    v: {id: parseInt(vid, 10)}
  }));
  fetch({
    url: `http://x.da.hunantv.com/m5/player?p=${p}&v=${v}`,
    headers: {
      Referer: url,
      'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    }
  }, (result) => {
    let ads = [];
    try {
      ads = result.match(/MediaFile\s[^>]+><!\[CDATA\[([^\]]+)/g);
      ads = ads ? ads.map(ad => ad.match(/<!\[CDATA\[(.+)/)[1]) : [];
    } catch (e) {
      err = `Get ads error: ${e.message}`;
    }
    cb(err, ads);
  });
};

const getDefinitions = (url, cb) => {
  waterfall([
    getVid(url),
    getPlayInfo(),
    getTmpUrlInfos(),
    getRealUrls(),
  ], (err, result) => {
    cb(err, {
      singleVideoDefintions: result
    });
  });
};

export {
  getPlayAds,
  getDefinitions
};
