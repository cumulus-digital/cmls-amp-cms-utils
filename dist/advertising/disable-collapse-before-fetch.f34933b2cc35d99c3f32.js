"use strict";(self.cmlsAmpUtils=self.cmlsAmpUtils||[]).push([[352],{1885:function(s,e,t){t.r(e);var a=JSON.parse('{"scriptName":"DISABLE COLLAPSE EMPTY DIV","version":"0.1","divIds":[],"pos":["top"]}');const{scriptName:l,version:o,divIds:i=[],pos:n=[]}=a;((s,e)=>{const t=new s._CMLS.Logger(`${l} ${o}`),a=()=>{const e=s._CMLS.adTag.getSlots().filter((s=>{const e=s.getSlotElementId(),t=s.getTargeting("pos");if(i.includes(e)||n.some((s=>t.includes(s))))return s}));e.length&&(t.info(`Disabling collapse for ${e.length} slots`,s._CMLS.adTag.listSlotData(e)),e.forEach((s=>s.setCollapseEmptyDiv(!0,!1))))};s._CMLS.adTag?s._CMLS.adTag.queue((()=>{a()})):s.addEventListener("cmls-adtag-loaded",(()=>{s._CMLS.adTag.queue((()=>{a()}))}))})(window.self)}}]);