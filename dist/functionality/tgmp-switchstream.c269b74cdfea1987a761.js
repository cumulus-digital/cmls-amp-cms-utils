(self.cmlsAmpUtils=self.cmlsAmpUtils||[]).push([[710],{522:function(){((t,e,a)=>{const{Logger:r,playerTools:s}=e.__CMLSINTERNAL.libs,{detectPlayer:m,waitForPlayer:i,addAfterPageFrame:c}=s,n="tgmpSwitchStream",o=new r("TGMP SWITCHSTREAM 0.6"),p=[".tgmp-switchstream",".tgmp-switchstream a",'[alt*="tgmp-switchstream"]','[alt*="tgmp-switchstream"] a','[href*="tgmp-switchstream"]','[href*="tgmp-switchstream"] a'];t?(e._CMLS.switchStreamInstance=new class{key="tgmp-switchstream";constructor(){e.top.tgmp_default_brand=e.top.tgmp_default_brand||""+e.top?.tgmp?.options?.brand,e.top.tgmp_default_theme=e.top.tgmp_default_theme||""+e.top?.tgmp?.options?.theme}getCommandSource(t){return t?.className?.includes(this.key)?"class":t?.getAttribute("alt")?.includes(this.key)?"alt":!!t?.href?.includes(key)&&"href"}parseCommand(t){const e=this.getCommandSource(t);if(!e)return!1;const a={brand:"",theme:"",autostart:!1},r=t.getAttribute(e);let s=r.match(/tgmp\-streamid\-([a-z0-9]+)/i),m=r.match(/tgmp\-theme-([\#a-z0-9]+)/i),i=r.match(/tgmp\-autostart/i);return s?.length>1&&(a.brand=s.pop()),m?.length>1&&(a.theme=m.pop()),i&&(a.autostart=!0),a}switch(t="",a="",r=!0,s="true"){m()||"function"==typeof e?.tgmp?.update?("[object Object]"===Object.prototype.toString.call(t)&&(s=t?.userInitStart||s,r=t?.autostart||r,a=t?.theme||a,t=t?.brand),!1===r&&(s="false"),t||(t=e.top.tgmp_default_brand),a||(a=e.top.tgmp_default_theme),o.info("Received stream switch request",{brand:t,theme:a,userInitStart:s}),e.tgmp.update({brand:t,theme:a,userInitStart:s})):o.warn("Switch stream request received without initialized player.")}},e._CMLS.switchStream=e._CMLS.switchStreamInstance.switch,e._CMLS.switchTGMPStream=(t="",a=!1,r="")=>{e._CMLS.switchStream(t,r,a)},i().then((()=>{t(e.document.body).off(`click.${n}`).on(`click.${n}`,p.join(","),(t=>{if(m()){t.preventDefault();const a=e._CMLS.switchStreamInstance.parseCommand(t.currentTarget);a&&(o.info("Received command",a),e._CMLS.switchStream(a))}})),c((()=>{t(e.document.body).off(`click.${n}`)}))}))):o.warn("jQuery not available")})(window?.jQuery,window.self)}}]);