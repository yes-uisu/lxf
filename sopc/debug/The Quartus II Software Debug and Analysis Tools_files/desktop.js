/**
 * HTML element names for the search form, the spellchecking suggestion, and the
 * cluster suggestions. The search form must have the following input elements:
 * "q" (for search box), "site", "client".
 * @type {string}
 */
var ss_form_element = 'suggestion_form'; // top search form
var ss_form_element2 = 'suggestion_form2'; // bottom search form
var ss_form_elementH = 'suggestion_formH'; // header search form

/**
 * Name of search suggestion drop down.
 * @type {string}
 */
var ss_popup_element = 'search_suggest'; // top search suggestion drop-down
var ss_popup_element2 = 'search_suggest2'; // bottom search suggestion drop-down
var ss_popup_elementH = 'search_suggestH'; // header search suggestion drop-down

/**
 * Types of suggestions to include.  Just one options now, but reserving the
 * code for more types
 *   g - suggest server
 * Array sequence determines how different suggestion types are shown.
 * Empty array would effectively turn off suggestions.
 * @type {object}
 */
var ss_seq = [ 'g' ];

/**
 * Suggestion type name to display when there is only one suggestion.
 * @type {string}
 */
var ss_g_one_name_to_display = "Suggestion";
if (document.domain.indexOf("jp")>=0 || window.location.href.indexOf("ja_jp")>0) {
	ss_g_one_name_to_display = "関連キーワード";
} else if (document.domain.indexOf("cn")>=0 || window.location.href.indexOf("zh_cn")>0) {
	ss_g_one_name_to_display = "建议";
}

/**
 * Suggestion type name to display when there are more than one suggestions.
 * @type {string}
 */
var ss_g_more_names_to_display = "Suggestions";
if (document.domain.indexOf("jp")>=0 || window.location.href.indexOf("ja_jp")>0) {
	ss_g_more_names_to_display = "関連キーワード";
} else if (document.domain.indexOf("cn")>=0 || window.location.href.indexOf("zh_cn")>0) {
	ss_g_more_names_to_display = "建议";
}

/**
 * The max suggestions to display for different suggestion types.
 * No-positive values are equivalent to unlimited.
 * For key matches, -1 means using GSA default (not tagging numgm parameter),
 * 0 means unlimited.
 * Be aware that GSA has a published max limit of 10 for key matches.
 * @type {number}
 */
var ss_g_max_to_display = 10;

/**
 * The max suggestions to display for all suggestion types.
 * No-positive values are equivalent to unlimited.
 * @type {number}
 */
var ss_max_to_display = 12;

/**
 * Idling interval for fast typers.
 * @type {number}
 */
var ss_wait_millisec = 300;

/**
 * Delay time to avoid contention when drawing the suggestion box by various
 * parallel processes.
 * @type {number}
 */
var ss_delay_millisec = 30;

/**
 * Host name or IP address of GSA.
 * Null value can be used if the JS code loads from the GSA.
 * For local test, use null if there is a <base> tag pointing to the GSA,
 * otherwise use the full GSA host name
 * @type {string}
 */
var ss_gsa_host = null;

/**
 * Constant that represents legacy output format.
 * @type {string}
 */
var SS_OUTPUT_FORMAT_LEGACY = 'legacy';

/**
 * Constant that represents OpenSearch output format.
 * @type {string}
 */
var SS_OUTPUT_FORMAT_OPEN_SEARCH = 'os';

/**
 * Constant that represents rich output format.
 * @type {string}
 */
var SS_OUTPUT_FORMAT_RICH = 'rich';

/**
 * What suggest request API to use.
 *   legacy - use current protocol in 6.0
 *            Request: /suggest?token=<query>&max_matches=<num>&use_similar=0
 *            Response: [ "<term 1>", "<term 2>", ..., "<term n>" ]
 *                   or
 *                      [] (if no result)
 *   os -     use OpenSearch protocol
 *            Request: /suggest?q=<query>&max=<num>&site=<collection>&client=<frontend>&access=p&format=os
 *            Response: [
 *                        "<query>",
 *                        [ "<term 1>", "<term 2>", ... "<term n>" ],
 *                        [ "<content 1>", "<content 2>", ..., "<content n>" ],
 *                        [ "<url 1>", "<url 2>", ..., "<url n>" ]
 *                      ] (where the last two elements content and url are optional)
 *                   or
 *                      [ <query>, [] ] (if no result)
 *   rich -   use rich protocol from search-as-you-type
 *            Request: /suggest?q=<query>&max=<num>&site=<collection>&client=<frontend>&access=p&format=rich
 *            Response: {
 *                        "query": "<query>",
 *                        "results": [
 *                          { "name": "<term 1>", "type": "suggest", "content": "<content 1>", "style": "<style 1>", "moreDetailsUrl": "<url 1>" },
 *                          { "name": "<term 2>", "type": "suggest", "content": "<content 2>", "style": "<style 2>", "moreDetailsUrl": "<url 2>" },
 *                          ...,
 *                          { "name": "<term n>", "type": "suggest", "content": "<content n>", "style": "<style n>", "moreDetailsUrl": "<url n>" }
 *                        ]
 *                      } (where type, content, style, moreDetailsUrl are optional)
 *                   or
 *                      { "query": <query>, "results": [] } (if no result)
 * If unspecified or null, using legacy protocol.
 * @type {string}
 */
var ss_protocol = SS_OUTPUT_FORMAT_RICH;

/**
 * Whether to allow non-query suggestion items.
 * Setting it to false can bring results from "os" and "rich" responses into
 * backward compatible with "legacy".
 * @type {boolean}
 */
var ss_allow_non_query = true;

/**
 * Default title text when the non-query suggestion item does not have a useful
 * title.
 * The default display text should be internalionalized.
 * @type {string}
 */
var ss_non_query_empty_title =
    "No Title";

/**
 * Whether debugging is allowed.  If so, toggle with F2 key.
 * @type {boolean}
 */
var ss_allow_debug = false;

/**
 * To determine whether the auto suggestion should be taken from preview or
 * production environment
 */
var ss_mode = 
	"";
﻿var searchText = "Search";
if (document.domain.indexOf("jp")>=0 || window.location.href.indexOf("ja_jp")>0 || window.location.href.indexOf("japan")>0) {
	searchText = "検索";
} else if (document.domain.indexOf("cn")>=0 || window.location.href.indexOf("zh_cn")>0 || window.location.href.indexOf("china")>0) {
	searchText = "搜索";
}

function resetSearchField(obj) {
	if (obj.value==searchText) {
		obj.value = "";
		obj.style.color = "#000";
	} else if (obj.value=="") {
		obj.value = searchText;
		obj.style.color = "#333";
	}
}

function isSearchFormCompleted(objForm) {
	if ((objForm.q.value=="Search" || objForm.q.value=="検索" || objForm.q.value=="搜索" || objForm.q.value=="")) {
		objForm.q.value = "";
		objForm.pn.value = '0';
	}
	return true;
}


