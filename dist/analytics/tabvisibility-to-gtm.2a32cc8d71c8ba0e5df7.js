"use strict";(self.cmlsAmpUtils=self.cmlsAmpUtils||[]).push([[156],{8864:function(i,e,s){s.r(e),s(4114),((i,e)=>{const{Logger:s,GTM:t,playerTools:l,tabVisibility:n}=i.__CMLSINTERNAL.libs,{addVisibilityListener:a,isVisible:o}=n,{addAfterPageFrame:r}=l,{push:b}=t,d=new s("TABVISIBILITY-TO-GTM 0.2");let g=Date.now();const c=new AbortController;a((()=>{const i=Math.round((Date.now()-g)/1e4);d.info("Event fired",!0===o()?"visible":"hidden",i),b({event:"page-visibility","page-visible":!0===o(),"page-visible-time-change":i}),g=Date.now()}),{signal:c.signal}),r((()=>{c.abort()}))})(window.self)}}]);