"use strict";(self.cmlsAmpUtils=self.cmlsAmpUtils||[]).push([[445],{1989:function(e,n,t){t.r(n),t(7658),(e=>{const{triggerEvent:n}=e._CMLS.libs,{push:t}=e._CMLS.libs.GTM,r="SGROUPS-TO-GTM",s=new e._CMLS.Logger(`${r} 0.3`);if(e._CMLS.gtmCmsSgroups)return void s.warn(r,"Already registered");function i(r){s.info("Firing event",r),t({event:r}),n(e,"cms-sgroup",r)}let a=!1;function o(){s.info("running sgroups"),a||(e._CMLS.adTag.queue((()=>{if(!e?._CMLS?.adTag?.isReady())return void s.warn("Adtag interface is not ready!");const n=e._CMLS.adTag.getTargeting("cms-sgroup");if(!n||!n.length)return void s.warn("No relevant page-level targeting found.");let t=!1;n.forEach((e=>{i(e),e.includes("Westwood One")&&(t=!0)})),i(t?"Westwood One Property":"Cumulus Owned and Operated")})),a=!0)}e?._CMLS?.adTag?o():e.addEventListener("cmls-adtag-loaded",(()=>o()))})(window.self)}}]);