"use strict";(self.cmlsAmpUtils=self.cmlsAmpUtils||[]).push([[597],{978:function(e,t,s){s.r(t),s(4114),((e,t)=>{const{Logger:s,GTM:a,playerTools:r}=e.__CMLSINTERNAL.libs,{detectPlayer:p,waitForPlayer:i}=r,{push:l}=a,n="streamTracking",T=new s("TGMP-EVENTS-TO-GTM 0.1");i().then((()=>{e.tgmp?.TGMP_EVENTS?.streamplaying&&!e.__CMLSINTERNAL[n]&&(e.__CMLSINTERNAL[n]=e.tgmp.addEventListener(e.top.TGMP_EVENTS.streamplaying,(e=>{!0===e?(T.info("Stream started"),l({event:"siteplayer-stream-playing"})):!1===e&&(T.info("Stream stopped."),l({event:"siteplayer-stream-stopped"}))})))}))})(window.top)}}]);