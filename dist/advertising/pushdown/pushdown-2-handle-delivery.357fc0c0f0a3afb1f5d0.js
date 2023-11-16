(self.cmlsAmpUtils=self.cmlsAmpUtils||[]).push([[227],{8582:function(){((t,e)=>{const{h:n,Fragment:o,triggerEvent:i}=t._CMLS.libs,{throttle:a,debounce:d}=t._CMLS.libs.lodash,r="pushdownHandler",s="gpt-pushdown",l=new t._CMLS.Logger("PUSHDOWN HANDLER 0.1"),c=t.document;let u;t._CMLS[r]||(t._CMLS[r]=new function(){const e=c.getElementById(`${s}-container`),o=e.shadowRoot.getElementById(s),a=(e.shadowRoot.getElementById("close"),e.shadowRoot.getElementById("timer"));let d=15e3;this.detectCreative=t=>{if(!t)return l.warn("No iframe supplied to detectCreative"),!1;if(!t.contentWindow)return l.warn("Could not get slot iframe window, is this a safe frame?"),!1;const e=t.contentWindow.document;return e.querySelector("#vpContainer")?"Vast":e.querySelector("video")?"Video":!(!e.querySelector(".img_ad")&&!e.querySelector('img[src]:not([width="1"]):not([width="0"])'))&&"Image"},this.handleVast=t=>{l.debug("Handling VAST creative.");const e=t.contentWindow,n=e.document.getElementById("vpContainer");return n?new e.VASTPlayer(n)?void 0:(l.warn("Could not generate VASTPlayer from vpContainer"),!1):(l.warn("Attempted to handle VAST creative, but no VAST content was found."),!1)},this.handleVideo=t=>{l.debug("Handling basic video creative.");const n=t.contentWindow.document.querySelector("video");if(n.querySelector("source"),!n)return l.warn("Attempted to handle video creative, but no video tag could be found."),!1;if(!n?.canPlayType)return l.warn("Client browser does not support this video format."),!1;const o={controls:!1,muted:!0,playsinline:!0,autoplay:!1};for(key in o)n.setAttribute(key,o[key]);n.addEventListener("mouseover",(()=>n.setAttribute("muted",!1))),n.addEventListener("mouseout",(()=>n.setAttribute("muted",!0))),n.addEventListener("playing",(()=>i(a,"cmls.start",{duration:n.duration}))),n.addEventListener("ended",(()=>i(e,"cmls.hide"))),n.addEventListener("canplaythrough",(()=>i(e,"cmls.show")))},this.handleImage=o=>{l.debug("Handling image creative");const a=o.contentWindow.document,r=n("style",null,'\n\t\t\t\ta { display: block; }\n\t\t\t\timg[src]:not([width="1"]):not([width="0"]) {\n\t\t\t\t\tdisplay: block;\n\t\t\t\t\twidth: auto !important;\n\t\t\t\t\theight: auto !important;\n\t\t\t\t\tmax-width: 100%;\n\t\t\t\t\tobject-fit: cover;\n\t\t\t\t}\n\t\t\t');a.body.append(r);const s=a.querySelector('img[src]:not([width="1"]):not([width="0"])'),c=t.getComputedStyle(s);l.debug(t.getComputedStyle(a.body).height,c.height);const u=parseInt(c?.height)||s.offsetHeight;e.style.setProperty("--height",u?`${u}px`:"56.25%"),d=15;const h=s.getAttribute("alt")?.match(/timeout=(\d+)/i);if(h?.length&&(d=h[1]),t._CMLS?.navThroughPlayer){const e=t._CMLS.navThroughPlayer;[...a.querySelectorAll("a[href]")].forEach((t=>e.updateLink(t)))}i(e,"cmls.display",{duration:d})},this.process=t=>{if(l.debug("Received process request.",t),u=t,!t.getResponseInformation())return void l.warn("Slot did not load creative.");const e=o.querySelector("iframe"),n=this.detectCreative(e);n?"function"==typeof this[`handle${n}`]?this[`handle${n}`](e):l.warn("Received a creative type we cannot handle?",n):l.warn("Could not detect creative.")},e.addEventListener("cmls.hide",(n=>{const d=n?.detail?.callback||null;l.info("Hiding.",{callback:d}),i(a,"cmls.reset"),o.classList.remove("show"),o.addEventListener("transitionend",(()=>{e.setAttribute("aria-hidden","true"),u?.addService&&t.googletag.destroySlots([u]),"function"==typeof d&&d.call(this)}).bind(this))})),e.addEventListener("cmls.display",(t=>{duration=t?.detail?.duration||15,callback=t?.detail?.callback||null,l.info("Displaying.",{duration:duration,callback:callback}),o.classList.add("show"),e.removeAttribute("aria-hidden"),i(a,"cmls.start",{duration:duration,callback:callback})})),a.addEventListener("cmls.start",(t=>{const n=t?.detail?.duration||15,o=t?.detail?.callback||null;l.info("Starting timer",{duration:n,callback:o}),a.style.setProperty("--time",`${n}s`),a.classList.add("start");const d=()=>{i(e,"cmls.hide"),"function"==typeof o&&o.call(this),a.removeEventListener("transitionend",d)};a.addEventListener("transitionend",d.bind(this))})),a.addEventListener("cmls.reset",(t=>{const e=t?.detail?.callback||null;a.classList.remove("start"),a.style.removeProperty("--time"),"function"==typeof e&&e.call(this)}))})})(window.self)}}]);