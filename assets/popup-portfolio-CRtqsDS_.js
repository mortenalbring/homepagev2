import{r as y}from"./vendor-react-B3XCSsYE.js";var u={exports:{}},t={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _;function j(){if(_)return t;_=1;var a=y(),m=Symbol.for("react.element"),d=Symbol.for("react.fragment"),x=Object.prototype.hasOwnProperty,R=a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,v={key:!0,ref:!0,__self:!0,__source:!0};function f(o,e,p){var r,n={},i=null,l=null;p!==void 0&&(i=""+p),e.key!==void 0&&(i=""+e.key),e.ref!==void 0&&(l=e.ref);for(r in e)x.call(e,r)&&!v.hasOwnProperty(r)&&(n[r]=e[r]);if(o&&o.defaultProps)for(r in e=o.defaultProps,e)n[r]===void 0&&(n[r]=e[r]);return{$$typeof:m,type:o,key:i,ref:l,props:n,_owner:R.current}}return t.Fragment=d,t.jsx=f,t.jsxs=f,t}var c;function O(){return c||(c=1,u.exports=j()),u.exports}var s=O();function P(){return s.jsxs("div",{className:"popup-content-inner",children:[s.jsx("h3",{children:"Portfolio"}),s.jsx("p",{children:"Portfolio window"})]})}const b=Object.freeze(Object.defineProperty({__proto__:null,PortfolioContent:P},Symbol.toStringTag,{value:"Module"}));export{b as P,s as j};
