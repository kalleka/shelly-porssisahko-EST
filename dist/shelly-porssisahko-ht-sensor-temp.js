/**
 * @license
 * 
 * shelly-porssisahko
 * 
 * (c) Jussi isotalo - http://jisotalo.fi
 * https://github.com/jisotalo/shelly-porssisahko
 * 
 * License: GNU Affero General Public License v3.0 
 * Modified by Kalle Kaljuste 2024-09-09
 */
let C_HIST=24,C_ERRC=3,C_ERRD=120,C_DEF={mode:0,m0:{cmd:0},m1:{lim:0},m2:{per:24,cnt:0,lim:-999,sq:0,m:999,ps:0,pe:23,ps2:0,pe2:23,cnt2:0},vat:22,day:0,night:0,bk:0,err:0,outs:[0],fh:0,fhCmd:0,inv:0,min:60,oc:0},_={s:{v:"0.1.0-2.13.0",dn:"",st:0,str:"",cmd:-1,chkTs:0,errCnt:0,errTs:0,upTs:0,timeOK:0,configOK:0,fCmdTs:0,fCmd:0,tz:"+02:00",tzh:0,delay:Math.floor(16*Math.random()),p:[{ts:0,now:0,low:0,high:0,avg:0},{ts:0,now:0,low:0,high:0,avg:0}]},p:[[],[]],h:[],c:C_DEF},p=!1,c=!1;function r(t,e){e-=t;return 0<=e&&e<3600}function l(t,e,s){return Math.min(s,Math.max(t,e))}function a(t){return Math.floor((t?t.getTime():Date.now())/1e3)}function n(t,e,s){let n=t.toString();for(;n.length<e;)n=s?s+n:" "+n;return n}function o(t){return t.getDate()}function d(t){let e=t.toString(),s=0;"+0000"==(e=e.substring(3+e.indexOf("GMT")))?(e="Z",s=0):(s=+e.substring(0,3),e=e.substring(0,3)+":"+e.substring(3)),e!=_.s.tz&&(_.s.p[0].ts=0),_.s.tz=e,_.s.tzh=s}function u(t){console.log((new Date).toString().substring(16,24)+":",t)}function i(){for(;0<C_HIST&&_.h.length>=C_HIST;)_.h.splice(0,1);_.h.push([a(),c?1:0,_.s.st])}function A(){var t=new Date;_.s.timeOK=2e3<t.getFullYear()?1:0,_.s.dn=Shelly.getComponentConfig("sys").device.name,!_.s.upTs&&_.s.timeOK&&(_.s.upTs=a(t))}function m(t){Shelly.call("KVS.Get",{key:"porssi-config"},function(e,t,s,n){_.c=e?e.value:{},"function"==typeof USER_CONFIG&&(_.c=USER_CONFIG(_.c,_,!0));{e=function(t){_.s.configOK=t?1:0,_.s.chkTs=0,n&&(p=!1,Timer.set(1e3,!1,f))};let t=0;if(C_DEF){for(var o in null==_.c.fhCmd&&null!=_.c.fh&&(_.c.fhCmd=_.c.fh),C_DEF)if(void 0===_.c[o])_.c[o]=C_DEF[o],t++;else if("object"==typeof C_DEF[o])for(var c in C_DEF[o])void 0===_.c[o][c]&&(_.c[o][c]=C_DEF[o][c],t++);void 0!==_.c.out&&(_.c.outs=[_.c.out],_.c.out=void 0),C_DEF=null,0<t?Shelly.call("KVS.Set",{key:"porssi-config",value:_.c},function(t,e,s,n){0!==e&&u("chkConfig() - error:"+e+" - "+s),n&&n(0===e)},e):e&&e(!0)}else e&&e(!0)}},t)}function f(){try{p||(p=!0,A(),_.s.configOK?t(0)?e(0):!function(){if(0==_.s.chkTs)return 1;var t=new Date,e=new Date(1e3*_.s.chkTs);return e.getHours()!=t.getHours()||e.getFullYear()!=t.getFullYear()||0<_.s.fCmdTs&&_.s.fCmdTs-a(t)<0||0==_.s.fCmdTs&&_.c.min<60&&t.getMinutes()>=_.c.min&&_.s.cmd+_.c.inv==1}()?t(1)?e(1):p=!1:b():m(!0))}catch(t){u("loop() - error:"+t),p=!1}}function t(t){var e=new Date;let s=!1;if(1==t)s=_.s.timeOK&&0===_.s.p[1].ts&&(18==e.getHours()&&e.getMinutes()>=_.s.delay||18<e.getHours());else{let t=o(new Date(1e3*_.s.p[0].ts))!==o(e);t&&0<_.s.p[1].ts&&o(new Date(1e3*_.s.p[1].ts))!==o(e)&&(_.p[0]=_.p[1],_.s.p[0]=Object.assign({},_.s.p[1]),_.s.p[0].ts=a(),_.s.p[1].ts=0,_.p[1]=[],t=!1),s=_.s.timeOK&&(0==_.s.p[0].ts||t)}return _.s.errCnt>=C_ERRC&&a(e)-_.s.errTs<C_ERRD?s=!1:_.s.errCnt>=C_ERRC&&(_.s.errCnt=0),s}function e(i){try{let r=new Date;d(r);var e=1==i?new Date(864e5+new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime()):r;let t=e.getFullYear()+"-"+n(1+e.getMonth(),2,"0")+"-"+n(o(e),2,"0")+"T00:00:00"+_.s.tz.replace("+","%2b");var s=t.replace("T00:00:00","T23:59:59");let l={url:"https://dashboard.elering.ee/api/nps/price/csv?fields=ee&start="+t+"&end="+s,timeout:5,ssl_ca:"*"};r=null,t=null,Shelly.call("HTTP.GET",l,function(e,t,s){l=null;try{if(0!==t||null==e||200!==e.code||!e.body_b64)throw Error("error: "+t+"("+s+") - "+JSON.stringify(e));{e.headers=null,s=e.message=null,_.p[i]=[],_.s.p[i].avg=0,_.s.p[i].high=-999,_.s.p[i].low=999,e.body_b64=atob(e.body_b64),e.body_b64=e.body_b64.substring(1+e.body_b64.indexOf("\n"));let t=0;for(;0<=t;){e.body_b64=e.body_b64.substring(t);var n=[t=0,0];if(0===(t=1+e.body_b64.indexOf('"',t)))break;n[0]=+e.body_b64.substring(t,e.body_b64.indexOf('"',t)),t=2+e.body_b64.indexOf('"',t),t=2+e.body_b64.indexOf(';"',t),n[1]=+(""+e.body_b64.substring(t,e.body_b64.indexOf('"',t)).replace(",",".")),n[1]=n[1]/10*(100+(0<n[1]?_.c.vat:0))/100;var o=new Date(1e3*n[0]).getHours(),c=new Date(1e3*n[0]).getDay();n[1]+=6==c||0==c||o<7||22<=o?(100+_.c.vat)*_.c.night/100:(100+_.c.vat)*_.c.day/100,_.p[i].push(n),_.s.p[i].avg+=n[1],n[1]>_.s.p[i].high&&(_.s.p[i].high=n[1]),n[1]<_.s.p[i].low&&(_.s.p[i].low=n[1]),t=e.body_b64.indexOf("\n",t)}if(e=null,_.s.p[i].avg=0<_.p[i].length?_.s.p[i].avg/_.p[i].length:0,_.s.p[i].ts=a(r),1==i&&_.p[i].length<23)throw Error("tomorrow's prices not obtained")}}catch(t){u("getPrices() - error:"+t),_.s.errCnt+=1,_.s.errTs=a(),_.s.p[i].ts=0,_.p[i]=[]}1==i?p=!1:Timer.set(1e3,!1,b)})}catch(t){u("getPrices() - error:"+t),_.s.p[i].ts=0,_.p[i]=[],1==i?p=!1:Timer.set(1e3,!1,b)}}function b(){try{"function"==typeof USER_CONFIG&&(_.c=USER_CONFIG(_.c,_,!1)),c=!1;var t,e,s=new Date;function n(t){if(null==t)p=!1;else if(c!=t&&(_.s.st=12),c=t,_.c.inv&&(c=!c),1==_.c.oc&&_.s.cmd==c)u("logic(): output is already in required state"),i(),_.s.cmd=c?1:0,_.s.chkTs=a(),p=!1;else{let e=0,s=0;for(let t=0;t<_.c.outs.length;t++)!function(o,t){var e="{id:"+o+",on:"+(c?"true":"false")+"}";Shelly.call("Switch.Set",e,function(t,e,s,n){0!=e&&u("setRelay() - switching #"+o+" failed: "+e+" - "+s),n(0==e)},t)}(_.c.outs[t],function(t){e++,t&&s++,e==_.c.outs.length&&(s==e&&(i(),_.s.cmd=c?1:0,_.s.chkTs=a()),p=!1)})}}d(s),!function(){if(_.s.timeOK&&0!=_.s.p[0].ts){var e=a();for(let t=0;t<_.p[0].length;t++)if(r(_.p[0][t][0],e))return _.s.p[0].now=_.p[0][t][1];return _.p[0].length<24&&(_.s.p[0].ts=0),_.s.p[0].now=0}_.s.p[0].now=0}(),0===_.c.mode?(c=1===_.c.m0.cmd,_.s.st=1):_.s.timeOK&&0<_.s.p[0].ts&&o(new Date(1e3*_.s.p[0].ts))===o(s)?1===_.c.mode?(c=_.s.p[0].now<=("avg"==_.c.m1.lim?_.s.p[0].avg:_.c.m1.lim),_.s.st=c?2:3):2===_.c.mode&&(c=function(){_.c.m2.ps=l(0,_.c.m2.ps,23),_.c.m2.pe=l(_.c.m2.ps,_.c.m2.pe,24),_.c.m2.ps2=l(0,_.c.m2.ps2,23),_.c.m2.pe2=l(_.c.m2.ps2,_.c.m2.pe2,24),_.c.m2.cnt=l(0,_.c.m2.cnt,0<_.c.m2.per?_.c.m2.per:_.c.m2.pe-_.c.m2.ps),_.c.m2.cnt2=l(0,_.c.m2.cnt2,_.c.m2.pe2-_.c.m2.ps2);var n=[];for(y=_.c.m2.per<0?1:_.c.m2.per,g=0;g<_.p[0].length;g+=y)if(!((z=-2==_.c.m2.per&&1<=g?_.c.m2.cnt2:_.c.m2.cnt)<=0)){var o=[];for(C=g,S=g+_.c.m2.per,_.c.m2.per<0&&0==g?(C=_.c.m2.ps,S=_.c.m2.pe):-2==_.c.m2.per&&1==g&&(C=_.c.m2.ps2,S=_.c.m2.pe2),h=C;h<S&&!(h>_.p[0].length-1);h++)o.push(h);if(_.c.m2.sq){let e=999,s=0;for(h=0;h<=o.length-z;h++){let t=0;for(v=h;v<h+z;v++)t+=_.p[0][o[v]][1];t/z<e&&(e=t/z,s=h)}for(h=s;h<s+z;h++)n.push(o[h])}else{for(h=0,v=1;v<o.length;v++){var t=o[v];for(h=v-1;0<=h&&_.p[0][t][1]<_.p[0][o[h]][1];h--)o[h+1]=o[h];o[h+1]=t}for(h=0;h<z;h++)n.push(o[h])}if(-1==_.c.m2.per||-2==_.c.m2.per&&1<=g)break}let e=a(),s=!1;for(let t=0;t<n.length;t++)if(r(_.p[0][n[t]][0],e)){s=!0;break}return s}(),_.s.st=c?5:4,!c&&_.s.p[0].now<=("avg"==_.c.m2.lim?_.s.p[0].avg:_.c.m2.lim)&&(c=!0,_.s.st=6),c)&&_.s.p[0].now>("avg"==_.c.m2.m?_.s.p[0].avg:_.c.m2.m)&&(c=!1,_.s.st=11):_.s.timeOK?(_.s.st=7,t=1<<s.getHours(),(_.c.bk&t)==t&&(c=!0)):(c=1===_.c.err,_.s.st=8),_.s.timeOK&&0<_.c.fh&&(e=1<<s.getHours(),(_.c.fh&e)==e)&&(c=(_.c.fhCmd&e)==e,_.s.st=10),c&&_.s.timeOK&&s.getMinutes()>=_.c.min&&(_.s.st=13,c=!1),_.s.timeOK&&0<_.s.fCmdTs&&(0<_.s.fCmdTs-a(s)?(c=1==_.s.fCmd,_.s.st=9):_.s.fCmdTs=0),"function"==typeof USER_OVERRIDE?USER_OVERRIDE(c,_,n):n(c)}catch(t){u("logic() - error:"+JSON.stringify(t)),p=!1}}let g=0,h=0,v=0,y=0,z=0,C=0,S=0;u("shelly-porssisahko v."+_.s.v),u("URL: http://"+(Shelly.getComponentStatus("wifi").sta_ip??"192.168.33.1")+"/script/"+Shelly.getCurrentScriptId()),HTTPServer.registerEndpoint("",function(s,n){try{if(p)return s=null,n.code=503,void n.send();var o=function(t){var e={},s=t.split("&");for(let t=0;t<s.length;t++){var n=s[t].split("=");e[n[0]]=n[1]}return e}(s.query);s=null;let t="application/json",e=(n.code=200,!0);var c="text/html",r="text/javascript";"s"===o.r?(A(),n.body=JSON.stringify(_),e=!1):"r"===o.r?(m(_.s.configOK=!1),_.s.p[0].ts=0,_.s.p[1].ts=0,n.code=204,e=!1):"f"===o.r&&o.ts?(_.s.fCmdTs=+(""+o.ts),_.s.fCmd=+(""+o.c),_.s.chkTs=0,n.code=204,e=!1):o.r?"s.js"===o.r?(n.body=atob("H4sIAAAAAAAACoVV3VIbNxR+FaFSRxorGkjSG7sLkwTaNIWkg0lmOplMOewe2yeWJbM6S/A4+zY8Ru54sY52DTYZQ268lvSdv+/8OWTx4eQok9J8ODkapO9FzDjbK0JeTdGzvaiwnA/QYc6hVKzNwas/M6WzvUVtBqcvTw//G5yeZJ/k3zfXdEkMU/IoTTpG4kjC3Xx3q+s35AsBzoGYEZXTm+ub6xJu72++O9x0jySCQxHROXRihiWFUJATMYQiAk1vccE/hnnSYNrzVEwqEhIcMImIGOWa3SdGHjVOV1GMyXsgPwxiVlVFNaWITqgJOidmQCOIWhp5QpMJToA4olCDMTo3FwkCgCPBCMUUGPQGUpIFNak8iV/jvfclAVwVgitf3CNoCpNI02qaHKYkBLFi+ALCUYQ4KWnGJGYhOBYRkwpp5PFKn1uGNiVfMaXz9TnJz+b4/cFaKh/InYdkVRr5z5LgO36h8dRTIT+byMCYXQYqxI55/WqQffpsptgUjZQmzNCfwnkGce5zwdneokVuZRl3OlKm77dvijPJcP40NixJbb6SL8JX60IOTMHbMcRxxv1LKAVkF1HJX2SXdR86HQU2H2M+wSLb2tFGyixrAfnTBLHkPZZvTo+POh34CsRiFmaVA8aDuYcp5QfAoLgr7ZinTppbudrgJbjXwTOQx3KQJ6ZPYRQztfQteBegaANrOmQZqtrku43VeeSS/EjtdjcCyBd49X6YItNa12ZzS750TknLUWo7DOUh5GPF2R5bKIrDS/R8RJHRY6lkPgY/Qml4zTO2DOUI2VKha60NOkwm/iqyvcUwlCrRG5tIY+Lw7llvcKLFSW0o2+nT70sx69CPeNynblcvrz7R5zYJp3jF+4lVtelF94bI+Xj9LZa5tjxGr4aVzxNVqki9tUi/lvGK1Y/vpV40Fkpd61qbNWUzKNHzu1CgLXEaLvH1mFyxZi7hN9TGMsFsIOWYy/ni4PBjU7FphHblfpnJLtsSZw5yVE0ZSyOlXl3dlpbUuqlgytpKHCG31We2dnWfbJjsq4uoYK1oM7Ip2IeKUYHWvR9F5GFZhjJpZ/IjkeR7QnbJ8hXXOSSSWS/y4GNwaDGBFeu6Nkt/lhGDodRRy6CT37j0u00U6D4NFdow0QuHLDjzlXP9ErkqvXi282Iry9C2Hd3pKM5ovxVH+yUGr3Tv9thmUptbtFmESW9rx+ShwN7dJV/x3SEVjGkC47peWrwfEHRlCnpdQLd6dzfoPdteQN0T24t1fC3U9uK+j7U+a82mUOsVmRtdWCpV24u3g/fvbNv+NJwnsvXZfW+e7q778YDIuunaDEM5hZQwTBv8bHvBtk0gpq4Ig3baaDuDYsBQsnpm5I7Utd1eKCm7arfbCBwHz2Ol9QbgWYv4o3LuX4RS6aXNU0rznQ1kWzupSHZ1GkEj5DehKuOj1ruyJ5d200bCn6AV7N8JDDAPvnhcoCeTEO1Le2fFOYqPSj6/k1yjdFOIq1fFuiuF7K7oSFBD2lSzAhiPQpitLYZmHcUZealt5LlDe0mRzskRzzPZ/Hco+7dtxj+Mh7s5E6Xuc5oS7crlZjT0ftt5npaoTXXU6aj2LRWJTtv43ppQWj88AMxKsh6SB+fmP/F8TEWBXpqIDQehYrWK3+ziC13X/YPDj/slXryNShZ4ab9EqXsrlNL9/wHw9TUqlQoAAA=="),t=r):"s.css"===o.r?(n.body=atob("H4sIAAAAAAAACo1VTW/jNhD9K4MNFsh6LVlK1tuEQoP2tEBRFL20l6IHihpZrCmSIEexvIb/e0Hqw4qToL0YFjkzfPPmzcxmtYIV+AaVOibWOO+l583eQDi+FZ/gl857CdIb4spAAg2RZZvNP+NJWktYxUPPNpudpKYrU2Ha2WDzTuxfpUDtkcG33/6An+sanYFvqNFxBb93pZJiMoHn+zSD1QZWcILS9ImX36XeMSiNq9AlpekLOENpquMaOJxAGGUcgxsUdVbn011w5mK/c6bTFYObO3GP26wAJTUmDcpdQwzy9Au2BdRGU3gGGWTp43xS81aqI4M/0VVc8wJa3icHWVHD4MujC3bjV55lH8O120nNIAPekSnA8qqKyLe2hzyzEfcNSVIIp+WjI4zBPykNkWmjV3QQxh5f2mfpQ7DnSu504lHVDGqFfYK6KoCwpyReMXAhzRAkrVUPJ6ikt4ofB/N4Trz0cAJrvCRpggsqTvIZi5f05bwUj2J2YazE2jhcT5+8JnSxGJpQE4MPH4rLc8RLhQvn2Vohd6Gy1Ey3IVNlODFQWA/Yya8hbZbwtdFzuETxEtXytlRG7K8qfZf+sA2czTXJIE/vwskoKzfa2R68UbKCm/wrzx62BYjO+SAwa6QmdPO7Y6pweqmCC5W89EZ1hAV8T6SusGeQF0DGXuCEHBlkC1y5wxauyK/ruphlPgnZWC4kHaN3JImJBsUeq88vWPnvQAMBb8SJIT5f5To/my/SuhtcjV2WYedkVcTfhLC1ihMmwqiu1Z5BXrvYJeFPdPZWRx1GjhN8Rk1+KvTEb3oXm+7SvcP3nED8HstHjmtvuUNNc42nzCcxj8dk7HR1aGSo16QJXsnOM9iGunItWz4UNmDNfRQYdyB1LXV0O8NPezzWjrfoYUgoaAJOA5rauJaBM8QJb++/ZhXuPsEZzkN7pEI8UZhcT+SeqGK1dJ4S0UhVrSEtd+vRzLdAbnk7zYbDSEtpVFXAMzqSgqtpFJCx77d0rfqkNaHMKvYf9kklHYpxJJhDzK3FSvLb5RB8yGz/KaQXkbVL/Gt4ry9fdMv5Ld+r7Ma5OPZKmIqXwkXZzpthGJzZIuxrrpa+ue2hVFzsB9H8Dy4GAV8bPlXyeQY6AhghXF70oXPi6FkKUnEb1uL07zU9F8xv4F2umKEHRSjHYgUInIdWLZfD6mMxqD3iwtBqB8dtNDzkD9nC8mEK3lKeXeoxMDiutcBGPvIVZ0Mwd9slKXENZuOYadX2urLTK+Uabnwi2neEfQapbUd/0dHij2VHZPTf1+s0D2PhfGmY0xsrfsxuWNUL20j4xOt9wPQ2nb5rW+7CZn69IP4FVHl/tmcJAAA="),t="text/css"):"status"===o.r?(n.body=atob("H4sIAAAAAAAACoWQQW7CMBBFr2Jl1S6SkEWlLozXCFXqolX3jj00Tjx2Go+BA3GFniAXqyAhUKBl6/fnzR9zkqUFpqwMYZ4gUyoRnDrBSY+Pm+J5Jj76na2j04Z5C80eGj0PqUItXiQgZFk2TolXC01kbf9d1TFMyUBHrVgYp1nbSfiME3Z+M/FlrMigCQhAXk8R9BqmzBtIjcCcQTMFtLvEAUyI7qQwbuUFzw8nC67N+nj3ym7Zym5T9GWqvE1+QVJ7VjDsnq4AUjFLBC+Ho6jfOcnzUvBcm7Xgw98eVrdmdnPzueN9P+6AyVo2cn0tGkZIjcYz4ZC61dne61x5RPirc3G388LjP40HTXFZ9FT3ELghHhJBdaYl0cHXMjwkJMs0kKQYsjokjzwf8Q/Bc6jMwwIAAA=="),t=c):"status.js"===o.r?(n.body=atob("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"),t=r):"history"===o.r?(n.body=atob("H4sIAAAAAAAACmWNOw7CMBBEr2K5giJY9JuVaGnhAv7FLHIweDdRcntEFBBSmineG81AoFH5bJlb3eVJdXlq+uIaX7JG+JPiP+6oEcS6HBGkIkj4aeWSxlNMG3Yt1NNjyy8xJ5KBwSxLroRZUWi5uRELgllvTKDxm+wrPQVrfJ15p8W6pVvqfLiz3oNZ/RulM4CB1AAAAA=="),t=c):"history.js"===o.r?(n.body=atob("H4sIAAAAAAAACnVRS27cMAy9ioadBlLHcZx2N7Yc9BOgi3bTMboxjEaw6VitYqUUJ8HA0G16jO5ysUKTftBFAC7IR/KRfFwcskBdlHeGBGsTDnMvla4XpsNiR3nn7SCKldaBDaNK0OrR5Yn8vbgk8iRh9mIwbED95jmWlHaUnE+a8ykPnlhKzkjpmtqiO+W26FRWVCnpcL7m6eQEVzoVt0WXksv3IOFZOJ1sYFC5nWek983HDxqgHD3JNImEHwXnk1pSFDRUTDVkQctkG31V8SB6Z0LQMFqGer2Mnm4MN/YG5Yz34p1hlOf46kXaSqlYnfFQX6nNsTPwwaGG3jtP2/VC7Xl3AdeEOMMWCAeIifER3tkQ0D38dJb3Abbw+eGH+2r+Av8R1+tl17xuLr/smk8ttS+77iInvHWmRwlCftvPVjwPCjKAPxttoDpLt5VPqLLRIeI/9WKMveF+kqyW3s/BO8zx+CtW2VPCcowlS5W9fbPLb/chNcdfk16cNCECAAA="),t=r):"config"===o.r?(n.body=atob("H4sIAAAAAAAACpVVwW7bOBD9FULAtslBla1mi6CVCRiwu1ES20Hs7J5pcRJNRFKqSCnNnvczcvQnbHvqafVjC8mSbCmpixw1nHnzOJr36HHMSSCY1iPLBGRt0eLpcrKcjifTiedwzKln2FpAkyNJEFjUMyn1DK+DD8PTAT3PQoMStQQwMfcMp54GAYEhyEcy5kA9ZxtoqssSNCxnJC824j5THIk/qSpRJVlVGGdGE41/w+ikLfuzzRbFD4GGSVTQaxgH1IsTg7EiORMZjAZ0LJhBEguIMhLFyqSxECVhEN3MIR2jyoSpU2WWmWyb1ud/WbXPdAIpxvWdW+YS1Za4S4lE1ZJn2mQJclRQ08/0XqF5TGAUhBBE6/hrCYMqb/tdFBtcg2SRzogsNsUm7bbMmWlb/tYUFU8CIqY4GKazimNSbCBn4iPZVXL22FYGTvRXSI5QSEYuZv/9a9ixt1sSaYYD+gaUTj4V34vvGjo4Cu9CcxCpXqnuAEmISjFUtzFJsozX4za8hFxHbfo1RhFEDI2GQyODNKXEE2wNgtzGafW9mDuLz589p4q2gLNqiMxknJhMKdz+wnJUKHRzYfE79XQmJUsf6bzYoGFOAsiZ5zTRWiHIR7dhoxMtSTkqi3pOdUo9p8bdRbrSK9NL/Z3fnK38mb+cTaerxYTY5KL4Z+mvlj65LJ4u/dV45s+nr5LmTjDlSh8anRzYgeSd6dWh3gBfeYUzfz4fX/n+9at4n6Gq/sgbAZ/2lkwObYGyt2V58Q1JBDoqzYDYxGL5nfVamlfTa3+xmPhkuVhMlmN/Np6Q1c187r/OCq/2/GDPA107gbRnS+4JdU/CngG5dOj2Yqf0tBf5QD/0Iie0j/Sevu9FXNpHtoc0lqz8wIgcDUltZse9LHc/y22y8Lg1ReLphKl6DCFl9yxnIUiMPKc8KOfUKMq1g0p+C8nILo8Mewbq2olu/vLHwYDYpHsIe4eNolflmnMgLM1fwAvUzpzCLiH3JUbuC4zcg5TcLqdnDfb5PUcPlHE7BLfPZLFJ70EbjDIN/KB8XVt/ad3N2r54GkBbpcM+09K2U10oUB7WUhe1erLZPvDdT4B/AftziVp7w9Esh+1915kx7VoumchBG0Zrfb6s89XCn/nzP24mz7JM0PTYvW6dNqWnx2kAdT+reAohilO+93pb1Funv4CJVSAwiEZvH1Dx+OFdnIA6shzr+G2NuwxBiEeigXHgVnMdHaSYGJrCl3N9ZBm2toNY3eLdu3ttlcrbHv8PcC4HzMMJAAA="),t=c):"config.js"===o.r?(n.body=atob("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"),t=r):n.code=404:(n.body=atob("H4sIAAAAAAAACqVTy27bMBD8FZaHwkItGb0VscigbXJorgVyLdbk2tqYJlXuyoZR9E/6Hf2B/FghS3koadAAvVDaneHM7Aqq3/jk5NhiI7tg6/5UAeLGYLT1DgWUayAziulkXX6wtZAEtJ9uf2cmDLgVzPViaA78CDs0e8JDm7Iol6JgFKMP5KUxHvfksDwVc4okBKFkBwHNe21rT3vlAjAbSe1Qkjd/tfS0vydwS3G8x220U9Cl9mjf9udSXXXMpL5wEghJzWpQTca1aURaPlssbmhAqjUpgbxBMd9WAeLWPkLqBdhitHgwGlPDip/UtqbYdqL6HZsMntKwIThNBquSBaRj5Rp0W/RmfN4JsFV1gBUGtU55wr8zKE+wvf0VcA/gsV4MjWmMcvwQp42UDzr25Un+mbwhlpSPL0d9QrjP+vEGQrfpXpt0lPmfqC7FNW1eTjrF74N+RfDoX5tzEJnGHE52mVqxLkUWdXF5bQ4UfTpUITkQSrFKmTYUK4oudB55pnskNIlFF8uAorzxyXU7jDJ3GUHwMmBfGTTWV5PWDIs5tC1G/7mh4AfGKvlj9ajbkzJ+v+Ie/rGHrNhMVfQQWhdLrjg7c3F5fY5n+jwb/Q6rjG0AhzPdD67nWk88Z1z8nDt+JhkobnWxdMxVxmA0yzEgN4iie3p1+ht7I82VY9Ynu+F1Iu+Yx/gzzdUN66JejDv+Ayfbnx7RBAAA"),t=c),n.headers=[["Content-Type",t]],e&&n.headers.push(["Content-Encoding","gzip"])}catch(t){u("http - error:"+t),n.code=500}n.send()}),Timer.set(1e4,!0,f),f();

