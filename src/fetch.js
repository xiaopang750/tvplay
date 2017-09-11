import request from 'request';

// wap.fetch api
// async: true isPost: true, form: {}, headers: {}, url: reqId, global.wpaFetchComplete
const $ = global.$ || {};
const wpa = global.wpa || {};

if (!global.wpaFetchComplete) {
  global.wpaFetchComplete = (reqId, data) => {
    for (let [nowReqId, nowInfo] of global.cbCollection) {
      if (nowReqId === reqId) {
        let {url, cb} = nowInfo;
        cb(data);
        console.log(`fetch ${url} result : ${JSON.stringify(data)}`);
        global.cbCollection.delete(nowReqId);
        break;
      }
    }
  };
}

const changeParam = (opt = {}) => {
  let newOpt = {...opt};
  if (newOpt.isPost === true) {
    newOpt.method = 'POST';
    delete newOpt.isPost;
  }
  return newOpt;
};

const encodeParam = (param) => {
  let result = [];
  for (let attr of Object.keys(param)) {
    let val = param[attr];
    val = encodeURIComponent(val);
    result.push(`${attr}=${val}`);
  }
  return result.length ? result.join('&') : null;
};

const fetch = (opt = {}, cb) => {
  let moye = global.moye || {};
  moye.utils = moye.utils || {isBlitz: () => false};
  let isInWebOs = moye.utils.isBlitz();
  if (global.document) {
    if (isInWebOs) {
      let http = global.blitz.load('http');
      let query = encodeParam(opt.query);
      let reqUrl = query ? `${opt.url}?${query}` : opt.url;
      let timeout = opt.timeout || 5000;
      http.request({
        url: reqUrl,
        header: opt.headers,
        http_type: opt.method || 'get',
        post_data: opt.form
      }, (data) => {
        cb(data);
      }, (e) => {
        console.log(`fetch fail: ${JSON.stringify(e)}`);
        cb();
      }, timeout);
    } else {
      if (wpa.fetch) {
        global.cbCollection = global.cbCollection || new Map();
        opt.async = true;
        opt.reqId = `${Math.random() + new Date().getTime()}`;
        global.cbCollection.set(opt.reqId, {
          url: opt.url,
          cb
        });
        if (opt.timeout) opt.timeout = parseInt(opt.timeout / 1000, 10);
        wpa.fetch(JSON.stringify(opt));
      } else {
        let newOpt = changeParam(opt);
        $.ajax({
          url: 'http://api.video.browser.tvall.cn:8888/video/api/proxy',
          type: 'post',
          data: {
            ...newOpt
          },
          complete: (result, b, c) => {
            cb(result.responseText);
          }
        });
      }
    }
  } else {
    let newOpt = changeParam(opt);
    request(newOpt, (err, res, data) => {
      cb(data);
    });
  }
  console.log(`fetch param : ${JSON.stringify(opt)}`);
};

export {
  fetch
};
