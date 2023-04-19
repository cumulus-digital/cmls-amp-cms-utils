!function(){var t={131:function(t,e,n){"use strict";n.r(e);var o=n(583),i=n(353),r=n(96);((t,e)=>{const n=new o.ZP("AUTO-RELOAD PAGE 0.1");t._CMLS=t._CMLS||{};class s{defaults={condition:"body.home",timeout:8};settings={};timer=null;timeout=null;active=!1;constructor(){let t=arguments.length>0&&arguments[0]!==e&&arguments[0];t instanceof Object&&(n.info("Instantiated with options",t),this.settings=Object.assign(this.defaults,t),this.start())}checkCondition(){let e=t;return(0,i.g5)()&&(e=(0,i.$H)()),e.document.querySelector(this.settings.condition)}start(){let t=arguments.length>0&&arguments[0]!==e?arguments[0]:{};!t instanceof Object?n.error("Received malformed options"):(this.settings=Object.assign(this.settings,t),this.stop(),this.checkCondition()?(this.timeout=new Date(Date.now()+6e4*this.settings.timeout),this.timer=setInterval((()=>this.tick()),1e3),this.active=!0,n.info("Timer initialized",this.timeout?.toISOString()||this.timeout.toUTCString())):n.info("Condition check failed, timer will not start"))}stop(){this.timer&&(n.info("Stopping timer"),clearInterval(this.timer),this.timer=null,this.active=!1)}tick(){Date.now()>this.timeout.getTime()&&this.fire()}fire(){if(this.stop(),!this.checkCondition())return void n.info("Condition check failed, timer will not fire or restart.");const e=t.location.protocol,o=t.location.hostname;let r=t.location.href.replace(`${e}//${o}`,"");if(r.length<1&&(r="/"),(0,i.g5)()){const t=(0,i.$H)();if(t.tgmp)return n.info("Reloading page through TuneGenie Player."),void t.tgmp.updateLocation(r)}t.location.href=r}push(t){n.info("Received request after initialization.",t),this.start(t)}}(0,r.Z)((()=>{t?._CMLS?.autoReload&&t._CMLS.autoReload instanceof Array&&t._CMLS.autoReload.length?t._CMLS.autoReload=new s(t._CMLS.autoReload.pop()):(t._CMLS=t._CMLS||{},t._CMLS.autoReload=new s)})),(0,i.Nj)((()=>{t?._CMLS?.autoReload instanceof s&&t._CMLS.autoReload.stop()}))})(window.self)},26:function(t,e,n){n(543),n(131),n(998),n(657)},543:function(t,e,n){"use strict";n.r(e);var o=n(583),i=n(96),r=n(826),s=n(252);n(353),function(t,e){const n=new o.ZP("SHAREBUTTONS 0.1"),a={facebook:{display_name:"Facebook",url:"https://www.facebook.com/sharer/sharer.php?u={{URL}}",icon:'\n\t\t\t<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t\t\tviewBox="0 0 20.1 20" enable-background="new 0 0 20.1 20" xml:space="preserve" title="Twitter" alt="Twitter">\n\t\t\t\t<path fill="currentColor" d="M20.1,10.1C20.1,4.5,15.6,0,10.1,0S0,4.5,0,10.1c0,5,3.7,9.2,8.5,9.9v-7H5.9v-2.9h2.6V7.8\n\t\t\t\t\tc0-2.5,1.5-3.9,3.8-3.9c1.1,0,2.3,0.2,2.3,0.2v2.5h-1.3c-1.2,0-1.6,0.8-1.6,1.6v1.9h2.8L14,13h-2.3v7C16.4,19.2,20.1,15.1,20.1,10.1\n\t\t\t\t\tz"/>\n\t\t\t</svg>\n\t\t\t'},twitter:{display_name:"Twitter",url:"https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}",icon:'\n\t\t\t<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t\t\t\tviewBox="0 0 24.6 20" enable-background="new 0 0 24.6 20" xml:space="preserve" title="Twitter" alt="Twitter">\n\t\t\t\t<path fill="currentColor" d="M7.7,20c9.3,0,14.4-7.7,14.4-14.4c0-0.2,0-0.4,0-0.7c1-0.7,1.8-1.6,2.5-2.6c-0.9,0.4-1.9,0.7-2.9,0.8\n\t\t\t\t\tc1-0.6,1.8-1.6,2.2-2.8c-1,0.6-2.1,1-3.2,1.2C19.8,0.6,18.5,0,17,0c-2.8,0-5,2.3-5,5c0,0.4,0,0.8,0.1,1.2C7.9,6,4.2,4,1.7,0.9\n\t\t\t\t\tC1.3,1.7,1,2.5,1,3.5c0,1.8,0.9,3.3,2.2,4.2C2.4,7.6,1.7,7.4,1,7c0,0,0,0,0,0.1C1,9.5,2.7,11.6,5,12c-0.4,0.1-0.9,0.2-1.3,0.2\n\t\t\t\t\tc-0.3,0-0.6,0-0.9-0.1c0.6,2,2.5,3.5,4.7,3.5c-1.7,1.4-3.9,2.2-6.3,2.2c-0.4,0-0.8,0-1.2-0.1C2.2,19.2,4.9,20,7.7,20"/>\n\t\t\t</svg>\n\t\t\t'},email:{display_name:"Email",url:"mailto:?subject={{TITLE}}&body={{URL}}",icon:'\n\t\t\t<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t\t\t\tviewBox="0 0 24.6 18" enable-background="new 0 0 24.6 18" xml:space="preserve" title="Email" alt="Email">\n\t\t\t\t<path fill="currentColor" d="M24.4,1.3C24.1,0.5,23.4,0,22.5,0H2.1C1.2,0,0.5,0.5,0.2,1.3C0.1,1.5,0,1.8,0,2.1v0.5v2.2v11.2\n\t\t\t\t\tC0,17.1,0.9,18,2.1,18h20.5c1.1,0,2.1-0.9,2.1-2.1V4.7V2.5V2.1C24.6,1.8,24.6,1.5,24.4,1.3z M23.6,5.3l-11.3,6.2L1,5.3V3.1l11.3,6.2\n\t\t\t\t\tl11.3-6.2V5.3z"/>\n\t\t\t</svg>\n\n\t\t\t'}};(0,i.Z)((()=>{if(document.body.classList.contains("visual-editor-mode-design"))return void n.info("Headway visual editor detected, exiting.");if(t.NO_ADDTHIS_HERE)return void n.info("Share buttons prevented by window.NO_ADDTHIS_HERE");if(t.document.body.classList.contains("home"))return void n.info("Homepage detected, exiting.");if(t.document.querySelector('div[class*="addthis_"]'))return void n.info("Local already has inline addThis container, exiting.");if(t.document.querySelector('script[src*="addthis.com"]'))return void n.info("Local already has addthis script, exiting.");if(t.document.querySelector('script[src*="addtoany.com"]'))return void n.info("Local already has AddToAny script, exiting.");const e=(0,s.Z)(["page-template-default"]);if(!e)return void n.info("Not a basic post, exiting.");n.info("got post",e);const o="shareButtons-"+Math.ceil(6e6*Math.random());if(!t.document.querySelector(`#${o}-style`)){const e="\n\t\t\t\t.cmls-share_buttons {\n\t\t\t\t\tclear: both !important;\n\t\t\t\t\tdisplay: block !important;\n\t\t\t\t\tmargin: 1em 0 !important;\n\t\t\t\t\tfont-size: 16px !important;\n\t\t\t\t\tline-height: 1 !important;\n\t\t\t\t}\n\t\t\t\t.cmls-share_buttons--container {\n\t\t\t\t\tdisplay: flex !important;\n\t\t\t\t\talign-items: center !important;\n\t\t\t\t\tgap: .5em !important;\n\t\t\t\t}\n\t\t\t\t.cmls-share_buttons ul {\n\t\t\t\t\tdisplay: flex !important;\n\t\t\t\t\talign-items: center !important;\n\t\t\t\t\tgap: .75em !important;\n\t\t\t\t\tlist-style: none !important;\n\t\t\t\t\tmargin: 0 !important;\n\t\t\t\t\tpadding: 0 !important;\n\t\t\t\t}\n\t\t\t\t.cmls-share_buttons li {\n\t\t\t\t\tmargin: 0 !important;\n\t\t\t\t\tpadding: 0 !important;\n\t\t\t\t}\n\t\t\t\t.cmls-share_buttons a:visited {\n\t\t\t\t\tcolor: inherit\n\t\t\t\t}\n\t\t\t\t.cmls-share_buttons svg {\n\t\t\t\t\theight: 1.5em !important;\n\t\t\t\t\twidth: 1.5em !important;\n\t\t\t\t}\n\t\t\t",n=r.Z.el("style");n.id=`${o}-style`,n.innerHTML=e,t.document.body.appendChild(n)}const i=[];Object.keys(a).forEach((e=>{const n=a[e],o=n.url.replace(/\{\{URL\}\}/g,encodeURIComponent(t.location.href)).replace(/\{\{TITLE\}\}/g,encodeURIComponent(t.document.title)),r=n.icon,s=n.display_name;i.push(`\n\t\t\t\t<li>\n\t\t\t\t\t<a href="${o}" target="_blank" rel="noopener" class="cmls-share_buttons--icon" title="${s}">\n\t\t\t\t\t\t${r}\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t`)}));const c=r.Z.el("div",{id:o,class:"cmls-share_buttons"});c.innerHTML='\n\t\t\t<nav class="cmls-share_buttons--container">\n\t\t\t\t<div class="cmls-share_buttons--label">Share this:</div>\n\t\t\t\t<ul>\n\t\t\t\t\t{{SERVICES}}\n\t\t\t\t</ul>\n\t\t\t</nav>\n\t\t'.replace("{{SERVICES}}",i.join("\n")),e.after(c),n.info("Share buttons injected."),c.addEventListener("click",(e=>{const o=e.target.closest(".cmls-share_buttons--icon");o&&t.gtag&&(n.info("Share click!",o.title),((e,n,o)=>{t.gtag&&t.gtag("event","share",{method:e,content_type:"post",item_id:o})})(o.title,0,t.location.href))}))}))}(window.self)},998:function(t,e,n){"use strict";n.r(e);var o=n(583),i=n(353),r=n(96);((t,e,n)=>{const s="socialListenLive",a=new o.ZP("SOCIAL LISTEN LIVE LINK 0.1");if(!t)return void a.warn("jQuery not available");const c=['.block-type-social a:has([alt="Listen Live!!"])','.block-type-social a:has([title="Listen Live!!"])','.block-type-social a[alt="Listen Live!!"]','.block-type-social a[title="Listen Live!!"]',".nav-listenlive a, .nav-listenlive img",".cmlistenlive-start"];(0,r.Z)((()=>{(0,i.wO)().then((()=>{a.info("Attaching click listener to our selectors",c),t(e.document.body).off(`click.${s}`).on(`click.${s}`,c.join(","),(t=>{(0,i.g5)()&&(t.preventDefault(),a.info("Caught a listen live request"),e._CMLS.switchStream({brand:e.top?.tgmp_default_brand,theme:e.top?.tgmp_default_theme,autostart:!0}))})),(0,i.Nj)((()=>{t(e).off(`click.${s}`)}))}))}))})(window?.jQuery,window.self)},657:function(t,e,n){"use strict";n.r(e);var o=n(583),i=n(353),r=n(96);((t,e,n)=>{const s="tgmpSwitchStream",a=new o.ZP("TGMP SWITCHSTREAM 0.6");if(!t)return void a.warn("jQuery not available");const c=[".tgmp-switchstream",'[alt*="tgmp-switchstream"]','[href*="tgmp-switchstream"]'];e._CMLS=e._CMLS||{},e._CMLS.switchStream=function(){let t=arguments.length>0&&arguments[0]!==n?arguments[0]:"",o=arguments.length>1&&arguments[1]!==n?arguments[1]:"",r=!(arguments.length>2&&arguments[2]!==n)||arguments[2],s=arguments.length>3&&arguments[3]!==n?arguments[3]:"true";"[object Object]"===Object.prototype.toString.call(t)&&(s=t?.userInitStart||s,r=t?.autostart||r,o=t?.theme||o,t=t?.brand),!1===r&&(s="false"),e.top.tgmp_default_brand=e.top.tgmp_default_brand||""+e.top?.tgmp?.options?.brand,e.top.tgmp_default_theme=e.top.tgmp_default_theme||e.top?.tgmp?.options?.theme,t||(t=e.top.tgmp_default_brand),o||(o=e.top.tgmp_default_theme||["#000"]),a.info("Received switchStream request",{brand:t,theme:o,userInitStart:s}),(0,i.g5)()&&"function"==typeof e?.tgmp?.update&&(a.info("Updating TuneGenie",{brand:t,theme:o,userInitStart:s}),e.tgmp.update({brand:t,theme:o,userInitStart:s}))},e._CMLS.switchTGMPStream=function(){let t=arguments.length>0&&arguments[0]!==n?arguments[0]:"",o=arguments.length>1&&arguments[1]!==n&&arguments[1],i=arguments.length>2&&arguments[2]!==n?arguments[2]:"";e._CMLS.switchStream(t,i,o)},(0,r.Z)((()=>{(0,i.wO)().then((()=>{e.top.tgmp_default_brand=e.top.tgmp_default_brand||""+e.top?.tgmp?.options?.brand,e.top.tgmp_default_theme=e.top.tgmp_default_theme||e.top?.tgmp?.options?.theme;const n=c.join(",");a.info("Attaching click handler to our selectors.",c),t(e.document.body).off(`click.${s}`).on(`click.${s}`,n,(t=>{if((0,i.g5)()){t.preventDefault();const o=(t=>{const e="tgmp-switchstream";return t.className.includes(e)?"class":t.getAttribute("alt")?.includes(e)?"alt":t.href?.includes(e)?"href":void 0})(t.currentTarget);if(a.info("Caught click",t,n,o),o){const n=((t,e)=>{const n={brand:"",theme:"",autostart:!1},o=t.getAttribute(e);let i=o.match(/tgmp\-streamid\-([a-z0-9]+)/i),r=o.match(/tgmp\-theme-([\#a-z0-9]+)/i),s=o.match(/tgmp\-autostart/i);return i?.length>1&&(n.brand=i.pop()),r?.length>1&&(n.theme=r.pop()),s&&(n.autostart=!0),n})(t.currentTarget,o);a.info("Received command",n),e._CMLS.switchStream(n)}}})),(0,i.Nj)((()=>{t(e).off(`click.${s}`)}))}))}))})(window?.jQuery,window.self)},583:function(t,e,n){"use strict";n.d(e,{ZP:function(){return r}});const o={},i=(t,e,n)=>{t/=255,e/=255,n/=255;const o=Math.max(t,e,n),i=o-Math.min(t,e,n),r=0===i?0:i&&o===t?(e-n)/i:o===e?2+(n-t)/i:4+(t-e)/i;return[60*(r<0?r+6:r),o&&i/o*100,100*o]};class r{background=null;foreground=null;#t=null;constructor(t){o[t]?(this.background=o[t]?.background,this.foreground=o[t]?.foreground):(this.background=(()=>{let t,e=!1;for(;!e;){t=Math.floor(16777215*Math.random());const n=i.apply(void 0,[t>>16&255,t>>8&255,255&t]);n[0]>25&&n[0]<330&&(e=!0)}return("000000"+t.toString(16)).slice(-6)})(),this.foreground=(t=>{const e=parseInt(t,16);return(e>>16&255)/255*.2126+(e>>8&255)/255*.7152+(e>>0&255)/255*.0722>.6?"000000":"FFFFFF"})(this.background),o[t]={background:this.background,foreground:this.foreground}),this.header=[`%c ${t} `,`background: #${this.background}; color: #${this.foreground}`]}timestamp(){return(new Date)?.toISOString()||(new Date).toUTCString()}resolveMessage(t){let e=t,n=160;return Array.isArray(t)&&t.length>0&&t[0]?.message&&t[0]?.headerLength&&(e=t[0].message,n=t[0].headerLength),{message:e,headerLength:n}}smallString(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:160;return t?(t instanceof Element?t.innerHTML:t.toString()).substring(0,e):t}displayHeader(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:160,o=[...this.header,{debug:"🐞",info:"ℹ️",warn:"🚸",error:"🚨"}?.[t]];e&&(Array.isArray(e)?o.push(this.smallString(e.map((t=>"string"!=typeof t?JSON.stringify(t):t)).join(" || "),n)):o.push(this.smallString(e,n))),window.top.console.groupCollapsed.apply(window.top.console,o)}displayFooter(){window.top.console.debug("TIMESTAMP:",this.timestamp()),window.top.console.trace(),window.top.console.groupEnd()}logMessage(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:160;if("object"!=typeof console||!console.groupCollapsed)return!1;let o=!1;try{(/(1|true|yes)/i.test(window.sessionStorage.getItem("cmlsDebug"))||/cmlsDebug/i.test(window.document.cookie))&&(o=!0)}catch(t){}(window?._CMLS?.debug||o)&&(this.displayHeader(t,e,n),n!==1/0&&window.top.console.debug(e),this.displayFooter())}info(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];let{message:o,headerLength:i}=this.resolveMessage(e);this.logMessage("info",o,i)}debug(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];let{message:o,headerLength:i}=this.resolveMessage(e);this.logMessage("debug",o,i)}warn(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];let{message:o,headerLength:i}=this.resolveMessage(e);this.logMessage("warn",o,i)}error(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];let{message:o,headerLength:i}=this.resolveMessage(e);this.logMessage("error",o,i)}}},826:function(t,e){"use strict";const n=window.self.document,o={el:function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const o=n.createElement(t);if(null!==e&&("function"==typeof e||"object"==typeof e))for(const t in e)o.setAttribute(t,e[t]);return o},script:function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e=Object.assign(e,{type:"text/javascript",async:!0,src:t}),o.el("script",e)},iframe:function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";var n=o.el("iframe",t);return n.onload=()=>{n.onload=!1;const t=n.contentWindow.document;t.open(),t.write(e),t.close()},n}};e.Z=o},96:function(t,e){"use strict";e.Z=t=>{"loading"!==window.self.document.readyState?t():window.self.document.addEventListener("DOMContentLoaded",t)}},252:function(t,e,n){"use strict";var o=n(583);e.Z=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];const e=new o.ZP("GET BASIC POST 0.1"),n=window.self.document;let i=["post-template-default","feed_posts-template","feed_posts-template-single","feed_posts-template-default"];if(t?.length&&(i=i.concat(t)),!i.some((t=>n.body.classList.contains(t))))return e.info("Not the default post template.",n.body.classList),!1;const r=[...n.body.classList].find((t=>t.match(/(post|page)\-?id\-/)))?.replace(/(post|page)\-?id\-/,"");if(!r)return e.info("Could not discover post ID"),!1;let s=n.querySelector(`.wrapper-content .column-1 #post-${r},.express-content .wp-block-post-content`);if(!s)return e.info("Could not discover post content."),!1;if(s.classList.contains("wp-block-post-content")){let t=n.querySelector(`.themify_builder_content[data-postid="${r}"]`);t?.parentElement?.classList.contains("wp-block-post-content")&&(s=t.parentElement)}const a=s.getBoundingClientRect();return a.width>800||a.width<320?(e.info("Post content width is suspicious.",a.width),!1):s}},353:function(t,e,n){"use strict";n.d(e,{$H:function(){return l},Nj:function(){return h},g5:function(){return a},wO:function(){return c}});var o=n(217),i=n(96);let r=null,s=0;const a=()=>{if(window.top.tgmp)return r="tunegenie",window.self.document.body.classList.contains("cmls-player-tunegenie")||window.self.document.body.classList.add("cmls-player-tunegenie"),r},c=()=>new Promise((function t(e,n){if(a())(0,o.Z)(window,"cmls-player-detected",r),e(a());else{if(s>20)return;s++,setTimeout(t.bind(this,e,n),500)}})),l=()=>{const t=window.top.document.querySelector('iframe[name="pwm_pageFrame"]');return t?t.contentWindow:window.top},d=[];let u=!1,p=!1;const m=new MutationObserver(((t,e)=>{for(const e of t)if("childList"===e.type&&window.top.document.querySelector('iframe[name="pwm_pageFrame"]')){p=!0;for(const t of d)"function"==typeof t&&t();m.disconnect()}}));(0,i.Z)((()=>{u=!!window.top.document.querySelector('iframe[name="pwm_pageFrame"]'),m.observe(window.top.document.body,{childList:!0})}));const h=t=>{"function"==typeof t&&d.push(t)}},217:function(t,e,n){"use strict";function o(t,e,n){let o;window.document.createEvent?(o=window.document.createEvent("CustomEvent"),o.initCustomEvent(e,!0,!0,n)):o=new CustomEvent(e,{detail:n}),t.dispatchEvent(o)}n.d(e,{Z:function(){return o}})}},e={};function n(o){var i=e[o];if(void 0!==i)return i.exports;var r=e[o]={exports:{}};return t[o](r,r.exports,n),r.exports}n.d=function(t,e){for(var o in e)n.o(e,o)&&!n.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n(26)}();