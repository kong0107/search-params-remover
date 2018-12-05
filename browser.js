"use strict";

const proxy = (typeof browser === "undefined" ? chrome : browser);
const $ = s => document.querySelector(s);
const area = "local"; // Firefox only supports `storage.local` for an anonymous user.

const getData = keys =>
    (typeof browser === "undefined")
    ? new Promise(resolve => chrome.storage[area].get(keys, resolve))
    : browser.storage[area].get(keys)
;

const setData = keys =>
    (typeof browser === "undefined")
    ? new Promise(resolve => chrome.storage[area].set(keys, resolve))
    : browser.storage[area].set(keys)
;
