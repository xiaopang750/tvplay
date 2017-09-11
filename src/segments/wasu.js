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

const getPageInfoFromBodyStr = curry((bodyStr, cb) => {
  let playId;
  let playKey;
  let playUrl;
  let err = null;
  try {
    playId = bodyStr.match(/_playId\s?=\s?'(\d+)'/)[1];
    playKey = bodyStr.match(/_playKey\s?=\s?'(.+)'/)[1];
    playUrl = bodyStr.match(/_playUrl\s?=\s?'(.+)'/)[1];
  } catch (e) {
    err = `step:getPageInfo From bodyStr failed ${e.message}`;
  }
  cb(err, {
    playId,
    playKey,
    playUrl
  });
});

const getEncryptPlayInfo = curry((pageInfo, cb) => {
  let {playId, playKey, playUrl} = pageInfo;
  let tm = new Date().getTime();
  let err = null;
  fetch({
    url: `http://apiontime.wasu.cn/Auth/getVideoUrl?id=${playId}&key=${playKey}&url=${playUrl}&type=jsonp&callback=&_=${tm}`
  }, (encryptPlayInfo) => {
    try {
      encryptPlayInfo = encryptPlayInfo.match(/\("(.+)"\)/)[1];
      encryptPlayInfo = encryptPlayInfo.replace(/\\/gi, '').replace(/"/gi, '');
    } catch (e) {
      err = `获取playInfo失败 ${e.message}`;
    }
    cb(err, encryptPlayInfo);
  });
});

const getDecryptPlayInfo = curry((encryptPlayInfo, cb) => {
  fetch({
    url: `http://api.video.browser.tvall.cn:8888/video/api/play/wasu?data=${encodeURIComponent(encryptPlayInfo)}&action=parseUrl`
  }, (decryptPlayUrl) => {
    let m3u8List = [{bittype: 3, url: decryptPlayUrl}];
    let {definitions, highestDefintion} = buildPlayStreams(m3u8List);
    cb(null, {
      definitions,
      highestDefintion
    });
  });
});

const getDefinitions = (url, cb) => {
  waterfall([
    getBodyStr(url),
    getPageInfoFromBodyStr(),
    getEncryptPlayInfo(),
    getDecryptPlayInfo()
  ], (err, result) => {
    cb(err, {
      singleVideoDefintions: result
    });
  });
};

export {
  getDefinitions
};
