(()=>{var t={576:(t,e,n)=>{"use strict";n.r(e);var o=n(583),i=n(96),s=n(826),a=n(252),r=n(353);((t,e,n)=>{const d="addThisInjector",l=new o.ZP("ADDTHIS INJECTOR 0.1"),c="ra-55dc79597bae383e";(0,i.Z)((()=>{if(document.body.classList.contains("visual-editor-mode-design"))l.info("Headway visual editor detected, exiting.");else if(e?.addthis&&e?.addthis_config?.pubid!==c)l.info("addThis already included by local.");else if(e.NO_ADDTHIS_HERE)l.info("addThis prevented by window.NO_ADDTHIS_HERE");else if(e.document.body.classList.contains("home"))l.info("Homepage detected, exiting.");else if(e.document.querySelector('div[class*="addthis_"]'))l.info("Local already has inline addThis container, exiting.");else if(e.document.querySelector('script[src*="addthis.com"]'))l.info("Local already has addthis script, exiting.");else{if(e.addthis_config=e.addthis_config||{},e.addthis_config.pubid=c,e.addthis_config.data_ga_social=!0,!e.document.getElementById(`${d}-script`)){l.info("Injecting library");const n=s.Z.script("//s7.addthis.com/js/300/addthis_widget.js#async=1&amp;pubid=ra-55dc79597bae383e",{id:`${d}-script`,async:!0});n.onload=function(){const n=(0,a.Z)(),o=d+"-"+Math.ceil(6e6*Math.random()),i=s.Z.el("aside",{id:o,class:"addthis_toolbox addthis_32x32_style"}),r=s.Z.el("style",{id:`${o}-style`});i.innerHTML='\n\t\t\t\t<div class="custom-label">Share this:</div>\n\t\t\t\t<a class="addthis_button_facebook"></a>\n\t\t\t\t<a class="addthis_button_twitter"></a>\n\t\t\t\t<a class="addthis_button_mailto"></a>\n\t\t\t\t<a class="addthis_button_compact"></a>\n\t\t\t',r.innerHTML=`\n\t\t\t\t#${o} {\n\t\t\t\t\tfont-size: 1rem;\n\t\t\t\t}\n\t\t\t\t#${o} .custom-label {\n\t\t\t\t\tline-height: 32px;\n\t\t\t\t\tfloat: left;\n\t\t\t\t}\n\t\t\t\t#${o} .at-icon-wrapper {\n\t\t\t\t\tbackground: transparent !important;\n\t\t\t\t\tborder-radius: 2px;\n\t\t\t\t}\n\t\t\t\t#${o} svg { fill: #666 }\n\t\t\t\t#${o} a:hover svg { fill: #111 }\n\t\t\t\t#${o} a.addthis_button_twitter:hover svg {\n\t\t\t\t\tfill: #1DA1F2;\n\t\t\t\t}\n\t\t\t\t#${o} a.addthis_button_facebook:hover svg {\n\t\t\t\t\tfill: #4267B2;\n\t\t\t\t}\n\t\t\t\t#${o} a.addthis_button_pinterest:hover svg {\n\t\t\t\t\tfill: #E60023;\n\t\t\t\t}\n\t\t\t\t#${o} a.addthis_button_gmail:hover svg {\n\t\t\t\t\tfill: #DB4437;\n\t\t\t\t}\n\t\t\t\t#${o} a.addthis_button_linkedin:hover svg {\n\t\t\t\t\tfill: #0072b1;\n\t\t\t\t}\n\t\t\t`;const c=e=>{l.info("Injecting inline share buttons."),i.classList.add("addthis_default_style");const n=t(e);n.after(r),n.after(i),addthis.init()};if(n)c(n);else if(e.document.querySelector("body.single,body.layout-using-single"))if(e.matchMedia("(min-width: 600px)").matches)l.info("Injecting floating share buttons"),i.classList.add("addthis_floating_style"),r.innerHTML+=`\n\t\t\t\t\t#${o} {\n\t\t\t\t\t\tbackground: white;\n\t\t\t\t\t\tborder: 1px solid #666;\n\t\t\t\t\t\tborder-radius: 3px;\n\t\t\t\t\t\tleft: -1px;\n\t\t\t\t\t\tbottom: 100px;\n\t\t\t\t\t\tz-index: 999999;\n\t\t\t\t\t}\n\t\t\t\t\t#${o} .custom-label {\n\t\t\t\t\t\tdisplay: none;\n\t\t\t\t\t}\n\t\t\t\t\t#${o} .addthis_button_compact,\n\t\t\t\t\t#${o} .addthis_button_compact .at-icon-wrapper {\n\t\t\t\t\t\tmargin-bottom: 0;\n\t\t\t\t\t}\n\t\t\t\t\t#${o} a:hover .at-icon-wrapper {\n\t\t\t\t\t\tbackground: rgba(0,0,0,0.15) !important;\n\t\t\t\t\t}\n\t\t\t\t`,e.document.body.appendChild(r),e.document.body.appendChild(i),addthis.init();else{let e=document.body.className.match(/(page|post)\-id\-(\d+)/),n=!1;n=e&&e.length>2?t(`.wrapper-content > .grid-container article#post-${e[2]}:first`):t(".wrapper-content > .grid-container > *:last,.is-fse-theme .wp-block-post-content:first"),console.log(n),n.length&&c(n)}},e.document.body.appendChild(n)}(0,r.Nj)((()=>{const t=["addthis","addthis_close","addthis_conf","addthis_config","addthis_exclude","addthis_open","addthis_options","addthis_options_default","addthis_options_rank","addthis_sendto","addthis_share","addthis_use_personalization","_adr","_atc","_atd","_ate"];try{const n=e.top.document.querySelectorAll(`[id*="${d}"],#_atssh,#at4-thankyou,#at-expanded-menu-host`);Array.prototype.forEach.call(n,(t=>t.remove())),t.forEach((t=>{e.top[t]&&delete e.top[t]}))}catch(t){}}))}}))})(window?.jQuery,window.self)},131:(t,e,n)=>{"use strict";n.r(e);var o=n(583),i=n(353),s=n(96);((t,e)=>{const n=new o.ZP("AUTO-RELOAD PAGE 0.1");t._CMLS=t._CMLS||{};class a{defaults={condition:"body.home",timeout:8};settings={};timer=null;timeout=null;active=!1;constructor(){let t=arguments.length>0&&arguments[0]!==e&&arguments[0];t instanceof Object&&(n.info("Instantiated with options",t),this.settings=Object.assign(this.defaults,t),this.start())}checkCondition(){let e=t;return(0,i.g5)()&&(e=(0,i.$H)()),e.document.querySelector(this.settings.condition)}start(){let t=arguments.length>0&&arguments[0]!==e?arguments[0]:{};!t instanceof Object?n.error("Received malformed options"):(this.settings=Object.assign(this.settings,t),this.stop(),this.checkCondition()?(this.timeout=new Date(Date.now()+6e4*this.settings.timeout),this.timer=setInterval((()=>this.tick()),1e3),this.active=!0,n.info("Timer initialized",this.timeout?.toISOString()||this.timeout.toUTCString())):n.info("Condition check failed, timer will not start"))}stop(){this.timer&&(n.info("Stopping timer"),clearInterval(this.timer),this.timer=null,this.active=!1)}tick(){Date.now()>this.timeout.getTime()&&this.fire()}fire(){if(this.stop(),!this.checkCondition())return void n.info("Condition check failed, timer will not fire or restart.");const e=t.location.protocol,o=t.location.hostname;let s=t.location.href.replace(`${e}//${o}`,"");if(s.length<1&&(s="/"),(0,i.g5)()){const t=(0,i.$H)();if(t.tgmp)return n.info("Reloading page through TuneGenie Player."),void t.tgmp.updateLocation(s)}t.location.href=s}push(t){n.info("Received request after initialization.",t),this.start(t)}}(0,s.Z)((()=>{t?._CMLS?.autoReload&&t._CMLS.autoReload instanceof Array&&t._CMLS.autoReload.length?t._CMLS.autoReload=new a(t._CMLS.autoReload.pop()):(t._CMLS=t._CMLS||{},t._CMLS.autoReload=new a)})),(0,i.Nj)((()=>{t?._CMLS?.autoReload instanceof a&&t._CMLS.autoReload.stop()}))})(window.self)},26:(t,e,n)=>{n(576),n(131),n(998),n(657)},998:(t,e,n)=>{"use strict";n.r(e);var o=n(583),i=n(353),s=n(96);((t,e,n)=>{const a="socialListenLive",r=new o.ZP("SOCIAL LISTEN LIVE LINK 0.1");if(!t)return void r.warn("jQuery not available");const d=['.block-type-social a:has([alt="Listen Live!!"])','.block-type-social a:has([title="Listen Live!!"])','.block-type-social a[alt="Listen Live!!"]','.block-type-social a[title="Listen Live!!"]',".nav-listenlive a, .nav-listenlive img",".cmlistenlive-start"];(0,s.Z)((()=>{(0,i.wO)().then((()=>{r.info("Attaching click listener to our selectors",d),t(e.document.body).off(`click.${a}`).on(`click.${a}`,d.join(","),(t=>{(0,i.g5)()&&(t.preventDefault(),r.info("Caught a listen live request"),e._CMLS.switchStream({brand:e.top?.tgmp_default_brand,theme:e.top?.tgmp_default_theme,autostart:!0}))})),(0,i.Nj)((()=>{t(e).off(`click.${a}`)}))}))}))})(window?.jQuery,window.self)},657:(t,e,n)=>{"use strict";n.r(e);var o=n(583),i=n(353),s=n(96);((t,e,n)=>{const a="tgmpSwitchStream",r=new o.ZP("TGMP SWITCHSTREAM 0.6");if(!t)return void r.warn("jQuery not available");const d=[".tgmp-switchstream",'[alt*="tgmp-switchstream"]','[href*="tgmp-switchstream"]'];e._CMLS=e._CMLS||{},e._CMLS.switchStream=function(){let t=arguments.length>0&&arguments[0]!==n?arguments[0]:"",o=arguments.length>1&&arguments[1]!==n?arguments[1]:"",s=!(arguments.length>2&&arguments[2]!==n)||arguments[2],a=arguments.length>3&&arguments[3]!==n?arguments[3]:"true";"[object Object]"===Object.prototype.toString.call(t)&&(a=t?.userInitStart||a,s=t?.autostart||s,o=t?.theme||o,t=t?.brand),!1===s&&(a="false"),e.top.tgmp_default_brand=e.top.tgmp_default_brand||""+e.top?.tgmp?.options?.brand,e.top.tgmp_default_theme=e.top.tgmp_default_theme||e.top?.tgmp?.options?.theme,t||(t=e.top.tgmp_default_brand),o||(o=e.top.tgmp_default_theme||["#000"]),r.info("Received switchStream request",{brand:t,theme:o,userInitStart:a}),(0,i.g5)()&&"function"==typeof e?.tgmp?.update&&(r.info("Updating TuneGenie",{brand:t,theme:o,userInitStart:a}),e.tgmp.update({brand:t,theme:o,userInitStart:a}))},e._CMLS.switchTGMPStream=function(){let t=arguments.length>0&&arguments[0]!==n?arguments[0]:"",o=arguments.length>1&&arguments[1]!==n&&arguments[1],i=arguments.length>2&&arguments[2]!==n?arguments[2]:"";e._CMLS.switchStream(t,i,o)},(0,s.Z)((()=>{(0,i.wO)().then((()=>{e.top.tgmp_default_brand=e.top.tgmp_default_brand||""+e.top?.tgmp?.options?.brand,e.top.tgmp_default_theme=e.top.tgmp_default_theme||e.top?.tgmp?.options?.theme;const n=d.join(",");r.info("Attaching click handler to our selectors.",d),t(e.document.body).off(`click.${a}`).on(`click.${a}`,n,(t=>{if((0,i.g5)()){t.preventDefault();const o=(t=>{const e="tgmp-switchstream";return t.className.includes(e)?"class":t.getAttribute("alt")?.includes(e)?"alt":t.href?.includes(e)?"href":void 0})(t.currentTarget);if(r.info("Caught click",t,n,o),o){const n=((t,e)=>{const n={brand:"",theme:"",autostart:!1},o=t.getAttribute(e);let i=o.match(/tgmp\-streamid\-([a-z0-9]+)/i),s=o.match(/tgmp\-theme-([\#a-z0-9]+)/i),a=o.match(/tgmp\-autostart/i);return i?.length>1&&(n.brand=i.pop()),s?.length>1&&(n.theme=s.pop()),a&&(n.autostart=!0),n})(t.currentTarget,o);r.info("Received command",n),e._CMLS.switchStream(n)}}})),(0,i.Nj)((()=>{t(e).off(`click.${a}`)}))}))}))})(window?.jQuery,window.self)},583:(t,e,n)=>{"use strict";n.d(e,{ZP:()=>i});const o={};class i{background=null;foreground=null;#t=null;constructor(t){o[t]?(this.background=o[t]?.background,this.foreground=o[t]?.foreground):(this.background=("000000"+Math.floor(16777215*Math.random()).toString(16)).slice(-6),this.foreground=(t=>{const e=parseInt(t,16);return.2126*(e>>16&255)+.7152*(e>>8&255)+.0722*(e>>0&255)>140?"000000":"FFFFFF"})(this.background),o[t]={background:this.background,foreground:this.foreground}),this.header=[`%c ${t} `,`background: #${this.background}; color: #${this.foreground}`]}timestamp(){return(new Date)?.toISOString()||(new Date).toUTCString()}resolveMessage(t){let e=t,n=160;return Array.isArray(t)&&t.length>0&&t[0]?.message&&t[0]?.headerLength&&(e=t[0].message,n=t[0].headerLength),{message:e,headerLength:n}}smallString(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:160;return t?(t instanceof Element?t.innerHTML:t.toString()).substring(0,e):t}displayHeader(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:160,o=[...this.header,{debug:"🐞",info:"ℹ️",warn:"🚸",error:"🚨"}?.[t]];e&&(Array.isArray(e)?o.push(this.smallString(e.map((t=>"string"!=typeof t?JSON.stringify(t):t)).join(" || "),n)):o.push(this.smallString(e,n))),window.top.console.groupCollapsed.apply(window.top.console,o)}displayFooter(){window.top.console.debug("TIMESTAMP:",this.timestamp()),window.top.console.trace(),window.top.console.groupEnd()}logMessage(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:160;if("object"!=typeof console||!console.groupCollapsed)return!1;let o=!1;try{(/(1|true|yes)/i.test(window.sessionStorage.getItem("cmlsDebug"))||/cmlsDebug/i.test(window.document.cookie))&&(o=!0)}catch(t){}(window?._CMLS?.debug||o)&&(this.displayHeader(t,e,n),n!==1/0&&window.top.console.debug(e),this.displayFooter())}info(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];let{message:o,headerLength:i}=this.resolveMessage(e);this.logMessage("info",o,i)}debug(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];let{message:o,headerLength:i}=this.resolveMessage(e);this.logMessage("debug",o,i)}warn(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];let{message:o,headerLength:i}=this.resolveMessage(e);this.logMessage("warn",o,i)}error(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];let{message:o,headerLength:i}=this.resolveMessage(e);this.logMessage("error",o,i)}}},826:(t,e,n)=>{"use strict";n.d(e,{Z:()=>s});const o=window.self.document,i={el:function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=o.createElement(t);if(null!==e&&("function"==typeof e||"object"==typeof e))for(const t in e)n.setAttribute(t,e[t]);return n},script:function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e=Object.assign(e,{type:"text/javascript",async:!0,src:t}),i.el("script",e)},iframe:function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";var n=i.el("iframe",t);return n.onload=()=>{n.onload=!1;const t=n.contentWindow.document;t.open(),t.write(e),t.close()},n}},s=i},96:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});const o=t=>{"loading"!==window.self.document.readyState?t():window.self.document.addEventListener("DOMContentLoaded",t)}},252:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var o=n(583);const i=function(){const t=new o.ZP("GET BASIC POST 0.1"),e=window.self.document;if(!["post-template-default","feed_posts-template-single","feed_posts-template-default"].some((t=>e.body.classList.contains(t))))return t.info("Not the default post template.",e.body.classList),!1;const n=[...e.body.classList].find((t=>t.includes("postid-")))?.replace("postid-","");if(!n)return t.info("Could not discover post ID"),!1;const i=e.querySelector(`.wp-block-post-content,.wrapper-content .column-1 #post-${n}`);if(!i)return t.info("Could not discover post content."),!1;const s=i.getBoundingClientRect();return s.width>800||s.width<300?(t.info("Post content width is suspicious.",s.width),!1):i}},353:(t,e,n)=>{"use strict";n.d(e,{$H:()=>l,Nj:()=>g,g5:()=>r,wO:()=>d});var o=n(217),i=n(96);let s=null,a=0;const r=()=>{if(window.top.tgmp)return s="tunegenie",window.self.document.body.classList.contains("cmls-player-tunegenie")||window.self.document.body.classList.add("cmls-player-tunegenie"),s},d=()=>new Promise((function t(e,n){if(r())(0,o.Z)(window,"cmls-player-detected",s),e(r());else{if(a>20)return;a++,setTimeout(t.bind(this,e,n),500)}})),l=()=>{const t=window.top.document.querySelector('iframe[name="pwm_pageFrame"]');return t?t.contentWindow:window.top},c=[];let u=!1,h=!1;const p=new MutationObserver(((t,e)=>{for(const e of t)if("childList"===e.type&&window.top.document.querySelector('iframe[name="pwm_pageFrame"]')){h=!0;for(const t of c)"function"==typeof t&&t();p.disconnect()}}));(0,i.Z)((()=>{u=!!window.top.document.querySelector('iframe[name="pwm_pageFrame"]'),p.observe(window.top.document.body,{childList:!0})}));const g=t=>{"function"==typeof t&&c.push(t)}},217:(t,e,n)=>{"use strict";function o(t,e,n){let o;window.document.createEvent?(o=window.document.createEvent("CustomEvent"),o.initCustomEvent(e,!0,!0,n)):o=new CustomEvent(e,{detail:n}),t.dispatchEvent(o)}n.d(e,{Z:()=>o})}},e={};function n(o){var i=e[o];if(void 0!==i)return i.exports;var s=e[o]={exports:{}};return t[o](s,s.exports,n),s.exports}n.d=(t,e)=>{for(var o in e)n.o(e,o)&&!n.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n(26),n(26)})();