/**
 * Tämä esimerkki hyödyntää Shelly H&T:n lähettämää lämpötilaa pörssisähköohjausten asetuksissa
 * Mitä kylmempi lämpötila, sitä useampi halvempi tunti ohjataan ja samalla myös ohjausminuuttien määrää kasvatetaan.
 * 
 * Käyttöönotto:
 * -----
 * Lisää Shelly H&T-asetuksiin "actions -> sensor reports" -osoitteisiin osoite
 *    http://ip-osoite/script/1/update-temp
 * missä ip-osoite on tämän shellyn osoite. 
 * Muista myös ottaa "sensor reports" -ominaisuus käyttöön
 */

//Kuinka vanha lämpötilatieto sallitaan ohjauksessa (tunteina)
let TEMPERATURE_MAX_AGE_HOURS = 12;

//Viimeisin tiedossa oleva lämpötiladata
let data = null;
//Alkuperäiset muokkaamattomat asetukset
let originalConfig = {
  hours: 0,
  minutes: 60
};

function USER_CONFIG(config, state, initialized) {
  //Tallenentaan alkuperäiset asetukset muistiin
  if (initialized) {
    originalConfig.hours = config.m2.cnt;
    originalConfig.minutes = config.min;

    console.log("Alkuperäiset asetukset:", originalConfig);
  }

  //Käytetää lähtökohtaisesti alkuperäisiin asetuksiin tallennettua tuntimäärää ja ohjausminuutteja
  //Näin ollen jos tallentaa asetukset käyttöliittymältä, tulee ne myös tähän käyttöön
  let hours = originalConfig.hours;
  let minutes = originalConfig.minutes;

  try {

    if (data == null) {
      console.log("Lämpötilatietoa ei ole saatavilla");
      state.s.str = "Lämpötila ei tiedossa -> halvat tunnit: " + hours + " h, ohjaus: " + minutes + " min";

    } else {
      let age = (Date.now() - data.ts) / 1000.0 / 60.0 / 60.0;
      console.log("Lämpötila on tiedossa (päivittynyt " + age.toFixed(2) + " h sitten):", data);

      if (age <= TEMPERATURE_MAX_AGE_HOURS * 60) {
        //------------------------------
        // Toimintalogiikka
        // muokkaa haluamaksesi
        //------------------------------

        //Muutetaan lämpötilan perusteella lämmitystuntien määrää ja minuutteja
        if (data.temp <= -15) {
          hours = 8;
          minutes = 60;

        } else if (data.temp <= -10) {
          hours = 7;
          minutes = 45;

        } else if (data.temp <= -5) {
          hours = 6;
          minutes = 45;
          
        } else {
          //Ei tehdä mitään --> käytetään käyttöliittymän asetuksia
        } 

        //------------------------------
        // Toimintalogiikka päättyy
        //------------------------------
        state.s.str = "Lämpötila " + data.temp.toFixed(1) + "°C (" + age.toFixed(1) + "h sitten) -> halvat tunnit: " + hours + " h, ohjaus: " + minutes + " min";
        console.log("Lämpötila:", data.temp.toFixed(1), "°C -> asetettu halvimpien tuntien määräksi ", hours, "h ja ohjausminuuteiksi", minutes, "min");

      } else {
        console.log("Lämpötilatieto on liian vanha -> ei käytetä");
        state.s.str = "Lämpötilatieto liian vanha (" + age.toFixed(1) + " h) -> halvat tunnit: " + hours + " h, ohjaus: " + minutes + " min";
      }
    }
  } catch (err) {
    state.s.str = "Virhe lämpötilaohjauksessa:" + err;
    console.log("Virhe tapahtui USER_CONFIG-funktiossa. Virhe:", err);
  }

  //Asetetaan arvot asetuksiin
  config.m2.cnt = hours;
  config.min = minutes;

  return config;
}

/**
 * Apufunktio, joka kerää parametrit osoitteesta
 */
function parseParams(params) {
  let res = {};
  let splitted = params.split("&");

  for (let i = 0; i < splitted.length; i++) {
    let pair = splitted[i].split("=");

    res[pair[0]] = pair[1];
  }

  return res;
}

/**
 * Takaisinkutsu, joka suoritetaan kun saadaan HTTP-pyyntö
 */
function onHttpRequest(request, response) {
  try {
    let params = parseParams(request.query);
    request = null;

    if (params.temp != undefined) {
      data = {
        temp: Number(params.temp),
        ts: Math.floor(Date.now())
      };

      console.log("Lämpötilatiedot päivitetty, pyydetään pörssisähkölogiikan ajoa. Data:", data);
      _.s.chkTs = 0;
      response.code = 200;

    } else {
      console.log("Lämpötilatiedojen päivitys epäonnistui, 'temp' puuttuu parametreista:", params);
      response.code = 400;
    }

    response.send();

  } catch (err) {
    console.log("Virhe:", err);
  }
}

//Rekisteröidään /script/x/update-temp -osoite
HTTPServer.registerEndpoint('update-temp', onHttpRequest);