import waterfall from 'async/waterfall';
import compose from 'async/compose';
import parallel from 'async/parallel';
import curry from 'ramda/src/curry';
import {fetch} from '../fetch';
import {md5} from '../decrypt';

const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
const ERROR_PLAY_URL = 'http://static.hdslb.com/error.mp4';

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

const getAidFromBodyStr = ({bodyStr, token}, cb) => {
  // to match like $("#change_to_computer").attr("aid", "3034657");
  let aid;
  let err = null;
  try {
    aid = bodyStr.match(/"aid",\s?"(\d+)"/)[1];
  } catch (e) {
    err = 'step:getAidFromBodyStr movie type 获取 aid失败';
  }
  cb(err, {
    aid,
    token
  });
};

const getToken = curry((cb) => {
  let token;
  let err = null;
  fetch({
    url: 'http://bangumi.bilibili.com/web_api/get_token'
  }, (data) => {
    try {
      let jsonData = JSON.parse(data);
      token = jsonData.result.token;
    } catch (e) {
      err = 'step:getToken movie type 获取token失败';
    }
    cb(err, token);
  });
});

const getCidFromApi = ({aid, token}, cb) => {
  let cid;
  let err = null;
  fetch({
    url: 'http://bangumi.bilibili.com/web_api/get_source',
    isPost: true,
    form: {
      movie_aid: aid,
      token
    }
  }, (cidInfo) => {
    try {
      let jsonData = JSON.parse(cidInfo);
      cid = jsonData.result.cid;
    } catch (e) {
      err = 'step:getCidFromApi movie type 获取token失败';
    }
    cb(err, cid);
  });
};

const getAnimeTypeCid = (url, cb) => {
  let cid;
  let err = null;
  let episodeId = url.match(/#\d+/)[0].replace('#', '');
  fetch({
    url: `http://bangumi.bilibili.com/web_api/episode/${episodeId}.json`
  }, (data) => {
    try {
      data = JSON.parse(data);
      let info = data.result.currentEpisode;
      cid = info.danmaku;
    } catch (e) {
      err = `step:getAnimeTypeCid anime type 获取 cid 失败 ${e.message}`;
    }
    cb(err, cid);
  });
};

const getMovieTypeCid = compose(getCidFromApi, getAidFromBodyStr, curry((href, cb) => {
  parallel({
    bodyStr: getBodyStr(href),
    token: getToken()
  }, cb);
}));

const getNoramlTypeCid = (url, cb) => {
  let aid = url.match(/\d+/)[0];
  let cid;
  let err = null;
  if (/m.bilibili.com/.test(url)) {
    url = `http://www.bilibili.com/video/av${aid}`;
  }
  fetch({
    url,
    gzip: true
  }, (bodyStr) => {
    try {
      cid = bodyStr.match(/"cid=(\d+)&/)[1];
    } catch (e) {
      err = `step:getNoramlTypeCid normal type 获取 cid 失败 ${e.message}`;
    }
    cb(err, cid);
  });
};

const getCid = curry((url, getAnimeCid, getMovieCid, getNormalCid, cb) => {
  let getFn = getNormalCid;
  let configTypes = new Map([
    [/bangumi\.bilibili\.com.+anime.+/, getAnimeCid],
    [/bangumi\.bilibili\.com.+movie.+/, getMovieCid]
  ]);
  for (let [reg, getCidFn] of configTypes) {
    if (reg.test(url)) {
      getFn = getCidFn;
      break;
    }
  }
  getFn(url, cb);
});

const getPlayInfo = curry(({quality, type}, cid, cb) => {
  let err = null;
  let appkey = 'YvirImLGlLANCLvM';
  let appSecretkey = 'JNlZNgfNGKZEpaDTkCdPQVXntXhuiJEM';
  let params = `appkey=${appkey}&build=4070&buvid=3168fe38e580b16a02c2cc9beceaf6b7&cid=${cid}&device=phone&otype=json&platform=android&quality=${quality}&type=${type}`;
  let sign = md5(`${params}${appSecretkey}`);
  fetch({
    url: `http://interface.bilibili.com/playurl?${params}&sign=${sign}`
  }, (playInfo) => {
    try {
      playInfo = JSON.parse(playInfo);
    } catch (e) {
      err = `获取playInfo 失败 ${e.message}`;
    }
    cb(err, {
      cid,
      playInfo
    });
  });
});

const judgePlayInfo = curry(({playInfo, cid}, cb) => {
  // mp4是单段 flv是多段
  // 错误状态码返回null
  // 如果没有mp4 就返回多段flv
  let {code} = playInfo;
  if (code === -5009 || code === -5051) {
    console.log('fanwei1');
    playInfo = null;
    cb(null, playInfo);
  } else if (!playInfo.durl || !playInfo.durl[0] || !playInfo.durl[0].url) {
    getPlayInfo({quality: 3, type: 'flv'}, cid)(cb);
  } else {
    cb(null, playInfo);
  }
});

const getPlayStreams = curry((playInfo, cb) => {
  let playUrl;
  let err = null;
  if (!playInfo) {
    playUrl = ERROR_PLAY_URL;
  } else {
    try {
      playUrl = playInfo.durl[0].url;
    } catch (e) {
      err = `getPlayStreams 获取播放地址失败 ${e.message}`;
    }
  }
  cb(err, {
    3: playUrl
  });
});

const getResult = curry((streams, cb) => {
  let singleVideoDefintions = {
    definitions: streams,
    highestDefintion: 3
  };
  cb(null, {
    singleVideoDefintions
  });
});

const getDefinitions = (url, cb) => {
  waterfall([
    getCid(url, getAnimeTypeCid, getMovieTypeCid, getNoramlTypeCid),
    getPlayInfo({quality: 3, type: 'mp4'}),
    judgePlayInfo(),
    getPlayStreams(),
    getResult()
  ], (err, result) => {
    cb(err, result);
  });
};

export {
  getCid,
  getAnimeTypeCid,
  getMovieTypeCid,
  getPlayInfo,
  judgePlayInfo,
  getPlayStreams,
  getResult,
  getDefinitions
};
