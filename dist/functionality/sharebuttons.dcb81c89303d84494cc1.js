(self.cmlsAmpUtils=self.cmlsAmpUtils||[]).push([[894],{7222:function(t,e,n){const{h:a,getBasicPost:l}=window._CMLS.libs,o=new window._CMLS.Logger("SHAREBUTTONS 0.2");((t,e)=>{const i={facebook:{display_name:"Facebook",url:"https://www.facebook.com/sharer/sharer.php?u={{URL}}",icon:'\n\t\t\t<svg xmlns="http://www.w3.org/2000/svg"\n\t\t\taria-label="Share via Facebook" alt="Share via Facebook" role="img"\n\t\t\tviewBox="0 0 410 410"><path d="M267,247.7h-45v134C326.8,365.1,398.2,266.8,381.7,162S266.8-14.2,162,2.4S-14.2,117.3,2.4,222\n\t\t\tc13,82.2,77.5,146.6,159.6,159.6v-134h-49v-56h49v-45c2.7-59.3,41.3-82,116-68v47h-26c-19.3,0.7-29.3,10.7-30,30v36h53.5" fill="currentColor" />\n\t\t\t</svg>\n\t\t\t'},twitter:{display_name:"Twitter",url:"https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}",icon:'\n\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg"\n\t\t\t\taria-label="Share via Twitter" alt="Share via Twitter"\n\t\t\t\trole="img" viewBox="0 0 410 340">\n\t\t\t\t<path fill="currentColor" d="M386,37.6c-15.3,6.7-30.3,10.7-45,12c16.7-10,28-24.3,34-43c-16,9.3-32.7,15.7-50,19\n\t\t\t\tc-29.5-32.2-79.5-34.3-111.6-4.8c-21.2,19.4-30.2,48.9-23.4,76.8c-67.3-4.7-121.7-32.3-163-83C6.1,50.8,16.5,97,51,120.6\n\t\t\t\tc-11.3,0-23.3-3.3-36-10c-19-10-3,62,64,79c-12.7,3.3-24.7,3.7-36,1c-17-4,15,53,74,55c-33.3,26.7-72.3,37.7-117,33\n\t\t\t\tc103.6,67.6,242.4,38.3,310-65.3c26-39.9,38.6-87.1,36-134.7C361.3,67.9,374.7,54.3,386,37.6"/>\n\t\t\t\t</svg>\n\t\t\t'},email:{display_name:"Email",url:"mailto:?subject={{TITLE}}&body={{URL}}",icon:'\n\t\t\t\t<svg\n\t\t\t\t\txmlns="http://www.w3.org/2000/svg"\n\t\t\t\t\tviewBox="0 0 25 18"\n\t\t\t\t\talt="Share via Email"\n\t\t\t\t\taria-label="Share via Email"\n\t\t\t\t>\n\t\t\t\t<path fill="currentColor" d="M24.4,1.3c-0.3-0.8-1-1.3-1.9-1.3H2.1C1.2,0,0.5,0.5,0.2,1.3C0.1,1.5,0,1.8,0,2.1v0.5v2.2V16c0,1.1,0.9,2,2.1,2h20.5\n\t\t\t\tc1.1,0,2.1-0.9,2.1-2.1V4.7V2.5V2.1C24.6,1.8,24.6,1.5,24.4,1.3z M23.6,5.3l-11.3,6.2L1,5.3V3.1l11.3,6.2l11.3-6.2V5.3z"/>\n\t\t\t\t</svg>\n\t\t\t'}},s=l(["page-template-default"]),c=(Math.ceil(6e6*Math.random()),e=>{let n=e.target;if(e.target.matches(".cmls-share_buttons--icon")||(n=e.target.closest(".cmls-share_buttons--icon")),n&&t.gtag){const e={method:n.title,content_type:t?.express_dimensions?.page_type||"post",item_id:t.location.href};o.info("Share click!",e),t.gtag("event","share",e)}}),r=a("nav",{class:"container"},a("div",{class:"label"},"Share this:"),a("ul",null,Object.keys(i).map((e=>{const n=i[e],l=n.url.replace(/\{\{URL\}\}/g,encodeURIComponent(t.location.href)).replace(/\{\{TITLE\}\}/g,encodeURIComponent(t.document.title)),o=n.icon,s=n.display_name,r=a("a",{href:l,target:"_blank",rel:"noopener",class:"cmls-share_buttons--icon",title:s,onClick:c});return r.innerHTML=o,a("li",null,r)})))),h=a("div",null);h.classList.add("cmls-share_buttons"),Promise.all([n.e(216),n.e(394)]).then(n.bind(n,8751)).then((t=>{t?.default?.use&&(t.default.use({target:h}),h.append(r),s.after(h),o.info("Share buttons injected."))}))})(window.self)}}]);