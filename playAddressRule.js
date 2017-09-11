const acfunRule = (url) => {
  let result;
  let regM3u8 = /^http:\/\/player.acfun.cn\/route_m3u8/;
  // http://player.acfun.cn/route_m3u8?sign=ct595439d50cf264ba3ec62e28&sid=25184246&uid=0&ran=0
  let regMp4 = /^http:\/\/player.acfun.cn\/route_mp4/;
  // http://player.acfun.cn/route_mp4?uid=0&timestamp=1498692053&fid=05044002040000594F3B6F00010002F90000000000-0000-0000-0180-47F300000000.mp4&ns=video.acfun.cn&ran=0&vid=594f2d320cf200e47acce33b&customer_id=5859fdaee4b0eaf5dd325b91&sign=ct595439d50cf264ba3ec62e28
  if (regM3u8.test(url) || regMp4.test(url)) {
    result = true;
  }
  return {
    regM3u8,
    regMp4,
    result
  };
};

const bilibiliRule = (url) => {
  // http://tx.acgvideo.com/8/6e/10803800-1-hd.mp4?txTime=1499163758&platform=android&txSecret=55312f770b4d1218bbf7d7ed5df3667c&oi=2034584890&rate=700000
  // http://59.47.225.5/vg6/1/cf/10803800-1.flv?expires=1499163900&platform=android&ssig=rSiwFUN8tpSazK7os5N2UA&oi=2034584890&nfa=zn2OTN7O9p3rqnr0+3S2RQ==&dynamic=1&hfa=2070439586
  // http://tx.acgvideo.com/8/6e/10803800-1.flv?txTime=1499164053&platform=android&txSecret=b041663b6b744e89017d8d56976c3a83&oi=2034584890&rate=1280000
  // http://59.47.225.3/vg7/e/ad/16197658-1-hd.mp4?expires=1500902400&platform=android&ssig=r43jsR8LTMO-lB_OR7SwMw&oi=2034584890&nfa=zlb44/URExVDmluh6FGErg==&dynamic=1&hfa=2068248610&hfb=NzUxMjI5MWJlMDBjMDY0YTQxNjFjMTJiYWE0MjEwYmQ=
  let result = false;
  let regs = [
    /^http:\/\/.+acgvideo.com.+.mp4/,
    /^http:\/\/.+acgvideo.com.+.flv/,
    /^http:\/\/(\d+\.){3}\d+.+.(flv|mp4)/,
    /http:\/\/static\.hdslb\.com\/error\.mp4/
  ];
  for (let urlRegs of regs) {
    if (urlRegs.test(url)) {
      result = true;
      break;
    }
  }
  return {
    regs,
    result
  };
};

const pptvRule = (url) => {
  // http://118.187.1.23/3/e534fc8afef271e8c6e06ebe302d76ce.mp4?key=&k=4934fe144942c5e58ef84e79c70e2079-cded-1500302607%26bppcataid%3D9&fpp.ver=1.3.0.4&type=web.fpp
  let result = false;
  let regs = [
    /^http:\/\/(\d+\.){3}\d+.+\.mp4\?key=&k=.+&fpp.ver=1.3.0.4&type=web.fpp/
  ];
  for (let urlRegs of regs) {
    if (urlRegs.test(url)) {
      result = true;
      break;
    }
  }
  return {
    regs,
    result
  };
};

const cztvRule = (url) => {
  // http://yf.v.cztv.com/cztv/vod/2016/02/11/3CDDA59C3B3A4e0c8EB1C83E0BF321EE/h264_450k_mp4.mp4_playlist.m3u8
  // http://video.cztv.com/video/rzx/201610/27/1f24a2cab256de39edca2e91bfc55dab1477573945.mp4
  let result = false;
  let regs = [
    /^http:\/\/yf\.v\.cztv\.com\//,
    /^http:\/\/video\.cztv\.com\//
  ];
  for (let urlRegs of regs) {
    if (urlRegs.test(url)) {
      result = true;
      break;
    }
  }
  return {
    regs,
    result
  };
};

