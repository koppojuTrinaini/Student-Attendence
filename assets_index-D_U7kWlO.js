var q3=Object.defineProperty;var F3=(e,t,n)=>t in e?q3(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var Rm=(e,t,n)=>F3(e,typeof t!="symbol"?t+"":t,n);function K3(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const i in r)if(i!=="default"&&!(i in e)){const a=Object.getOwnPropertyDescriptor(r,i);a&&Object.defineProperty(e,i,a.get?a:{enumerable:!0,get:()=>r[i]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();var a1=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function ta(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var UT={exports:{}},fh={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Y3=Symbol.for("react.transitional.element"),G3=Symbol.for("react.fragment");function $T(e,t,n){var r=null;if(n!==void 0&&(r=""+n),t.key!==void 0&&(r=""+t.key),"key"in t){n={};for(var i in t)i!="key"&&(n[i]=t[i])}else n=t;return t=n.ref,{$$typeof:Y3,type:e,key:r,ref:t!==void 0?t:null,props:n}}fh.Fragment=G3;fh.jsx=$T;fh.jsxs=$T;UT.exports=fh;var S=UT.exports,IT={exports:{}},Z={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
... (file content truncated for brevity)