/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-1.10.2.min.map
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.2",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=st(),k=st(),E=st(),S=!1,A=function(e,t){return e===t?(S=!0,0):0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=mt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+yt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,n,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function lt(e){return e[b]=!0,e}function ut(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ct(e,t){var n=e.split("|"),r=e.length;while(r--)o.attrHandle[n[r]]=t}function pt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function dt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return lt(function(t){return t=+t,lt(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.defaultView;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.attachEvent&&i!==i.top&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),r.getElementsByTagName=ut(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ut(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=K.test(n.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ut(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=K.test(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ut(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=K.test(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return pt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?pt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:lt,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=mt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?lt(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:lt(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?lt(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:lt(function(e){return function(t){return at(e,t).length>0}}),contains:lt(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:lt(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},o.pseudos.nth=o.pseudos.eq;for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=ft(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=dt(n);function gt(){}gt.prototype=o.filters=o.pseudos,o.setFilters=new gt;function mt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function yt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function vt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function bt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function wt(e,t,n,r,i,o){return r&&!r[b]&&(r=wt(r)),i&&!i[b]&&(i=wt(i,o)),lt(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||Nt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:xt(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=xt(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=xt(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function Tt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=vt(function(e){return e===t},s,!0),p=vt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[vt(bt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return wt(l>1&&bt(f),l>1&&yt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&Tt(e.slice(l,r)),i>r&&Tt(e=e.slice(r)),i>r&&yt(e))}f.push(n)}return bt(f)}function Ct(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=xt(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?lt(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=mt(e)),n=t.length;while(n--)o=Tt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Ct(i,r))}return o};function Nt(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function kt(e,t,n,i){var a,s,u,c,p,f=mt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&yt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}r.sortStable=b.split("").sort(A).join("")===b,r.detectDuplicates=S,p(),r.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(f.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||ct("type|href|height|width",function(e,n,r){return r?t:e.getAttribute(n,"type"===n.toLowerCase()?1:2)}),r.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||ct("value",function(e,n,r){return r||"input"!==e.nodeName.toLowerCase()?t:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||ct(B,function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&i.specified?i.value:e[n]===!0?n.toLowerCase():null}),x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!l||i&&!u||(t=t||[],t=[e,t.slice?t.slice():t],n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)}),n=s=l=u=r=o=null,t
}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,r=0,o=x(this),a=e.match(T)||[];while(t=a[r++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){nn(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);


/*
 * jQuery FlexSlider v2.2.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */ (function(e){e.flexslider=function(t,n){var r=e(t);r.vars=e.extend({},e.flexslider.defaults,n);var i=r.vars.namespace,s=window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture,o=("ontouchstart"in window||s||window.DocumentTouch&&document instanceof DocumentTouch)&&r.vars.touch,u="click touchend MSPointerUp",a="",f,l=r.vars.direction==="vertical",c=r.vars.reverse,h=r.vars.itemWidth>0,p=r.vars.animation==="fade",d=r.vars.asNavFor!=="",v={},m=!0;e.data(t,"flexslider",r);v={init:function(){r.animating=!1;r.currentSlide=parseInt(r.vars.startAt?r.vars.startAt:0);isNaN(r.currentSlide)&&(r.currentSlide=0);r.animatingTo=r.currentSlide;r.atEnd=r.currentSlide===0||r.currentSlide===r.last;r.containerSelector=r.vars.selector.substr(0,r.vars.selector.search(" "));r.slides=e(r.vars.selector,r);r.container=e(r.containerSelector,r);r.count=r.slides.length;r.syncExists=e(r.vars.sync).length>0;r.vars.animation==="slide"&&(r.vars.animation="swing");r.prop=l?"top":"marginLeft";r.args={};r.manualPause=!1;r.stopped=!1;r.started=!1;r.startTimeout=null;r.transitions=!r.vars.video&&!p&&r.vars.useCSS&&function(){var e=document.createElement("div"),t=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var n in t)if(e.style[t[n]]!==undefined){r.pfx=t[n].replace("Perspective","").toLowerCase();r.prop="-"+r.pfx+"-transform";return!0}return!1}();r.vars.controlsContainer!==""&&(r.controlsContainer=e(r.vars.controlsContainer).length>0&&e(r.vars.controlsContainer));r.vars.manualControls!==""&&(r.manualControls=e(r.vars.manualControls).length>0&&e(r.vars.manualControls));if(r.vars.randomize){r.slides.sort(function(){return Math.round(Math.random())-.5});r.container.empty().append(r.slides)}r.doMath();r.setup("init");r.vars.controlNav&&v.controlNav.setup();r.vars.directionNav&&v.directionNav.setup();r.vars.keyboard&&(e(r.containerSelector).length===1||r.vars.multipleKeyboard)&&e(document).bind("keyup",function(e){var t=e.keyCode;if(!r.animating&&(t===39||t===37)){var n=t===39?r.getTarget("next"):t===37?r.getTarget("prev"):!1;r.flexAnimate(n,r.vars.pauseOnAction)}});r.vars.mousewheel&&r.bind("mousewheel",function(e,t,n,i){e.preventDefault();var s=t<0?r.getTarget("next"):r.getTarget("prev");r.flexAnimate(s,r.vars.pauseOnAction)});r.vars.pausePlay&&v.pausePlay.setup();r.vars.slideshow&&r.vars.pauseInvisible&&v.pauseInvisible.init();if(r.vars.slideshow){r.vars.pauseOnHover&&r.hover(function(){!r.manualPlay&&!r.manualPause&&r.pause()},function(){!r.manualPause&&!r.manualPlay&&!r.stopped&&r.play()});if(!r.vars.pauseInvisible||!v.pauseInvisible.isHidden())r.vars.initDelay>0?r.startTimeout=setTimeout(r.play,r.vars.initDelay):r.play()}d&&v.asNav.setup();o&&r.vars.touch&&v.touch();(!p||p&&r.vars.smoothHeight)&&e(window).bind("resize orientationchange focus",v.resize);r.find("img").attr("draggable","false");setTimeout(function(){r.vars.start(r)},200)},asNav:{setup:function(){r.asNav=!0;r.animatingTo=Math.floor(r.currentSlide/r.move);r.currentItem=r.currentSlide;r.slides.removeClass(i+"active-slide").eq(r.currentItem).addClass(i+"active-slide");if(!s)r.slides.click(function(t){t.preventDefault();var n=e(this),s=n.index(),o=n.offset().left-e(r).scrollLeft();if(o<=0&&n.hasClass(i+"active-slide"))r.flexAnimate(r.getTarget("prev"),!0);else if(!e(r.vars.asNavFor).data("flexslider").animating&&!n.hasClass(i+"active-slide")){r.direction=r.currentItem<s?"next":"prev";r.flexAnimate(s,r.vars.pauseOnAction,!1,!0,!0)}});else{t._slider=r;r.slides.each(function(){var t=this;t._gesture=new MSGesture;t._gesture.target=t;t.addEventListener("MSPointerDown",function(e){e.preventDefault();e.currentTarget._gesture&&e.currentTarget._gesture.addPointer(e.pointerId)},!1);t.addEventListener("MSGestureTap",function(t){t.preventDefault();var n=e(this),i=n.index();if(!e(r.vars.asNavFor).data("flexslider").animating&&!n.hasClass("active")){r.direction=r.currentItem<i?"next":"prev";r.flexAnimate(i,r.vars.pauseOnAction,!1,!0,!0)}})})}}},controlNav:{setup:function(){r.manualControls?v.controlNav.setupManual():v.controlNav.setupPaging()},setupPaging:function(){var t=r.vars.controlNav==="thumbnails"?"control-thumbs":"control-paging",n=1,s,o;r.controlNavScaffold=e('<ol class="'+i+"control-nav "+i+t+'"></ol>');if(r.pagingCount>1)for(var f=0;f<r.pagingCount;f++){o=r.slides.eq(f);s=r.vars.controlNav==="thumbnails"?'<img src="'+o.attr("data-thumb")+'"/>':"<a>"+n+"</a>";if("thumbnails"===r.vars.controlNav&&!0===r.vars.thumbCaptions){var l=o.attr("data-thumbcaption");""!=l&&undefined!=l&&(s+='<span class="'+i+'caption">'+l+"</span>")}r.controlNavScaffold.append("<li>"+s+"</li>");n++}r.controlsContainer?e(r.controlsContainer).append(r.controlNavScaffold):r.append(r.controlNavScaffold);v.controlNav.set();v.controlNav.active();r.controlNavScaffold.delegate("a, img",u,function(t){t.preventDefault();if(a===""||a===t.type){var n=e(this),s=r.controlNav.index(n);if(!n.hasClass(i+"active")){r.direction=s>r.currentSlide?"next":"prev";r.flexAnimate(s,r.vars.pauseOnAction)}}a===""&&(a=t.type);v.setToClearWatchedEvent()})},setupManual:function(){r.controlNav=r.manualControls;v.controlNav.active();r.controlNav.bind(u,function(t){t.preventDefault();if(a===""||a===t.type){var n=e(this),s=r.controlNav.index(n);if(!n.hasClass(i+"active")){s>r.currentSlide?r.direction="next":r.direction="prev";r.flexAnimate(s,r.vars.pauseOnAction)}}a===""&&(a=t.type);v.setToClearWatchedEvent()})},set:function(){var t=r.vars.controlNav==="thumbnails"?"img":"a";r.controlNav=e("."+i+"control-nav li "+t,r.controlsContainer?r.controlsContainer:r)},active:function(){r.controlNav.removeClass(i+"active").eq(r.animatingTo).addClass(i+"active")},update:function(t,n){r.pagingCount>1&&t==="add"?r.controlNavScaffold.append(e("<li><a>"+r.count+"</a></li>")):r.pagingCount===1?r.controlNavScaffold.find("li").remove():r.controlNav.eq(n).closest("li").remove();v.controlNav.set();r.pagingCount>1&&r.pagingCount!==r.controlNav.length?r.update(n,t):v.controlNav.active()}},directionNav:{setup:function(){var t=e('<ul class="'+i+'direction-nav"><li><a class="'+i+'prev" href="#">'+r.vars.prevText+'</a></li><li><a class="'+i+'next" href="#">'+r.vars.nextText+"</a></li></ul>");if(r.controlsContainer){e(r.controlsContainer).append(t);r.directionNav=e("."+i+"direction-nav li a",r.controlsContainer)}else{r.append(t);r.directionNav=e("."+i+"direction-nav li a",r)}v.directionNav.update();r.directionNav.bind(u,function(t){t.preventDefault();var n;if(a===""||a===t.type){n=e(this).hasClass(i+"next")?r.getTarget("next"):r.getTarget("prev");r.flexAnimate(n,r.vars.pauseOnAction)}a===""&&(a=t.type);v.setToClearWatchedEvent()})},update:function(){var e=i+"disabled";r.pagingCount===1?r.directionNav.addClass(e).attr("tabindex","-1"):r.vars.animationLoop?r.directionNav.removeClass(e).removeAttr("tabindex"):r.animatingTo===0?r.directionNav.removeClass(e).filter("."+i+"prev").addClass(e).attr("tabindex","-1"):r.animatingTo===r.last?r.directionNav.removeClass(e).filter("."+i+"next").addClass(e).attr("tabindex","-1"):r.directionNav.removeClass(e).removeAttr("tabindex")}},pausePlay:{setup:function(){var t=e('<div class="'+i+'pauseplay"><a></a></div>');if(r.controlsContainer){r.controlsContainer.append(t);r.pausePlay=e("."+i+"pauseplay a",r.controlsContainer)}else{r.append(t);r.pausePlay=e("."+i+"pauseplay a",r)}v.pausePlay.update(r.vars.slideshow?i+"pause":i+"play");r.pausePlay.bind(u,function(t){t.preventDefault();if(a===""||a===t.type)if(e(this).hasClass(i+"pause")){r.manualPause=!0;r.manualPlay=!1;r.pause()}else{r.manualPause=!1;r.manualPlay=!0;r.play()}a===""&&(a=t.type);v.setToClearWatchedEvent()})},update:function(e){e==="play"?r.pausePlay.removeClass(i+"pause").addClass(i+"play").html(r.vars.playText):r.pausePlay.removeClass(i+"play").addClass(i+"pause").html(r.vars.pauseText)}},touch:function(){var e,n,i,o,u,a,f=!1,d=0,v=0,m=0;if(!s){t.addEventListener("touchstart",g,!1);function g(s){if(r.animating)s.preventDefault();else if(window.navigator.msPointerEnabled||s.touches.length===1){r.pause();o=l?r.h:r.w;a=Number(new Date);d=s.touches[0].pageX;v=s.touches[0].pageY;i=h&&c&&r.animatingTo===r.last?0:h&&c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:h&&r.currentSlide===r.last?r.limit:h?(r.itemW+r.vars.itemMargin)*r.move*r.currentSlide:c?(r.last-r.currentSlide+r.cloneOffset)*o:(r.currentSlide+r.cloneOffset)*o;e=l?v:d;n=l?d:v;t.addEventListener("touchmove",y,!1);t.addEventListener("touchend",b,!1)}}function y(t){d=t.touches[0].pageX;v=t.touches[0].pageY;u=l?e-v:e-d;f=l?Math.abs(u)<Math.abs(d-n):Math.abs(u)<Math.abs(v-n);var s=500;if(!f||Number(new Date)-a>s){t.preventDefault();if(!p&&r.transitions){r.vars.animationLoop||(u/=r.currentSlide===0&&u<0||r.currentSlide===r.last&&u>0?Math.abs(u)/o+2:1);r.setProps(i+u,"setTouch")}}}function b(s){t.removeEventListener("touchmove",y,!1);if(r.animatingTo===r.currentSlide&&!f&&u!==null){var l=c?-u:u,h=l>0?r.getTarget("next"):r.getTarget("prev");r.canAdvance(h)&&(Number(new Date)-a<550&&Math.abs(l)>50||Math.abs(l)>o/2)?r.flexAnimate(h,r.vars.pauseOnAction):p||r.flexAnimate(r.currentSlide,r.vars.pauseOnAction,!0)}t.removeEventListener("touchend",b,!1);e=null;n=null;u=null;i=null}}else{t.style.msTouchAction="none";t._gesture=new MSGesture;t._gesture.target=t;t.addEventListener("MSPointerDown",w,!1);t._slider=r;t.addEventListener("MSGestureChange",E,!1);t.addEventListener("MSGestureEnd",S,!1);function w(e){e.stopPropagation();if(r.animating)e.preventDefault();else{r.pause();t._gesture.addPointer(e.pointerId);m=0;o=l?r.h:r.w;a=Number(new Date);i=h&&c&&r.animatingTo===r.last?0:h&&c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:h&&r.currentSlide===r.last?r.limit:h?(r.itemW+r.vars.itemMargin)*r.move*r.currentSlide:c?(r.last-r.currentSlide+r.cloneOffset)*o:(r.currentSlide+r.cloneOffset)*o}}function E(e){e.stopPropagation();var n=e.target._slider;if(!n)return;var r=-e.translationX,s=-e.translationY;m+=l?s:r;u=m;f=l?Math.abs(m)<Math.abs(-r):Math.abs(m)<Math.abs(-s);if(e.detail===e.MSGESTURE_FLAG_INERTIA){setImmediate(function(){t._gesture.stop()});return}if(!f||Number(new Date)-a>500){e.preventDefault();if(!p&&n.transitions){n.vars.animationLoop||(u=m/(n.currentSlide===0&&m<0||n.currentSlide===n.last&&m>0?Math.abs(m)/o+2:1));n.setProps(i+u,"setTouch")}}}function S(t){t.stopPropagation();var r=t.target._slider;if(!r)return;if(r.animatingTo===r.currentSlide&&!f&&u!==null){var s=c?-u:u,l=s>0?r.getTarget("next"):r.getTarget("prev");r.canAdvance(l)&&(Number(new Date)-a<550&&Math.abs(s)>50||Math.abs(s)>o/2)?r.flexAnimate(l,r.vars.pauseOnAction):p||r.flexAnimate(r.currentSlide,r.vars.pauseOnAction,!0)}e=null;n=null;u=null;i=null;m=0}}},resize:function(){if(!r.animating&&r.is(":visible")){h||r.doMath();if(p)v.smoothHeight();else if(h){r.slides.width(r.computedW);r.update(r.pagingCount);r.setProps()}else if(l){r.viewport.height(r.h);r.setProps(r.h,"setTotal")}else{r.vars.smoothHeight&&v.smoothHeight();r.newSlides.width(r.computedW);r.setProps(r.computedW,"setTotal")}}},smoothHeight:function(e){if(!l||p){var t=p?r:r.viewport;e?t.animate({height:r.slides.eq(r.animatingTo).height()},e):t.height(r.slides.eq(r.animatingTo).height())}},sync:function(t){var n=e(r.vars.sync).data("flexslider"),i=r.animatingTo;switch(t){case"animate":n.flexAnimate(i,r.vars.pauseOnAction,!1,!0);break;case"play":!n.playing&&!n.asNav&&n.play();break;case"pause":n.pause()}},pauseInvisible:{visProp:null,init:function(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)e[t]+"Hidden"in document&&(v.pauseInvisible.visProp=e[t]+"Hidden");if(v.pauseInvisible.visProp){var n=v.pauseInvisible.visProp.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(n,function(){v.pauseInvisible.isHidden()?r.startTimeout?clearTimeout(r.startTimeout):r.pause():r.started?r.play():r.vars.initDelay>0?setTimeout(r.play,r.vars.initDelay):r.play()})}},isHidden:function(){return document[v.pauseInvisible.visProp]||!1}},setToClearWatchedEvent:function(){clearTimeout(f);f=setTimeout(function(){a=""},3e3)}};r.flexAnimate=function(t,n,s,u,a){!r.vars.animationLoop&&t!==r.currentSlide&&(r.direction=t>r.currentSlide?"next":"prev");d&&r.pagingCount===1&&(r.direction=r.currentItem<t?"next":"prev");if(!r.animating&&(r.canAdvance(t,a)||s)&&r.is(":visible")){if(d&&u){var f=e(r.vars.asNavFor).data("flexslider");r.atEnd=t===0||t===r.count-1;f.flexAnimate(t,!0,!1,!0,a);r.direction=r.currentItem<t?"next":"prev";f.direction=r.direction;if(Math.ceil((t+1)/r.visible)-1===r.currentSlide||t===0){r.currentItem=t;r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");return!1}r.currentItem=t;r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");t=Math.floor(t/r.visible)}r.animating=!0;r.animatingTo=t;n&&r.pause();r.vars.before(r);r.syncExists&&!a&&v.sync("animate");r.vars.controlNav&&v.controlNav.active();h||r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");r.atEnd=t===0||t===r.last;r.vars.directionNav&&v.directionNav.update();if(t===r.last){r.vars.end(r);r.vars.animationLoop||r.pause()}if(!p){var m=l?r.slides.filter(":first").height():r.computedW,g,y,b;if(h){g=r.vars.itemMargin;b=(r.itemW+g)*r.move*r.animatingTo;y=b>r.limit&&r.visible!==1?r.limit:b}else r.currentSlide===0&&t===r.count-1&&r.vars.animationLoop&&r.direction!=="next"?y=c?(r.count+r.cloneOffset)*m:0:r.currentSlide===r.last&&t===0&&r.vars.animationLoop&&r.direction!=="prev"?y=c?0:(r.count+1)*m:y=c?(r.count-1-t+r.cloneOffset)*m:(t+r.cloneOffset)*m;r.setProps(y,"",r.vars.animationSpeed);if(r.transitions){if(!r.vars.animationLoop||!r.atEnd){r.animating=!1;r.currentSlide=r.animatingTo}r.container.unbind("webkitTransitionEnd transitionend");r.container.bind("webkitTransitionEnd transitionend",function(){r.wrapup(m)})}else r.container.animate(r.args,r.vars.animationSpeed,r.vars.easing,function(){r.wrapup(m)})}else if(!o){r.slides.eq(r.currentSlide).css({zIndex:1}).animate({opacity:0},r.vars.animationSpeed,r.vars.easing);r.slides.eq(t).css({zIndex:2}).animate({opacity:1},r.vars.animationSpeed,r.vars.easing,r.wrapup)}else{r.slides.eq(r.currentSlide).css({opacity:0,zIndex:1});r.slides.eq(t).css({opacity:1,zIndex:2});r.wrapup(m)}r.vars.smoothHeight&&v.smoothHeight(r.vars.animationSpeed)}};r.wrapup=function(e){!p&&!h&&(r.currentSlide===0&&r.animatingTo===r.last&&r.vars.animationLoop?r.setProps(e,"jumpEnd"):r.currentSlide===r.last&&r.animatingTo===0&&r.vars.animationLoop&&r.setProps(e,"jumpStart"));r.animating=!1;r.currentSlide=r.animatingTo;r.vars.after(r)};r.animateSlides=function(){!r.animating&&m&&r.flexAnimate(r.getTarget("next"))};r.pause=function(){clearInterval(r.animatedSlides);r.animatedSlides=null;r.playing=!1;r.vars.pausePlay&&v.pausePlay.update("play");r.syncExists&&v.sync("pause")};r.play=function(){r.playing&&clearInterval(r.animatedSlides);r.animatedSlides=r.animatedSlides||setInterval(r.animateSlides,r.vars.slideshowSpeed);r.started=r.playing=!0;r.vars.pausePlay&&v.pausePlay.update("pause");r.syncExists&&v.sync("play")};r.stop=function(){r.pause();r.stopped=!0};r.canAdvance=function(e,t){var n=d?r.pagingCount-1:r.last;return t?!0:d&&r.currentItem===r.count-1&&e===0&&r.direction==="prev"?!0:d&&r.currentItem===0&&e===r.pagingCount-1&&r.direction!=="next"?!1:e===r.currentSlide&&!d?!1:r.vars.animationLoop?!0:r.atEnd&&r.currentSlide===0&&e===n&&r.direction!=="next"?!1:r.atEnd&&r.currentSlide===n&&e===0&&r.direction==="next"?!1:!0};r.getTarget=function(e){r.direction=e;return e==="next"?r.currentSlide===r.last?0:r.currentSlide+1:r.currentSlide===0?r.last:r.currentSlide-1};r.setProps=function(e,t,n){var i=function(){var n=e?e:(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo,i=function(){if(h)return t==="setTouch"?e:c&&r.animatingTo===r.last?0:c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:r.animatingTo===r.last?r.limit:n;switch(t){case"setTotal":return c?(r.count-1-r.currentSlide+r.cloneOffset)*e:(r.currentSlide+r.cloneOffset)*e;case"setTouch":return c?e:e;case"jumpEnd":return c?e:r.count*e;case"jumpStart":return c?r.count*e:e;default:return e}}();return i*-1+"px"}();if(r.transitions){i=l?"translate3d(0,"+i+",0)":"translate3d("+i+",0,0)";n=n!==undefined?n/1e3+"s":"0s";r.container.css("-"+r.pfx+"-transition-duration",n)}r.args[r.prop]=i;(r.transitions||n===undefined)&&r.container.css(r.args)};r.setup=function(t){if(!p){var n,s;if(t==="init"){r.viewport=e('<div class="'+i+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(r).append(r.container);r.cloneCount=0;r.cloneOffset=0;if(c){s=e.makeArray(r.slides).reverse();r.slides=e(s);r.container.empty().append(r.slides)}}if(r.vars.animationLoop&&!h){r.cloneCount=2;r.cloneOffset=1;t!=="init"&&r.container.find(".clone").remove();r.container.append(r.slides.first().clone().addClass("clone").attr("aria-hidden","true")).prepend(r.slides.last().clone().addClass("clone").attr("aria-hidden","true"))}r.newSlides=e(r.vars.selector,r);n=c?r.count-1-r.currentSlide+r.cloneOffset:r.currentSlide+r.cloneOffset;if(l&&!h){r.container.height((r.count+r.cloneCount)*200+"%").css("position","absolute").width("100%");setTimeout(function(){r.newSlides.css({display:"block"});r.doMath();r.viewport.height(r.h);r.setProps(n*r.h,"init")},t==="init"?100:0)}else{r.container.width((r.count+r.cloneCount)*200+"%");r.setProps(n*r.computedW,"init");setTimeout(function(){r.doMath();r.newSlides.css({width:r.computedW,"float":"left",display:"block"});r.vars.smoothHeight&&v.smoothHeight()},t==="init"?100:0)}}else{r.slides.css({width:"100%","float":"left",marginRight:"-100%",position:"relative"});t==="init"&&(o?r.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+r.vars.animationSpeed/1e3+"s ease",zIndex:1}).eq(r.currentSlide).css({opacity:1,zIndex:2}):r.slides.css({opacity:0,display:"block",zIndex:1}).eq(r.currentSlide).css({zIndex:2}).animate({opacity:1},r.vars.animationSpeed,r.vars.easing));r.vars.smoothHeight&&v.smoothHeight()}h||r.slides.removeClass(i+"active-slide").eq(r.currentSlide).addClass(i+"active-slide")};r.doMath=function(){var e=r.slides.first(),t=r.vars.itemMargin,n=r.vars.minItems,i=r.vars.maxItems;r.w=r.viewport===undefined?r.width():r.viewport.width();r.h=e.height();r.boxPadding=e.outerWidth()-e.width();if(h){r.itemT=r.vars.itemWidth+t;r.minW=n?n*r.itemT:r.w;r.maxW=i?i*r.itemT-t:r.w;r.itemW=r.minW>r.w?(r.w-t*(n-1))/n:r.maxW<r.w?(r.w-t*(i-1))/i:r.vars.itemWidth>r.w?r.w:r.vars.itemWidth;r.visible=Math.floor(r.w/r.itemW);r.move=r.vars.move>0&&r.vars.move<r.visible?r.vars.move:r.visible;r.pagingCount=Math.ceil((r.count-r.visible)/r.move+1);r.last=r.pagingCount-1;r.limit=r.pagingCount===1?0:r.vars.itemWidth>r.w?r.itemW*(r.count-1)+t*(r.count-1):(r.itemW+t)*r.count-r.w-t}else{r.itemW=r.w;r.pagingCount=r.count;r.last=r.count-1}r.computedW=r.itemW-r.boxPadding};r.update=function(e,t){r.doMath();if(!h){e<r.currentSlide?r.currentSlide+=1:e<=r.currentSlide&&e!==0&&(r.currentSlide-=1);r.animatingTo=r.currentSlide}if(r.vars.controlNav&&!r.manualControls)if(t==="add"&&!h||r.pagingCount>r.controlNav.length)v.controlNav.update("add");else if(t==="remove"&&!h||r.pagingCount<r.controlNav.length){if(h&&r.currentSlide>r.last){r.currentSlide-=1;r.animatingTo-=1}v.controlNav.update("remove",r.last)}r.vars.directionNav&&v.directionNav.update()};r.addSlide=function(t,n){var i=e(t);r.count+=1;r.last=r.count-1;l&&c?n!==undefined?r.slides.eq(r.count-n).after(i):r.container.prepend(i):n!==undefined?r.slides.eq(n).before(i):r.container.append(i);r.update(n,"add");r.slides=e(r.vars.selector+":not(.clone)",r);r.setup();r.vars.added(r)};r.removeSlide=function(t){var n=isNaN(t)?r.slides.index(e(t)):t;r.count-=1;r.last=r.count-1;isNaN(t)?e(t,r.slides).remove():l&&c?r.slides.eq(r.last).remove():r.slides.eq(t).remove();r.doMath();r.update(n,"remove");r.slides=e(r.vars.selector+":not(.clone)",r);r.setup();r.vars.removed(r)};v.init()};e(window).blur(function(e){focused=!1}).focus(function(e){focused=!0});e.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7e3,animationSpeed:600,initDelay:0,randomize:!1,thumbCaptions:!1,pauseOnAction:!0,pauseOnHover:!1,pauseInvisible:!0,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:"Previous",nextText:"Next",keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:1,maxItems:0,move:0,allowOneSlide:!0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){}};e.fn.flexslider=function(t){t===undefined&&(t={});if(typeof t=="object")return this.each(function(){var n=e(this),r=t.selector?t.selector:".slides > li",i=n.find(r);if(i.length===1&&t.allowOneSlide===!0||i.length===0){i.fadeIn(400);t.start&&t.start(n)}else n.data("flexslider")===undefined&&new e.flexslider(this,t)});var n=e(this).data("flexslider");switch(t){case"play":n.play();break;case"pause":n.pause();break;case"stop":n.stop();break;case"next":n.flexAnimate(n.getTarget("next"),!0);break;case"prev":case"previous":n.flexAnimate(n.getTarget("prev"),!0);break;default:typeof t=="number"&&n.flexAnimate(t,!0)}}})(jQuery);

/** jquery scrollto
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.4.12
 */
;(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else{a(jQuery)}}(function($){var j=$.scrollTo=function(a,b,c){return $(window).scrollTo(a,b,c)};j.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};j.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(f,g,h){if(typeof g=='object'){h=g;g=0}if(typeof h=='function')h={onAfter:h};if(f=='max')f=9e9;h=$.extend({},j.defaults,h);g=g||h.duration;h.queue=h.queue&&h.axis.length>1;if(h.queue)g/=2;h.offset=both(h.offset);h.over=both(h.over);return this._scrollable().each(function(){if(f==null)return;var d=this,$elem=$(d),targ=f,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=win?$(targ):$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}var e=$.isFunction(h.offset)&&h.offset(d,targ)||h.offset;$.each(h.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=j.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(h.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=e[pos]||0;if(h.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*h.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(h.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&h.queue){if(old!=attr[key])animate(h.onAfterFirst);delete attr[key]}});animate(h.onAfter);function animate(a){$elem.animate(attr,g,h.easing,a&&function(){a.call(this,targ,h)})}}).end()};j.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return $.isFunction(a)||typeof a=='object'?a:{top:a,left:a}};return j}));

jQuery.noConflict();

(function($){
	window.blip = $;
	$(document).ready(function(){
		Altera = window.Altera || {};

		/*** header nav dropdowns ***/
		$('.altera-header-nav').on('click touchend', '.header-dropdown a', function(e){
			e.preventDefault();
			e.stopPropagation();
			var tray = $(e.target).closest('a').attr('href');
			if ($(tray).hasClass('active')){
				$('.altera-header-nav .tray.active, .altera-header-nav .header-dropdown.active').removeClass('active');
			}
			else {
				$('.altera-header-nav .tray.active, .altera-header-nav .header-dropdown.active').removeClass('active');
				$(e.target).closest('.header-dropdown').addClass('active')
				$(tray).addClass('active')
			}		
		});
		/*** end header nav dropdowns ***/

		/*** share this ***/
		$('.altera-social-nav').on('click', 'a.st_sharethis_custom', function(e){
			e.preventDefault();
		})
		/*** /share this ***/

		/*** global nav ***/

		Altera.globalNavDebounce = null;
		Altera.clearGlobalNavDebounce = function() {
			if (Altera.globalNavDebounce) {
				window.clearTimeout(Altera.globalNavDebounce);
				Altera.globalNavDebounce = null;
			}
		};

		//rollover menu items
		$('.content-primary-nav .navTriggers li a').on('mouseenter', function(e){
			Altera.clearGlobalNavDebounce();
			Altera.globalNavDebounce = window.setTimeout(function(){
				var navItem = $(e.target).parent()
					idx = navItem.index(),
					navTray = $('.navTray').eq(idx),
					navTrayCarat = navTray.children('.navTrayHeader').children('.navTrayCarat');
				$('.content-primary-nav li a').removeClass('active');
				$(e.target).addClass('active');
				$('.navTray').removeClass('active');
				navTrayCarat.css({
					left:( navItem.position().left + (navItem.width()/2 - navTrayCarat.width()/2) ) + 'px'
				})
				navTray.addClass('active');
			},150)
		});

		$('.content-primary-nav .navTriggers li a').on('touchend', function(e){
			e.preventDefault();
			e.stopPropagation();
			var navItem = $(e.target).parent()
					idx = navItem.index(),
					navTray = $('.navTray').eq(idx),
					navTrayCarat = navTray.children('.navTrayHeader').children('.navTrayCarat');
				$('.content-primary-nav li a').removeClass('active');
				$(e.target).addClass('active');
				$('.navTray').removeClass('active');
				navTrayCarat.css({
					left:( navItem.position().left + (navItem.width()/2 - navTrayCarat.width()/2) ) + 'px'
				})
				navTray.addClass('active');
		})

		//rollout menu items
		$('.content-primary-nav .navTriggers li a').on('mouseleave', function(e){
			Altera.clearGlobalNavDebounce();
			Altera.globalNavDebounce = window.setTimeout(function(){
				$('.content-primary-nav li a').removeClass('active');
				$('.navTray').removeClass('active');
			}, 150)
		});

		//rollover active navTrays will stop the debounce timer, preventing navTray from closing
		$('.navTray').on('mouseenter', function(e){
			Altera.clearGlobalNavDebounce();
		});
		//rollout active tray will close tray after debounce if no nav item rolled over
		$('.navTray').on('mouseleave', function(e){
			Altera.clearGlobalNavDebounce();
			Altera.globalNavDebounce = window.setTimeout(function(){
				$('.content-primary-nav li a').removeClass('active');
				$('.navTray').removeClass('active');
			}, 150);
		});
		//SoonMing added icon-close. Active tray will close onclick
        $('.navTray .icon-close').click(function(e) {
			Altera.clearGlobalNavDebounce();
			Altera.globalNavDebounce = window.setTimeout(function(){
				$('.content-primary-nav li a').removeClass('active');
				$('.navTray').removeClass('active');
			}, 150);
        });

		/*** end global nav ***/

		/*** tabbed container ***/
        var pathName = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
		$('.tab-navigator').on('click', 'li', function(e) {
			// console.log('tab navigator li click');
			if ( !$(e.currentTarget).hasClass('active') ) {
				try {
					var tabNav = $(e.currentTarget).closest('.tab-navigator'),
						tabbedContainer = $(e.currentTarget).closest('.tabbed-container'),
						idx= tabNav.children('li').index(e.currentTarget);
		            if(sessionStorage) sessionStorage.tab_container = pathName + ':'+ idx;
					tabNav.children('li.active').removeClass('active');
					tabbedContainer.find('.tab-item.active').removeClass('active');
					$(e.currentTarget).addClass('active');
					tabbedContainer.find('.tab-items .tab-item').eq(idx).addClass('active');
				}
				catch(e) {
	
				}
			}
		})

        var tab_container;
        if(sessionStorage) tab_container = sessionStorage.tab_container;
        var tab_path = tab_container==null ? '' : tab_container.substring(0, tab_container.indexOf(':'));
        var tab_idx = tab_container==null || pathName != tab_path? '0' : tab_container.substring(tab_container.indexOf(':') + 1);
		$('.tab-navigator li').eq(tab_idx).click();
		/*** end tabbed container ***/

		/*** feature panel rollup "hide features overview" ***/
		$('body').on('click', '.featurePanel .showHideFeatures', function(e) {
			e.preventDefault();
			var fp = $(e.target).closest('.featurePanel'),
				pb = fp.children('.panelBody'),
				h = $(e.target).parent();
			
			pb.slideToggle().promise().then(function(){
				if (pb.is(":visible")){
					//debugger;
					h.children('.showHideFeatures.show').hide();
					h.children('.showHideFeatures.hide').show();
					if(sessionStorage) sessionStorage.showHideFeatures = pathName + ':showHideFeatures-show';
				}
				else {					
					h.children('.showHideFeatures.hide').hide();
					h.children('.showHideFeatures.show').show();
					if(sessionStorage) sessionStorage.showHideFeatures = pathName + ':showHideFeatures-hide';
				}
			});
		});
        var showHideFeatures;
        if(sessionStorage) showHideFeatures = sessionStorage.showHideFeatures;
        var showHideFeatures_path = showHideFeatures==null ? '' : showHideFeatures.substring(0, showHideFeatures.indexOf(':'));
        var showHideFeatures_mode = showHideFeatures==null || pathName != showHideFeatures_path? 'showHideFeatures-show' : showHideFeatures.substring(showHideFeatures.indexOf(':') + 1);
        if ( showHideFeatures_mode == 'showHideFeatures-hide') {
          $('.featurePanel .panelBody').hide();
          $('.featurePanel .showHideFeatures.show').show();
          $('.featurePanel .showHideFeatures.hide').hide();
        }
		/*** end feature panel rollup "hide features overview" ***/

		/*** table striping ***/
		for (var i = 0; i < $('table.striped').length; i++){
			var t = $('table.striped').eq(i);
			var tr = t.children('tbody').children('tr');
			for (var j = 0; j < tr.length; j++){
				if (j%2 != 0) {
					tr.eq(j).children('td').addClass('stripe');
				}
			}
		}

		/* footer year updates */

		$('.footer .endYear').html(new Date().getFullYear())


		/** VIDEO BEHAVIOR - all videos when playing, should pause all other videos **/
		$('video').on('play', function(e){
			console.log('vid play event captured', e.target);
			var allvids = $('video').not(e.target);
			for (var i = 0; i < allvids.length; i++) {
					allvids[i].pause();
			}
		})

		/** CMS-505 - "skip-up" and "skip-down" arrows for documentation pages and tab page content **/
		if ( $('.tab-page-tab-content').length || $('.content-body-cols').length )
		{
			var skipUp = $('<a href="#" class="skipUp"></a>');
			var skipUpBottomMargin = 25;
			var skipDown = $('<a href="#" class="skipDown"></a>');
			var skipDownTopMargin = 25;
			var container = ($('.tab-page-tab-content').length)? $('.tab-page-tab-content') : $('.content-body-cols');
            console.log("!!!! container=",container);
			var containerDistFromBottom;
			var containerDistFromTop;
			var anchor = false;

			skipUp.css({
                position: 'fixed',
				bottom: skipUpBottomMargin
            });
            skipDown.css({
                position: 'fixed',
				top: skipDownTopMargin
            });

			function positionSkipsHorizontally() {
                skipUp.css({
                    left: container.offset().left + container.width() + 15
                });
                skipDown.css({
                    left: container.offset().left + container.width() + 15
                });
			}
			container.append(skipUp);
            positionSkipsHorizontally();

			if ($('#documentation_begin').length || $('[name="documentation_begin"]').length) {
				anchor = ($('#documentation_begin').length)? $('#documentation_begin') : $('[name="documentation_begin"]');
				container.append(skipDown);
			}

			$(document).on('click', '.skipUp', function(e){
				e.preventDefault();
				$(window).scrollTo(container, 800);
			});

			$(document).on('click', '.skipDown', function(e){
				e.preventDefault();
				$(window).scrollTo(anchor, 800);
			});

			$(window).on('scroll', function(e){
				containerDistFromBottom = ($(window).scrollTop() + $(window).height()) - (container.offset().top + container.height());
				containerDistFromTop = container.offset().top - $(window).scrollTop();

				if ($(window).scrollTop() > container.offset().top) {
					skipUp.fadeIn();
					if( containerDistFromBottom + 25 > skipUpBottomMargin ) {
						skipUp.css({
							bottom: containerDistFromBottom + 25
						})
					}
					else {
						skipUp.css({
							bottom: skipUpBottomMargin
						})
					}
				}
				else {
					skipUp.fadeOut();
				}
				if ( (!!anchor) && /*containerDistFromTop < 0.01 && */$(window).scrollTop() < anchor.offset().top - $(window).height()/4) {
					skipDown.fadeIn();
				}
				else {
					skipDown.fadeOut();
				}
				if ( containerDistFromTop + skipDownTopMargin >= skipDownTopMargin ) {
					skipDown.css({
						top: containerDistFromTop + skipDownTopMargin
					});
				}
				else {
					skipDown.css({
						top: skipDownTopMargin
					});
				}

			})

			$(window).on('resize',function(e){
				positionSkipsHorizontally();
			})
		}

		else if (false) {}

	}) 
})(jQuery);

/** start myaltera.js **/
function isValidEmail(email) { 
	var isValid = false;
	var at = "";
	var domain = "";
	var dot = "";

	if (email!="" && email.length>5) {
		at = email.indexOf("@");
		domain = email.substr(at+1);
		dot = domain.indexOf(".") + at + 1;
		if (at>=1 && at<dot && dot+1<email.length) {
			isValid = true;
		}
		//if (email.lastIndexOf(".")+1==email.length || email.lastIndexOf("@")+1==email.length) {
		// -- 20080226: email validation for the contain the space between email address, for leading/trailing space is ok
		if (email.lastIndexOf(".")+1==email.length || email.lastIndexOf("@")+1==email.length || email.replace(/^\s+|\s+$/g, '').indexOf(" ")!=-1) {
			isValid = false;
		}
	}
	
	return isValid;
}

function getURLParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
    }
}
/** end myaltera.js **/
// Copyright 2009 Google Inc.  All Rights Reserved.

