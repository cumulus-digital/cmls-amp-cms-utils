(self.cmlsAmpUtils=self.cmlsAmpUtils||[]).push([[152],{5875:function(n,t,e){((n,t)=>{const i={Newsmax:"./injectables/newsmax.js",Hindsight:"./injectables/hindsight.js"},{h:o,domReady:s,getBasicPost:c,Logger:r}=n.__CMLSINTERNAL.libs,d=new r("PAID CONTENT INJECTOR 0.2");s((()=>{if(n.NO_PAIDCONTENT)return void d.info("NO_PAIDCONTENT flag found, exiting.");const t=c();if(!t)return void d.info("Could not discover entry container, exiting.");const s=t.closest(".column,.wp-block-column");if(!s)return void d.info("Could not discover entry content's parent column, exiting");const r=o("div",{id:`PAIDCONTENT-${Math.ceil(6e6*Math.random())}`,class:"injected-paid-content",style:"position: relative !important; width: 100% !important; top: 0; overflow: hidden"});s.append(r);for(const n in i){let t=!1;"function"==typeof i[n]?(r.append(i[n]()),t=!0):"string"==typeof i[n]&&(d.debug("Importing",i[n]),e(882)(`${i[n]}`).then((n=>{if(d.warn(n),"function"==typeof n?.default){const t=n.default();t&&r.append(t)}})),t=!0),t&&d.info("Injected paid content",n)}}))})(window.self)},882:function(n,t,e){var i={"./inject-content":[5875,7],"./inject-content.js":[5875,7],"./injectables/hindsight":[2167,9,294],"./injectables/hindsight.js":[2167,9,294],"./injectables/newsmax":[6454,9,893],"./injectables/newsmax.js":[6454,9,893],"./shouldImport":[204,9],"./shouldImport.js":[204,9]};function o(n){if(!e.o(i,n))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+n+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=i[n],o=t[0];return Promise.all(t.slice(2).map(e.e)).then((function(){return e.t(o,16|t[1])}))}o.keys=function(){return Object.keys(i)},o.id=882,n.exports=o}}]);