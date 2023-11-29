!function(){var e,t,n,i,o,r,s={2128:function(e,t,n){(e=>{new e._CMLS.Logger("ADVERTISING").info({message:"\n                      __\n ______ ____ _  __ __/ /_ _____\n/ __/ // /  ' \\/ // / / // (_-<\n\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/\n   ADVERTISING LIBRARY LOADED",headerLength:1/0})})(window),n(7489)},7489:function(e,t,n){"use strict";n.r(t);var i=n(7978),o=n(363);const{scriptName:r,nameSpace:s,version:a}=o;var d=n(4393),l=n(2666);n(5611),n(8236),n(8337);const c=[{name:"advertising/disable-collapse-before-fetch",check:()=>()=>{n.e(352).then(n.bind(n,1885))}},{name:"advertising/sticky-bottom-320x50",check:()=>{const{scriptName:e,nameSpace:t,version:o,elementId:r}=i,s=new window._CMLS.Logger(`${e} ${o}`),{waitForPlayer:a,detectPlayer:d}=window._CMLS.libs.playerTools,l=()=>{n.e(937).then(n.bind(n,9467))};return new Promise(((e,t)=>{window.matchMedia("(min-width: 800px)").matches&&"tunegenie"!==d()?(s.debug("No TuneGenie player detected on desktop, wait for player before re-injecting."),a().then((()=>{"tunegenie"===d()?e(l):(s.info("Current player does not support sticky ad on desktop."),e(!1))}))):e(l)}))}},{name:"advertising/auto-refresh-ads",check:()=>{const e=new window._CMLS.Logger(`${r} Loader ${a}`);return new Promise(((t,i)=>{(window.self.location.search.includes("cmlsDisableAdRefresh")||window.self.DISABLE_AUTO_REFRESH_ADS)&&(e.warn("Disabled for this site.",{"window.DISABLE_AUTO_REFRESH_ADS set":!!window.self.DISABLE_AUTO_REFRESH_ADS,"cmlsDisableAdRefresh in URL":window.self.location.search.includes("cmlsDisableAdRefresh")}),t(!1)),t((()=>{n.e(58).then(n.bind(n,6163))}))}))},loadImmediately:!0,loaderOptions:{async:!1,defer:!1}},{name:"advertising/local-nav-through-player",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{Promise.all([n.e(216),n.e(353)]).then(n.bind(n,8102))})},{name:"advertising/wallpaper",check:()=>new Promise((e=>{window.self.document.body.classList.contains("is-fse-theme")&&e(!1),window.matchMedia("(max-width: 1100px)").matches&&e(!1),e((()=>{n.e(618).then(n.t.bind(n,6446,23))}))}))},{name:"advertising/tgmp-event-targeting",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{n.e(103).then(n.bind(n,5))})},{name:"advertising/paid-content",check:d.default},{name:"advertising/pushdown",check:()=>new Promise((e=>{const t=window.self.document;t.querySelector("body.home")||e(!1),t.querySelector("#gpt-pushdown")&&(log.info("Tag already exists, exiting."),e(!1)),e((()=>{n.e(377).then(n.t.bind(n,8139,23))}))}))},{name:"advertising/sidewalls",check:l.Z}];window._CMLS.libs.doDynamicImports(c)},5611:function(e,t,n){"use strict";n.r(t),n(560);class i{scriptName="DEFAULT ADTAG INTERFACE";nameSpace="defaultAdtagInterface";parentNameSpace="adTagDetection";version="x";static identity="DEFAULT";static detectTag(){}constructor(){this.log=new window._CMLS.Logger(`${this.scriptName} v${this.version}`)}rawInterface(){}queue(e){return this.rawInterface().cmd.push(e)}pubads(){return this.rawInterface().pubads()}getTargeting(e){}setTargeting(e,t){}isInitialLoadDisabled(){return!1}isReady(){return!1}defaultDefineSlotOptions(){return{adUnitPath:null,size:[],sizeMap:null,div:null,collapse:!0,targeting:[],init:!0,prebid:!1,outOfPage:!1}}defineSlot(e){return{}}destroySlots(e){}getSlots(){return[]}display(e,t=!1){}refresh(e,t={}){}wasSlotRequested(e){return!1}doInitialLoad(e){}filterSlots(e){if(e)return Array.isArray(e)||(e=[e]),e;this.log.warn("Filter called without slots",e)}listSlotData(e){return[]}addListener(){}removeListener(){}}class o extends i{scriptName="GPT INTERFACE";version="0.2";log=null;static identity="GPT";static detectTag(){if(window.self.googletag?.pubadsReady)return!0}initialRequestKey="initial-request-made";inViewPercentage=50;constructor(){super(),this.log=new window._CMLS.Logger(`${this.scriptName} v${this.version}`);const e=this;e.addListener("slotRequested",(t=>{t.slot._cm_displayed&&t.slot.getTargeting(e.initialRequestKey)?.length||(e.log.debug("Setting initial request key",e.listSlotData(t.slot),t),t.slot._cm_displayed=!0,t.slot.setTargeting(e.initialRequestKey,!0))})),e.addListener("slotRenderEnded",(t=>{e.log.debug("Rendered",t)})),e.addListener("slotVisibilityChanged",(e=>{const t=e.inViewPercentage||0;e.slot._cm_visiblePercent=t,e.slot._cm_visible=t>=this.inViewPercentage})),e.addListener("impressionViewable",(t=>{e.log.debug("Slot is VIEWABLE",e.listSlotData(t.slot)),t.slot._cm_visible=!0}))}rawInterface(){return window.self?.googletag}addListener(e,t){const n=this;this.queue((()=>{n.pubads().addEventListener(e,t)}))}removeListener(e,t){return this.pubads().removeEventListener(e,t)}getTargeting(e){return this.pubads().getTargeting(e)}setTargeting(e,t){return this.pubads().setTargeting(e,t)}isInitialLoadDisabled(){return this.pubads().isInitialLoadDisabled()}isReady(){return this.rawInterface().pubadsReady}defineSlot(e){const t=Object.assign(this.defaultDefineSlotOptions(),e);let n=!1;if(t.outOfPage)n=this.rawInterface().defineOutOfPageSlot(t.adUnitPath,t.div);else{const e=window.self!==window.parent;let i=t?.size;if(e&&t?.sizeMap?.length){let e=t.sizeMap;Array.isArray(e)||(e=[e]),e.some((e=>{if(!(e.length<2||e[0].length<2))return matchMedia(`(min-width: ${e[0][0]}px) and (min-height: ${e[0][1]}px)`).matches?(i=e[1],!0):void 0;log.debug("Invalid map",e)}))}if(!i)return this.log.error("defineSlot must be provided with a size property."),!1;this.log.debug("Winning sizemap",t.div,i),n=this.rawInterface().defineSlot(t.adUnitPath,i,t.div),n&&!e&&t?.sizeMap?.length&&n.defineSizeMapping(t.sizeMap)}return n?(this.log.debug("Slot created",this.listSlotData(n)),t.hasOwnProperty("collapse")&&(Array.isArray(t.collapse)||(t.collapse=[t.collapse]),n=n.setCollapseEmptyDiv.apply(n,t.collapse)),t.targeting=Array.isArray(t.targeting)?t.targeting:[t.targeting],t.targeting.forEach((e=>{for(const t in e)e?.hasOwnProperty(t)&&(n=n.setTargeting(t,e[t]))})),t.init&&(n=n.addService(this.pubads())),this.log.debug("Defined slot",{slot:this.listSlotData(n).shift(),settings:t}),window.GPT_SITE_SLOTS=window.GPT_SITE_SLOTS||{},window.GPT_SITE_SLOTS[n.getSlotElementId()]=n,n):(this.log.error("Failed to create slot!",t),!1)}destroySlots(e){return this.rawInterface().destroySlots(e)}getSlots(){return this.pubads().getSlots()}display(e,t=!1){const n=this;this.queue((()=>{if(n.log.debug("Calling display",e,t),n.rawInterface().display(e),t){n.log.debug("Forceload enabled for this display call");let i=null;if("string"==typeof e?i=e:e instanceof Node?i=e.id:"object"==typeof e&&e?.getSlotElementId&&null!==e&&(i=e.getSlotElementId()),!i)return void n.log.warn("Attempted to force initial load, but ID could not be discovered",{ID:e,forceLoad:t});let o=!1;if(window.GPT_SITE_SLOTS?.[i]?.getSlotElementId)o=window.GPT_SITE_SLOTS[i];else{const e=n.getSlots();if(!e?.length)return void n.log.warn("No slots defined!");e.some((e=>{if(e.getSlotElementId()===i)return o=e,!0}))}o?(n.log.debug("Forcing initial load",{id:o?.getSlotElementId?o.getSlotElementId():"unknown!",slot:o}),n.doInitialLoad(o)):n.log.warn("Attempted to force initial load but slot was not defined!",{ID:e,forceLoad:t,slot:o})}}))}refresh(e,t={}){if(!e)return void this.log.warn("Refresh called without slots");Array.isArray(e)||(e=[e]);const n=this.filterSlots(e);if(n?.length)return this.log.debug("Refresh called for slots",this.listSlotData(n)),this.pubads().refresh(n,t);this.log.debug("No slots found for refreshing after filtering.")}wasSlotRequested(e){const t=this;if(e?._displayed||e.getTargeting(t.initialRequestKey)?.length)return t.log.debug("Has initial request key",t.listSlotData(e)),!0;if(e.getResponseInformation())return t.log.debug("Has response info",t.listSlotData(e)),!0;const n=window.self.document.getElementById(e.getSlotElementId());return!!n?.getAttribute("data-google-query-id")&&(t.log.debug("Has data attribute",t.listSlotData(e)),!0)}doInitialLoad(e){const t=this;e?(Array.isArray(e)||(e=[e]),t.isInitialLoadDisabled()&&(t.log.debug("Initial load requested while initial load is disabled, this will be delayed",t.listSlotData(e)),setTimeout((()=>{const n=[],i=[];e.forEach((e=>{t.wasSlotRequested(e)?i.push(e):n.push(e)})),n.length&&(t.log.debug("Delayed initial load firing",t.listSlotData(n)),t.refresh(n)),i.length&&t.log.debug("Slots were already requested",t.listSlotData(i))}),500))):t.log.warn("doInitialLoad called without slots")}filterSlots(e){if(!e)return void this.log.warn("Filter called without slots",e);Array.isArray(e)||(e=[e]);const t=[];return e.forEach((e=>{e?.getSlotElementId()&&t.push(e)})),!!t.length&&t}listSlotData(e){Array.isArray(e)||(e=[e]);const t=[];return e.forEach((e=>{const n={_cm_displayed:e?._displayed?"yes":"no",div:e?.getSlotElementId?e.getSlotElementId():"unknown!",pos:e?.getTargeting?e.getTargeting("pos"):"unknown!",adUnitPath:e?.getAdUnitPath?e.getAdUnitPath():"unknown!",sizes:e?.getSizes?e.getSizes():"unknown!",targeting:[],slot:e},i=e?.getTargetingKeys();if(i?.length)for(let t of i)n.targeting.push({[t]:e?.getTargeting(t)});t.push(n)})),t}}const r=[class extends o{scriptName="APS-GPT INTERFACE";version="0.1";log=null;static identity="APS-GPT";static detectTag(){if(super.detectTag()&&window?.apstag)return!0}constructor(){super(),this.log=new window._CMLS.Logger(`${this.scriptName} v${this.version}`)}defineSlot(e){const t=Object.assign(this.defaultDefineSlotOptions(),e);return!1!==t?.prebid||t?.targeting?.noprebid||(t.targeting.noprebid="noprebid"),super.defineSlot(t)}filterPrebidSlots(e){const t=this;if(!e)return void t.log.warn("filterPrebidSlots called without slots");Array.isArray(e)||(e=[e]);const n={prebid:[],noprebid:[],all:e=t.filterSlots(e)};return e.forEach((e=>{t.log.debug("Checking",e.getSlotElementId());let i=!1;const o=["120x240","120x600","160x600","250x250","300x50","300x100","300x1050","300x300","300x75","300x250","300x600","320x50","320x100","336x280","400x300","468x60","728x90","970x250","970x90"],r=e.getSizes();if(r?.length?r.some((e=>{if(o.includes(`${e.width}x${e.height}`))return i=!0,!0})):i=!1,e.getTargeting("noprebid")?.length&&(i=!1),i)try{n.prebid.push(e)}catch(e){console.log(e)}else n.noprebid.push(e)})),n}refresh(e,t={}){const n=this;if(!e)return void n.log.warn("Refresh called without slots");Array.isArray(e)||(e=[e]),n.log.debug("Refresh requested for slots",n.listSlotData(e));const i=n.filterPrebidSlots(e);if(i?.all?.length){if(i?.prebid?.length){n.log.debug(`🏷 Requesting bids for ${i.prebid.length} prebid slots`,this.listSlotData(i.prebid));const e=[];i.prebid.forEach((t=>{e.push({slotID:t.getSlotElementId(),slotName:t.getAdUnitPath(),sizes:t.getSizes().map((e=>[e.width,e.height]))})})),o={slots:e,params:{adRefresh:"1"}},n.log.debug("fetchBids called",o,o.slots),window.apstag.fetchBids(o,(e=>{n.queue((()=>{window.apstag.setDisplayBids(),n.log.debug("🏷 Refreshing prebid slots after bids received",n.listSlotData(i.prebid),e),n.pubads().refresh(i.prebid,t)}))}))}return i?.noprebid?.length?(n.log.debug("Refreshing noprebid slots",n.listSlotData(i.noprebid)),n.pubads().refresh(i.noprebid)):void 0}var o;n.log.debug("No slots found for refreshing after filtering.")}wasSlotRequested(e){return!!super.wasSlotRequested(e)||!!e.getTargeting("amznbid")?.length&&(this.log.debug("Has amznbid targeting",this.listSlotData(e)),!0)}},o];((e,t)=>{const n="adTagDetection",{triggerEvent:i,domReady:o}=e._CMLS.libs,s=new e._CMLS.Logger("ADTAG DETECTION 0.1");e._CMLS=e._CMLS||{},e._CMLS[n]={registeredDetectors:r};const a=(t=0)=>{if(e._CMLS.adTag||t>60)return;s.debug(`Running registered detectors (Loop: ${t})`);let o=!1;for(const t of e._CMLS[n].registeredDetectors){if(!t.identity||!t.detectTag){s.error("Invalid interface",t);break}if(s.debug("Checking registered detector",t.identity),t.detectTag()){o=!0,e._CMLS.adTag=new t,e._CMLS.adTag.identity=t.identity;break}}if(o)return s.info("Interface detected",e._CMLS.adTag.identity,e._CMLS.adTag),void i(e,"cmls-adtag-loaded",!0);s.warn("No interface detected, re-running detection in 0.15 seconds"),setTimeout((()=>a(t+1)),150)};o((()=>{s.info("Initializing."),a()}))})(window.self)},4393:function(e,t,n){"use strict";n.r(t),t.default=()=>new Promise((e=>{const{getBasicPost:t}=window._CMLS.libs;(window.self.NO_PAIDCONTENT||window.self.NO_PAID_CONTENT||!t())&&e(!1),e((()=>{n.e(354).then(n.t.bind(n,6134,23))}))}))},8236:function(e,t,n){"use strict";n.r(t);var i=JSON.parse('{"scriptName":"REGISTER-AD-PATH","version":"0.3","networkId":"6717"}');(e=>{const{triggerEvent:t}=e._CMLS.libs,{scriptName:n,version:o,networkId:r}=i,s=new e._CMLS.Logger(`${n} ${o}`);function a(){s.debug("Checking for ad path");const n=e?._CMLS?.adTag.getSlots();s.debug(`Testing ${n.length} slots`),n.length?n.some((n=>{const i=n?.getAdUnitPath();if(i&&i.indexOf(`/${r}/`)>-1)return s.debug("Found in-network slot",n.getSlotElementId(),i),e._CMLS=e._CMLS||{},e._CMLS.adPath=i,s.info("Ad path discovered",e._CMLS.adPath),t(e,"cmls-adpath-discovered",e._CMLS.adPath),!0})):s.warn("Found no slots!")}e?._CMLS?.adTag?.isReady()?a():e.addEventListener("cmls-adtag-loaded",(()=>a()))})(window.self)},2666:function(e,t,n){"use strict";n.d(t,{X:function(){return s}});var i=n(2347);const o=new window._CMLS.Logger("SIDEWALL ADS IMPORTER 2.1"),r=window.self;function s(){return r.NO_SIDEWALLS||r.NO_SIDE_WALLS?(o.info("window.NO_SIDEWALLS is set. Sidewalls will not be created."),!1):r._CMLS?.disabled?.sideWalls?(o.info("_CMLS.disabled.sideWalls is set. Sidewalls will not be created."),!1):!r.document.querySelector(i.D)||(o.info("Legacy skyscrapers exist. Sidewalls will not be created."),!1)}t.Z=()=>new Promise(((e,t)=>{setTimeout((()=>{s()?e((()=>{n.e(860).then(n.bind(n,7731))})):e(!1)}),i._)}))},8337:function(){(e=>{const{h:t,domReady:n}=e._CMLS.libs,i="gpt-w7mtag",o=new e._CMLS.Logger("WEST7-1X1 0.1"),r=e.document,s=()=>{if(r.getElementById(i))return;const n=t("div",{id:i,style:"line-height:0; font-size: 0; height: 0"});r.body.appendChild(n),o.debug("Slot injected"),e._CMLS.adTag.queue((()=>{e._CMLS.adTag.defineSlot({adUnitPath:e._CMLS.adPath,size:[[1,1]],div:i,collapse:!0,targeting:{pos:"w7m",noprebid:"noprebid",never_refresh:"true"},prebid:!1})&&e._CMLS.adTag.display(i,e._CMLS.adTag.isInitialLoadDisabled()),o.info("Slot initialized")}))};n((()=>{e?._CMLS?.adPath?s():e.addEventListener("cmls-adpath-discovered",(()=>s()))}))})(window.self)},7984:function(e,t,n){(e=>{new e._CMLS.Logger("ANALYTICS").info({message:"\n                      __\n ______ ____ _  __ __/ /_ _____\n/ __/ // /  ' \\/ // / / // (_-<\n\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/\n     ANALYTICS LIBRARY LOADED",headerLength:1/0})})(window),n(9637)},9637:function(e,t,n){"use strict";n.r(t),window._CMLS.libs.domReady;const i=[{name:"analytics/sgroups-to-gtm",check:()=>{Promise.all([n.e(216),n.e(445)]).then(n.bind(n,1989))}},{name:"analytics/tabvisibility-to-gtm",check:()=>{Promise.all([n.e(216),n.e(133)]).then(n.bind(n,6542))}},{name:"analytics/tgmp-events-to-gtm",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{Promise.all([n.e(216),n.e(771)]).then(n.bind(n,1506))})},{name:"analytics/promoreel-click",check:()=>new Promise((e=>{window.self.document.querySelector("body.home .sliderItem")&&e((()=>{Promise.all([n.e(216),n.e(307)]).then(n.bind(n,2238))})),e(!1)}))}];window._CMLS.libs.doDynamicImports(i)},3272:function(e,t,n){n(1875),n(2128),n(7984)},4489:function(e,t,n){n(2502)},2502:function(e,t,n){"use strict";n.r(t);const{getBasicPost:i}=window._CMLS.libs,o=new window._CMLS.Logger("SHAREBUTTONS 0.2"),r=[{name:"functionality/sharebuttons",check:()=>{if(document.body.classList.contains("visual-editor-mode-design"))o.info("Headway visual editor detected.");else if(window.NO_ADDTHIS_HERE)o.info("Share buttons prevented by window.NO_ADDTHIS_HERE");else if(window.document.body.classList.contains("home"))o.info("Share buttons prevented on homepage");else if(window.document.querySelector('div[class*="addthis_"]'))o.info("Local already has inline addThis container.");else if(window.document.querySelector('script[src*="addthis.com"]'))o.info("Local already has addthis script.");else if(window.document.querySelector('script[src*="addtoany.com"]'))o.info("Local already has AddToAny script.");else if(i(["page-template-default"]))return()=>{n.e(894).then(n.t.bind(n,7222,23))}}},{name:"functionality/social-listen-live",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{n.e(972).then(n.t.bind(n,1608,23))})},{name:"functionality/auto-reload-page",check:()=>new Promise((e=>{const t=window.self;t?._CMLS?.autoReload&&t._CMLS.autoReload instanceof Array&&t._CMLS.autoReload.length&&t?.document?.body?.matches("body.home")?e((()=>{Promise.all([n.e(216),n.e(800)]).then(n.bind(n,6100))})):e(!1)}))},{name:"functionality/tgmp-switchstream",check:async()=>!!await window._CMLS.libs.playerTools.waitForPlayer()&&(()=>{n.e(710).then(n.t.bind(n,522,23))})}];window._CMLS.libs.doDynamicImports(r)},1875:function(e,t,n){"use strict";n.r(t);var i={};n.r(i),n.d(i,{dataLayers:function(){return h},push:function(){return m}});var o={};n.r(o),n.d(o,{addVisibilityListener:function(){return v},api:function(){return y},isVisible:function(){return S},removeVisibilityListener:function(){return L}}),n(8858),n(1318),n(3228);var r=n(3583),s=n(3493),a=n.n(s),d=n(3279),l=n.n(d),c=n(6353);const u=window.self.document,g={el:(e,t={})=>{const n=u.createElement(e);if(null!==t&&("function"==typeof t||"object"==typeof t))for(const e in t)n.setAttribute(e,t[e]);return n},script:(e,t={})=>(t=Object.assign(t,{type:"text/javascript",async:!0,src:e}),g.el("script",t)),iframe:(e={},t="")=>{var n=g.el("iframe",e);return n.onload=()=>{n.onload=!1;const e=n.contentWindow.document;e.open(),e.write(t),e.close()},n}};var f=g;const w=(e,t)=>{Array.isArray(t)?t.forEach((t=>w(e,t))):e.appendChild(t?.nodeType?t:document.createTextNode(t))};var p=n(96);n(560);const h=["dataLayer","sharedContainerDataLayer","corpDataLayer"],m=e=>{h.forEach((t=>{window.self[t]=window.self[t]||[],window.self[t].push(e)}))},b={hidden:"hidden",event:"visibilitychange"};void 0!==window.document.mozHidden?Object.assign(b,{hidden:"mozHidden",event:"mozvisibilitychange"}):void 0!==window.document.msHidden?Object.assign(b,{hidden:"msHidden",event:"msvisibilitychange"}):void 0!==window.document.webkitHidden?Object.assign(b,{hidden:"webkitHidden",event:"webkitvisibilitychange"}):void 0!==window.document.oHidden&&Object.assign(b,{hidden:"oHidden",event:"ovisibilitychange"});const y=b;let _=!1;function S(){let e=!0;return e=window.document.visibilityState?!("hidden"===window.document.visibilityState):!window.document[b.hidden],!e&&_?-1:e}function v(e,t={}){return window.document.addEventListener(b.event,e,t)}function L(e){return window.document.removeEventListener(b.event,e)}window.addEventListener("beforeunload",(()=>{_=!0}));var T=n(9217);window._CMLS.scriptUrlBase,window._CMLS=window._CMLS||{},window._CMLS.Logger=r.ZP,window._CMLS.commonLog=new window._CMLS.Logger("COMMON");const E=document.currentScript.src;window._CMLS.scriptUrl=E,E.replace("/main.js",""),window._CMLS.scriptUrlBase=window._CMLS.scriptUrl.replace("/main.js",""),window._CMLS.libs={doDynamicImports:e=>{const t=new window._CMLS.Logger("DYNAMIC IMPORT"),n=[],i=[];e.forEach((e=>{e?.loadImmediately?i.push(e):n.push(e)})),i.forEach((async e=>{if(e.hasOwnProperty("check")){const n=await e.check();n&&(t.debug("Loading",e?.name||e.check?.name||e),n())}})),n.length&&(0,p.Z)((()=>{n.forEach((async e=>{if(e.hasOwnProperty("check")){const n=await e.check();n&&(t.debug("Loading (DR)",e?.name||e.check?.name||e),n())}}))}))},playerTools:c,getBasicPost:function(e=[]){const t=new window._CMLS.Logger("GET BASIC POST 0.1"),n=window.self.document;let i=["post-template-default","feed_posts-template","feed_posts-template-single","feed_posts-template-default"];if(e?.length&&(i=i.concat(e)),!i.some((e=>n.body.classList.contains(e))))return t.info("Not the default post template.",n.body.classList),!1;const o=[...n.body.classList].find((e=>e.match(/(post|page)\-?id\-/)))?.replace(/(post|page)\-?id\-/,"");if(!o)return t.info("Could not discover post ID"),!1;let r=n.querySelector(`.wrapper-content .column-1 #post-${o},.express-content .wp-block-post-content`);if(!r)return t.info("Could not discover post content."),!1;if(r.classList.contains("wp-block-post-content")){let e=n.querySelector(`.themify_builder_content[data-postid="${o}"]`);e?.parentElement?.classList.contains("wp-block-post-content")&&(r=e.parentElement)}const s=r.getBoundingClientRect();return s.width>800||s.width<320?(t.info("Post content width is suspicious.",s.width),!1):r},createElement:f,h:(e,t,...n)=>{const i=document.createElement(e);return Object.entries(t||{}).forEach((([e,t])=>{e.startsWith("on")&&e.toLowerCase()in window?i.addEventListener(e.toLowerCase().substring(2),t):i.setAttribute(e,"boolean"==typeof t?t:t.toString())})),n.forEach((e=>{w(i,e)})),i},Fragment:(e,...t)=>t,domReady:p.Z,GTM:i,tabVisibility:o,triggerEvent:T.Z,lodash:{throttle:a(),debounce:l()}};const C=new URLSearchParams(window.location.search);C.has("cmlsDebug")&&(window._CMLS.debug=!0),C.has("cmlsEnableDebug")&&window.sessionStorage.setItem("cmlsDebug","yes"),C.has("cmlsDisableDebug")&&window.sessionStorage.removeItem("cmlsDebug"),window._CMLS.commonLog.info({message:`\nURL BASE: ${window._CMLS.scriptUrlBase}\n                      __\n ______ ____ _  __ __/ /_ _____\n/ __/ // /  ' \\/ // / / // (_-<\n\\__/\\_,_/_/_/_/\\_,_/_/\\_,_/___/\n          MAIN LIBRARY LOADED`,headerLength:1/0}),n(4489)},3583:function(e,t,n){"use strict";n.d(t,{ZP:function(){return r}}),n(560);const i={},o=(e,t,n)=>{e/=255,t/=255,n/=255;const i=Math.max(e,t,n),o=i-Math.min(e,t,n),r=0===o?0:o&&i===e?(t-n)/o:i===t?2+(n-e)/o:4+(e-t)/o;return[60*(r<0?r+6:r),i&&o/i*100,100*i]};class r{background=null;foreground=null;#e=null;constructor(e){i[e]?(this.background=i[e]?.background,this.foreground=i[e]?.foreground):(this.background=(()=>{let e,t=!1;for(;!t;){e=Math.floor(16777215*Math.random());const n=o.apply(void 0,[e>>16&255,e>>8&255,255&e]);n[0]>25&&n[0]<330&&(t=!0)}return("000000"+e.toString(16)).slice(-6)})(),this.foreground=(e=>{const t=parseInt(e,16);return(t>>16&255)/255*.2126+(t>>8&255)/255*.7152+(t>>0&255)/255*.0722>.6?"000000":"FFFFFF"})(this.background),i[e]={background:this.background,foreground:this.foreground}),this.header=[`%c ${e} %c`,`background: #${this.background}; color: #${this.foreground}`]}timestamp(){return(new Date)?.toISOString()||(new Date).toUTCString()}resolveMessage(e){let t=e,n=160;return Array.isArray(e)&&e.length>0&&e[0]?.message&&e[0]?.headerLength&&(t=e[0].message,n=e[0].headerLength),{message:t,headerLength:n}}smallString(e,t=160){return e?(e instanceof Element?e.innerHTML:e.toString()).substring(0,t):e}displayHeader(e,t,n=160){let i=[{debug:"🐞",info:"ℹ️",warn:"🚸",error:"🚨"}?.[e]];t&&(Array.isArray(t)?i.push(this.smallString(t.map((e=>{if("string"!=typeof e){const t=new WeakSet;return JSON.stringify(e,((e,n)=>{if("object"==typeof n&&null!==n){if(t.has(n))return;t.add(n)}return n}))}return e})).join(" || "),n)):i.push(this.smallString(t,n))),this.header.length>1?window.top.console.groupCollapsed.apply(window.top.console,[`${this.header[0]} %c${i.join(" ")}`,this.header[1],"",`color: ${{debug:"#777777",info:"darkblue",warn:"darkgoldenrod",error:"darkred"}?.[e]}`,""]):window.top.console.groupCollapsed.apply(window.top.console,[...this.header,...i])}displayFooter(){window.top.console.debug("TIMESTAMP:",this.timestamp()),window.top.console.trace(),window.top.console.groupEnd()}logMessage(e,t,n=160){if("object"!=typeof console||!console.groupCollapsed)return!1;let i=!1;try{(/(1|true|yes)/i.test(window.sessionStorage.getItem("cmlsDebug"))||/cmlsDebug/i.test(window.document.cookie))&&(i=!0),window.location.search.indexOf("cmlsDebug")>=0&&(i=!0)}catch(e){}("debug"!==e||window?._CMLS?.debug||i)&&(this.displayHeader(e,t,n),window.top.console.debug(t),this.displayFooter())}info(...e){let{message:t,headerLength:n}=this.resolveMessage(e);this.logMessage("info",t,n)}debug(...e){let{message:t,headerLength:n}=this.resolveMessage(e);this.logMessage("debug",t,n)}warn(...e){let{message:t,headerLength:n}=this.resolveMessage(e);this.logMessage("warn",t,n)}error(...e){let{message:t,headerLength:n}=this.resolveMessage(e);this.logMessage("error",t,n)}}},96:function(e,t){"use strict";t.Z=e=>{"loading"!==window.self.document.readyState?e():window.self.document.addEventListener("DOMContentLoaded",e)}},6353:function(e,t,n){"use strict";n.r(t),n.d(t,{addAfterPageFrame:function(){return b},detectPlayer:function(){return l},getPlayerFrame:function(){return g},isInIframe:function(){return f},navigateThroughPlayer:function(){return c},waitForPlayer:function(){return u}}),n(560);var i=n(9217),o=n(96);const r=new(n(3583).ZP)("PlayerTools");let s=null,a=0,d={tunegenie:"pwm_pageFrame",cumulus:"cmls_siteframe"};window._CMLS=window._CMLS||{},window._CMLS.playerTools=window._CMLS.playerTools||{};const l=()=>{if(s)return s;let e=!1;return[window.self,window.parent,window.top].some((t=>t?.tgmp||window.frames[d.tunegenie]?(e="tunegenie",!0):window.frames[d.cumulus]?(e="cumulus",!0):void 0)),r.debug("HASPLAYER?",e),e?(document.body.classList.add("has-detected-player"),document.body.classList.add(`player-${e}`),s=e,s):(b(l),!1)};window._CMLS.playerTools.detectPlayer=l;const c=e=>{const t=l();"tunegenie"===t&&window.tgmp.updateLocation(e),"cumulus"===t&&window.cmls_player.updateLocation(e)};window._CMLS.playerTools.navigateThroughPlayer=c;const u=()=>{const e=(t,n)=>{if(l())(0,i.Z)(window,"cmls-player-detected",s),t(l());else{if(a>20)return void t(!1);a++,setTimeout(e.bind(void 0,t,n),500)}};return new Promise(e)};window._CMLS.playerTools.waitForPlayer=u;const g=()=>{let e=!1;return[window.self,window.parent,window.top].some((t=>{if(Object.values(d).includes(t.name))return e=t,t;let n=(e=>e.document.querySelector(Object.values(d).map((e=>`iframe[name="${e}"]`)).join(",")))(t);return n?.contentWindow?(e=n.contentWindow,n.contentWindow):void 0})),e?.document?e:window.self};window._CMLS.playerTools.getPlayerFrame=g;const f=()=>window.self!==window.top||"pwm_pageFrame"===window.self.name;window._CMLS.playerTools.isInIframe=f;const w=[];let p=!1,h=!1;const m=new MutationObserver(((e,t)=>{const n=()=>{for(const e of w)"function"==typeof e&&e();m.disconnect()};for(const t of e)if("childList"===t.type){let e;if([window.top,window.parent,window.self].some((t=>{if(Object.values(d).some((e=>t?.frames?.[e])))return e=t,!0})),e){const e=l();"tunegenie"===e&&(h=!0),"cumulus"===e&&document.body.classList.contains("iframe-loaded")&&(h=!0),h&&n()}}}));(0,o.Z)((()=>{let e=!1;[window.self,window.parent,window.top].some((t=>t?.tgmp||window.frames[d.tunegenie]?(e="tunegenie",!0):window.frames[d.cumulus]?(e="cumulus",!0):void 0)),e&&("tunegenie"===e||"cumulus"===e&&document.body.classList.contains("iframe-loaded"))&&(r.debug("Page loaded with active page frame"),p=!0),m.observe(window.top.document.body,{childList:!0})}));const b=e=>{"function"==typeof e&&w.push(e)};window._CMLS.playerTools.addAfterPageFrame=b},9217:function(e,t,n){"use strict";function i(e,t,n){let i;window.document.createEvent?(i=window.document.createEvent("CustomEvent"),i.initCustomEvent(t,!0,!0,n)):i=new CustomEvent(t,{detail:n}),e.dispatchEvent(i)}n.d(t,{Z:function(){return i}})},363:function(e){"use strict";e.exports=JSON.parse('{"scriptName":"AUTO REFRESH ADS","nameSpace":"autoRefreshAds","version":"0.4","viewablePercent":50,"defaultRefreshInMinutes":1,"ALWAYS_REFRESH_POS":["wallpaper-ad"]}')},2347:function(e){"use strict";e.exports=JSON.parse('{"scriptName":"SIDEWALL ADS","nameSpace":"sidewallAds","version":"2.1","injectPoint":".wrapper-content, body > .wp-site-blocks > header + *","spacingPoint":".wrapper-content > .grid-container > *:first-child","containerId":"cmls-sidewalls","sidewallClass":"cmls-sidewall","contentWidth":1130,"topPad":10,"D":".takeover-left div[id^=\'div-gpt\'],.takeover-right div[id^=\'div-gpt\'],.skyscraper-left div[id^=\'div-gpt\'],.skyscraper-right div[id^=\'div-gpt\']","_":2000}')},7978:function(e){"use strict";e.exports=JSON.parse('{"scriptName":"STICKY-BOTTOM-320x50","nameSpace":"stickyBottomAd","version":"0.11","elementId":"CmlsStickyBottom"}')}},a={};function d(e){var t=a[e];if(void 0!==t)return t.exports;var n=a[e]={id:e,exports:{}};return s[e].call(n.exports,n,n.exports,d),n.exports}d.m=s,d.c=a,e=[],d.O=function(t,n,i,o){if(!n){var r=1/0;for(c=0;c<e.length;c++){n=e[c][0],i=e[c][1],o=e[c][2];for(var s=!0,a=0;a<n.length;a++)(!1&o||r>=o)&&Object.keys(d.O).every((function(e){return d.O[e](n[a])}))?n.splice(a--,1):(s=!1,o<r&&(r=o));if(s){e.splice(c--,1);var l=i();void 0!==l&&(t=l)}}return t}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[n,i,o]},d.H={},d.G=function(e){Object.keys(d.H).map((function(t){d.H[t](e)}))},d.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return d.d(t,{a:t}),t},n=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__},d.t=function(e,i){if(1&i&&(e=this(e)),8&i)return e;if("object"==typeof e&&e){if(4&i&&e.__esModule)return e;if(16&i&&"function"==typeof e.then)return e}var o=Object.create(null);d.r(o);var r={};t=t||[null,n({}),n([]),n(n)];for(var s=2&i&&e;"object"==typeof s&&!~t.indexOf(s);s=n(s))Object.getOwnPropertyNames(s).forEach((function(t){r[t]=function(){return e[t]}}));return r.default=function(){return e},d.d(o,r),o},d.d=function(e,t){for(var n in t)d.o(t,n)&&!d.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},d.f={},d.e=function(e){return Promise.all(Object.keys(d.f).reduce((function(t,n){return d.f[n](e,t),t}),[]))},d.u=function(e){return{58:"advertising/auto-refresh-ads",61:"advertising/paid-content/injectables-newsmax",103:"advertising/tgmp-event-targeting",133:"analytics/tabvisibility-to-gtm",183:"advertising/paid-content/injectables-hindsight",188:"advertising/wallpaper/style-outer",227:"advertising/pushdown/pushdown-2-handle-delivery",307:"analytics/promoreel-click",352:"advertising/disable-collapse-before-fetch",353:"advertising/local-nav-through-player",354:"advertising/paid-content",377:"advertising/pushdown/pushdown-1-generate-tag",394:"functionality/sharebuttons/style",445:"analytics/sgroups-to-gtm",510:"advertising/wallpaper/wallpaper-2-handle-creative",611:"advertising/wallpaper/style-inner",618:"advertising/wallpaper/wallpaper-1-await-creative",658:"advertising/sticky-bottom-320x50/style",710:"functionality/tgmp-switchstream",741:"advertising/pushdown/style",747:"advertising/sidewalls/style",771:"analytics/tgmp-events-to-gtm",800:"functionality/auto-reload-page",860:"advertising/sidewalls",894:"functionality/sharebuttons",937:"advertising/sticky-bottom-320x50",972:"functionality/social-listen-live"}[e]+"."+{58:"ce3f9393e4983c4fade0",61:"4f3783e4b963f4439ba1",103:"40a4ae31b1ffc100c84d",133:"a6d990be60dbb1635423",183:"a8f3eaf189d69039ed93",188:"b1a2ee63d75beb276529",227:"357fc0c0f0a3afb1f5d0",307:"decbbf9caa1d01b895df",352:"f34933b2cc35d99c3f32",353:"7128be8ff939ab881576",354:"da1913b4b94f9446346c",377:"90a5b5a7050baf56758d",394:"3fe6d260ed9c2a818307",445:"4bc7303622ae0b386130",510:"3e9e4338b98cd7ee6dc4",611:"bc652db3d60462bf2402",618:"b1044c9d1aaab96c2fdd",658:"a6bd8f69fecaec5b1de3",710:"6ab39e800d242690f183",741:"20d048a5aacdfe9ca981",747:"7c6398fabead8fe01942",771:"3a1ad2e29fae240e3053",800:"425abef4f85e0a9dac68",860:"6e0bb9a994b0cedf4dfe",894:"ffbbee3c57364968eb6d",937:"0de85a57de110c11a9d4",972:"2412edad0447bf119419"}[e]+".js"},d.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),d.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i={},o="cmls-amp-fse-utils:",d.l=function(e,t,n,r){if(i[e])i[e].push(t);else{var s,a;if(void 0!==n)for(var l=document.getElementsByTagName("script"),c=0;c<l.length;c++){var u=l[c];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==o+n){s=u;break}}s||(a=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,d.nc&&s.setAttribute("nonce",d.nc),s.setAttribute("data-webpack",o+n),s.src=e),i[e]=[t];var g=function(t,n){s.onerror=s.onload=null,clearTimeout(f);var o=i[e];if(delete i[e],s.parentNode&&s.parentNode.removeChild(s),o&&o.forEach((function(e){return e(n)})),t)return t(n)},f=setTimeout(g.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=g.bind(null,s.onerror),s.onload=g.bind(null,s.onload),a&&document.head.appendChild(s)}},d.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){d.S={};var e={},t={};d.I=function(n,i){i||(i=[]);var o=t[n];if(o||(o=t[n]={}),!(i.indexOf(o)>=0)){if(i.push(o),e[n])return e[n];d.o(d.S,n)||(d.S[n]={}),d.S[n];var r=[];return e[n]=r.length?Promise.all(r).then((function(){return e[n]=1})):1}}}(),function(){var e;d.g.importScripts&&(e=d.g.location+"");var t=d.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");if(n.length)for(var i=n.length-1;i>-1&&!e;)e=n[i--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),d.p=e}(),function(){var e={296:0,566:0,142:0};d.f.j=function(t,n){var i=d.o(e,t)?e[t]:void 0;if(0!==i)if(i)n.push(i[2]);else{var o=new Promise((function(n,o){i=e[t]=[n,o]}));n.push(i[2]=o);var r=d.p+d.u(t),s=new Error;d.l(r,(function(n){if(d.o(e,t)&&(0!==(i=e[t])&&(e[t]=void 0),i)){var o=n&&("load"===n.type?"missing":n.type),r=n&&n.target&&n.target.src;s.message="Loading chunk "+t+" failed.\n("+o+": "+r+")",s.name="ChunkLoadError",s.type=o,s.request=r,i[1](s)}}),"chunk-"+t,t)}},d.H.j=function(t){if(!d.o(e,t)||void 0===e[t]){e[t]=null;var n=document.createElement("link");n.charset="utf-8",d.nc&&n.setAttribute("nonce",d.nc),n.rel="preload",n.as="script",n.href=d.p+d.u(t),document.head.appendChild(n)}},d.O.j=function(t){return 0===e[t]};var t=function(t,n){var i,o,r=n[0],s=n[1],a=n[2],l=0;if(r.some((function(t){return 0!==e[t]}))){for(i in s)d.o(s,i)&&(d.m[i]=s[i]);if(a)var c=a(d)}for(t&&t(n);l<r.length;l++)o=r[l],d.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return d.O(c)},n=self.cmlsAmpUtils=self.cmlsAmpUtils||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}(),d.nc=void 0,r={377:[216,741],510:[216,611,188],860:[216,747],894:[216,394]},d.f.preload=function(e){var t=r[e];Array.isArray(t)&&t.map(d.G)};var l=d.O(void 0,[216],(function(){return d(3272)}));l=d.O(l)}();