!function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n=window.webpackJsonpqiguoPlayManage;window.webpackJsonpqiguoPlayManage=function(r,u,i){for(var c,a,l,f=0,s=[];f<r.length;f++)a=r[f],o[a]&&s.push(o[a][0]),o[a]=0;for(c in u)Object.prototype.hasOwnProperty.call(u,c)&&(t[c]=u[c]);for(n&&n(r,u,i);s.length;)s.shift()();if(i)for(f=0;f<i.length;f++)l=e(e.s=i[f]);return l};var r={},o={9:0};e.e=function(t){function n(){c.onerror=c.onload=null,clearTimeout(a);var e=o[t];0!==e&&(e&&e[1](new Error("Loading chunk "+t+" failed.")),o[t]=void 0)}var r=o[t];if(0===r)return new Promise(function(t){t()});if(r)return r[2];var u=new Promise(function(e,n){r=o[t]=[e,n]});r[2]=u;var i=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.charset="utf-8",c.async=!0,c.timeout=12e4,e.nc&&c.setAttribute("nonce",e.nc),c.src=e.p+""+t+".js";var a=setTimeout(n,12e4);return c.onerror=c.onload=n,i.appendChild(c),u},e.m=t,e.c=r,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e.oe=function(t){throw console.error(t),t}}([,function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){function n(e){var n=(0,m.default)(t[o++]);e.push((0,d.default)(r)),n.apply(null,e)}function r(r){if(r||o===t.length)return e.apply(null,arguments);n((0,s.default)(arguments,1))}if(e=(0,l.default)(e||c.default),!(0,u.default)(t))return e(new Error("First argument to waterfall must be an array of functions"));if(!t.length)return e();var o=0;n([])};var o=n(48),u=r(o),i=n(8),c=r(i),a=n(15),l=r(a),f=n(16),s=r(f),p=n(20),d=r(p),y=n(5),m=r(y);t.exports=e.default},function(t,e,n){"use strict";var r=n(55),o=n(62);t.exports=r(function(t){return o(t.length,t)})},function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.fetch=void 0;var r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},o=function(){function t(t,e){var n=[],r=!0,o=!1,u=void 0;try{for(var i,c=t[Symbol.iterator]();!(r=(i=c.next()).done)&&(n.push(i.value),!e||n.length!==e);r=!0);}catch(t){o=!0,u=t}finally{try{!r&&c.return&&c.return()}finally{if(o)throw u}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=n(17),i=function(t){return t&&t.__esModule?t:{default:t}}(u),c=t.$||{},a=t.wpa||{};t.wpaFetchComplete||(t.wpaFetchComplete=function(e,n){var r=!0,u=!1,i=void 0;try{for(var c,a=t.cbCollection[Symbol.iterator]();!(r=(c=a.next()).done);r=!0){var l=o(c.value,2),f=l[0],s=l[1];if(f===e){var p=s.url;(0,s.cb)(n),console.log("fetch "+p+" result : "+JSON.stringify(n)),t.cbCollection.delete(f);break}}}catch(t){u=!0,i=t}finally{try{!r&&a.return&&a.return()}finally{if(u)throw i}}});var l=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=r({},t);return!0===e.isPost&&(e.method="POST",delete e.isPost),e},f=function(t){var e=[],n=!0,r=!1,o=void 0;try{for(var u,i=Object.keys(t)[Symbol.iterator]();!(n=(u=i.next()).done);n=!0){var c=u.value,a=t[c];a=encodeURIComponent(a),e.push(c+"="+a)}}catch(t){r=!0,o=t}finally{try{!n&&i.return&&i.return()}finally{if(r)throw o}}return e.length?e.join("&"):null},s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1],o=t.moye||{};o.utils=o.utils||{isBlitz:function(){return!1}};var u=o.utils.isBlitz();if(t.document)if(u){var s=t.blitz.load("http"),p=f(e.query),d=p?e.url+"?"+p:e.url,y=e.timeout||5e3;s.request({url:d,header:e.headers,http_type:e.method||"get",post_data:e.form},function(t){n(t)},function(t){console.log("fetch fail: "+JSON.stringify(t)),n()},y)}else if(a.fetch)t.cbCollection=t.cbCollection||new Map,e.async=!0,e.reqId=""+(Math.random()+(new Date).getTime()),t.cbCollection.set(e.reqId,{url:e.url,cb:n}),e.timeout&&(e.timeout=parseInt(e.timeout/1e3,10)),a.fetch(JSON.stringify(e));else{var m=l(e);c.ajax({url:"http://api.video.browser.tvall.cn:8888/video/api/proxy",type:"post",data:r({},m),complete:function(t,e,r){n(t.responseText)}})}else{var h=l(e);(0,i.default)(h,function(t,e,r){n(r)})}console.log("fetch param : "+JSON.stringify(e))};e.fetch=s}).call(e,n(45))},,function(t,e,n){"use strict";function r(t){return c&&"AsyncFunction"===t[Symbol.toStringTag]}function o(t){return r(t)?(0,i.default)(t):t}Object.defineProperty(e,"__esModule",{value:!0}),e.isAsync=void 0;var u=n(59),i=function(t){return t&&t.__esModule?t:{default:t}}(u),c="function"==typeof Symbol;e.default=o,e.isAsync=r},,,function(t,e,n){"use strict";function r(){}t.exports=r},,,,,,,function(t,e,n){"use strict";function r(t){return function(){if(null!==t){var e=t;t=null,e.apply(this,arguments)}}}Object.defineProperty(e,"__esModule",{value:!0}),e.default=r,t.exports=e.default},function(t,e,n){"use strict";function r(t,e){e|=0;for(var n=Math.max(t.length-e,0),r=Array(n),o=0;o<n;o++)r[o]=t[e+o];return r}Object.defineProperty(e,"__esModule",{value:!0}),e.default=r,t.exports=e.default},,,,function(t,e,n){"use strict";function r(t){return function(){if(null===t)throw new Error("Callback was already called.");var e=t;t=null,e.apply(this,arguments)}}Object.defineProperty(e,"__esModule",{value:!0}),e.default=r,t.exports=e.default},,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,n){"use strict";var r,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(t){"object"===("undefined"==typeof window?"undefined":o(window))&&(r=window)}t.exports=r},,,function(t,e,n){"use strict";var r=Array.isArray;t.exports=r},function(t,e,n){"use strict";function r(t){var e=void 0===t?"undefined":o(t);return null!=t&&("object"==e||"function"==e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};t.exports=r},,,,,,function(t,e,n){"use strict";var r=n(56);t.exports=function(t){return function e(n){return 0===arguments.length||r(n)?e:t.apply(this,arguments)}}},function(t,e,n){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};t.exports=function(t){return null!=t&&"object"===(void 0===t?"undefined":r(t))&&!0===t["@@functional/placeholder"]}},function(t,e,n){"use strict";function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function u(t){if(s===setTimeout)return setTimeout(t,0);if((s===r||!s)&&setTimeout)return s=setTimeout,setTimeout(t,0);try{return s(t,0)}catch(e){try{return s.call(null,t,0)}catch(e){return s.call(this,t,0)}}}function i(t){if(p===clearTimeout)return clearTimeout(t);if((p===o||!p)&&clearTimeout)return p=clearTimeout,clearTimeout(t);try{return p(t)}catch(e){try{return p.call(null,t)}catch(e){return p.call(this,t)}}}function c(){h&&y&&(h=!1,y.length?m=y.concat(m):v=-1,m.length&&a())}function a(){if(!h){var t=u(c);h=!0;for(var e=m.length;e;){for(y=m,m=[];++v<e;)y&&y[v].run();v=-1,e=m.length}y=null,h=!1,i(t)}}function l(t,e){this.fun=t,this.array=e}function f(){}var s,p,d=t.exports={};!function(){try{s="function"==typeof setTimeout?setTimeout:r}catch(t){s=r}try{p="function"==typeof clearTimeout?clearTimeout:o}catch(t){p=o}}();var y,m=[],h=!1,v=-1;d.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];m.push(new l(t,e)),1!==m.length||h||u(a)},l.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=f,d.addListener=f,d.once=f,d.off=f,d.removeListener=f,d.removeAllListeners=f,d.emit=f,d.prependListener=f,d.prependOnceListener=f,d.listeners=function(t){return[]},d.binding=function(t){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(t){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},function(t,e,n){"use strict";t.exports=function(t,e){switch(t){case 0:return function(){return e.apply(this,arguments)};case 1:return function(t){return e.apply(this,arguments)};case 2:return function(t,n){return e.apply(this,arguments)};case 3:return function(t,n,r){return e.apply(this,arguments)};case 4:return function(t,n,r,o){return e.apply(this,arguments)};case 5:return function(t,n,r,o,u){return e.apply(this,arguments)};case 6:return function(t,n,r,o,u,i){return e.apply(this,arguments)};case 7:return function(t,n,r,o,u,i,c){return e.apply(this,arguments)};case 8:return function(t,n,r,o,u,i,c,a){return e.apply(this,arguments)};case 9:return function(t,n,r,o,u,i,c,a,l){return e.apply(this,arguments)};case 10:return function(t,n,r,o,u,i,c,a,l,f){return e.apply(this,arguments)};default:throw new Error("First argument to _arity must be a non-negative integer no greater than ten")}}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){return(0,f.default)(function(e,n){var r;try{r=t.apply(this,e)}catch(t){return n(t)}(0,a.default)(r)&&"function"==typeof r.then?r.then(function(t){u(n,null,t)},function(t){u(n,t.message?t:new Error(t))}):n(null,r)})}function u(t,e,n){try{t(e,n)}catch(t){(0,p.default)(i,t)}}function i(t){throw t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var c=n(49),a=r(c),l=n(60),f=r(l),s=n(61),p=r(s);t.exports=e.default},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){return function(){var e=(0,o.default)(arguments),n=e.pop();t.call(this,e,n)}};var r=n(16),o=function(t){return t&&t.__esModule?t:{default:t}}(r);t.exports=e.default},function(t,e,n){"use strict";(function(t,r){function o(t){setTimeout(t,0)}function u(t){return function(e){var n=(0,l.default)(arguments,1);t(function(){e.apply(null,n)})}}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};Object.defineProperty(e,"__esModule",{value:!0}),e.hasNextTick=e.hasSetImmediate=void 0,e.fallback=o,e.wrap=u;var c,a=n(16),l=function(t){return t&&t.__esModule?t:{default:t}}(a),f=e.hasSetImmediate="function"==typeof t&&t,s=e.hasNextTick="object"===(void 0===r?"undefined":i(r))&&"function"==typeof r.nextTick;c=f?t:s?r.nextTick:o,e.default=u(c)}).call(e,n(66).setImmediate,n(57))},function(t,e,n){"use strict";var r=n(58),o=n(55),u=n(63),i=n(64);t.exports=u(function(t,e){return 1===t?o(e):r(t,i(t,[],e))})},function(t,e,n){"use strict";var r=n(55),o=n(56);t.exports=function(t){return function e(n,u){switch(arguments.length){case 0:return e;case 1:return o(n)?e:r(function(e){return t(n,e)});default:return o(n)&&o(u)?e:o(n)?r(function(e){return t(e,u)}):o(u)?r(function(e){return t(n,e)}):t(n,u)}}}},function(t,e,n){"use strict";var r=n(58),o=n(56);t.exports=function t(e,n,u){return function(){for(var i=[],c=0,a=e,l=0;l<n.length||c<arguments.length;){var f;l<n.length&&(!o(n[l])||c>=arguments.length)?f=n[l]:(f=arguments[c],c+=1),i[l]=f,o(f)||(a-=1),l+=1}return a<=0?u.apply(this,i):r(a,t(e,i,u))}}},function(t,e,n){"use strict";(function(t,e){!function(t,n){function r(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var r={callback:t,args:e};return l[a]=r,c(a),a++}function o(t){delete l[t]}function u(t){var e=t.callback,r=t.args;switch(r.length){case 0:e();break;case 1:e(r[0]);break;case 2:e(r[0],r[1]);break;case 3:e(r[0],r[1],r[2]);break;default:e.apply(n,r)}}function i(t){if(f)setTimeout(i,0,t);else{var e=l[t];if(e){f=!0;try{u(e)}finally{o(t),f=!1}}}}if(!t.setImmediate){var c,a=1,l={},f=!1,s=t.document,p=Object.getPrototypeOf&&Object.getPrototypeOf(t);p=p&&p.setTimeout?p:t,"[object process]"==={}.toString.call(t.process)?function(){c=function(t){e.nextTick(function(){i(t)})}}():function(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1},t.postMessage("","*"),t.onmessage=n,e}}()?function(){var e="setImmediate$"+Math.random()+"$",n=function(n){n.source===t&&"string"==typeof n.data&&0===n.data.indexOf(e)&&i(+n.data.slice(e.length))};t.addEventListener?t.addEventListener("message",n,!1):t.attachEvent("onmessage",n),c=function(n){t.postMessage(e+n,"*")}}():t.MessageChannel?function(){var t=new MessageChannel;t.port1.onmessage=function(t){i(t.data)},c=function(e){t.port2.postMessage(e)}}():s&&"onreadystatechange"in s.createElement("script")?function(){var t=s.documentElement;c=function(e){var n=s.createElement("script");n.onreadystatechange=function(){i(e),n.onreadystatechange=null,t.removeChild(n),n=null},t.appendChild(n)}}():function(){c=function(t){setTimeout(i,0,t)}}(),p.setImmediate=r,p.clearImmediate=o}}("undefined"==typeof self?void 0===t?void 0:t:self)}).call(e,n(45),n(57))},function(t,e,n){"use strict";function r(t,e){this._id=t,this._clearFn=e}var o=Function.prototype.apply;e.setTimeout=function(){return new r(o.call(setTimeout,window,arguments),clearTimeout)},e.setInterval=function(){return new r(o.call(setInterval,window,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close()},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(window,this._id)},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout()},e))},n(65),e.setImmediate=setImmediate,e.clearImmediate=clearImmediate}]);