/**
 * @fileoverview JavaScript for GSA Suggest (Core).
 *
 * List of global variables defined in other files. We define these variables
 * in an XSLT accessible to customers so that they can customize it.
 * Look at the stylesheet_template.enterprise for detailed descriptions of
 * these variables. Listing here with short descriptions:
 * <ul>
 * <li> ss_form_element {string} Name of search form.
 * <li> ss_popup_element {string} Name of search suggestion drop down.
 * <li> ss_seq {array} Types of suggestions to include.
 * <li> ss_g_one_name_to_display {string} name to display to user.
 * <li> ss_g_more_names_to_display {string} name to display to user.
 * <li> ss_g_max_to_display {number} Max number of query suggestions to display.
 * <li> ss_max_to_display {number} Max number of all types of suggestions to
 * display.
 * <li> ss_wait_millisec {number} Idling internval for fast typers.
 * <li> ss_delay_millisec {number} Delay time to avoid contention when drawing
 * the suggestion box by various par  allel processes.
 * <li> ss_gsa_host {string} Host name or IP address of GSA.
 * <li> SS_OUTPUT_FORMAT_LEGACY {string} Constant that contains the value for
 * legacy output format.
 * <li> SS_OUTPUT_FORMAT_OPEN_SEARCH {string} Constant that contains the value
 * for OpenSearch output format.
 * <li> SS_OUTPUT_FORMAT_RICH {string} Constant that contains the value for rich
 * output format.
 * <li> ss_g_protocol {string} Output format protocol to use.
 * <li> ss_allow_debug {boolean} Whether debugging is allowed.
 * </ul>
 */

