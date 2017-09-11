import waterfall from 'async/waterfall';
import curry from 'ramda/src/curry';
import {fetch} from '../fetch';
import {buildPlayStreams} from '../util';

const getVidFromApi = curry((url, vid, cb) => {
  let err = null;
  let urlId;
  if (!vid) {
    try {
      urlId = url.match(/videoID=(\w+)/)[1];
    } catch (e) {
      console.log(e.message);
    }
    if (!urlId) {
      try {
        urlId = url.match(/(\w+)\.shtml/)[1];
      } catch (e) {
        console.log(e.message);
      }
    }
    fetch({
      url: `http://api.cntv.cn/list/getBottomPageList?serviceId=tvcctv&id=${urlId}`
    }, (result) => {
      try {
        result = JSON.parse(result);
        vid = result.video_shared_code;
      } catch (e) {
        err = `获取vid失败 ${e.message}`;
      }
      cb(err, vid);
    });
  } else {
    cb(null, vid);
  }
});

const getVidFromPage = curry((url, cb) => {
  let vid;
  fetch({
    url
  }, (bodyStr) => {
    try {
      vid = bodyStr.match(/videoCenterId","(\w+)"/)[1];
    } catch (e) {
      console.log(`从页面获取vid失败: ${e.message}`);
    }
    cb(null, vid);
  });
});

const getVid = curry((url, cb) => {
  waterfall([
    getVidFromPage(url),
    getVidFromApi(url)
  ], cb);
});

const getResult = curry((vid, cb) => {
  let err = null;
  fetch({
    url: `http://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${vid}`
  }, (playInfo) => {
    let m3u8List;
    try {
      let data = JSON.parse(playInfo);
      let playUrl = data.hls_url;
      m3u8List = [{bittype: 3, url: playUrl}];
    } catch (e) {
      err = `获取playurl失败: ${e.message}`;
    }
    let {definitions, highestDefintion} = buildPlayStreams(m3u8List);
    cb(err, {
      err,
      definitions,
      highestDefintion
    });
  });
});

const getDefinitions = (url, cb) => {
  waterfall([
    getVid(url),
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
