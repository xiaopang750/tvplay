# 播放码流库

## 一个获取常用网址码流的库

包括: acfun bilibili cntv cztv letv mgtv pptv sohu wasu

## 说明

请勿用于生产环境，仅供自己观看，过滤广告使用。

## 开始
1. npm run dev 开发调试代码
2. npm run build 打包
3. npm run play ${网址别名/acfun bilibili cntv cztv letv mgtv pptv sohu wasu} ${网址} 用命令行获取播放地址
4. npm run lint 语法检测

# 使用

## In frontEnd Browser

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <script src="https://cdn.bootcss.com/jquery/2.2.4/jquery.js"></script>
  <script type="text/javascript" src="./dist/common.js"></script>
  <script type="text/javascript" src="./dist/acfun.js"></script>
  <script>
    qiguoPlayManage.getDefinitions('http://m.acfun.cn/v/?ac=3713714', function(err, data){
      console.log(data);
    });
  </script>
</body>
</html>
```

## In Client Support wpa.fetch

wpa.fetch 是android实现的js api可以实现客户端的跨域请求

有些获取码流的方法，是需要依赖ip的，如果用服务器做代理请求可能

会导致播放慢的问题
```
first inject common;
require('acfun');
qiguoPlayManage.getDefinitions('http://m.acfun.cn/v/?ac=3713714', function(err, data){
  console.log(data);
});
```

## In backEnd

```
global.window = global;
require('./dist/common');
let acfun = require('./dist/acfun');

acfun.getDefinitions('http://m.acfun.cn/v/?ac=3713714', (err, data) => {
  console.log(data);
});

```