/**
 * Cached array that stores processed results for typed queries.
 * @type {array}
 */
var ss_cached = [];

/**
 * Cached query when using up and down arrows to move around the suggestion box.
 * When the user escapes from the suggestion box, the typed query is restored
 * from here.
 * @type {string}
 */
var ss_qbackup = null;

/**
 * The query for which suggestions are displayed.
 * @type {string}
 */
var ss_qshown = null;

/**
 * The table row location of the selected suggestion entry.
 * @type {number}
 */
var ss_loc = -1;

/**
 * Lock to prevent painting the suggestion box for an expired query after the
 * required delay.
 * @type {number}
 */
var ss_waiting = 0;

/**
 * Lock to prevent contention when drawing the suggestion box, especially for
 * the concurrent AJAX calls.
 * @type {boolean}
 */
var ss_painting = false;

/**
 * Pending key handling request holder.
 */
var ss_key_handling_queue = null;

/**
 * Pending painting request holder.
 */
var ss_painting_queue = null;

/**
 * Global flag to indicate whether the search box is currently dismissed.
 * The suggestion box must not be drawn if it is false.
 * @type {boolean}
 */
var ss_dismissed = false;

/**
 * Low-level raw information including AJAX requests and responses shown via
 * rudimental alert().
 * @type {boolean}
 */
var ss_panic = false;

/**
 * Constant for the name of class for a row in suggestions drop down.
 * @type {string}
 */
var SS_ROW_CLASS = 'ss-gac-a';

/**
 * Constant for the name of class for a selected row in suggestions drop down.
 * @type {string}
 */
var SS_ROW_SELECTED_CLASS = 'ss-gac-b';

if (!Array.indexOf) {
  /**
   * Custom implementation of indexOf for browsers that do not support it.
   * For example, IE6 and IE7 do not support.
   *
   * @param {Object} obj The element to be searched in the array.
   *
   * @return {number} The index if the element is found, -1 otherwise.
   */
  Array.prototype.indexOf = function(obj) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  };
}

/**
 * Instance of debugger.
 * @type {ss_Debugger}
 */
var ss_debug = new ss_Debugger();

/**
 * Composes the suggest URI to be sent to EnterpriseFrontend. Extracts the user
 * input from the suggest form and then formats the URI based on that.
 *
 * @param {string} qVal The query string.
 * @param {Element} suggestForm The suggest form node.
 *
 * @return {string} The composed URI.
 */
function ss_composeSuggestUri(qVal, suggestForm) {
  var siteVal = suggestForm.site ? suggestForm.site.value : null;
  var clientVal = suggestForm.client ? suggestForm.client.value : null;
  if (!qVal || !siteVal || !clientVal) {
    return null;
  }
  var accessVal = (suggestForm.access && suggestForm.access.value) ?
      suggestForm.access.value : 'p';
  //var uri = '/suggest';
  //var uri = '/servlets/gsasuggest';
    var uri = '/bin/gsasuggest';
  if (SS_OUTPUT_FORMAT_LEGACY == ss_protocol) {
    uri = uri + '?token=' + encodeURIComponent(qVal) +
        '&max_matches=' + ss_g_max_to_display;
  } else {
    // Same param names for other two formats.
    uri = uri + '?q=' + encodeURIComponent(qVal) +
        '&max=' + ss_g_max_to_display;
  }
  uri = uri +
  	  '&mode=' + ss_mode +
      '&site=' + encodeURIComponent(siteVal) +
      '&client=' + encodeURIComponent(clientVal) +
      '&access=' + encodeURIComponent(accessVal) +
      '&format=' + encodeURIComponent(ss_protocol);
  return uri;
}

/**
 * Submits a suggest query to the EnterpriseFrontend.
 *
 * Also defines a nested function handler that is called when suggest results
 * are fetched. The handler function parses the JSON response to extract
 * dynamic result clusters, and document matches.
 *
 * @param {string} qVal The query that user enters.
 */
// TODO: This function is too big and needs to be re-factored.
function ss_suggest(qVal) {
  var startTimeMs = new Date().getTime();
  if (!ss_cached[qVal]) {
    ss_cached[qVal] = {};
  }
  var suggestForm = document.getElementById(ss_form_element);
  var uri = ss_composeSuggestUri(qVal, suggestForm);
  if (!uri) {
    return;
  }
  var url = ss_gsa_host ? 'http://' + ss_gsa_host + uri : uri;
  if (ss_panic) {
    alert('ss_suggest() AJAX: ' + url);
  }
  var xmlhttp = XH_XmlHttpCreate();
  var handler = function() {
    if (xmlhttp.readyState == XML_READY_STATE_COMPLETED) {
      if (ss_panic) {
        alert('ss_suggest() AJAX: ' + xmlhttp.responseText);
      }
      var suggested;
      try {
        suggested = eval('(' + xmlhttp.responseText + ')');
      } catch (e) {
        ss_cached[qVal].g = null;

        // Always try to show suggestion box even if there is no results
        // because previous attempt may be skipped due to concurrent ajax
        // processing.
        ss_show(qVal);
        return;
      }
      if (ss_use.g) {
        try {
          switch (ss_protocol) {
            case SS_OUTPUT_FORMAT_LEGACY:
            default:
              var suggestions = suggested;
              if (suggestions && suggestions.length > 0) {
                var found = false;
                ss_cached[qVal].g = [];
                var max = (ss_g_max_to_display <= 0) ?
                    suggestions.length :
                    Math.min(ss_g_max_to_display, suggestions.length);
                for (var si = 0; si < max; si++) {
                  ss_cached[qVal].g[si] = { 'q': suggestions[si] };
                  found = true;
                }
                if (!found) {
                  ss_cached[qVal].g = null;
                }
              } else {
                ss_cached[qVal].g = null;
              }
              break;
            case SS_OUTPUT_FORMAT_OPEN_SEARCH:
              if (suggested.length > 1) {
                var suggestions = suggested[1];
                if (suggestions && suggestions.length > 0) {
                  var found = false;
                  ss_cached[qVal].g = [];
                  var max = (ss_g_max_to_display <= 0) ?
                      suggestions.length :
                      Math.min(ss_g_max_to_display, suggestions.length);
                  for (var si = 0; si < max; si++) {
                    if (suggestions[si] && suggestions[si] != suggested[0]) {
                      ss_cached[qVal].g[si] = { 'q': suggestions[si] };
                      found = true;
                    } else if ((suggested.length > 3) && ss_allow_non_query) {
                      var title = (suggested[2].length > si) ?
                          null : suggested[2][si];
                      var url = (suggested[3].length > si) ?
                          null : suggested[3][si];
                      if (url) {
                        title = !title ? ss_non_query_empty_title : title;
                        ss_cached[qVal].g[si] = { 't': title, 'u': url };
                        found = true;
                      }
                    }
                  }
                  if (!found) {
                    ss_cached[qVal].g = null;
                  }
                } else {
                  ss_cached[qVal].g = null;
                }
              } else {
                ss_cached[qVal].g = null;
              }
              break;
            case SS_OUTPUT_FORMAT_RICH:
              var suggestions = suggested.results;
              if (suggestions && suggestions.length > 0) {
                var found = false;
                ss_cached[qVal].g = [];
                var max = (ss_g_max_to_display <= 0) ?
                    suggestions.length :
                    Math.min(ss_g_max_to_display, suggestions.length);
                for (var si = 0; si < max; si++) {
                  if (suggestions[si].name &&
                      suggestions[si].name != suggested.query) {
                    ss_cached[qVal].g[si] = { 'q': suggestions[si].name };
                    found = true;
                  } else if (ss_allow_non_query) {
                    var title = suggestions[si].content;
                    var url = suggestions[si].moreDetailsUrl;
                    if (url) {
                      title = !title ? ss_non_query_empty_title : title;
                      ss_cached[qVal].g[si] = { 't': title, 'u': url };
                      found = true;
                    }
                  }
                }
                if (!found) {
                  ss_cached[qVal].g = null;
                }
              } else {
                ss_cached[qVal].g = null;
              }
              break;
          }
        } catch (e) {
          ss_cached[qVal].g = null;
        }
      }
      if (ss_allow_debug && ss_debug && ss_debug.getDebugMode()) {
        var stopTimeMs = new Date().getTime();
        ss_debug.addRequestDebugLine(qVal, 'suggest',
                                     stopTimeMs - startTimeMs, ss_cached[qVal]);
      }

      // Always try to show suggestion box even if there is no results
      // because previous attempt may be skipped due to concurrent ajax
      // processing.
      ss_show(qVal);
    }
  };
  XH_XmlHttpPOST(xmlhttp, url, '', handler);
}

/**
 * Determines if the query has been processed.
 *
 * @param {string} qVal The query that user enters.
 * @return {boolean} True if this query is already in cache.
 */
function ss_processed(qVal) {
  if (!ss_cached[qVal] && ss_use.g) {
    return false;
  }
  return true;
}

/**
 * Handles key stroke events for turning debug console on and off.
 */
function ss_handleAllKey(e) {
  var kid = (window.event) ? window.event.keyCode : e.keyCode;
  switch (kid) {
    case 40:  // "key down".
    case 38:  // "key up".
      // If the next line is activated, key down and up will bring search box
      // into focus which is useful if the user happens to click the mouse
      // outside of the search box and the suggestions, but it may not be
      // desirable if you want to use keyboard to scroll the page also, once the
      // key is trapped here, it won't starts move the selection unless we add
      // suggestion movement code here, which would bring side effect to the
      // search box key stroke trapping.
      break;
    case 9:  // "tab".
      ss_qbackup = null;
      ss_dismissed = true;
      ss_clear(true);
    case 16:  // "shift-tab".
      ss_qbackup = null;
      ss_dismissed = true;
      var qry = document.getElementById(ss_form_element).q.value;
      if (!ss_processed(qry)) {
        // Fire new searches for the selected suggestion
        // useful for potential lucky guess.
        if (ss_panic) {
          alert('run ajax when key off');
        }
        ss_suggest(qry);
      }
      break;
    case 113:  // "F2".
      if (!ss_allow_debug) {
        break;
      }
      if (ss_debug && ss_debug.getDebugMode()) {
        ss_debug.deactivateConsole();
      } else {
        ss_debug.activateConsole();
      }
      break;
    default:
      break;
  }
}

/**
 * Handles key stroke events for the search box.
 */
function ss_handleKey(e) {
  var kid = (window.event) ? window.event.keyCode : e.keyCode;
  var fo = document.getElementById(ss_form_element);
  var qnow = (!ss_qbackup) ? fo.q.value : ss_qbackup;
  var sum = 0;
  var tbl = document.getElementById(ss_popup_element);
  switch (kid) {
    case 40:  // "key down".

      ss_dismissed = false;
      if (ss_processed(qnow)) {
        sum = ss_countSuggestions(qnow);
        if (sum > 0) {
          if (tbl.style.visibility == 'hidden') {
            ss_show(qnow);
            break;
          }

          if (ss_qbackup) {
            ss_loc++;
          } else {
            ss_qbackup = qnow;
            ss_loc = 1;
          }

          while (ss_loc >= sum +1)
            ss_loc -= sum;

          var rows = tbl.getElementsByTagName('tr');
          for (var ri = 1; ri <= rows.length-1; ri++) {
            if (ri == ss_loc) {
              	rows[ri].className = SS_ROW_SELECTED_CLASS;
            } else {
                rows[ri].className = SS_ROW_CLASS;
            }
          }

          // Find out what type of suggestion it is.
          var suggestion = ss_locateSuggestion(qnow, ss_loc);

          // Adjust the query in the search box.
          if (suggestion.q) {
            fo.q.value = suggestion.q;
          } else {
            fo.q.value = ss_qbackup;
          }
        }
      } else {
        // May be here if using back button.
        if (ss_panic) {
          alert('run ajax when key down');
        }
        ss_suggest(qnow);
      }
      break;
    case 38:  // "key up".
      ss_dismissed = false;
      if (ss_processed(qnow)) {
        sum = ss_countSuggestions(qnow);
        if (sum > 0) {
          if (tbl.style.visibility == 'hidden') {
            ss_show(qnow);
            break;
          }
          if (ss_qbackup) {
            ss_loc--;
          } else {
            ss_qbackup = qnow;
            ss_loc = -1;
          }

          while (ss_loc < 0)
            ss_loc += sum;
          var rows = tbl.getElementsByTagName('tr');
          for (var ri = 0; ri <= rows.length - 1; ri++) {
            if (ri == ss_loc) {
              rows[ri].className = SS_ROW_SELECTED_CLASS;
            } else {
              rows[ri].className = SS_ROW_CLASS;
            }
          }

           if (ss_loc > 0) {
              // Find out what type of suggestion it is.
              var suggestion = ss_locateSuggestion(qnow, ss_loc);

              // Adjust the query in the search box.
              if (suggestion.q) {
                fo.q.value = suggestion.q;
              } else {
                fo.q.value = ss_qbackup;
              }
           }
        }
      } else {
        // May be here if using back button.
        if (ss_panic) {
          alert('run ajax when key up');
        }
        ss_suggest(qnow);
      }
      break;
    case 13:  // "enter".

      var url = null;
      if (ss_processed(qnow) && ss_qbackup && ss_loc > -1) {
        // Find out what type of suggestion it is.
        var suggestion = ss_locateSuggestion(ss_qbackup, ss_loc);
        // Adjust the query in the search box.
        if (suggestion.u) {
          url = suggestion.u;
        }
      }
      ss_qbackup = null;
      ss_dismissed = true;
      ss_clear();
      if (url) {
        window.location.href = url;
      }
      break;
    case 27:  // "escape".
      if (ss_qbackup) {
        fo.q.value = ss_qbackup;
        ss_qbackup = null;
      }
      ss_dismissed = true;
      ss_clear();
      break;
    case 37:  // "key left".
    case 39:  // "key right".
    case 9:  // "tab".
    case 16:  // "shift-tab".
      break;
    default:
      ss_dismissed = false;
      if (fo.q.value == ss_qshown) {
        // The key stroke has not changed the searched text.
      } else {
        if (ss_key_handling_queue) {
          // Ignore pending key handling request delayed earlier.
          clearTimeout(ss_key_handling_queue);
        }
        ss_qbackup = null;
        ss_loc = -1;
        // Flow through for delayed AJAX calls.
        ss_waiting++;
        if (ss_allow_debug && ss_debug && ss_debug.getDebugMode()) {
          ss_debug.addWaitDebugLine(fo.q.value, 'queue', ss_wait_millisec);
        }
        ss_key_handling_queue = setTimeout(
            'ss_handleQuery("' + ss_escape(fo.q.value) + '", ' +
            ss_waiting + ')', ss_wait_millisec);
      }
      break;
  }
}

