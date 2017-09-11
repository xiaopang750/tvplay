import waterfall from 'async/waterfall';
import curry from 'ramda/src/curry';
import {fetch} from '../fetch';
import {buildPlayStreams} from '../util';

const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';

const getBodyStr = curry((url, cb) => {
  fetch({
    url,
    headers: {
      'User-Agent': IPAD_UA
    }
  }, (bodyStr) => {
    cb(null, bodyStr);
  });
});

const getParams = curry((bodyStr, cb) => {
  let vid;
  let err = null;
  try {
    vid = bodyStr.match(/var\s?webcfg\s?=\s?.+(id|vid)":([^,]+)/)[2];
  } catch (e) {
    err = 'step:getVidFromBodyStr 获取 vid失败';
  }
  cb(err, vid);
});

const getPlayInfo = curry((vid, cb) => {
  fetch({
    url: `http://web-play.pptv.com/webplay3-0-${vid}.xml?type=web.fpp&version=4`
  }, (playInfo) => {
    cb(null, playInfo);
  });
});

const parsePlayInfo = curry((playInfo, cb) => {
  const mp4Lists = [];
  let err = null;
  let sumDuration;
  try {
    let files = playInfo.match(/item\srid="([^"]+).mp4[^>]+/gi);
    let dragdatas = playInfo.match(/<dragdata.+/gi);
    let shs = playInfo.match(/<sh>[^<]+/gi);
    let keys = playInfo.match(/<key[^<]+/gi);
    sumDuration = dragdatas[0].match(/du="(\d+(\.\d+)?)"/)[1];
    sumDuration = parseInt(sumDuration, 10);
    for (let i = 0; i < files.length; i += 1) {
      let segs = {};
      let file = files[i];
      let rid = file.match(/rid="([^"]+.mp4)/)[1];
      let ft = parseInt(file.match(/ft="(\d+)/)[1], 10);
      let sh = shs[ft].replace('<sh>', '');
      let key = keys[ft].match(/>(.+)/)[1];
      let dragdata = dragdatas[ft];
      let parts = dragdata.match(/no="\d+"/gi);
      let durations = dragdata.match(/dur="\d+\.?\d+"/gi);
      let playUrls = [];
      for (let k = 0; k < parts.length; k += 1) {
        let json = {};
        let part = parts[k].match(/\d+/)[0];
        let duration = durations[k].match(/\d+\.?\d+/)[0];
        let url = `http://${sh}/${part}/${rid}?key=&k=${key}&fpp.ver=1.3.0.4&type=web.fpp`;
        json.url = url;
        json.duration = duration;
        playUrls.push(json);
      }
      segs.bittype = ft + 1;
      segs.url = playUrls;
      mp4Lists.push(segs);
    }
  } catch (e) {
    err = `多段视频获取失败 ${e.message}`;
  }
  let {definitions, highestDefintion} = buildPlayStreams(mp4Lists);
  cb(null, {
    err,
    definitions,
    highestDefintion,
    duration: sumDuration
  });
});

const getDefinitions = (url, cb) => {
  waterfall([
    getBodyStr(url),
    getParams(),
    getPlayInfo(),
    parsePlayInfo()
  ], (err, result) => {
    cb(err, {
      multiVideoDefintions: result
    });
  });
};

export {
  getDefinitions
};
