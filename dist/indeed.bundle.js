/*! For license information please see indeed.bundle.js.LICENSE.txt */
(()=>{"use strict";var t={linkedin:{jobViewContainer:"main.scaffold-layout__main",jobTitle:".jobs-unified-top-card__job-title",jobDescriptionContainer:".jobs-description__content .jobs-box__html-content",easyApplyButton:".jobs-apply-button--top-card button.jobs-apply-button",formInputByName:function(t){return'.jobs-easy-apply-form-section__grouping input[name="'.concat(t,'"]')},formFileInput:'input[type="file"][name="file"]',formSubmitButton:'button[aria-label="Submit application"]'},indeed:{jobViewContainer:"#viewjob-container",jobTitle:".jobsearch-JobInfoHeader-title",jobDescriptionContainer:"#jobDescriptionText",applyButton:"#indeedApplyButton, .indeed-apply-button",formInputByLabel:function(t){return'input[aria-label*="'.concat(t,'" i], input[placeholder*="').concat(t,'" i]')},formFileInput:'input[type="file"]',formSubmitButton:"button.ia-continueButton, button#form-action-submit"}};function e(e,r,n){var o=t[e];if(!o)return console.error("Selectors not defined for platform: ".concat(e)),null;var i=o[r];if(!i)return console.error('Selector key "'.concat(r,'" not found for platform: ').concat(e)),null;if("function"==typeof i)try{return i(n)}catch(t){return console.error("Error generating selector for ".concat(e,".").concat(r," with args:"),n,t),null}return i}function r(t){if(!t)return null;try{return document.querySelector(t)}catch(e){return console.error('Error querying selector "'.concat(t,'":'),e),null}}function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function o(){o=function(){return e};var t,e={},r=Object.prototype,i=r.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},s="function"==typeof Symbol?Symbol:{},c=s.iterator||"@@iterator",u=s.asyncIterator||"@@asyncIterator",l=s.toStringTag||"@@toStringTag";function p(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{p({},"")}catch(t){p=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var o=e&&e.prototype instanceof m?e:m,i=Object.create(o.prototype),s=new P(n||[]);return a(i,"_invoke",{value:D(t,r,s)}),i}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var d="suspendedStart",b="suspendedYield",y="executing",v="completed",g={};function m(){}function w(){}function j(){}var x={};p(x,c,(function(){return this}));var k=Object.getPrototypeOf,S=k&&k(k(J([])));S&&S!==r&&i.call(S,c)&&(x=S);var E=j.prototype=m.prototype=Object.create(x);function I(t){["next","throw","return"].forEach((function(e){p(t,e,(function(t){return this._invoke(e,t)}))}))}function L(t,e){function r(o,a,s,c){var u=h(t[o],t,a);if("throw"!==u.type){var l=u.arg,p=l.value;return p&&"object"==n(p)&&i.call(p,"__await")?e.resolve(p.__await).then((function(t){r("next",t,s,c)}),(function(t){r("throw",t,s,c)})):e.resolve(p).then((function(t){l.value=t,s(l)}),(function(t){return r("throw",t,s,c)}))}c(u.arg)}var o;a(this,"_invoke",{value:function(t,n){function i(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(i,i):i()}})}function D(e,r,n){var o=d;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===v){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var s=n.delegate;if(s){var c=_(s,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var u=h(e,r,n);if("normal"===u.type){if(o=n.done?v:b,u.arg===g)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=v,n.method="throw",n.arg=u.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=h(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function A(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(A,this),this.reset(!0)}function J(e){if(e||""===e){var r=e[c];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(i.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(n(e)+" is not iterable")}return w.prototype=j,a(E,"constructor",{value:j,configurable:!0}),a(j,"constructor",{value:w,configurable:!0}),w.displayName=p(j,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,j):(t.__proto__=j,p(t,l,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},I(L.prototype),p(L.prototype,u,(function(){return this})),e.AsyncIterator=L,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new L(f(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},I(E),p(E,l,"Generator"),p(E,c,(function(){return this})),p(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=J,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(O),!e)for(var r in this)"t"===r.charAt(0)&&i.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function n(n,o){return s.type="throw",s.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var c=i.call(a,"catchLoc"),u=i.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),O(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:J(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function i(t,e,r,n,o,i,a){try{var s=t[i](a),c=s.value}catch(t){return void r(t)}s.done?e(c):Promise.resolve(c).then(n,o)}function a(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function s(t){i(a,n,o,s,c,"next",t)}function c(t){i(a,n,o,s,c,"throw",t)}s(void 0)}))}}function s(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,c(n.key),n)}}function c(t){var e=function(t){if("object"!=n(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=n(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==n(e)?e:e+""}new(function(){return t=function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.platform="indeed",this.jobDetails=null,this.processing=!1,console.log("Indeed Job Processor Initialized"),this.init()},n=[{key:"init",value:(l=a(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,new Promise((function(t){return setTimeout(t,1e3)}));case 2:console.log("Attempting to process Indeed job..."),this.attemptProcessJob(),chrome.runtime.onMessage.addListener((function(t,e,r){"showNotification"===t.type&&alert("[Job AutoApply] ".concat(t.level.toUpperCase(),": ").concat(t.message))}));case 5:case"end":return t.stop()}}),t,this)}))),function(){return l.apply(this,arguments)})},{key:"attemptProcessJob",value:(u=a(o().mark((function t(){var e,r,n,i;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.processing){t.next=2;break}return t.abrupt("return");case 2:if(this.processing=!0,t.prev=3,this.jobDetails=this.extractJobDetails(),null!==(e=this.jobDetails)&&void 0!==e&&e.title&&null!==(r=this.jobDetails)&&void 0!==r&&r.description){t.next=9;break}return console.log("Indeed job details not found or incomplete."),this.processing=!1,t.abrupt("return");case 9:return console.log("Extracted Indeed Job Details:",this.jobDetails),t.next=12,chrome.runtime.sendMessage({type:"hasApplied",jobIdentifier:this.jobDetails.link});case 12:if(null==(n=t.sent)||!n.applied){t.next=18;break}return console.log("Already applied to Indeed job ".concat(this.jobDetails.link,". Skipping.")),this.showStatusMessage("Already applied to this job.","info"),this.processing=!1,t.abrupt("return");case 18:return t.next=20,this.isFresherJob();case 20:if(!t.sent){t.next=28;break}return console.log("Indeed job identified as potential fresher role."),t.next=24,chrome.runtime.sendMessage({type:"skillCheck",jobData:this.jobDetails});case 24:(i=t.sent)&&i.match?(console.log("Skills match. Attempting to start Indeed application."),this.triggerApplyFlow()):i&&i.reason?console.log("Skill check skipped: ".concat(i.reason)):(console.log("Skills do not match threshold. Saving Indeed job."),this.saveJob()),t.next=29;break;case 28:console.log("Indeed job does not appear to be a fresher role.");case 29:t.next=35;break;case 31:t.prev=31,t.t0=t.catch(3),console.error("Error processing Indeed job:",t.t0),this.showStatusMessage("Error processing Indeed job: ".concat(t.t0.message),"error");case 35:return t.prev=35,this.processing=!1,t.finish(35);case 38:case"end":return t.stop()}}),t,this,[[3,31,35,38]])}))),function(){return u.apply(this,arguments)})},{key:"extractJobDetails",value:function(){var t,n=r(e(this.platform,"jobTitle")),o=r(e(this.platform,"jobDescriptionContainer")),i=r(e(this.platform,"applyButton")),a=o?o.innerText||o.textContent:null;return{title:null==n||null===(t=n.innerText)||void 0===t?void 0:t.trim(),description:null==a?void 0:a.trim(),link:window.location.href,isEasyApply:!!i,platform:this.platform,extractedAt:(new Date).toISOString()}}},{key:"isFresherJob",value:(c=a(o().mark((function t(){var e,r,n,i,a,s,c,u;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(null!==(e=this.jobDetails)&&void 0!==e&&e.description){t.next=2;break}return t.abrupt("return",!1);case 2:if(n=/\b(0\s*-\s*1|zero\s*-\s*one|0\s*to\s*1)\s+years?\b|\b(entry-?level|fresher|graduate|intern)\b|\b(no|0|1)\s+years?\s+(of\s+)?experience\b|\bexperience\s+not\s+required\b/i,i=(null===(r=this.jobDetails.title)||void 0===r?void 0:r.toLowerCase())||"",a=this.jobDetails.description.toLowerCase(),s=/\b(junior|jr|entry|graduate|intern)\b/i.test(i),c=n.test(a),!(u=/\b(senior|sr|lead|principal|manager|director|vp)\b|\b([2-9]|[1-9]\d+)\+?\s+years?\s+(of\s+)?experience\b/i).test(i)&&!u.test(a)){t.next=11;break}return console.log("Excluding job due to seniority keywords or higher experience requirement."),t.abrupt("return",!1);case 11:return t.abrupt("return",s||c);case 12:case"end":return t.stop()}}),t,this)}))),function(){return c.apply(this,arguments)})},{key:"triggerApplyFlow",value:function(){var t=this;this.jobDetails&&(r(e(this.platform,"applyButton"))&&this.jobDetails.isEasyApply?(console.log("Indeed Apply button found. Sending message to background."),chrome.runtime.sendMessage({type:"startApplication",provider:this.platform,tabId:null,jobLink:this.jobDetails.link}).then((function(e){null!=e&&e.error?t.showStatusMessage("Error starting Indeed application: ".concat(e.error),"error"):null!=e&&e.success&&t.showStatusMessage("Indeed application process initiated.","info")})).catch((function(e){console.error("Error sending startApplication message for Indeed:",e),t.showStatusMessage("Error initiating Indeed application: ".concat(e.message),"error")}))):(console.log("Not an Indeed Apply job or button not found. Saving instead."),this.saveJob()))}},{key:"saveJob",value:(i=a(o().mark((function t(){var e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.jobDetails){t.next=2;break}return t.abrupt("return");case 2:return console.log("Sending message to background to save Indeed job."),t.prev=3,t.next=6,chrome.runtime.sendMessage({type:"saveJob",jobData:this.jobDetails});case 6:null!=(e=t.sent)&&e.success?this.showStatusMessage('Indeed job "'.concat(this.jobDetails.title,'" saved.'),"success"):this.showStatusMessage("Failed to save Indeed job: ".concat((null==e?void 0:e.error)||"Unknown reason"),"error"),t.next=14;break;case 10:t.prev=10,t.t0=t.catch(3),console.error("Error sending saveJob message for Indeed:",t.t0),this.showStatusMessage("Error saving Indeed job: ".concat(t.t0.message),"error");case 14:case"end":return t.stop()}}),t,this,[[3,10]])}))),function(){return i.apply(this,arguments)})},{key:"showStatusMessage",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"info";console.log("[Status - ".concat(e.toUpperCase(),"] ").concat(t))}}],n&&s(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,n,i,c,u,l}())})();