/**
 * Triggers fetch for query suggestions or triggers the display depending on
 * whether the query has already been processed earlier or not.
 *
 * @param {string} query The query whose suggestions are needed.
 * @param {number} waiting1 The value to match the lock so as not to handle
 *     queries that are no longer valid.
 */
function ss_handleQuery(query, waiting1) {
  if (waiting1 != ss_waiting) return;
  ss_waiting = 0;
  if (query == '') {
    ss_clear();
  } else if (!ss_processed(query)) {
    if (ss_panic) {
      alert('run ajax when key change');
    }
    ss_suggest(query);
  } else {
    ss_show(query);
  }
}

/**
 * Puts search box in focus.
 */
function ss_sf() {
  document.getElementById(ss_form_element).q.focus();
  ss_dismissed = false;
}

/**
 * Clears search suggestions.
 *
 * @param {boolean} nofocus The flag to indicate whether the search box must not
 *     be in focus, such as when user uses the tab key to move away to the
 *     search button(s).
 */
function ss_clear(nofocus) {
  ss_qshown = null;
  var fo = document.getElementById(ss_form_element);
  var qnow = (!ss_qbackup) ? fo.q.value : ss_qbackup;
  ss_hide(qnow);
  if (!nofocus) {
    ss_sf();
  }
}

/**
 * Hides search suggestions.
 *
 * @param {string} qry The query to which suggestions to be closed.
 */
function ss_hide(qry) {
  var tbl = document.getElementById(ss_popup_element);
  if (tbl.style.visibility == 'visible') {
    if (ss_panic) {
      alert('close suggestion box');
    }
    if (ss_allow_debug && ss_debug && ss_debug.getDebugMode()) {
      ss_debug.addHideDebugLine(qry, 'hide');
    }
    tbl.style.visibility = 'hidden';
  }
}

/**
 * Shows search suggestions.
 *
 * @param {string} qry The query to which suggestions to be presented.
 */
function ss_show(qry) {
  var currentQry = document.getElementById(ss_form_element).q.value;
  if (currentQry != qry) {
    // The query whose suggestions to be shown does not match the current query
    // this happens when the previous query takes much longer to process.
    if (ss_allow_debug && ss_debug && ss_debug.getDebugMode()) {
      ss_debug.addHideDebugLine(qry, 'skip');
    }
    return;
  }

  var startTimeMs = new Date().getTime();
  if (ss_dismissed) {
    // The suggestion box has been dismissed by mouse close or key
    // escape/enter/tab.
    ss_qshown = null;
    ss_hide(qry);
    return;
  }

  if (!ss_processed(qry)) {
    // Not all ajax calls have been processed, skip instead.
    return;
  }

  if (qry == '') {
    // Empty query should not have much to suggest, close if not already.
    ss_hide(qry);
    return;
  }

  var g = ss_cached[qry] ? ss_cached[qry].g : null;
  var disp = false;
  if (ss_use.g && g) {
    disp = true;
  }
  if (!disp) {
    // Nothing to show for.
    ss_qshown = null;
    ss_hide(qry);
    return;
  }
  // Check the lock.
  if (ss_painting) {
    if (ss_painting_queue) {
      // Ignore potential painting request delayed earlier.
      clearTimeout(ss_painting_queue);
    }
    // Postpone the call for later time.
    if (ss_allow_debug && ss_debug && ss_debug.getDebugMode()) {
      ss_debug.addWaitDebugLine(qry, 'delay', ss_delay_millisec);
    }
    ss_painting_queue = setTimeout('ss_show("' + ss_escape(qry) + '")',
                                   ss_delay_millisec);
    return;
  } else {
    // Set the lock, which may not be fool-proof when more than another thread
    // checks the lock just before.
    ss_painting = true;
  }

  var tbl = document.getElementById(ss_popup_element);
  for (var ri = tbl.rows.length - 1; ri > -1; ri--) {
    tbl.deleteRow(ri);
  }
  var cnt = 0;

  if (g && g.length > 0) {
      var row = tbl.insertRow(-1);
      row.className = 'ss-gac-e';

      var clue = '';
      if (g.length == 1) {
        clue = ss_g_one_name_to_display;
      } else {
        clue = ss_g_more_names_to_display;
      }
      var typ = document.createElement('td');
      typ.appendChild(document.createTextNode(clue));
      typ.className = 'ss-gac-c';
      row.appendChild(typ);

        var cls = document.createElement('td');
        cls.className = 'ss-gac-d';
        cls.onclick = function() {
            ss_qbackup = null;
            ss_clear();  // This will always turn off ss_dismiss after bring search
                       // box into focus.
            var query = document.getElementById(ss_form_element).q.value;

            if (!ss_processed(query)) {
                // Fire new searches for the selected suggestion
                // useful for potential lucky guess.
                ss_dismissed = true;
                if (ss_panic) {
                  alert('run ajax when mouse close');
                }
                ss_suggest(query);
             }
        };

    	var divTxt = document.createElement('div');
        divTxt.className = 'icon-closeSearch';
   		var spanTxt = document.createElement('span');
        divTxt.appendChild(spanTxt);

        cls.appendChild(divTxt);
    	row.appendChild(cls);

    }


  for (var z = 0; z < ss_seq.length; z++) {
    switch (ss_seq[z]) {
      case 'g':
        cnt += ss_showSuggestion(g, cnt, tbl, qry);
        break;
    }
    if (ss_max_to_display > 0 && cnt >= ss_max_to_display) {
      break;
    }
  }

    if (cnt > 0) {

    var row = tbl.insertRow(-1);
    row.className = 'ss-gac-e';
    var cls = document.createElement('td');
    cls.colSpan = 2;
    row.appendChild(cls);

    tbl.style.visibility = 'visible';

    ss_qshown = qry;
    if (ss_panic) {
      alert('open suggestion box for ' + qry);
    }
    if (ss_allow_debug && ss_debug && ss_debug.getDebugMode()) {
      var stopTimeMs = new Date().getTime();
      ss_debug.addShowDebugLine(qry, stopTimeMs - startTimeMs,
                                ss_cached[qry], cnt);
    }
  } else {
    ss_hide(qry);
  }

  // Release the lock.
  ss_painting = false;
}

/**
 * Draws suggestion.
 *
 * @param {object} g The suggest server entry.
 * @param {number} cnt The current row index to start drawing.
 * @param {object} tbl The suggestion box element.
 * @param {string} qry The user's query.
 * @return {number} Returns the number of suggestions actually drawn.
 */
