webpackJsonp([53],{

/***/ 410:
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define(t):(e.ReactIntlLocaleData=e.ReactIntlLocaleData||{},e.ReactIntlLocaleData.sh=t())}(this,function(){"use strict";var e=[{locale:"sh",pluralRuleFunction:function(e,t){var a=String(e).split("."),r=a[0],i=a[1]||"",o=!a[1],l=r.slice(-1),n=r.slice(-2),s=i.slice(-1),u=i.slice(-2);return t?"other":o&&1==l&&11!=n||1==s&&11!=u?"one":o&&l>=2&&l<=4&&(n<12||n>14)||s>=2&&s<=4&&(u<12||u>14)?"few":"other"},fields:{year:{displayName:"Year",relative:{0:"this year",1:"next year","-1":"last year"},relativeTime:{future:{other:"+{0} y"},past:{other:"-{0} y"}}},month:{displayName:"Month",relative:{0:"this month",1:"next month","-1":"last month"},relativeTime:{future:{other:"+{0} m"},past:{other:"-{0} m"}}},day:{displayName:"Day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{other:"+{0} d"},past:{other:"-{0} d"}}},hour:{displayName:"Hour",relativeTime:{future:{other:"+{0} h"},past:{other:"-{0} h"}}},minute:{displayName:"Minute",relativeTime:{future:{other:"+{0} min"},past:{other:"-{0} min"}}},second:{displayName:"Second",relative:{0:"now"},relativeTime:{future:{other:"+{0} s"},past:{other:"-{0} s"}}}}}];return e});


/***/ })

});
//# sourceMappingURL=53.js.map