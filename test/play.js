/**
 * description: 播放测试
 * author: fanwei
 * date: 2017-06-26
 */
import assert from 'assert';
import verify from '../verifyPlayAdreess';
import {acfunRule, bilibiliRule, pptvRule, cztvRule, leRule, wasuRule, cntvRule, mgtvRule, sohuRule} from '../playAddressRule';

let acfun = require('../src/segments/acfun');
let bilibili = require('../src/segments/bilibili');
let pptv = require('../src/segments/pptv');
let cztv = require('../src/segments/cztv');
let le = require('../src/segments/le');
let wasu = require('../src/segments/wasu');
let cntv = require('../src/segments/cntv');
let sohu = require('../src/segments/sohu');
let mgtv = require('../src/segments/mgtv');

// TODO 把配置提出来
describe('播放地址检测', () => {
  it('acfun ac mobile', (done) => {
    acfun.getDefinitions('http://m.acfun.cn/v/?ac=3827023', (err, data) => {
      let verifyResult = verify(acfunRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('acfun ac pc', (done) => {
    acfun.getDefinitions('http://www.acfun.cn/v/ac3827023', (err, data) => {
      let verifyResult = verify(acfunRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('acfun ab pc', (done) => {
    acfun.getDefinitions('http://www.acfun.cn/v/ab1470440_35', (err, data) => {
      let verifyResult = verify(acfunRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('acfun ab mobile', (done) => {
    acfun.getDefinitions('http://m.acfun.cn/v/?ab=1470440#ab=1470440;part=35', (err, data) => {
      let verifyResult = verify(acfunRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });

  it('bilibili anime type', (done) => {
    bilibili.getDefinitions('http://bangumi.bilibili.com/anime/1511/play#28158', (err, data) => {
      let verifyResult = verify(bilibiliRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('bilibili movie type', (done) => {
    bilibili.getDefinitions('http://bangumi.bilibili.com/mobile/movie/10131', (err, data) => {
      let verifyResult = verify(bilibiliRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('bilibili normal type', (done) => {
    bilibili.getDefinitions('http://www.bilibili.com/video/av11789818', (err, data) => {
      let verifyResult = verify(bilibiliRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('pptv play', (done) => {
    pptv.getDefinitions('http://v.pptv.com/show/FykDgelPvic1g3kY.html?rcc_src=www_index', (err, data) => {
      let verifyResult = verify(pptvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('cztv normal', (done) => {
    cztv.getDefinitions('http://me.cztv.com/wap/play?id=3711525', (err, data) => {
      let verifyResult = verify(cztvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('cztv letv cloud', (done) => {
    cztv.getDefinitions('http://tv.cztv.com/vplay/139734.html', (err, data) => {
      let verifyResult = verify(cztvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('cztv letv cloud', (done) => {
    cztv.getDefinitions('http://tv.cztv.com/vplay/139734.html', (err, data) => {
      let verifyResult = verify(cztvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });

  it('le tv', (done) => {
    le.getDefinitions('http://www.le.com/ptv/vplay/30220165.html', (err, data) => {
      let verifyResult = verify(leRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('le movie', (done) => {
    le.getDefinitions('http://www.le.com/ptv/vplay/29508386.html?ref=ym0208', (err, data) => {
      let verifyResult = verify(leRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('le comic', (done) => {
    le.getDefinitions('http://www.le.com/ptv/vplay/30283806.html', (err, data) => {
      let verifyResult = verify(leRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('le zongyi', (done) => {
    le.getDefinitions('http://www.le.com/ptv/vplay/30441128.html', (err, data) => {
      let verifyResult = verify(leRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });

  it('wasu tv', (done) => {
    wasu.getDefinitions('https://www.wasu.cn/Play/show/id/8970355', (err, data) => {
      let verifyResult = verify(wasuRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });

  it('cctv pc', (done) => {
    cntv.getDefinitions('http://tv.cctv.com/2017/02/21/VIDEBFHjxOwMOF5AKd9q6Gsk170221.shtml', (err, data) => {
      let verifyResult = verify(cntvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('cctv mobile', (done) => {
    cntv.getDefinitions('http://tv.cctv.com/v1/index.shtml?videoID=VIDEBFHjxOwMOF5AKd9q6Gsk170221', (err, data) => {
      let verifyResult = verify(cntvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('cntv mobile', (done) => {
    cntv.getDefinitions('http://tv.cctv.com/v1/index.shtml?videoID=VIDEBFHjxOwMOF5AKd9q6Gsk170221', (err, data) => {
      let verifyResult = verify(cntvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });

  it('sohu movie', (done) => {
    sohu.getDefinitions('http://tv.sohu.com/20090302/n262552639.shtml', (err, data) => {
      console.log(data);
      let verifyResult = verify(sohuRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('sohu tv', (done) => {
    sohu.getDefinitions('http://tv.sohu.com/20151113/n426423588.shtml', (err, data) => {
      let verifyResult = verify(sohuRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('sohu zongyi', (done) => {
    sohu.getDefinitions('http://tv.sohu.com/20170302/n482141879.shtml', (err, data) => {
      let verifyResult = verify(sohuRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('sohu comic', (done) => {
    sohu.getDefinitions('http://tv.sohu.com/20140129/n394357059.shtml', (err, data) => {
      let verifyResult = verify(sohuRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });

  it('mgtv movie', (done) => {
    mgtv.getDefinitions('http://www.mgtv.com/b/307960/4024850.html', (err, data) => {
      let verifyResult = verify(mgtvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('mgtv tv', (done) => {
    mgtv.getDefinitions('http://www.mgtv.com/b/293193/3960734.html', (err, data) => {
      let verifyResult = verify(mgtvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('mgtv comic', (done) => {
    mgtv.getDefinitions('http://www.mgtv.com/b/293399/4012099.html', (err, data) => {
      let verifyResult = verify(mgtvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  it('mgtv zongyi', (done) => {
    mgtv.getDefinitions('http://www.mgtv.com/b/105380/2932102.html', (err, data) => {
      let verifyResult = verify(mgtvRule, data);
      assert.equal(verifyResult, true);
      done();
    });
  });
  // it('mgtv ads', (done) => {
  //   mgtv.getPlayAds('http://www.mgtv.com/b/293399/4012099.html', (err, ads) => {
  //     let {result} = mgtvRule(ads[0]);
  //     assert.equal(result, true);
  //     done();
  //   });
  // });
});