function ss_showSuggestion(g, cnt, tbl, qry) {
  if (ss_max_to_display > 0 && cnt >= ss_max_to_display) {
    return 0;
  }

  if (g && g.length > 0) {

    lqry = qry.toLowerCase().replace(/\"/g, "");
    for (var i = 0; i < g.length; i++) {
      var row = tbl.insertRow(-1);
      row.onclick = ss_handleMouseC;
      row.onmousemove = ss_handleMouseM;
      row.className = SS_ROW_CLASS;
      var alt = document.createElement('td');
      // the suggestion will always start with the query.
      if (g[i].q) {
        var txtNode = '<b>' + g[i].q.substr(0, lqry.length) + '</b>';
        if (g[i].q.length > lqry.length) {
          txtNode += g[i].q.substring(lqry.length);
        }
        alt.innerHTML = txtNode;
      } else {
        alt.innerHTML = '<i>' + g[i].t + '</i>';
      }
      alt.className = 'ss-gac-c';
      row.appendChild(alt);

       var typ = document.createElement('td');
      typ.className = 'ss-gac-d';
      row.appendChild(typ);
      if (ss_max_to_display > 0 && cnt + i + 1 >= ss_max_to_display) {
        return i + 1;
      }
    }
    return g.length;
  }
  return 0;
}

/**
 * Handles mouse movement. To be attached to the row on mouse-over.
 * @return {boolean} Always returns true after handling the event.
 * @this {Element}
 */
function ss_handleMouseM() {
  var fo = document.getElementById(ss_form_element);
  var tbl = document.getElementById(ss_popup_element);
  var rows = tbl.getElementsByTagName('tr');
  for (var ri = 1; ri <= rows.length - 1; ri++) {
    if (rows[ri] == this && rows[ri].className != SS_ROW_SELECTED_CLASS) {
      // Select the row.
      rows[ri].className = SS_ROW_SELECTED_CLASS;
      // Back up the original query if not already, and adjust the reference
      // index.
      if (!ss_qbackup) {
        ss_qbackup = fo.q.value;
      }
      ss_loc = ri;
      // Find out what type of suggestion it is.
      var suggestion = ss_locateSuggestion(ss_qbackup, ss_loc);
      // Adjust the query in the search box.
      if (suggestion.q) {
        fo.q.value = suggestion.q;
      } else {
        fo.q.value = ss_qbackup;
      }
    } else if (rows[ri] != this) {
      rows[ri].className = SS_ROW_CLASS;
    }
  }
  // Bring the search box back into focus to allow the next key down and key up.
  ss_sf();
  return true;
}

/**
 * Handles mouse pressing, while keeping the history in the browser in case back
 * button is used. To be attached to the row on mouse clicking.
 * @this {Element}
 */
function ss_handleMouseC() {
  var fo = document.getElementById(ss_form_element);
  var tbl = document.getElementById(ss_popup_element);
  var rows = tbl.getElementsByTagName('tr');
  for (var ri = 1; ri <= rows.length - 1; ri++) {
    if (rows[ri] == this) {
      // Back up the original query if not already, and adjust the reference
      // index.
      if (!ss_qbackup) {
        ss_qbackup = fo.q.value;
      }
      ss_loc = ri;
      // Find out what type of suggestion it is.
      var suggestion = ss_locateSuggestion(ss_qbackup, ss_loc);
      // Adjust the query in the search box.
      if (suggestion.q) {
        fo.q.value = suggestion.q;
        fo.submit();
      } else {
        fo.q.value = ss_qbackup;
        if (suggestion.u) {
          window.location.href = suggestion.u;
        }
      }
      break;
    }
  }
}

/**
 * Counts the total number of suggestions for the typed query.
 *
 * @param {string} query The typed query.ss_locateSuggestion
 * @return {number} The number of suggestions we have for displaying.
 */
function ss_countSuggestions(query) {
  var cnt = 0;
  for (var i = 0; i < ss_seq.length; i++) {
    switch (ss_seq[i]) {
      case 'g':
        cnt += ss_cached[query].g ? ss_cached[query].g.length : 0;
        break;
    }
    if (ss_max_to_display > 0 && cnt >= ss_max_to_display) {
      return ss_max_to_display;
    }
  }
  return cnt;
}

/**
 * Looks up the suggestion for the typed query.
 *
 * @param {string} query The typed query.
 * @param {number} loc The location index of the current suggestion selection.
 *
 * @return {string} The suggestion term for given query at the given loc.
 */
function ss_locateSuggestion(query, loc) {
  var cnt1 = 1;
  var cnt2 = 0;
  var type = null;
  for (var z = 0; z <= ss_seq.length; z++) {
    switch (ss_seq[z]) {
      case 'g':
        cnt2 += ss_cached[query].g ? ss_cached[query].g.length : 0;
        break;
    }
    if (loc >= cnt1 && loc <= cnt2) {

      switch (ss_seq[z]) {
        case 'g':
          var qV = ss_cached[query].g[loc - cnt1].q;
          if (qV) {
            return { 'q': qV };
          } else {
            return { 'u': ss_cached[query].g[loc - cnt1].u };
          }
      }
      break;
    }
    cnt1 = cnt2;
  }
  return null;
}

/**
 * Escapes query to be used in setTimeout().
 *
 * @param {string} query The query whose suggestions are needed.
 * @return {string} The escaped query.
 */
function ss_escape(query) {
  return query.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"');
}

/**
 * Escapes query to be used in debugging display.
 *
 * @param {string} query The query whose suggestions are needed.
 * @return {string} The escaped query.
 */
function ss_escapeDbg(query) {
  var escapedQuery = '';
  var ch = query.split('');
  for (var i = 0; i < ch.length; i++) {
    switch (ch[i]) {
      case '&':
        escapedQuery += '&amp;';
        break;
      case '<':
        escapedQuery += '&lt;';
        break;
      case '>':
        escapedQuery += '&gt;';
        break;
      default:
        escapedQuery += ch[i];
        break;
    }
  }
  return escapedQuery;
}

/**
 * Debugger class.
 *
 * @constructor
 */
function ss_Debugger() {
  this.debugMode = false;
}

/**
 * Id of debug console in the DOM Tree.
 * @type {string}
 */
ss_Debugger.DEBUG_CONSOLE_ID = 'ss_debug_console';

/**
 * Id of content node of debug console in the DOM Tree.
 * @type {string}
 */
ss_Debugger.DEBUG_CONTENT_ID = 'ss_debug_content';

/**
 * Id of the button that minimizes/maximizes the debug console.
 * @type {string}
 */
ss_Debugger.DEBUG_TOGGLE_ID = 'ss_debug_toggle';

/**
 * Getter method for debugMode member variable.
 * @return {boolean} The value of debugMode variable.
 */
ss_Debugger.prototype.getDebugMode = function() {
  return this.debugMode;
};

/**
 * Activates debugger console.
 */
ss_Debugger.prototype.activateConsole = function() {
  var console = document.getElementById(ss_Debugger.DEBUG_CONSOLE_ID);
  if (console) {
    console.style.display = 'block';
  } else {
    var dc = document.createElement('div');
    dc.id = ss_Debugger.DEBUG_CONSOLE_ID;
    dc.zIndex = 100;
    dc.className = 'expanded';
    var title = document.createElement('h1');
    title.appendChild(document.createTextNode('GSA Suggest Debug Console'));
    title.style.display = 'inline';
    dc.appendChild(title);
    var actn = document.createElement('div');
    // actn.style.float = 'right'; -- bonnie requested to commented out since it cause the prolem in minifying js
    var btn = document.createElement('button');
    btn.onclick = function(event) {
      var debugContent = document.getElementById(ss_Debugger.DEBUG_CONTENT_ID);
      if (debugContent) {
        for (var ri = debugContent.rows.length - 1; ri > 0; ri--) {
          debugContent.deleteRow(ri);
        }
      }
    };
    btn.appendChild(document.createTextNode('Clear console'));
    actn.appendChild(btn);
    btn = document.createElement('button');
    btn.onclick = function(event) {
      ss_cached = [];
    };
    btn.appendChild(document.createTextNode('Clear cache'));
    actn.appendChild(btn);
    btn = document.createElement('button');
    btn.id = ss_Debugger.DEBUG_TOGGLE_ID;
    btn.onclick = function(event) {
      var debugConsole = document.getElementById(ss_Debugger.DEBUG_CONSOLE_ID);
      if (debugConsole) {
        var b = document.getElementById(ss_Debugger.DEBUG_TOGGLE_ID);
        if (debugConsole.className.indexOf('expanded') != -1) {
          debugConsole.className = debugConsole.className.replace(
              /expanded/, 'contracted');
          b.innerHTML = 'Maximize';
        } else {
          debugConsole.className = debugConsole.className.replace(
              /contracted/, 'expanded');
          b.innerHTML = 'Minimize';
        }
      }
    };
    btn.appendChild(document.createTextNode('Minimize'));
    actn.appendChild(btn);
    actn.style.display = 'inline';
    dc.appendChild(actn);
    dc.appendChild(document.createElement('br'));
    var pane = document.createElement('table');
    pane.id = ss_Debugger.DEBUG_CONTENT_ID;
    var dhr = pane.insertRow(-1);
    var dhc = document.createElement('th');
    dhc.innerHTML = 'Query';
    dhr.appendChild(dhc);
    dhc = document.createElement('th');
    dhc.innerHTML = 'Type';
    dhr.appendChild(dhc);
    dhc = document.createElement('th');
    dhc.innerHTML = 'Time';
    dhr.appendChild(dhc);
    dhc = document.createElement('th');
    dhc.innerHTML = 'g';
    dhr.appendChild(dhc);
    dhc = document.createElement('th');
    dhc.innerHTML = 'Total';
    dhr.appendChild(dhc);
    dc.appendChild(pane);
    document.body.appendChild(dc);
  }
  this.debugMode = true;
};

/**
 * De-activates debugger console.
 */
ss_Debugger.prototype.deactivateConsole = function() {
  var console = document.getElementById(ss_Debugger.DEBUG_CONSOLE_ID);
  if (console) {
    console.style.display = 'none';
  }
  this.debugMode = false;
};

ss_Debugger.prototype.addRequestDebugLine = function(query, type, time, obj) {
  var debugContent = document.getElementById(ss_Debugger.DEBUG_CONTENT_ID);
  if (debugContent) {
    var currentRow = debugContent.insertRow(1);
    var currentCell = document.createElement('td');
    currentCell.innerHTML = '&lt;' + ss_escapeDbg(query) + '&gt;';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.innerHTML = type;
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = time + ' ms';
    currentRow.appendChild(currentCell);
    switch (type) {
      case 'suggest':
        currentCell = document.createElement('td');
        currentCell.className = 'no';
        currentCell.innerHTML = (obj.g ? obj.g.length : 0);
        currentRow.appendChild(currentCell);
        currentCell = document.createElement('td');
        currentRow.appendChild(currentCell);
        break;
      default:
        currentCell = document.createElement('td');
        currentRow.appendChild(currentCell);
        currentCell = document.createElement('td');
        currentRow.appendChild(currentCell);
        break;
    }
  }
};

ss_Debugger.prototype.addShowDebugLine = function(query, time, o, total) {
  var debugContent = document.getElementById(ss_Debugger.DEBUG_CONTENT_ID);
  if (debugContent) {
    var currentRow = debugContent.insertRow(1);
    var currentCell = document.createElement('td');
    currentCell.innerHTML = '&lt;' + ss_escapeDbg(query) + '&gt;';
    currentRow.appendChild(currentCell);

    currentCell = document.createElement('td');
    currentCell.innerHTML = '<i>show</i>';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = time + ' ms';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = (o ? (o.g ? o.g.length : 0) : 0);
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = total;
    currentRow.appendChild(currentCell);
  }
};

ss_Debugger.prototype.addHideDebugLine = function(query, type) {
  var debugContent = document.getElementById(ss_Debugger.DEBUG_CONTENT_ID);
  if (debugContent) {
    var currentRow = debugContent.insertRow(1);
    var currentCell = document.createElement('td');
    currentCell.innerHTML = '&lt;' + ss_escapeDbg(query) + '&gt;';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.innerHTML = '<i>' + type + '</i>';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = '0 ms';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentRow.appendChild(currentCell);
  }
};

ss_Debugger.prototype.addWaitDebugLine = function(query, type, time) {
  var debugContent = document.getElementById(ss_Debugger.DEBUG_CONTENT_ID);
  if (debugContent) {
    var currentRow = debugContent.insertRow(1);
    var currentCell = document.createElement('td');
    currentCell.innerHTML = '&lt;' + ss_escapeDbg(query) + '&gt;';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.innerHTML = '<i>' + type + '</i>';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = time + ' ms';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentRow.appendChild(currentCell);
  }
};

/**
 * Object that stores which all type of suggestions to display.
 * @type {object}
 */
var ss_use = {};
ss_use.g = ss_seq.indexOf('g') >= 0 ? true : false;

/**
 * Defined outside this file (by the browser's DOM).
 * @type {object}
 */
document.onkeyup = ss_handleAllKey;

// Copyright 2009 Google Inc.  All Rights Reserved.

/**
 * @fileoverview JavaScript for GSA Suggest (Core).
 *
 * List of global variables defined in other files. We define these variables
 * in an XSLT accessible to customers so that they can customize it.
 * Look at the stylesheet_template.enterprise for detailed descriptions of
 * these variables. Listing here with short descriptions:
 * <ul>
 * <li> ss_form_elementH {string} Name of search form.
 * <li> ss_popup_elementH {string} Name of search suggestion drop down.
 * <li> ss_seq {array} Types of suggestions to include.
 * <li> ss_g_one_name_to_display {string} name to display to user.
 * <li> ss_g_more_names_to_display {string} name to display to user.
 * <li> ss_g_max_to_display {number} Max number of query suggestions to display.
 * <li> ss_max_to_display {number} Max number of all types of suggestions to
 * display.
 * <li> ss_wait_millisec {number} Idling internval for fast typers.
 * <li> ss_delay_millisec {number} Delay time to avoid contention when drawing
 * the suggestion box by various par  allel processes.
 * <li> ss_gsa_host {string} Host name or IP address of GSA.
 * <li> SS_OUTPUT_FORMAT_LEGACY {string} Constant that contains the value for
 * legacy output format.
 * <li> SS_OUTPUT_FORMAT_OPEN_SEARCH {string} Constant that contains the value
 * for OpenSearch output format.
 * <li> SS_OUTPUT_FORMAT_RICH {string} Constant that contains the value for rich
 * output format.
 * <li> ss_g_protocol {string} Output format protocol to use.
 * <li> ss_allow_debug {boolean} Whether debugging is allowed.
 * </ul>
 */

/**
 * Cached array that stores processed results for typed queries.
 * @type {array}
 */
var ss_cachedH = [];

/**
 * Cached query when using up and down arrows to move around the suggestion box.
 * When the user escapes from the suggestion box, the typed query is restored
 * from here.
 * @type {string}
 */
var ss_qbackupH = null;

/**
 * The query for which suggestions are displayed.
 * @type {string}
 */
var ss_qshownH = null;

/**
 * The table row location of the selected suggestion entry.
 * @type {number}
 */
var ss_locH = -1;

/**
 * Lock to prevent painting the suggestion box for an expired query after the
 * required delay.
 * @type {number}
 */
var ss_waitingH = 0;

/**
 * Lock to prevent contention when drawing the suggestion box, especially for
 * the concurrent AJAX calls.
 * @type {boolean}
 */
var ss_paintingH = false;

/**
 * Pending key handling request holder.
 */
var ss_key_handling_queueH = null;

/**
 * Pending painting request holder.
 */
var ss_painting_queueH = null;

/**
 * Global flag to indicate whether the search box is currently dismissed.
 * The suggestion box must not be drawn if it is false.
 * @type {boolean}
 */
var ss_dismissedH = false;

/**
 * Low-level raw information including AJAX requests and responses shown via
 * rudimental alert().
 * @type {boolean}
 */
var ss_panicH = false;

/**
 * Constant for the name of class for a row in suggestions drop down.
 * @type {string}
 */
var SS_ROW_CLASSH = 'ss-gac-a';

/**
 * Constant for the name of class for a selected row in suggestions drop down.
 * @type {string}
 */
var SS_ROW_SELECTED_CLASSH = 'ss-gac-b';

if (!Array.indexOf) {
  /**
   * Custom implementation of indexOf for browsers that do not support it.
   * For example, IE6 and IE7 do not support.
   *
   * @param {Object} obj The element to be searched in the array.
   *
   * @return {number} The index if the element is found, -1 otherwise.
   */
  Array.prototype.indexOf = function(obj) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  };
}

/**
 * Instance of debugger.
 * @type {ss_DebuggerH}
 */
var ss_debugH = new ss_DebuggerH();

/**
 * Composes the suggest URI to be sent to EnterpriseFrontend. Extracts the user
 * input from the suggest form and then formats the URI based on that.
 *
 * @param {string} qVal The query string.
 * @param {Element} suggestForm The suggest form node.
 *
 * @return {string} The composed URI.
 */
function ss_composeSuggestUriH(qVal, suggestForm) {
  var siteVal = suggestForm.site ? suggestForm.site.value : null;
  var clientVal = suggestForm.client ? suggestForm.client.value : null;
  if (!qVal || !siteVal || !clientVal) {
    return null;
  }
  var accessVal = (suggestForm.access && suggestForm.access.value) ?
      suggestForm.access.value : 'p';
  //var uri = '/suggest';
  //var uri = '/servlets/gsasuggest';
    var uri = '/bin/gsasuggest';
  if (SS_OUTPUT_FORMAT_LEGACY == ss_protocol) {
    uri = uri + '?token=' + encodeURIComponent(qVal) +
        '&max_matches=' + ss_g_max_to_display;
  } else {
    // Same param names for other two formats.
    uri = uri + '?q=' + encodeURIComponent(qVal) +
        '&max=' + ss_g_max_to_display;
  }
  uri = uri +
	  '&mode=' + ss_mode +
      '&site=' + encodeURIComponent(siteVal) +
      '&client=' + encodeURIComponent(clientVal) +
      '&access=' + encodeURIComponent(accessVal) +
      '&format=' + encodeURIComponent(ss_protocol);
  return uri;
}

/**
 * Submits a suggest query to the EnterpriseFrontend.
 *
 * Also defines a nested function handler that is called when suggest results
 * are fetched. The handler function parses the JSON response to extract
 * dynamic result clusters, and document matches.
 *
 * @param {string} qVal The query that user enters.
 */
// TODO: This function is too big and needs to be re-factored.
function ss_suggestH(qVal) {
  var startTimeMs = new Date().getTime();
  if (!ss_cachedH[qVal]) {
    ss_cachedH[qVal] = {};
  }
  var suggestForm = document.getElementById(ss_form_elementH);
  var uri = ss_composeSuggestUriH(qVal, suggestForm);
  if (!uri) {
    return;
  }
  var url = ss_gsa_host ? 'http://' + ss_gsa_host + uri : uri;
  if (ss_panicH) {
    alert('ss_suggestH() AJAX: ' + url);
  }

  var xmlhttp = XH_XmlHttpCreate();
  var handler = function() {
       if (xmlhttp.readyState == XML_READY_STATE_COMPLETED) {
         if (ss_panicH) {
        alert('ss_suggestH() AJAX: ' + xmlhttp.responseText);
      }
      var suggested;
      try {
        suggested = eval('(' + xmlhttp.responseText + ')');
      } catch (e) {
        ss_cachedH[qVal].g = null;

        // Always try to show suggestion box even if there is no results
        // because previous attempt may be skipped due to concurrent ajax
        // processing.
        ss_showH(qVal);
        return;
      }
      if (ss_useH.g) {
        try {
          switch (ss_protocol) {
            case SS_OUTPUT_FORMAT_LEGACY:
            default:
              var suggestions = suggested;
              if (suggestions && suggestions.length > 0) {
                var found = false;
                ss_cachedH[qVal].g = [];
                var max = (ss_g_max_to_display <= 0) ?
                    suggestions.length :
                    Math.min(ss_g_max_to_display, suggestions.length);
                for (var si = 0; si < max; si++) {
                  ss_cachedH[qVal].g[si] = { 'q': suggestions[si] };
                  found = true;
                }
                if (!found) {
                  ss_cachedH[qVal].g = null;
                }
              } else {
                ss_cachedH[qVal].g = null;
              }
              break;
            case SS_OUTPUT_FORMAT_OPEN_SEARCH:
              if (suggested.length > 1) {
                var suggestions = suggested[1];
                if (suggestions && suggestions.length > 0) {
                  var found = false;
                  ss_cachedH[qVal].g = [];
                  var max = (ss_g_max_to_display <= 0) ?
                      suggestions.length :
                      Math.min(ss_g_max_to_display, suggestions.length);
                  for (var si = 0; si < max; si++) {
                    if (suggestions[si] && suggestions[si] != suggested[0]) {
                      ss_cachedH[qVal].g[si] = { 'q': suggestions[si] };
                      found = true;
                    } else if ((suggested.length > 3) && ss_allow_non_query) {
                      var title = (suggested[2].length > si) ?
                          null : suggested[2][si];
                      var url = (suggested[3].length > si) ?
                          null : suggested[3][si];
                      if (url) {
                        title = !title ? ss_non_query_empty_title : title;
                        ss_cachedH[qVal].g[si] = { 't': title, 'u': url };
                        found = true;
                      }
                    }
                  }
                  if (!found) {
                    ss_cachedH[qVal].g = null;
                  }
                } else {
                  ss_cachedH[qVal].g = null;
                }
              } else {
                ss_cachedH[qVal].g = null;
              }
              break;
            case SS_OUTPUT_FORMAT_RICH:
              var suggestions = suggested.results;
              if (suggestions && suggestions.length > 0) {
                var found = false;
                ss_cachedH[qVal].g = [];
                var max = (ss_g_max_to_display <= 0) ?
                    suggestions.length :
                    Math.min(ss_g_max_to_display, suggestions.length);
                for (var si = 0; si < max; si++) {
                  if (suggestions[si].name &&
                      suggestions[si].name != suggested.query) {
                    ss_cachedH[qVal].g[si] = { 'q': suggestions[si].name };
                    found = true;
                  } else if (ss_allow_non_query) {
                    var title = suggestions[si].content;
                    var url = suggestions[si].moreDetailsUrl;
                    if (url) {
                      title = !title ? ss_non_query_empty_title : title;
                      ss_cachedH[qVal].g[si] = { 't': title, 'u': url };
                      found = true;
                    }
                  }
                }
                if (!found) {
                  ss_cachedH[qVal].g = null;
                }
              } else {
                ss_cachedH[qVal].g = null;
              }
              break;
          }
        } catch (e) {
          ss_cachedH[qVal].g = null;
        }
      }
      if (ss_allow_debug && ss_debugH && ss_debugH.getDebugMode()) {
        var stopTimeMs = new Date().getTime();
        ss_debugH.addRequestDebugLine(qVal, 'suggest',
                                     stopTimeMs - startTimeMs, ss_cachedH[qVal]);
      }

      // Always try to show suggestion box even if there is no results
      // because previous attempt may be skipped due to concurrent ajax
      // processing.
      ss_showH(qVal);
    }
  };
  XH_XmlHttpPOST(xmlhttp, url, '', handler);
}

/**
 * Determines if the query has been processed.
 *
 * @param {string} qVal The query that user enters.
 * @return {boolean} True if this query is already in cache.
 */
function ss_processedH(qVal) {
  if (!ss_cachedH[qVal] && ss_useH.g) {
    return false;
  }
  return true;
}

/**
 * Handles key stroke events for turning debug console on and off.
 */
