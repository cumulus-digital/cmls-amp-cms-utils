!function(){var e,t,n,i,o,r,s={2128:function(e,t,n){(e=>{new e._CMLS.Logger("ADVERTISING").info({message:"\n                      __\n ______ ____ _  __ __/ /_ _____\n/ __/ // /  ' \\/ // / / // (_-<\n\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/\n   ADVERTISING LIBRARY LOADED",headerLength:1/0})})(window),n(1448)},1448:function(e,t,n){"use strict";n.r(t);var i=n(7978),o=n(4393),r=n(2666);n(5611),n(8236),n(8337);const s=[{name:"advertising/sticky-bottom-320x50",check:()=>{const{scriptName:e,nameSpace:t,version:o,elementId:r}=i,s=new window._CMLS.Logger(`${e} ${o}`),{waitForPlayer:a,detectPlayer:d}=window._CMLS.libs.playerTools,l=()=>{n.e(937).then(n.bind(n,9467))};return new Promise(((e,t)=>{window.matchMedia("(min-width: 800px)").matches&&"tunegenie"!==d()?(s.debug("No TuneGenie player detected on desktop, wait for player before re-injecting."),a().then((()=>{"tunegenie"===d()?e(l):(s.info("Current player does not support sticky ad on desktop."),e(!1))}))):e(l)}))}},{name:"advertising/auto-refresh-ads",check:()=>new Promise(((e,t)=>{(window.self.location.search.includes("cmlsDisableAdRefresh")||window.self.DISABLE_AUTO_REFRESH_ADS)&&e(!1),e((()=>{n.e(58).then(n.bind(n,7954))}))})),loadImmediately:!0,loaderOptions:{async:!1,defer:!1}},{name:"advertising/local-nav-through-player",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{Promise.all([n.e(216),n.e(353)]).then(n.bind(n,8102))})},{name:"advertising/wallpaper",check:()=>new Promise((e=>{window.self.document.body.classList.contains("is-fse-theme")&&e(!1),window.matchMedia("(max-width: 1100px)").matches&&e(!1),e((()=>{n.e(618).then(n.t.bind(n,6446,23))}))}))},{name:"advertising/tgmp-event-targeting",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{n.e(103).then(n.bind(n,5))})},{name:"advertising/paid-content",check:o.default},{name:"advertising/pushdown",check:()=>new Promise((e=>{const t=window.self.document;t.querySelector("body.home")||e(!1),t.querySelector("#gpt-pushdown")&&(log.info("Tag already exists, exiting."),e(!1)),e((()=>{n.e(377).then(n.t.bind(n,8139,23))}))}))},{name:"advertising/sidewalls",check:r.Z}];window._CMLS.libs.doDynamicImports(s)},5611:function(e,t,n){"use strict";n.r(t),n(7658);class i{scriptName="DEFAULT ADTAG INTERFACE";nameSpace="defaultAdtagInterface";parentNameSpace="adTagDetection";version="x";static identity="DEFAULT";static detectTag(){}constructor(){this.log=new window._CMLS.Logger(`${this.scriptName} v${this.version}`)}rawInterface(){}queue(e){return this.rawInterface().cmd.push(e)}pubads(){return this.rawInterface().pubads()}getTargeting(e){}setTargeting(e,t){}isInitialLoadDisabled(){return!1}isReady(){return!1}defaultDefineSlotOptions(){return{adUnitPath:null,size:[],sizeMap:null,div:null,collapse:!0,targeting:[],init:!0,prebid:!1,outOfPage:!1}}defineSlot(e){return{}}destroySlots(e){}getSlots(){return[]}display(e,t=!1){}refresh(e,t={}){}wasSlotRequested(e){return!1}doInitialLoad(e){}filterSlots(e){if(e)return Array.isArray(e)||(e=[e]),e;this.log.warn("Filter called without slots",e)}listSlotData(e){return[]}addListener(){}removeListener(){}}class o extends i{scriptName="GPT INTERFACE";version="0.2";log=null;static identity="GPT";static detectTag(){if(window.self.googletag?.pubadsReady)return!0}initialRequestKey="initial-request-made";inViewPercentage=50;constructor(){super(),this.log=new window._CMLS.Logger(`${this.scriptName} v${this.version}`);const e=this;e.addListener("slotRequested",(t=>{t.slot._cm_displayed&&t.slot.getTargeting(e.initialRequestKey)?.length||(e.log.debug("Setting initial request key",e.listSlotData(t.slot),t),t.slot._cm_displayed=!0,t.slot.setTargeting(e.initialRequestKey,!0))})),e.addListener("slotRenderEnded",(t=>{e.log.debug("Rendered",t)})),e.addListener("slotVisibilityChanged",(t=>{const n=t.inViewPercentage||0;t.slot._cm_visiblePercent=n,t.slot._cm_visible=n>=this.inViewPercentage,e.log.debug(t.slot._cm_visible?"Slot is VIEWABLE":"Slot is HIDDEN",e.listSlotData(t.slot))})),e.addListener("impressionViewable",(t=>{e.log.debug("Slot is VIEWABLE",e.listSlotData(t.slot)),t.slot._cm_visible=!0}))}rawInterface(){return window.self?.googletag}addListener(e,t){const n=this;this.queue((()=>{n.pubads().addEventListener(e,t)}))}removeListener(e,t){return this.pubads().removeEventListener(e,t)}getTargeting(e){return this.pubads().getTargeting(e)}setTargeting(e,t){return this.pubads().setTargeting(e,t)}isInitialLoadDisabled(){return this.pubads().isInitialLoadDisabled()}isReady(){return this.rawInterface().pubadsReady}defineSlot(e){const t=Object.assign(this.defaultDefineSlotOptions(),e);let n=!1;if(t.outOfPage)n=this.rawInterface().defineOutOfPageSlot(t.adUnitPath,t.div);else{const e=window.self!==window.parent;let i=t?.size;if(e&&t?.sizeMap?.length){let e=t.sizeMap;Array.isArray(e)||(e=[e]),e.some((e=>{if(!(e.length<2||e[0].length<2))return matchMedia(`(min-width: ${e[0][0]}px) and (min-height: ${e[0][1]}px)`).matches?(i=e[1],!0):void 0;log.debug("Invalid map",e)}))}if(!i)return this.log.error("defineSlot must be provided with a size property."),!1;this.log.debug("Winning sizemap",t.div,i),n=this.rawInterface().defineSlot(t.adUnitPath,i,t.div),n&&!e&&t?.sizeMap?.length&&n.defineSizeMapping(t.sizeMap)}return n?(this.log.info("Slot created",this.listSlotData(n)),t.hasOwnProperty("collapse")&&(Array.isArray(t.collapse)||(t.collapse=[t.collapse]),n=n.setCollapseEmptyDiv.apply(n,t.collapse)),t.targeting=Array.isArray(t.targeting)?t.targeting:[t.targeting],t.targeting.forEach((e=>{for(const t in e)e?.hasOwnProperty(t)&&(n=n.setTargeting(t,e[t]))})),t.init&&(n=n.addService(this.pubads())),this.log.info("Defined slot",{slot:this.listSlotData(n).shift(),settings:t}),window.GPT_SITE_SLOTS=window.GPT_SITE_SLOTS||{},window.GPT_SITE_SLOTS[n.getSlotElementId()]=n,n):(this.log.error("Failed to create slot!",t),!1)}destroySlots(e){return this.rawInterface().destroySlots(e)}getSlots(){return this.pubads().getSlots()}display(e,t=!1){const n=this;this.queue((()=>{if(n.log.info("Calling display",e,t),n.rawInterface().display(e),t){n.log.info("Forceload enabled for this display call");let i=!1;if(window.GPT_SITE_SLOTS?.[e]?.getSlotElementId)i=window.GPT_SITE_SLOTS[e];else{const t=n.getSlots();if(!t?.length)return void n.log.warn("No slots defined!");t.some((t=>{if(t.getSlotElementId()===e)return i=t,!0}))}i?(n.log.info("Forcing initial load",i.getSlotElementId()),n.doInitialLoad(i)):n.log.warn("Attempted to force initial load but slot was not defined!",e,t,i)}}))}refresh(e,t={}){if(!e)return void this.log.warn("Refresh called without slots");Array.isArray(e)||(e=[e]);const n=this.filterSlots(e);if(n?.length)return this.log.info("Refresh called for slots",this.listSlotData(n)),this.pubads().refresh(n,t);this.log.info("No slots found for refreshing after filtering.")}wasSlotRequested(e){const t=this;if(e?._displayed||e.getTargeting(t.initialRequestKey)?.length)return t.log.info("Has initial request key",t.listSlotData(e)),!0;if(e.getResponseInformation())return t.log.info("Has response info",t.listSlotData(e)),!0;const n=window.self.document.getElementById(e.getSlotElementId());return!!n?.getAttribute("data-google-query-id")&&(t.log.info("Has data attribute",t.listSlotData(e)),!0)}doInitialLoad(e){const t=this;e?(Array.isArray(e)||(e=[e]),t.isInitialLoadDisabled()&&(t.log.info("Initial load requested while initial load is disabled, this will be delayed",t.listSlotData(e)),setTimeout((()=>{const n=[],i=[];e.forEach((e=>{t.wasSlotRequested(e)?i.push(e):n.push(e)})),n.length&&(t.log.info("Delayed initial load firing",t.listSlotData(n)),t.refresh(n)),i.length&&t.log.info("Slots were already requested",t.listSlotData(i))}),500))):t.log.warn("doInitialLoad called without slots")}filterSlots(e){if(!e)return void this.log.warn("Filter called without slots",e);Array.isArray(e)||(e=[e]);const t=[];return e.forEach((e=>{e?.getSlotElementId()&&t.push(e)})),!!t.length&&t}listSlotData(e){Array.isArray(e)||(e=[e]);const t=[];return e.forEach((e=>{const n={_cm_displayed:e?._displayed?"yes":"no",div:e?.getSlotElementId(),pos:e?.getTargeting("pos"),adUnitPath:e?.getAdUnitPath(),sizes:e?.getSizes(),targeting:[]},i=e?.getTargetingKeys();if(i?.length)for(let t of i)n.targeting.push({[t]:e?.getTargeting(t)});t.push(n)})),t}}const r=[class extends o{scriptName="APS-GPT INTERFACE";version="0.1";log=null;static identity="APS-GPT";static detectTag(){if(super.detectTag()&&window?.apstag)return!0}constructor(){super(),this.log=new window._CMLS.Logger(`${this.scriptName} v${this.version}`)}defineSlot(e){const t=Object.assign(this.defaultDefineSlotOptions(),e);return!1!==t?.prebid||t?.targeting?.noprebid||(t.targeting.noprebid="noprebid"),super.defineSlot(t)}filterPrebidSlots(e){const t=this;if(!e)return void t.log.warn("filterPrebidSlots called without slots");Array.isArray(e)||(e=[e]);const n={prebid:[],noprebid:[],all:e=t.filterSlots(e)};return e.forEach((e=>{t.log.info("Checking",e.getSlotElementId());let i=!1;const o=["120x240","120x600","160x600","250x250","300x50","300x100","300x1050","300x300","300x75","300x250","300x600","320x50","320x100","336x280","400x300","468x60","728x90","970x250","970x90"],r=e.getSizes();if(r?.length?r.some((e=>{if(o.includes(`${e.width}x${e.height}`))return i=!0,!0})):i=!1,e.getTargeting("noprebid")?.length&&(i=!1),i)try{n.prebid.push(e)}catch(e){console.log(e)}else n.noprebid.push(e)})),n}refresh(e,t={}){const n=this;if(!e)return void n.log.warn("Refresh called without slots");Array.isArray(e)||(e=[e]),n.log.info("Refresh requested for slots",n.listSlotData(e));const i=n.filterPrebidSlots(e);if(i?.all?.length){if(i?.prebid?.length){n.log.info(`🏷 Requesting bids for ${i.prebid.length} prebid slots`,this.listSlotData(i.prebid));const e=[];i.prebid.forEach((t=>{e.push({slotID:t.getSlotElementId(),slotName:t.getAdUnitPath(),sizes:t.getSizes().map((e=>[e.width,e.height]))})})),o={slots:e,params:{adRefresh:"1"}},n.log.info("fetchBids called",o,o.slots),window.apstag.fetchBids(o,(e=>{n.queue((()=>{window.apstag.setDisplayBids(),n.log.info("🏷 Refreshing prebid slots after bids received",n.listSlotData(i.prebid),e),n.pubads().refresh(i.prebid,t)}))}))}return i?.noprebid?.length?(n.log.info("Refreshing noprebid slots",n.listSlotData(i.noprebid)),n.pubads().refresh(i.noprebid)):void 0}var o;n.log.info("No slots found for refreshing after filtering.")}wasSlotRequested(e){return!!super.wasSlotRequested(e)||!!e.getTargeting("amznbid")?.length&&(this.log.info("Has amznbid targeting",this.listSlotData(e)),!0)}},o];((e,t)=>{const n="adTagDetection",{triggerEvent:i,domReady:o}=e._CMLS.libs,s=new e._CMLS.Logger("ADTAG DETECTION 0.1");e._CMLS=e._CMLS||{},e._CMLS[n]={registeredDetectors:r};const a=(t=0)=>{if(e._CMLS.adTag||t>60)return;s.info(`Running registered detectors (Loop: ${t})`);let o=!1;for(const t of e._CMLS[n].registeredDetectors){if(!t.identity||!t.detectTag){s.error("Invalid interface",t);break}if(s.info("Checking registered detector",t.identity),t.detectTag()){o=!0,e._CMLS.adTag=new t,e._CMLS.adTag.identity=t.identity;break}}if(o)return s.info("Interface detected",e._CMLS.adTag.identity,e._CMLS.adTag),void i(e,"cmls-adtag-loaded",!0);s.warn("No interface detected, re-running detection in 0.15 seconds"),setTimeout((()=>a(t+1)),150)};o((()=>{s.info("Initializing."),a()}))})(window.self)},4393:function(e,t,n){"use strict";n.r(t),t.default=()=>new Promise((e=>{const{getBasicPost:t}=window._CMLS.libs;(window.self.NO_PAIDCONTENT||window.self.NO_PAID_CONTENT||!t())&&e(!1),e((()=>{n.e(354).then(n.t.bind(n,6134,23))}))}))},8236:function(e,t,n){"use strict";n.r(t);var i=JSON.parse('{"scriptName":"REGISTER-AD-PATH","version":"0.3","networkId":"6717"}');(e=>{const{triggerEvent:t}=e._CMLS.libs,{scriptName:n,version:o,networkId:r}=i,s=new e._CMLS.Logger(`${n} ${o}`);function a(){s.info("Checking for ad path");const n=e?._CMLS?.adTag.getSlots();s.info(`Testing ${n.length} slots`),n.length?n.some((n=>{const i=n?.getAdUnitPath();if(i&&i.indexOf(`/${r}/`)>-1)return s.info("Found in-network slot",n.getSlotElementId(),i),e._CMLS=e._CMLS||{},e._CMLS.adPath=i,s.info("Ad path discovered",e._CMLS.adPath),t(e,"cmls-adpath-discovered",e._CMLS.adPath),!0})):s.warn("Found no slots!")}e?._CMLS?.adTag?.isReady()?a():e.addEventListener("cmls-adtag-loaded",(()=>a()))})(window.self)},2666:function(e,t,n){"use strict";t.Z=()=>{const e=new window._CMLS.Logger("SIDEWALL ADS IMPORTER 2.1"),t=window.self;return new Promise(((i,o)=>{setTimeout((()=>{(t.NO_SIDEWALLS||t.NO_SIDE_WALLS)&&(e.info("NO_SIDEWALLS configured."),i(!1)),t._CMLS?.disabled?.sideWalls&&(e.info("_CMLS.disabled.sideWalls configured."),i(!1)),t.document.querySelector('.takeover-left div[id^="div-gpt"],.takeover-right div[id^="div-gpt"],.skyscraper-left div[id^="div-gpt"],.skyscraper-right div[id^="div-gpt"]')&&(e.info("Legacy skyscrapers exist"),i(!1)),i((()=>{n.e(860).then(n.bind(n,7082))}))}),1500)}))}},8337:function(){(e=>{const{h:t,domReady:n}=e._CMLS.libs,i="gpt-w7mtag",o=new e._CMLS.Logger("WEST7-1X1 0.1"),r=e.document,s=()=>{if(r.getElementById(i))return;const n=t("div",{id:i,style:"line-height:0; font-size: 0; height: 0"});r.body.appendChild(n),o.info("Slot injected"),e._CMLS.adTag.queue((()=>{e._CMLS.adTag.defineSlot({adUnitPath:e._CMLS.adPath,size:[[1,1]],div:i,collapse:!0,targeting:{pos:"w7m",noprebid:"noprebid",never_refresh:"true"},prebid:!1})&&e._CMLS.adTag.display(i,e._CMLS.adTag.isInitialLoadDisabled()),o.info("Slot initialized")}))};n((()=>{e?._CMLS?.adPath?s():e.addEventListener("cmls-adpath-discovered",(()=>s()))}))})(window.self)},7984:function(e,t,n){(e=>{new e._CMLS.Logger("ANALYTICS").info({message:"\n                      __\n ______ ____ _  __ __/ /_ _____\n/ __/ // /  ' \\/ // / / // (_-<\n\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/\n     ANALYTICS LIBRARY LOADED",headerLength:1/0})})(window),n(9637)},9637:function(e,t,n){"use strict";n.r(t),window._CMLS.libs.domReady;const i=[{name:"analytics/sgroups-to-gtm",check:()=>{Promise.all([n.e(216),n.e(445)]).then(n.bind(n,1989))}},{name:"analytics/tabvisibility-to-gtm",check:()=>{Promise.all([n.e(216),n.e(133)]).then(n.bind(n,6542))}},{name:"analytics/tgmp-events-to-gtm",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{Promise.all([n.e(216),n.e(771)]).then(n.bind(n,1506))})},{name:"analytics/promoreel-click",check:()=>new Promise((e=>{window.self.document.querySelector("body.home .sliderItem")&&e((()=>{Promise.all([n.e(216),n.e(307)]).then(n.bind(n,2238))})),e(!1)}))}];window._CMLS.libs.doDynamicImports(i)},3272:function(e,t,n){n(9812),n(2128),n(7984)},4489:function(e,t,n){n(2502)},2502:function(e,t,n){"use strict";n.r(t);const{getBasicPost:i}=window._CMLS.libs,o=new window._CMLS.Logger("SHAREBUTTONS 0.2"),{getPageWindow:r}=window._CMLS.libs.playerTools,s=[{name:"functionality/sharebuttons",check:()=>{if(document.body.classList.contains("visual-editor-mode-design"))o.info("Headway visual editor detected.");else if(window.NO_ADDTHIS_HERE)o.info("Share buttons prevented by window.NO_ADDTHIS_HERE");else if(window.document.body.classList.contains("home"))o.info("Homepage detected.");else if(window.document.querySelector('div[class*="addthis_"]'))o.info("Local already has inline addThis container.");else if(window.document.querySelector('script[src*="addthis.com"]'))o.info("Local already has addthis script.");else if(window.document.querySelector('script[src*="addtoany.com"]'))o.info("Local already has AddToAny script.");else if(i(["page-template-default"]))return()=>{n.e(894).then(n.t.bind(n,7222,23))}}},{name:"functionality/social-listen-live",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{n.e(972).then(n.t.bind(n,1608,23))})},{name:"functionality/auto-reload-page",check:()=>new Promise((e=>{const t=r();t?._CMLS?.autoReload&&t._CMLS.autoReload instanceof Array&&t._CMLS.autoReload.length&&t?.document?.body?.matches("body.home")?e((()=>{Promise.all([n.e(216),n.e(800)]).then(n.bind(n,6100))})):e(!1)}))},{name:"functionality/tgmp-switchstream",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{n.e(710).then(n.t.bind(n,522,23))})}];window._CMLS.libs.doDynamicImports(s)},9812:function(e,t,n){"use strict";n.r(t);var i={};n.r(i),n.d(i,{addAfterPageFrame:function(){return E},detectPlayer:function(){return b},getPageWindow:function(){return S},isInIframe:function(){return v},navigateThroughPlayer:function(){return y},waitForPlayer:function(){return _}});var o={};n.r(o),n.d(o,{dataLayers:function(){return O},push:function(){return k}});var r={};n.r(r),n.d(r,{addVisibilityListener:function(){return F},api:function(){return N},isVisible:function(){return j},removeVisibilityListener:function(){return q}}),n(6229),n(7330),n(2062);var s=n(3493),a=n.n(s),d=n(3279),l=n.n(d);n(7658);const c={},u=(e,t,n)=>{e/=255,t/=255,n/=255;const i=Math.max(e,t,n),o=i-Math.min(e,t,n),r=0===o?0:o&&i===e?(t-n)/o:i===t?2+(n-e)/o:4+(e-t)/o;return[60*(r<0?r+6:r),i&&o/i*100,100*i]};class g{background=null;foreground=null;#e=null;constructor(e){c[e]?(this.background=c[e]?.background,this.foreground=c[e]?.foreground):(this.background=(()=>{let e,t=!1;for(;!t;){e=Math.floor(16777215*Math.random());const n=u.apply(void 0,[e>>16&255,e>>8&255,255&e]);n[0]>25&&n[0]<330&&(t=!0)}return("000000"+e.toString(16)).slice(-6)})(),this.foreground=(e=>{const t=parseInt(e,16);return(t>>16&255)/255*.2126+(t>>8&255)/255*.7152+(t>>0&255)/255*.0722>.6?"000000":"FFFFFF"})(this.background),c[e]={background:this.background,foreground:this.foreground}),this.header=[`%c ${e} `,`background: #${this.background}; color: #${this.foreground}`]}timestamp(){return(new Date)?.toISOString()||(new Date).toUTCString()}resolveMessage(e){let t=e,n=160;return Array.isArray(e)&&e.length>0&&e[0]?.message&&e[0]?.headerLength&&(t=e[0].message,n=e[0].headerLength),{message:t,headerLength:n}}smallString(e,t=160){return e?(e instanceof Element?e.innerHTML:e.toString()).substring(0,t):e}displayHeader(e,t,n=160){let i=[...this.header,{debug:"🐞",info:"ℹ️",warn:"🚸",error:"🚨"}?.[e]];t&&(Array.isArray(t)?i.push(this.smallString(t.map((e=>"string"!=typeof e?JSON.stringify(e):e)).join(" || "),n)):i.push(this.smallString(t,n))),window.top.console.groupCollapsed.apply(window.top.console,i)}displayFooter(){window.top.console.debug("TIMESTAMP:",this.timestamp()),window.top.console.trace(),window.top.console.groupEnd()}logMessage(e,t,n=160){if("object"!=typeof console||!console.groupCollapsed)return!1;let i=!1;try{(/(1|true|yes)/i.test(window.sessionStorage.getItem("cmlsDebug"))||/cmlsDebug/i.test(window.document.cookie))&&(i=!0)}catch(e){}(window?._CMLS?.debug||i)&&(this.displayHeader(e,t,n),window.top.console.debug(t),this.displayFooter())}info(...e){let{message:t,headerLength:n}=this.resolveMessage(e);this.logMessage("info",t,n)}debug(...e){let{message:t,headerLength:n}=this.resolveMessage(e);this.logMessage("debug",t,n)}warn(...e){let{message:t,headerLength:n}=this.resolveMessage(e);this.logMessage("warn",t,n)}error(...e){let{message:t,headerLength:n}=this.resolveMessage(e);this.logMessage("error",t,n)}}function f(e,t,n){let i;window.document.createEvent?(i=window.document.createEvent("CustomEvent"),i.initCustomEvent(t,!0,!0,n)):i=new CustomEvent(t,{detail:n}),e.dispatchEvent(i)}var w=e=>{"loading"!==window.self.document.readyState?e():window.self.document.addEventListener("DOMContentLoaded",e)};let p=null,h=0,m="pwm_pageFrame";window._CMLS=window._CMLS||{},window._CMLS.playerTools=window._CMLS.playerTools||{};const b=()=>{if(p)return p;let e=!1,t=window.self;for(;!1!==t||!1!==e;){if(t?.tgmp||window.frames.pwm_pageFrame){e="tunegenie";break}if(window.frames.cmls_siteframe){e="cumulus";break}if(t===window.top){t=!1;break}if(!t.parent)break;t=t.parent}return window._CMLS.commonLog.debug("HASPLAYER?",e),e?(p=e,p):(E(b),!1)};window._CMLS.playerTools.detectPlayer=b;const y=e=>{const t=b();"tunegenie"===t&&window.tgmp.updateLocation(e),"cumulus"===t&&window.self!==window.parent&&(window.parent.location.href=e)};window._CMLS.playerTools.navigateThroughPlayer=y;const _=()=>{const e=(t,n)=>{if(b())f(window,"cmls-player-detected",p),t(b());else{if(h>20)return void t(!1);h++,setTimeout(e.bind(void 0,t,n),500)}};return new Promise(e)};window._CMLS.playerTools.waitForPlayer=_;const S=()=>{let e=!1;return[window.self,window.parent,window.top].some((t=>{if(t.name===m)return e=t,t;let n=t.document.querySelector(`iframe[name="${m}"]`);return n?.contentWindow?(e=n.contentWindow,n.contentWindow):void 0})),e?.document?e:window.self};window._CMLS.playerTools.getPageWindow=S;const v=()=>window.self!==window.top||window.self.name===m;window._CMLS.playerTools.isInIframe=v;const L=[];let T=!1,M=!1;const C=new MutationObserver(((e,t)=>{for(const t of e)if("childList"===t.type){let e;if([window.top,window.parent,window.self].some((t=>{if(t?.frames?.pwm_pageFrame)return e=t,!0})),e){M=!0;for(const e of L)"function"==typeof e&&e();C.disconnect()}}}));w((()=>{T=!!window.top.document.querySelector(`iframe[name="${m}"]`),C.observe(window.top.document.body,{childList:!0})}));const E=e=>{"function"==typeof e&&L.push(e)};window._CMLS.playerTools.addAfterPageFrame=E;const A=window.self.document,I={el:(e,t={})=>{const n=A.createElement(e);if(null!==t&&("function"==typeof t||"object"==typeof t))for(const e in t)n.setAttribute(e,t[e]);return n},script:(e,t={})=>(t=Object.assign(t,{type:"text/javascript",async:!0,src:e}),I.el("script",t)),iframe:(e={},t="")=>{var n=I.el("iframe",e);return n.onload=()=>{n.onload=!1;const e=n.contentWindow.document;e.open(),e.write(t),e.close()},n}};var P=I;const D=(e,t)=>{Array.isArray(t)?t.forEach((t=>D(e,t))):e.appendChild(t?.nodeType?t:document.createTextNode(t))},O=["dataLayer","sharedContainerDataLayer","corpDataLayer"],k=e=>{O.forEach((t=>{window.self[t]=window.self[t]||[],window.self[t].push(e)}))},R={hidden:"hidden",event:"visibilitychange"};void 0!==window.document.mozHidden?Object.assign(R,{hidden:"mozHidden",event:"mozvisibilitychange"}):void 0!==window.document.msHidden?Object.assign(R,{hidden:"msHidden",event:"msvisibilitychange"}):void 0!==window.document.webkitHidden?Object.assign(R,{hidden:"webkitHidden",event:"webkitvisibilitychange"}):void 0!==window.document.oHidden&&Object.assign(R,{hidden:"oHidden",event:"ovisibilitychange"});const N=R;let x=!1;function j(){let e=!0;return e=window.document.visibilityState?!("hidden"===window.document.visibilityState):!window.document[R.hidden],!e&&x?-1:e}function F(e,t={}){return window.document.addEventListener(R.event,e,t)}function q(e){return window.document.removeEventListener(R.event,e)}window.addEventListener("beforeunload",(()=>{x=!0})),window._CMLS.scriptUrlBase,window._CMLS=window._CMLS||{};const H=document.currentScript.src;window._CMLS.scriptUrl=H,H.replace("/main.js",""),window._CMLS.scriptUrlBase=window._CMLS.scriptUrl.replace("/main.js",""),window._CMLS.Logger=g,window._CMLS.libs={doDynamicImports:e=>{const t=new window._CMLS.Logger("DYNAMIC IMPORT"),n=[],i=[];e.forEach((e=>{e?.loadImmediately?i.push(e):n.push(e)})),i.forEach((async e=>{if(e.hasOwnProperty("check")){const n=await e.check();n&&(t.info("Loading",e?.name||e.check?.name||e),n())}})),n.length&&w((()=>{n.forEach((async e=>{if(e.hasOwnProperty("check")){const n=await e.check();n&&(t.info("Loading (DR)",e?.name||e.check?.name||e),n())}}))}))},playerTools:i,getBasicPost:function(e=[]){const t=new window._CMLS.Logger("GET BASIC POST 0.1"),n=window.self.document;let i=["post-template-default","feed_posts-template","feed_posts-template-single","feed_posts-template-default"];if(e?.length&&(i=i.concat(e)),!i.some((e=>n.body.classList.contains(e))))return t.info("Not the default post template.",n.body.classList),!1;const o=[...n.body.classList].find((e=>e.match(/(post|page)\-?id\-/)))?.replace(/(post|page)\-?id\-/,"");if(!o)return t.info("Could not discover post ID"),!1;let r=n.querySelector(`.wrapper-content .column-1 #post-${o},.express-content .wp-block-post-content`);if(!r)return t.info("Could not discover post content."),!1;if(r.classList.contains("wp-block-post-content")){let e=n.querySelector(`.themify_builder_content[data-postid="${o}"]`);e?.parentElement?.classList.contains("wp-block-post-content")&&(r=e.parentElement)}const s=r.getBoundingClientRect();return s.width>800||s.width<320?(t.info("Post content width is suspicious.",s.width),!1):r},createElement:P,h:(e,t,...n)=>{const i=document.createElement(e);return Object.entries(t||{}).forEach((([e,t])=>{e.startsWith("on")&&e.toLowerCase()in window?i.addEventListener(e.toLowerCase().substring(2),t):i.setAttribute(e,"boolean"==typeof t?t:t.toString())})),n.forEach((e=>{D(i,e)})),i},Fragment:(e,...t)=>t,domReady:w,GTM:o,tabVisibility:r,triggerEvent:f,lodash:{throttle:a(),debounce:l()}},(e=>{const t=new URLSearchParams(e.location.search);t.has("cmlsDebug")&&(e._CMLS.debug=!0),t.has("cmlsEnableDebug")&&e.sessionStorage.setItem("cmlsDebug","yes"),t.has("cmlsDisableDebug")&&e.sessionStorage.removeItem("cmlsDebug"),e._CMLS.commonLog=new g("COMMON"),e._CMLS.commonLog.info({message:`\nURL BASE: ${e._CMLS.scriptUrlBase}\n                      __\n ______ ____ _  __ __/ /_ _____\n/ __/ // /  ' \\/ // / / // (_-<\n\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/\n          MAIN LIBRARY LOADED`,headerLength:1/0}),n(4489)})(window)},7978:function(e){"use strict";e.exports=JSON.parse('{"scriptName":"STICKY-BOTTOM-320x50","nameSpace":"stickyBottomAd","version":"0.10","elementId":"CmlsStickyBottom"}')}},a={};function d(e){var t=a[e];if(void 0!==t)return t.exports;var n=a[e]={id:e,exports:{}};return s[e].call(n.exports,n,n.exports,d),n.exports}d.m=s,d.c=a,e=[],d.O=function(t,n,i,o){if(!n){var r=1/0;for(c=0;c<e.length;c++){n=e[c][0],i=e[c][1],o=e[c][2];for(var s=!0,a=0;a<n.length;a++)(!1&o||r>=o)&&Object.keys(d.O).every((function(e){return d.O[e](n[a])}))?n.splice(a--,1):(s=!1,o<r&&(r=o));if(s){e.splice(c--,1);var l=i();void 0!==l&&(t=l)}}return t}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[n,i,o]},d.H={},d.G=function(e){Object.keys(d.H).map((function(t){d.H[t](e)}))},d.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return d.d(t,{a:t}),t},n=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__},d.t=function(e,i){if(1&i&&(e=this(e)),8&i)return e;if("object"==typeof e&&e){if(4&i&&e.__esModule)return e;if(16&i&&"function"==typeof e.then)return e}var o=Object.create(null);d.r(o);var r={};t=t||[null,n({}),n([]),n(n)];for(var s=2&i&&e;"object"==typeof s&&!~t.indexOf(s);s=n(s))Object.getOwnPropertyNames(s).forEach((function(t){r[t]=function(){return e[t]}}));return r.default=function(){return e},d.d(o,r),o},d.d=function(e,t){for(var n in t)d.o(t,n)&&!d.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},d.f={},d.e=function(e){return Promise.all(Object.keys(d.f).reduce((function(t,n){return d.f[n](e,t),t}),[]))},d.u=function(e){return{58:"advertising/auto-refresh-ads",61:"advertising/paid-content/injectables-newsmax",103:"advertising/tgmp-event-targeting",133:"analytics/tabvisibility-to-gtm",183:"advertising/paid-content/injectables-hindsight",188:"advertising/wallpaper/style-outer",227:"advertising/pushdown/pushdown-2-handle-delivery",307:"analytics/promoreel-click",353:"advertising/local-nav-through-player",354:"advertising/paid-content",377:"advertising/pushdown/pushdown-1-generate-tag",394:"functionality/sharebuttons/style",445:"analytics/sgroups-to-gtm",510:"advertising/wallpaper/wallpaper-2-handle-creative",611:"advertising/wallpaper/style-inner",618:"advertising/wallpaper/wallpaper-1-await-creative",658:"advertising/sticky-bottom-320x50/style",710:"functionality/tgmp-switchstream",741:"advertising/pushdown/style",747:"advertising/sidewalls/style",771:"analytics/tgmp-events-to-gtm",800:"functionality/auto-reload-page",860:"advertising/sidewalls",894:"functionality/sharebuttons",937:"advertising/sticky-bottom-320x50",972:"functionality/social-listen-live"}[e]+"."+{58:"cb30556ffe39d6167594",61:"6c56f72d2885e9b8c17c",103:"a0712c73c0dabecd4f5b",133:"3a851d687d4904dc7380",183:"ef256f60e41f33179617",188:"17d641966d58ef2d2016",227:"07aa43d971625ebf59ca",307:"3e86e7164cc017008d62",353:"821ecf2ca41096998f4a",354:"15bb1ee43b8e0b8bda7e",377:"138fdd3d52e8e08006b4",394:"cb043c80f79a158f6446",445:"2b95c8c89fb50ba6e508",510:"0adb35dc3df3e93cad55",611:"e63c6a088262d278006a",618:"247f9fedccec29448a7c",658:"9d3985b698a3abec9768",710:"5a28f9e0df03e2b0e1f1",741:"265b197efb4f8ef9e5e9",747:"f54ef741e4f9d5996d5a",771:"a67d5c8947310bb6f27d",800:"788034ac6ca184d13b59",860:"c0ff48e8938c0819ab53",894:"dcb81c89303d84494cc1",937:"38be617bbddfcdf8c5d1",972:"d4ca0c47ad871a319b36"}[e]+".js"},d.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),d.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i={},o="cmls-amp-fse-utils:",d.l=function(e,t,n,r){if(i[e])i[e].push(t);else{var s,a;if(void 0!==n)for(var l=document.getElementsByTagName("script"),c=0;c<l.length;c++){var u=l[c];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==o+n){s=u;break}}s||(a=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,d.nc&&s.setAttribute("nonce",d.nc),s.setAttribute("data-webpack",o+n),s.src=e),i[e]=[t];var g=function(t,n){s.onerror=s.onload=null,clearTimeout(f);var o=i[e];if(delete i[e],s.parentNode&&s.parentNode.removeChild(s),o&&o.forEach((function(e){return e(n)})),t)return t(n)},f=setTimeout(g.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=g.bind(null,s.onerror),s.onload=g.bind(null,s.onload),a&&document.head.appendChild(s)}},d.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){d.S={};var e={},t={};d.I=function(n,i){i||(i=[]);var o=t[n];if(o||(o=t[n]={}),!(i.indexOf(o)>=0)){if(i.push(o),e[n])return e[n];d.o(d.S,n)||(d.S[n]={}),d.S[n];var r=[];return e[n]=r.length?Promise.all(r).then((function(){return e[n]=1})):1}}}(),function(){var e;d.g.importScripts&&(e=d.g.location+"");var t=d.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");if(n.length)for(var i=n.length-1;i>-1&&!e;)e=n[i--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),d.p=e}(),function(){var e={296:0,566:0,142:0};d.f.j=function(t,n){var i=d.o(e,t)?e[t]:void 0;if(0!==i)if(i)n.push(i[2]);else{var o=new Promise((function(n,o){i=e[t]=[n,o]}));n.push(i[2]=o);var r=d.p+d.u(t),s=new Error;d.l(r,(function(n){if(d.o(e,t)&&(0!==(i=e[t])&&(e[t]=void 0),i)){var o=n&&("load"===n.type?"missing":n.type),r=n&&n.target&&n.target.src;s.message="Loading chunk "+t+" failed.\n("+o+": "+r+")",s.name="ChunkLoadError",s.type=o,s.request=r,i[1](s)}}),"chunk-"+t,t)}},d.H.j=function(t){if(!d.o(e,t)||void 0===e[t]){e[t]=null;var n=document.createElement("link");n.charset="utf-8",d.nc&&n.setAttribute("nonce",d.nc),n.rel="preload",n.as="script",n.href=d.p+d.u(t),document.head.appendChild(n)}},d.O.j=function(t){return 0===e[t]};var t=function(t,n){var i,o,r=n[0],s=n[1],a=n[2],l=0;if(r.some((function(t){return 0!==e[t]}))){for(i in s)d.o(s,i)&&(d.m[i]=s[i]);if(a)var c=a(d)}for(t&&t(n);l<r.length;l++)o=r[l],d.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return d.O(c)},n=self.cmlsAmpUtils=self.cmlsAmpUtils||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}(),d.nc=void 0,r={377:[216,741],510:[216,611,188],860:[216,747],894:[216,394]},d.f.preload=function(e){var t=r[e];Array.isArray(t)&&t.map(d.G)};var l=d.O(void 0,[216],(function(){return d(3272)}));l=d.O(l)}();