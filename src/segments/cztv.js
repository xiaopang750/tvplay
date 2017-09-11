import waterfall from 'async/waterfall';
import compose from 'async/compose';
import curry from 'ramda/src/curry';
import {fetch} from '../fetch';
import {buildPlayStreams} from '../util';

const getType = curry((url, cb) => {
  let type;
  if (url.indexOf('/vplay/') !== -1) {
    type = 'letv';
  } else {
    type = 'noraml';
  }
  cb(null, {
    type,
    url
  });
});

const getBodyStr = curry((url, cb) => {
  fetch({
    url
  }, (bodyStr) => {
    cb(null, bodyStr);
  });
});

const getVideoUrlFromHtml = (bodyStr, cb) => {
  let playUrl;
  let err = null;
  let m3u8List;
  try {
    playUrl = bodyStr.match(/video.+src="(.+)"/)[1];
  } catch (e) {
    err = `从页面获取播放地址失败 ${e.message}`;
  }
  m3u8List = [{bittype: 3, url: playUrl}];
  let {definitions, highestDefintion} = buildPlayStreams(m3u8List);
  cb(err, {
    err,
    definitions,
    highestDefintion
  });
};

const getPlayInfoFormLetvCloud = (url, cb) => {
  let err = null;
  let vid;
  let playUrl;
  let m3u8List = [];
  try {
    vid = url.match(/vplay\/(\d+).html/)[1];
  } catch (e) {
    err = `从url获取vid失败 ${e.message}`;
  }
  fetch({
    url: `http://api.cms.cztv.com/mms/out/video/playJson?id=${vid}&platid=111&splatid=1002&format=1&tkey=&domain=m.tv.cztv.com&pt=4&at=1`
  }, (playInfo) => {
    try {
      playInfo = JSON.parse(playInfo);
      playUrl = playInfo.playurl.dispatch[0].url[0].yf;
    } catch (e) {
      err = `获取letvcloud playInfo失败 ${e.message}`;
    }
    m3u8List = [{bittype: 3, url: playUrl}];
    let {definitions, highestDefintion} = buildPlayStreams(m3u8List);
    cb(err, {
      err,
      definitions,
      highestDefintion
    });
  });
};

const getResult = curry(({type, url}, cb) => {
  if (type === 'letv') {
    getPlayInfoFormLetvCloud(url, cb);
  } else {
    compose(getVideoUrlFromHtml, getBodyStr)(url, cb);
  }
});

const getDefinitions = (url, cb) => {
  waterfall([
    getType(url),
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