function ss_handleAllKeyH(e) {
  var kid = (window.event) ? window.event.keyCode : e.keyCode;
  switch (kid) {
    case 40:  // "key down".
    case 38:  // "key up".
      // If the next line is activated, key down and up will bring search box
      // into focus which is useful if the user happens to click the mouse
      // outside of the search box and the suggestions, but it may not be
      // desirable if you want to use keyboard to scroll the page also, once the
      // key is trapped here, it won't starts move the selection unless we add
      // suggestion movement code here, which would bring side effect to the
      // search box key stroke trapping.
      break;
    case 9:  // "tab".
      ss_qbackupH = null;
      ss_dismissedH = true;
      ss_clearH(true);
    case 16:  // "shift-tab".
      ss_qbackupH = null;
      ss_dismissedH = true;
      var qry = document.getElementById(ss_form_elementH).q.value;
      if (!ss_processedH(qry)) {
        // Fire new searches for the selected suggestion
        // useful for potential lucky guess.
        if (ss_panicH) {
          alert('run ajax when key off');
        }
        ss_suggestH(qry);
      }
      break;
    case 113:  // "F2".
      if (!ss_allow_debug) {
        break;
      }
      if (ss_debugH && ss_debugH.getDebugMode()) {
        ss_debugH.deactivateConsole();
      } else {
        ss_debugH.activateConsole();
      }
      break;
    default:
      break;
  }
}

/**
 * Handles key stroke events for the search box.
 */
function ss_handleKeyH(e) {
  var kid = (window.event) ? window.event.keyCode : e.keyCode;
  var fo = document.getElementById(ss_form_elementH);
  var qnow = (!ss_qbackupH) ? fo.q.value : ss_qbackupH;
  var sum = 0;
  var tbl = document.getElementById(ss_popup_elementH);

  switch (kid) {
    case 40:  // "key down".
      ss_dismissedH = false;
      if (ss_processedH(qnow)) {
        sum = ss_countSuggestionsH(qnow);
        if (sum > 0) {
          if (tbl.style.visibility == 'hidden') {
            ss_showH(qnow);
            break;
          }
          if (ss_qbackupH) {
            ss_locH++;
          } else {
            ss_qbackupH = qnow;
            ss_locH = 1;
          }
          while (ss_locH >= sum+1)
            ss_locH -= sum;
          var rows = tbl.getElementsByTagName('tr');
          for (var ri = 1; ri <= rows.length - 1; ri++) {
				if (ri == ss_locH) {
				  rows[ri].className = SS_ROW_SELECTED_CLASSH;
				} else {
				  rows[ri].className = SS_ROW_CLASSH;
				}
          }

          // Find out what type of suggestion it is.
          var suggestion = ss_locateSuggestionH(qnow, ss_locH);

          // Adjust the query in the search box.
          if (suggestion.q) {
            fo.q.value = suggestion.q;
          } else {
            fo.q.value = ss_qbackupH;
          }
        }
      } else {
        // May be here if using back button.
        if (ss_panicH) {
          alert('run ajax when key down');
        }
        ss_suggestH(qnow);
      }
      break;
    case 38:  // "key up".
      ss_dismissedH = false;
      if (ss_processedH(qnow)) {
        sum = ss_countSuggestionsH(qnow);
        if (sum > 0) {
          if (tbl.style.visibility == 'hidden') {
            ss_showH(qnow);
            break;
          }
          if (ss_qbackupH) {
            ss_locH--;
          } else {
            ss_qbackupH = qnow;
            ss_locH = -1;
          }
          while (ss_locH < 0)
            ss_locH += sum;
          var rows = tbl.getElementsByTagName('tr');
          for (var ri = 0; ri <= rows.length - 1; ri++) {
            if (ri == ss_locH) {
              rows[ri].className = SS_ROW_SELECTED_CLASSH;
            } else {
              rows[ri].className = SS_ROW_CLASSH;
            }
          }

          // Find out what type of suggestion it is.
          var suggestion = ss_locateSuggestionH(qnow, ss_locH);

          // Adjust the query in the search box.
          if (suggestion.q) {
            fo.q.value = suggestion.q;
          } else {
            fo.q.value = ss_qbackupH;
          }
        }
      } else {
        // May be here if using back button.
        if (ss_panicH) {
          alert('run ajax when key up');
        }
        ss_suggestH(qnow);
      }
      break;
    case 13:  // "enter".
      var url = null;
      if (ss_processedH(qnow) && ss_qbackupH && ss_locH > -1) {
        // Find out what type of suggestion it is.
        var suggestion = ss_locateSuggestionH(ss_qbackupH, ss_locH);
        // Adjust the query in the search box.
        if (suggestion.u) {
          url = suggestion.u;
        }
      }
      ss_qbackupH = null;
      ss_dismissedH = true;
      ss_clearH();
      if (url) {
        window.location.href = url;
      }
      break;
    case 27:  // "escape".
      if (ss_qbackupH) {
        fo.q.value = ss_qbackupH;
        ss_qbackupH = null;
      }
      ss_dismissedH = true;
      ss_clearH();
      break;
    case 37:  // "key left".
    case 39:  // "key right".
    case 9:  // "tab".
    case 16:  // "shift-tab".
      break;
    default:
      ss_dismissedH = false;
      if (fo.q.value == ss_qshownH) {
        // The key stroke has not changed the searched text.
      } else {
        if (ss_key_handling_queueH) {
          // Ignore pending key handling request delayed earlier.
          clearTimeout(ss_key_handling_queueH);
        }
        ss_qbackupH = null;
        ss_locH = -1;
        // Flow through for delayed AJAX calls.
        ss_waitingH++;
        if (ss_allow_debug && ss_debugH && ss_debugH.getDebugMode()) {
          ss_debugH.addWaitDebugLine(fo.q.value, 'queue', ss_wait_millisec);
        }
        ss_key_handling_queueH = setTimeout(
            'ss_handleQueryH("' + ss_escapeH(fo.q.value) + '", ' +
            ss_waitingH + ')', ss_wait_millisec);
      }
      break;
  }
}

/**
 * Triggers fetch for query suggestions or triggers the display depending on
 * whether the query has already been processed earlier or not.
 *
 * @param {string} query The query whose suggestions are needed.
 * @param {number} waiting1 The value to match the lock so as not to handle
 *     queries that are no longer valid.
 */
function ss_handleQueryH(query, waiting1) {
  if (waiting1 != ss_waitingH) return;
  ss_waitingH = 0;
  if (query == '') {
    ss_clearH();
  } else if (!ss_processedH(query)) {
    if (ss_panicH) {
      alert('run ajax when key change');
    }
    ss_suggestH(query);
  } else {
    ss_showH(query);
  }
}

/**
 * Puts search box in focus.
 */
function ss_sfH() {
  document.getElementById(ss_form_elementH).q.focus();
  ss_dismissedH = false;
}

/**
 * Clears search suggestions.
 *
 * @param {boolean} nofocus The flag to indicate whether the search box must not
 *     be in focus, such as when user uses the tab key to move away to the
 *     search button(s).
 */
function ss_clearH(nofocus) {
  ss_qshownH = null;
  var fo = document.getElementById(ss_form_elementH);
  var qnow = (!ss_qbackupH) ? fo.q.value : ss_qbackupH;
  ss_hideH(qnow);
  if (!nofocus) {
    ss_sfH();
  }
}

/**
 * Hides search suggestions.
 *
 * @param {string} qry The query to which suggestions to be closed.
 */
function ss_hideH(qry) {
  var tbl = document.getElementById(ss_popup_elementH);
  if (tbl.style.visibility == 'visible') {
    if (ss_panicH) {
      alert('close suggestion box');
    }
    if (ss_allow_debug && ss_debugH && ss_debugH.getDebugMode()) {
      ss_debugH.addHideDebugLine(qry, 'hide');
    }
    tbl.style.visibility = 'hidden';
  }
}

/**
 * Shows search suggestions.
 *
 * @param {string} qry The query to which suggestions to be presented.
 */
function ss_showH(qry) {
  var currentQry = document.getElementById(ss_form_elementH).q.value;
  if (currentQry != qry) {
    // The query whose suggestions to be shown does not match the current query
    // this happens when the previous query takes much longer to process.
    if (ss_allow_debug && ss_debugH && ss_debugH.getDebugMode()) {
      ss_debugH.addHideDebugLine(qry, 'skip');
    }
    return;
  }

  var startTimeMs = new Date().getTime();
  if (ss_dismissedH) {
    // The suggestion box has been dismissed by mouse close or key
    // escape/enter/tab.
    ss_qshownH = null;
    ss_hideH(qry);
    return;
  }

  if (!ss_processedH(qry)) {
    // Not all ajax calls have been processed, skip instead.
    return;
  }

  if (qry == '') {
    // Empty query should not have much to suggest, close if not already.
    ss_hideH(qry);
    return;
  }

  var g = ss_cachedH[qry] ? ss_cachedH[qry].g : null;
  var disp = false;
  if (ss_useH.g && g) {
    disp = true;
  }
  if (!disp) {
    // Nothing to show for.
    ss_qshownH = null;
    ss_hideH(qry);
    return;
  }
  // Check the lock.
  if (ss_paintingH) {
    if (ss_painting_queueH) {
      // Ignore potential painting request delayed earlier.
      clearTimeout(ss_painting_queueH);
    }
    // Postpone the call for later time.
    if (ss_allow_debug && ss_debugH && ss_debugH.getDebugMode()) {
      ss_debugH.addWaitDebugLine(qry, 'delay', ss_delay_millisec);
    }
    ss_painting_queueH = setTimeout('ss_showH("' + ss_escapeH(qry) + '")',
                                   ss_delay_millisec);
    return;
  } else {
    // Set the lock, which may not be fool-proof when more than another thread
    // checks the lock just before.
    ss_paintingH = true;
  }
  var tbl = document.getElementById(ss_popup_elementH);
  for (var ri = tbl.rows.length - 1; ri > -1; ri--) {
    tbl.deleteRow(ri);
  }
  var cnt = 0;

  if (g && g.length > 0) {
      var row = tbl.insertRow(-1);
      row.className = 'ss-gac-e';

      var clue = '';
      if (g.length == 1) {
        clue = ss_g_one_name_to_display;
      } else {
        clue = ss_g_more_names_to_display;
      }
      var typ = document.createElement('td');
      typ.appendChild(document.createTextNode(clue));
      typ.className = 'ss-gac-c';
      row.appendChild(typ);

      var cls = document.createElement('td');
      cls.className = 'ss-gac-d';

    cls.onclick = function() {
      ss_qbackupH = null;
      ss_clearH();  // This will always turn off ss_dismiss after bring search
                   // box into focus.
      var query = document.getElementById(ss_form_elementH).q.value;
      if (!ss_processedH(query)) {
        // Fire new searches for the selected suggestion
        // useful for potential lucky guess.
        ss_dismissedH = true;
        if (ss_panicH) {
          alert('run ajax when mouse close');
        }
        ss_suggestH(query);
      }
    };

    	var divTxt = document.createElement('div');
        divTxt.className = 'icon-closeSearch';
   		var spanTxt = document.createElement('span');
        divTxt.appendChild(spanTxt);

        cls.appendChild(divTxt);

      row.appendChild(cls);
  }

  for (var z = 0; z < ss_seq.length; z++) {
    switch (ss_seq[z]) {
      case 'g':
        cnt += ss_showSuggestionH(g, cnt, tbl, qry);
        break;
    }
    if (ss_max_to_display > 0 && cnt >= ss_max_to_display) {
      break;
    }
  }
  if (cnt > 0) {

  	var row = tbl.insertRow(-1);
    row.className = 'ss-gac-e';
    var cls = document.createElement('td');
    cls.colSpan = 2;
    row.appendChild(cls);

    tbl.style.visibility = 'visible';
    ss_qshownH = qry;
    if (ss_panicH) {
      alert('open suggestion box for ' + qry);
    }
    if (ss_allow_debug && ss_debugH && ss_debugH.getDebugMode()) {
      var stopTimeMs = new Date().getTime();
      ss_debugH.addShowDebugLine(qry, stopTimeMs - startTimeMs,
                                ss_cachedH[qry], cnt);
    }
  } else {
    ss_hideH(qry);
  }
  // Release the lock.
  ss_paintingH = false;
}

/**
 * Draws suggestion.
 *
 * @param {object} g The suggest server entry.
 * @param {number} cnt The current row index to start drawing.
 * @param {object} tbl The suggestion box element.
 * @param {string} qry The user's query.
 * @return {number} Returns the number of suggestions actually drawn.
 */
