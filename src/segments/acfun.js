import waterfall from 'async/waterfall';
import curry from 'ramda/src/curry';
import {fetch} from '../fetch';
import {decodeAcfun, base64DecodeAcfun} from '../decrypt';
import {buildPlayStreams} from '../util';

const getAcfunInfoHeaders = {deviceType: 2};
const logPrefix = 'qiguoPlayManage-getDefintions-acfun: ';
const pageCache = {};
const getRemoteInfo = (fetchInfo, cb) => {
  let {fetchParams, step} = fetchInfo;
  let err = null;
  fetch(fetchParams, (data) => {
    try {
      data = JSON.parse(data);
    } catch (e) {
      err = JSON.stringify(
        {
          fetchParams,
          step,
          value: {acFunInfo: 'not json string'},
          expected: {acFunInfo: 'json string'}
        }
      );
    }
    cb(err, data);
  });
};

const getPart = (url, type) => {
  let part;
  try {
    if (type === 'ac') {
      part = parseInt(url.match(/.+part=(\d+)/)[1], 10) - 1 || 0;
    } else if (type === 'ab') {
      try {
        // 抓取的是这种地址:http://www.acfun.cn/v/ab1480058_3 这种地址重定向会有问题
        part = parseInt(url.match(/.+ab=?\d+_(\d+)/)[1], 10) * 10;
      } catch (e) {
        // http://m.acfun.cn/v/?ab=1480058#ab=1480058;part=29
        part = parseInt(url.match(/.+part=(\d+)/)[1], 10) * 10;
      }
    }
  } catch (e) {
    part = 0;
  }
  return part;
};

let getAcfunType = (url) => {
  let matchInfo = url.match(/(ac|ab)=?(\d+)/);
  let type = matchInfo[1];
  return type;
};

let getPageParam = curry(({url, cache = {}}, getAcfunPart, getType, cb) => {
  let urlId;
  let type;
  let part;
  let err = null;
  try {
    let matchInfo = url.match(/(ac|ab)=?(\d+)/);
    type = getType(url);
    urlId = matchInfo[2];
    part = getAcfunPart(url, type);
  } catch (e) {
    err = `${logPrefix}get page param error ${e.message}`;
  }
  let pageParams = {
    urlId,
    type,
    part,
    url
  };
  cache.pageParams = pageParams;
  cb(err, pageParams);
});

const getAcfunInfo = curry((request, {urlId, type, part}, cb) => {
  let getAcfunInfoUrl;
  if (type === 'ac') {
    getAcfunInfoUrl = `http://api.aixifan.com/contents/${urlId}`;
  } else if (type === 'ab') {
    getAcfunInfoUrl = `http://api.aixifan.com/bangumis/${urlId}?page=${encodeURIComponent(JSON.stringify({num: 1, size: 300}))}`;
  }
  request({
    fetchParams: {
      url: getAcfunInfoUrl,
      headers: getAcfunInfoHeaders
    },
    step: 'getAcfunInfo'
  }, cb);
});

const getAcFunVideoId = curry(({pageParams: {type, part, url}}, acFunInfo, cb) => {
  let err = null;
  let acFunVideoId;
  if (!acFunInfo.data || !acFunInfo.data.videos || !acFunInfo.data.videos.length) {
    err = `${logPrefix}acFunInfo 没有videos字段或者videos字段为空`;
  } else {
    if (type === 'ac') {
      acFunVideoId = acFunInfo.data.videos[part].videoId;
    } else if (type === 'ab') {
      let nowInfo = acFunInfo.data.videos.filter(item => item.sort === part);
      if (nowInfo.length) {
        acFunVideoId = nowInfo[0].videoId;
      } else {
        // 一个都没有匹配上就取第一个id
        acFunVideoId = acFunInfo.data.videos[0].videoId;
      }
    }
  }
  console.log(acFunVideoId);
  cb(err, acFunVideoId);
});

const getYoukuInfo = curry((request, acFunVideoId, cb) => {
  let url = `http://www.acfun.cn/video/getVideo.aspx?id=${acFunVideoId}`;
  // 备用 let url = `http://api.aixifan.com/plays/youku/${acFunVideoId}`;
  request({
    fetchParams: {
      url
    },
    step: 'getYoukuInfo'
  }, cb);
});

const getSidAndSign = curry((youkuInfo, cb) => {
  let sid;
  let sign;
  let err = null;
  let errMsg = `${logPrefix}youkuInfo 没有sid或者sign字段`;
  try {
    sid = youkuInfo.sourceId;
    sign = youkuInfo.encode;
    if (!sid || !sign) {
      err = errMsg;
    }
  } catch (e) {
    err = errMsg;
  }
  cb(err, {
    sid,
    sign
  });
});