const leRule = (url) => {
  // http://219.238.31.131/248/27/65/letv-uts/14/ver_00_22-1108059582-avc-419147-aac-48000-2714560-162623517-79f9dc2bcedef31a8c50351681d73a41-1498812716605.mp4?crypt=67aa7f2e538&b=479&nlh=4096&nlt=60&bf=90&p2p=1&video_type=mp4&termid=2&tss=no&platid=3&splatid=304&its=0&qos=4&fcheck=0&amltag=4701&mltag=4701&proxy=2092995015,2092994881,467476982&uid=2034584890.rp&keyitem=GOw_33YJAAbXYE-cnQwpfLlv_b2zAkYctFVqe5bsXQpaGNn3T1-vhw..&ntm=1500449400&nkey=64663024690aedcc163bb878182169ea&nkey2=82c81c570fec500fce237476be5c6fbe&geo=CN-1-12-16&mmsid=65610389&tm=1500430923&key=ad95a387b7b894645670e33181ca5829&playid=0&vtype=13&cvid=474124833331&payff=0&p1=0&p2=06&ostype=un&hwtype=ipad&vid=30220165&uidx=0&errc=0&gn=1938&ndtype=0&vrtmcd=107&buss=4701&cips=121.69.77.58
  let result = false;
  let regs = [
    /^http:\/\/(\d+\.){3}\d+.+letv-uts.+/,
  ];
  for (let urlRegs of regs) {
    if (urlRegs.test(url)) {
      result = true;
      break;
    }
  }
  return {
    regs,
    result
  };
};

const wasuRule = (url) => {
  // http://vodpc-al.wasu.cn/pcsan12/mams/vod/201707/07/16/201707071656370988df126fc.mp4?auth_key=cf0f23f9660879ac4a511c3613aecc63-1500441118-60e9060dcb22b70c44a6b8062553c420-&sk=9efc314b65237d5d646e1b817372afc6
  let result = false;
  let regs = [
    /^http:\/\/vodpc-al\.wasu\.cn.+\.mp4.+/
  ];
  for (let urlRegs of regs) {
    if (urlRegs.test(url)) {
      result = true;
      break;
    }
  }
  return {
    regs,
    result
  };
};

const sohuRule = (url) => {
  // http://hot.vrs.sohu.com/ipad3782360_4711114606564_6993681.m3u8?vid=3782360&uid=1500893572777083&plat=17&SOHUSVP=pBAove3b4OaQq30NICTifvnDREjPTO6VqRlLMMWax1Q&pt=2&prod=h5&pg=1&eye=0&cv=1.0.0&qd=68000&src=10150001&ca=4&cateCode=101&_c=1&appid=tv
  let result = false;
  let regs = [
    /^http:\/\/hot\.vrs\.sohu\.com.+m3u8.+/
  ];
  for (let urlRegs of regs) {
    if (urlRegs.test(url)) {
      result = true;
      break;
    }
  }
  return {
    regs,
    result
  };
};

const cntvRule = (url) => {
  // http://asp.cntv.lxdns.com/asp/hls/main/0303000a/3/default/e982b5fe441a4c69b68b61f0dee9a7bb/main.m3u8?maxbr=2048
  let result = false;
  let regs = [
    /^http:\/\/asp\.cntv\.lxdns\.com.+m3u8.+/
  ];
  for (let urlRegs of regs) {
    if (urlRegs.test(url)) {
      result = true;
      break;
    }
  }
  return {
    regs,
    result
  };
};

const mgtvRule = (url) => {
  // http://202.109.167.169/c1/2017/07/24_0/53D5C07D66B067A935EB2C447D186A06_20170724_1_1_493_mp4/3B7D8D0097957E4C9594A8799D752838.m3u8?t=59764398&pno=1042000&sign=d25f7c9a1a4c7c1d0477a40ed85edf7e&win=300&srgid=253&urgid=119&srgids=253&nid=1981&payload=usertoken%3Dhit%3D1%5Eruip%3D2034584890&rdur=21600&limitrate=0&fid=53D5C07D66B067A935EB2C447D186A06&ver=0x03&uuid=2778861de3734b40b9368e7c7d1a9961&arange=310
  // ads http://mp4.res.hunantv.com/new_video/2017/07/11/1001/9E6A2DF27D00273E3140F38541E1A4C4_20170711_1_1_240.mp4
  let result = false;
  let regs = [
    /^http:\/\/(\d+\.){3}\d+.+m3u8.+/,
    /^http:\/\/mp4\.res\.hunantv\.com.+mp4/
  ];
  for (let urlRegs of regs) {
    if (urlRegs.test(url)) {
      result = true;
      break;
    }
  }
  return {
    regs,
    result
  };
};

export {
  acfunRule,
  bilibiliRule,
  pptvRule,
  cztvRule,
  leRule,
  wasuRule,
  sohuRule,
  cntvRule,
  mgtvRule
};