function ss_showSuggestionH(g, cnt, tbl, qry) {
  if (ss_max_to_display > 0 && cnt >= ss_max_to_display) {
    return 0;
  }
  if (g && g.length > 0) {
    lqry = qry.toLowerCase().replace(/\"/g, "");
    for (var i = 0; i < g.length; i++) {
      var row = tbl.insertRow(-1);
      row.onclick = ss_handleMouseCH;
      row.onmousemove = ss_handleMouseMH;
      row.className = SS_ROW_CLASSH;
      var alt = document.createElement('td');
      // the suggestion will always start with the query.
      if (g[i].q) {
        var txtNode = '<b>' + g[i].q.substr(0, lqry.length) + '</b>';
        if (g[i].q.length > lqry.length) {
          txtNode += g[i].q.substring(lqry.length);
        }
        alt.innerHTML = txtNode;
      } else {
        alt.innerHTML = '<i>' + g[i].t + '</i>';
      }
      alt.className = 'ss-gac-c';        
      row.appendChild(alt);

      var typ = document.createElement('td');
      typ.className = 'ss-gac-d';
      row.appendChild(typ);
      if (ss_max_to_display > 0 && cnt + i + 1 >= ss_max_to_display) {
        return i + 1;
      }

    }
    return g.length;
  }
  return 0;
}

/**
 * Handles mouse movement. To be attached to the row on mouse-over.
 * @return {boolean} Always returns true after handling the event.
 * @this {Element}
 */
function ss_handleMouseMH() {
  var fo = document.getElementById(ss_form_elementH);
  var tbl = document.getElementById(ss_popup_elementH);
  var rows = tbl.getElementsByTagName('tr');
  for (var ri = 1; ri <= rows.length - 1; ri++) {
    if (rows[ri] == this && rows[ri].className != SS_ROW_SELECTED_CLASSH) {
      // Select the row.
      rows[ri].className = SS_ROW_SELECTED_CLASSH;
      // Back up the original query if not already, and adjust the reference
      // index.
      if (!ss_qbackupH) {
        ss_qbackupH = fo.q.value;
      }
      ss_locH = ri;
      // Find out what type of suggestion it is.
      var suggestion = ss_locateSuggestionH(ss_qbackupH, ss_locH);
      // Adjust the query in the search box.
      if (suggestion.q) {
        fo.q.value = suggestion.q;
      } else {
        fo.q.value = ss_qbackupH;
      }
    } else if (rows[ri] != this) {
      rows[ri].className = SS_ROW_CLASSH;
    }
  }
  // Bring the search box back into focus to allow the next key down and key up.
  ss_sfH();
  return true;
}

/**
 * Handles mouse pressing, while keeping the history in the browser in case back
 * button is used. To be attached to the row on mouse clicking.
 * @this {Element}
 */
function ss_handleMouseCH() {
  var fo = document.getElementById(ss_form_elementH);
  var tbl = document.getElementById(ss_popup_elementH);
  var rows = tbl.getElementsByTagName('tr');
  for (var ri = 1; ri <= rows.length - 1; ri++) {
    if (rows[ri] == this) {
      // Back up the original query if not already, and adjust the reference
      // index.
      if (!ss_qbackupH) {
        ss_qbackupH = fo.q.value;
      }
      ss_locH = ri;
      // Find out what type of suggestion it is.
      var suggestion = ss_locateSuggestionH(ss_qbackupH, ss_locH);
      // Adjust the query in the search box.
      if (suggestion.q) {
        fo.q.value = suggestion.q;
        fo.submit();
      } else {
        fo.q.value = ss_qbackupH;
        if (suggestion.u) {
          window.location.href = suggestion.u;
        }
      }
      break;
    }
  }
}

/**
 * Counts the total number of suggestions for the typed query.
 *
 * @param {string} query The typed query.
 * @return {number} The number of suggestions we have for displaying.
 */
function ss_countSuggestionsH(query) {
  var cnt = 0;
  for (var i = 0; i < ss_seq.length; i++) {
    switch (ss_seq[i]) {
      case 'g':
        cnt += ss_cachedH[query].g ? ss_cachedH[query].g.length : 0;
        break;
    }
    if (ss_max_to_display > 0 && cnt >= ss_max_to_display) {
      return ss_max_to_display;
    }
  }
  return cnt;
}

/**
 * Looks up the suggestion for the typed query.
 *
 * @param {string} query The typed query.
 * @param {number} loc The location index of the current suggestion selection.
 *
 * @return {string} The suggestion term for given query at the given loc.
 */
function ss_locateSuggestionH(query, loc) {
  var cnt1 = 1;
  var cnt2 = 0;
  var type = null;
  for (var z = 0; z <= ss_seq.length; z++) {
    switch (ss_seq[z]) {
      case 'g':
        cnt2 += ss_cachedH[query].g ? ss_cachedH[query].g.length : 0;
        break;
    }
    if (loc >= cnt1 && loc <= cnt2) {
      switch (ss_seq[z]) {
        case 'g':
          var qV = ss_cachedH[query].g[loc - cnt1].q;
          if (qV) {
            return { 'q': qV };
          } else {
            return { 'u': ss_cachedH[query].g[loc - cnt1].u };
          }
      }
      break;
    }
    cnt1 = cnt2;
  }
  return null;
}

/**
 * Escapes query to be used in setTimeout().
 *
 * @param {string} query The query whose suggestions are needed.
 * @return {string} The escaped query.
 */
function ss_escapeH(query) {
  return query.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"');
}

/**
 * Escapes query to be used in debugging display.
 *
 * @param {string} query The query whose suggestions are needed.
 * @return {string} The escaped query.
 */
function ss_escapeDbgH(query) {
  var escapedQuery = '';
  var ch = query.split('');
  for (var i = 0; i < ch.length; i++) {
    switch (ch[i]) {
      case '&':
        escapedQuery += '&amp;';
        break;
      case '<':
        escapedQuery += '&lt;';
        break;
      case '>':
        escapedQuery += '&gt;';
        break;
      default:
        escapedQuery += ch[i];
        break;
    }
  }
  return escapedQuery;
}

/**
 * Debugger class.
 *
 * @constructor
 */
function ss_DebuggerH() {
  this.debugMode = false;
}

/**
 * Id of debug console in the DOM Tree.
 * @type {string}
 */
ss_DebuggerH.DEBUG_CONSOLE_ID = 'ss_debug_console';

/**
 * Id of content node of debug console in the DOM Tree.
 * @type {string}
 */
ss_DebuggerH.DEBUG_CONTENT_ID = 'ss_debug_content';

/**
 * Id of the button that minimizes/maximizes the debug console.
 * @type {string}
 */
ss_DebuggerH.DEBUG_TOGGLE_ID = 'ss_debug_toggle';

/**
 * Getter method for debugMode member variable.
 * @return {boolean} The value of debugMode variable.
 */
ss_DebuggerH.prototype.getDebugMode = function() {
  return this.debugMode;
};

/**
 * Activates debugger console.
 */
ss_DebuggerH.prototype.activateConsole = function() {
  var console = document.getElementById(ss_DebuggerH.DEBUG_CONSOLE_ID);
  if (console) {
    console.style.display = 'block';
  } else {
    var dc = document.createElement('div');
    dc.id = ss_DebuggerH.DEBUG_CONSOLE_ID;
    dc.zIndex = 100;
    dc.className = 'expanded';
    var title = document.createElement('h1');
    title.appendChild(document.createTextNode('GSA Suggest Debug Console'));
    title.style.display = 'inline';
    dc.appendChild(title);
    var actn = document.createElement('div');
    // actn.style.float = 'right'; -- bonnie requested to commented out since it cause the prolem in minifying js
    var btn = document.createElement('button');
    btn.onclick = function(event) {
      var debugContent = document.getElementById(ss_DebuggerH.DEBUG_CONTENT_ID);
      if (debugContent) {
        for (var ri = debugContent.rows.length - 1; ri > 0; ri--) {
          debugContent.deleteRow(ri);
        }
      }
    };
    btn.appendChild(document.createTextNode('Clear console'));
    actn.appendChild(btn);
    btn = document.createElement('button');
    btn.onclick = function(event) {
      ss_cachedH = [];
    };
    btn.appendChild(document.createTextNode('Clear cache'));
    actn.appendChild(btn);
    btn = document.createElement('button');
    btn.id = ss_DebuggerH.DEBUG_TOGGLE_ID;
    btn.onclick = function(event) {
      var debugConsole = document.getElementById(ss_DebuggerH.DEBUG_CONSOLE_ID);
      if (debugConsole) {
        var b = document.getElementById(ss_DebuggerH.DEBUG_TOGGLE_ID);
        if (debugConsole.className.indexOf('expanded') != -1) {
          debugConsole.className = debugConsole.className.replace(
              /expanded/, 'contracted');
          b.innerHTML = 'Maximize';
        } else {
          debugConsole.className = debugConsole.className.replace(
              /contracted/, 'expanded');
          b.innerHTML = 'Minimize';
        }
      }
    };
    btn.appendChild(document.createTextNode('Minimize'));
    actn.appendChild(btn);
    actn.style.display = 'inline';
    dc.appendChild(actn);
    dc.appendChild(document.createElement('br'));
    var pane = document.createElement('table');
    pane.id = ss_DebuggerH.DEBUG_CONTENT_ID;
    var dhr = pane.insertRow(-1);
    var dhc = document.createElement('th');
    dhc.innerHTML = 'Query';
    dhr.appendChild(dhc);
    dhc = document.createElement('th');
    dhc.innerHTML = 'Type';
    dhr.appendChild(dhc);
    dhc = document.createElement('th');
    dhc.innerHTML = 'Time';
    dhr.appendChild(dhc);
    dhc = document.createElement('th');
    dhc.innerHTML = 'g';
    dhr.appendChild(dhc);
    dhc = document.createElement('th');
    dhc.innerHTML = 'Total';
    dhr.appendChild(dhc);
    dc.appendChild(pane);
    document.body.appendChild(dc);
  }
  this.debugMode = true;
};

/**
 * De-activates debugger console.
 */
ss_DebuggerH.prototype.deactivateConsole = function() {
  var console = document.getElementById(ss_DebuggerH.DEBUG_CONSOLE_ID);
  if (console) {
    console.style.display = 'none';
  }
  this.debugMode = false;
};

ss_DebuggerH.prototype.addRequestDebugLine = function(query, type, time, obj) {
  var debugContent = document.getElementById(ss_DebuggerH.DEBUG_CONTENT_ID);
  if (debugContent) {
    var currentRow = debugContent.insertRow(1);
    var currentCell = document.createElement('td');
    currentCell.innerHTML = '&lt;' + ss_escapeDbgH(query) + '&gt;';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.innerHTML = type;
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = time + ' ms';
    currentRow.appendChild(currentCell);
    switch (type) {
      case 'suggest':
        currentCell = document.createElement('td');
        currentCell.className = 'no';
        currentCell.innerHTML = (obj.g ? obj.g.length : 0);
        currentRow.appendChild(currentCell);
        currentCell = document.createElement('td');
        currentRow.appendChild(currentCell);
        break;
      default:
        currentCell = document.createElement('td');
        currentRow.appendChild(currentCell);
        currentCell = document.createElement('td');
        currentRow.appendChild(currentCell);
        break;
    }
  }
};

ss_DebuggerH.prototype.addShowDebugLine = function(query, time, o, total) {
  var debugContent = document.getElementById(ss_DebuggerH.DEBUG_CONTENT_ID);
  if (debugContent) {
    var currentRow = debugContent.insertRow(1);
    var currentCell = document.createElement('td');
    currentCell.innerHTML = '&lt;' + ss_escapeDbgH(query) + '&gt;';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.innerHTML = '<i>show</i>';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = time + ' ms';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = (o ? (o.g ? o.g.length : 0) : 0);
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = total;
    currentRow.appendChild(currentCell);
  }
};

ss_DebuggerH.prototype.addHideDebugLine = function(query, type) {
  var debugContent = document.getElementById(ss_DebuggerH.DEBUG_CONTENT_ID);
  if (debugContent) {
    var currentRow = debugContent.insertRow(1);
    var currentCell = document.createElement('td');
    currentCell.innerHTML = '&lt;' + ss_escapeDbgH(query) + '&gt;';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.innerHTML = '<i>' + type + '</i>';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = '0 ms';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentRow.appendChild(currentCell);
  }
};

ss_DebuggerH.prototype.addWaitDebugLine = function(query, type, time) {
  var debugContent = document.getElementById(ss_DebuggerH.DEBUG_CONTENT_ID);
  if (debugContent) {
    var currentRow = debugContent.insertRow(1);
    var currentCell = document.createElement('td');
    currentCell.innerHTML = '&lt;' + ss_escapeDbgH(query) + '&gt;';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.innerHTML = '<i>' + type + '</i>';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentCell.className = 'no';
    currentCell.innerHTML = time + ' ms';
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentRow.appendChild(currentCell);
    currentCell = document.createElement('td');
    currentRow.appendChild(currentCell);
  }
};

/**
 * Object that stores which all type of suggestions to display.
 * @type {object}
 */
var ss_useH = {};
ss_useH.g = ss_seq.indexOf('g') >= 0 ? true : false;

/**
 * Defined outside this file (by the browser's DOM).
 * @type {object}
 */
document.onkeyup = ss_handleAllKeyH;

// Copyright 2004-2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview A bunch of XML HTTP recipes used to do RPC from within
 * JavaScript from Gagan Saksena's wiki page
 * http://wiki.corp.google.com/twiki/bin/view/Main/JavaScriptRecipes
 */


/**
 * The active x identifier used for ie.
 * @type String
 * @private
 */
var XH_ieProgId_;


// Domain for XMLHttpRequest readyState
var XML_READY_STATE_UNINITIALIZED = 0;
var XML_READY_STATE_LOADING = 1;
var XML_READY_STATE_LOADED = 2;
var XML_READY_STATE_INTERACTIVE = 3;
var XML_READY_STATE_COMPLETED = 4;


/**
 * Initialize the private state used by other functions.
 * @private
 */
function XH_XmlHttpInit_() {
  // The following blog post describes what PROG IDs to use to create the
  // XMLHTTP object in Internet Explorer:
  // http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
  // However we do not (yet) fully trust that this will be OK for old versions
  // of IE on Win9x so we therefore keep the last 2.
  // Versions 4 and 5 have been removed because 3.0 is the preferred "fallback"
  // per the article above.
  // - Version 5 was built for Office applications and is not recommended for
  //   web applications.
  // - Version 4 has been superseded by 6 and is only intended for legacy apps.
  // - Version 3 has a wide install base and is serviced regularly with the OS.

  /**
   * Candidate Active X types.
   * @type Array.<String>
   * @private
   */
  var XH_ACTIVE_X_IDENTS = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0",
                            "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];

  if (typeof XMLHttpRequest == "undefined" &&
      typeof ActiveXObject != "undefined") {
    for (var i = 0; i < XH_ACTIVE_X_IDENTS.length; i++) {
      var candidate = XH_ACTIVE_X_IDENTS[i];

      try {
        new ActiveXObject(candidate);
        XH_ieProgId_ = candidate;
        break;
      } catch (e) {
        // do nothing; try next choice
      }
    }

    // couldn't find any matches
    if (!XH_ieProgId_) {
      throw Error("Could not create ActiveXObject. ActiveX might be disabled," +
                  " or MSXML might not be installed.");
    }
  }
}


XH_XmlHttpInit_();


/**
 * Create and return an xml http request object that can be passed to
 * {@link #XH_XmlHttpGET} or {@link #XH_XmlHttpPOST}.
 */
function XH_XmlHttpCreate() {
  if (XH_ieProgId_) {
    return new ActiveXObject(XH_ieProgId_);
  } else {
    return new XMLHttpRequest();
  }
}


/**
 * Send a get request.
 * @param {XMLHttpRequest} xmlHttp as from {@link XH_XmlHttpCreate}.
 * @param {string} url the service to contact
 * @param {Function} handler function called when the response is received.
 */
function XH_XmlHttpGET(xmlHttp, url, handler) {
  xmlHttp.open("GET", url, true);
  xmlHttp.onreadystatechange = handler;
  XH_XmlHttpSend(xmlHttp, null);
}

/**
 * Send a post request.
 * @param {XMLHttpRequest} xmlHttp as from {@link XH_XmlHttpCreate}.
 * @param {string} url the service to contact
 * @param {string} data the request content.
 * @param {Function} handler function called when the response is received.
 */
function XH_XmlHttpPOST(xmlHttp, url, data, handler) {
  xmlHttp.open("POST", url, true);
  xmlHttp.onreadystatechange = handler;
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  //xmlHttp.setRequestHeader("Content-Length", /** @type {string} */ (data.length));
  XH_XmlHttpSend(xmlHttp, data);
}

/**
 * Opens a XMLHttpRequest object and sets the onreadystatechange handler
 *
 * @deprecated You might as well do this directly in your code.
 *
 * @param {XMLHttpRequest} xmlHttp as from {@link XH_XmlHttpCreate}.
 * @param {string} verb The HTTP verb to use.
 * @param {string} url the service to contact
 * @param {Function} handler function called when the response is received.
 */
function XH_XmlHttpOpen(xmlHttp, verb, url, handler) {
  xmlHttp.open(verb, url, true);
  xmlHttp.onreadystatechange = handler;
}


/**
 * Calls 'setRequestHeader' on the XMLHttpRequest object
 *
 * @deprecated This does not do anything.
 *
 * @param {XMLHttpRequest} xmlHttp as from {@link XH_XmlHttpCreate}.
 * @param {string} name The name of the HTTP header.
 * @param {string} value The value of the HTTP header.
 */
function XH_XmlHttpSetRequestHeader(xmlHttp, name, value) {
  xmlHttp.setRequestHeader(name, value);
}


/**
 * Calls 'send' on the XMLHttpRequest object and calls a function called 'log'
 * if any error occured.
 *
 * @deprecated This dependes on a function called 'log'. You are better of
 * handling your errors on application level.
 *
 * @param {XMLHttpRequest} xmlHttp as from {@link XH_XmlHttpCreate}.
 * @param {string|null} data the request content.
 */
function XH_XmlHttpSend(xmlHttp, data) {
  try {
    xmlHttp.send(data);
  } catch (e) {
    // You may want to log/debug this error one that you should be aware of is
    // e.number == -2146697208, which occurs when the 'Languages...' setting in
    // IE is empty.
    // This is not entirely true. The same error code is used when the user is
    // off line.
    log('XMLHttpSend failed ' + e.toString() + '<br>' + e.stack);
    throw e;
  }
}


/**
 * Calls 'abort' on the XMLHttpRequest object and calls a function called 'log'
 * if any error occured.
 *
 * @deprecated This depends on a function called 'SafeTimeout'. You should call
 *     'abort' directly on your XMLHttpRequest object instead.
 *
 * @param {XMLHttpRequest} xmlHttp as from {@link XH_XmlHttpCreate}.
 */
function XH_XmlHttpAbort(xmlHttp) {
  // IE crashes if you NULL out the onreadystatechange synchronously
  SafeTimeout(window, function() {
    xmlHttp.onreadystatechange = function() {};
  }, 0);
  if (xmlHttp.readyState < XML_READY_STATE_COMPLETED) {
    xmlHttp.abort();
  }
}

