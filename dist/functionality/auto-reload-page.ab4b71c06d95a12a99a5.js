"use strict";(self.cmlsAmpUtils=self.cmlsAmpUtils||[]).push([[808],{7076:function(t,e,i){i.r(e),i(3248);const{Logger:o,playerTools:s}=window.__CMLSINTERNAL.libs,{detectPlayer:n,addAfterPageFrame:r,navigateThroughPlayer:l}=s,a=new o("AUTO-RELOAD PAGE 0.5");((t,e)=>{const i=t;i._CMLS=i._CMLS||{};class o{defaults={condition:"body.home",timeout:8};settings={};timer=null;timeout=null;active=!1;log_timer=null;constructor(t=!1){t instanceof Object&&(a.info("Instantiated with options",t),this.settings=Object.assign(this.defaults,t),this.start())}checkCondition(){const e=t.self.location.pathname;return!!(e.length<1||"/"===e)}start(e={}){!e instanceof Object?a.error("Received malformed options"):(this.settings=Object.assign(this.defaults,this.settings,e),this.stop(),this.checkCondition()?(this.timeout=new Date(Date.now()+6e4*this.settings.timeout),this.timer=setInterval((()=>this.tick()),1e3),this.active=!0,a.info("Timer initialized. Scheduled reload:",this.timeout.toLocaleString()||this.timeout?.toISOString()||this.timeout.toUTCString())):a.info("Condition check failed, timer will not start",{tag:t.self.document.body,must_match:this.settings.condition}))}stop(){this.timer&&(a.info("Stopping timer"),clearInterval(this.timer),this.timer=null,this.active=!1),this.log_timer=null}tick(){this.log_timer||(this.log_timer=new Date);const t=new Date;t-this.log_timer>3e4&&(a.debug({headerLength:1/0,message:["Checking timer",[t.toLocaleString(),this.timeout.toLocaleString()]]}),this.log_timer=new Date),t.getTime()>this.timeout.getTime()&&this.fire()}fire(){if(this.stop(),!this.checkCondition())return void a.info("Condition check failed, timer will not fire or restart.");let e=i.location.href.replace(i.location.origin,"/").replace(/^\/+/,"/");if(e.length<1&&(e="/"),"function"==typeof t._CMLS?.clearAutoRefreshAdsExclusion&&t._CMLS.clearAutoRefreshAdsExclusion(),n())return a.info("Reloading page through player."),void l(e);i.location.href=e}push(t){a.info("Received request after initialization.",t),this.start(t)}}const s=new o;i._CMLS.autoReload=new o(i._CMLS.autoReload.pop()),r((()=>{s.stop()}))})(window.self)}}]);