const getEncryptPlayInfo = curry((request, {sid, sign}, cb) => {
  let url = `http://aplay-vod.cn-beijing.aliyuncs.com/acfun/web?vid=${sid}&ct=85&ev=3&sign=${sign}`;
  request({
    fetchParams: {
      url
    },
    step: 'getEncryptPlayInfo'
  }, cb);
});

const decryptAcFunPlayInfo = curry((acFunEncryptInfo, cb) => {
  let key = '8bdc7e1a';
  let acFunEncrypt;
  let decryptPlayInfo;
  let err = null;
  try {
    acFunEncrypt = acFunEncryptInfo.data;
    decryptPlayInfo = decodeAcfun(key, base64DecodeAcfun(acFunEncrypt));
  } catch (e) {
    err = `${logPrefix}acFunPlayInfo 解密失败`;
  }
  cb(err, {
    decryptPlayInfo
  });
});

const getPlayStreams = curry(({decryptPlayInfo}, cb) => {
  let streams;
  let err = null;
  try {
    streams = JSON.parse(decryptPlayInfo).stream;
  } catch (e) {
    err = `${logPrefix}playInfo没有streams字段`;
  }
  cb(err, {
    streams
  });
});

const getFullVideos = ({streams}) => {
  let m3u8List = [];
  let err = null;
  const m3u8Map = new Map([
    ['m3u8_hd3', 5],
    ['m3u8_hd', 4],
    ['m3u8_mp4', 3],
    ['m3u8_flv', 3]
  ]);
  try {
    streams.forEach((item) => {
      for (let [acfunBittype, ourBittype] of m3u8Map) {
        if (item.stream_type === acfunBittype) {
          try {
            let json = {};
            json.url = item.m3u8;
            json.bittype = ourBittype;
            m3u8List.push(json);
          } catch (e) {
            console.log(`${logPrefix}getFullVideo push error: ${e.message}`);
          }
        }
      }
    });
  } catch (e) {
    err = `${logPrefix}单段视频获取失败 ${e.message}`;
  }
  let {definitions, highestDefintion} = buildPlayStreams(m3u8List);
  return {
    err,
    definitions,
    highestDefintion
  };
};

const getMultiVideos = ({streams}) => {
  let err = null;
  let map4List = [];
  let duration = 0;
  const mp4Map = new Map([
    ['flvhd', 2],
    ['mp4hd', 3],
    ['mp4hd2', 4],
    ['mp4hd3', 5]
  ]);
  try {
    streams.forEach((item) => {
      for (let [acfunBittype, ourBittype] of mp4Map) {
        if (item.stream_type === acfunBittype) {
          duration = item.duration;
          let json = {};
          let playUrls = item.segs.map((seg) => {
            let part = {
              url: seg.url,
              duration: seg.seconds
            };
            return part;
          });
          json.bittype = ourBittype;
          json.url = playUrls;
          map4List.push(json);
        }
      }
    });
  } catch (e) {
    err = `${logPrefix}多段视频获取失败 ${e.message}`;
  }
  let {definitions, highestDefintion} = buildPlayStreams(map4List);
  return {
    err,
    definitions,
    highestDefintion,
    duration
  };
};

const getResult = curry((streams, cb) => {
  let singleVideoDefintions = getFullVideos(streams);
  let multiVideoDefintions = getMultiVideos(streams);
  cb(null, {
    singleVideoDefintions,
    multiVideoDefintions
  });
});

const getDefinitions = (url, cb) => {
  waterfall([
    getPageParam({url, cache: pageCache}, getPart, getAcfunType),
    getAcfunInfo(getRemoteInfo),
    getAcFunVideoId(pageCache),
    getYoukuInfo(getRemoteInfo),
    getSidAndSign(),
    getEncryptPlayInfo(getRemoteInfo),
    decryptAcFunPlayInfo(),
    getPlayStreams(),
    getResult()
  ], (err, result) => {
    cb(err, result);
  });
};

export {
  getRemoteInfo,
  getPart,
  getAcfunType,
  getPageParam,
  getAcfunInfo,
  getAcFunVideoId,
  getYoukuInfo,
  getSidAndSign,
  getEncryptPlayInfo,
  decryptAcFunPlayInfo,
  getPlayStreams,
  getResult,
  getDefinitions
};
