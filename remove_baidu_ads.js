// ==UserScript==
// @name         Remove Baidu Ads
// @namespace    https://github.com/roshanca
// @version      0.1.0
// @description  Remove Baidu Ads
// @author       wwj1983 <wwj1983@gmail.com>
// @homepageURL  https://github.com/roshanca/remove-baidu-ads
// @supportURL   https://github.com/roshanca/remove-baidu-ads/issues
// @updateURL    https://raw.githubusercontent.com/roshanca/remove-baidu-ads/master/remove_baidu_ads.js
// @license      MIT
// @match        http://www.baidu.com/s*
// @match        https://www.baidu.com/s*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function clearBaiduAds() {

        // 移除搜索结果头部与尾部的推广
        var contentLeft = document.querySelector('#content_left');
        var ads = contentLeft.querySelectorAll('[style="display:block !important;visibility:visible !important"]');

        for (let dom of ads) {
            if (dom) {
                dom.parentNode.removeChild(dom);
            }
        }

        // 移除网页右边的推广
        var sideContainer = document.querySelector('#ec_im_container');
        if (sideContainer) {
            var adWrap = sideContainer.parentNode;
            adWrap.parentNode.removeChild(adWrap);
        }
    }

    clearBaiduAds();

    // 表单提交
    var searchForm = document.forms.f;
    searchForm.addEventListener('submit', () => {
        console.log('search');
        setTimeout(clearBaiduAds, 1000);
    });

    var timeId;
    var kw = document.querySelector('#kw');
    kw.addEventListener('keyup', () => {
        if (timeId) clearTimeout(timeId);
        timeId = setTimeout(clearBaiduAds, 1000);
    });

    var $$ = function (selector) {
        return new W(selector);
    };

    function W(selector) {
        if (typeof selector === 'string') {
            this.elem = document.querySelectorAll(selector);
        } else if (selector.nodeType) { // Node/element
            this.elem = [selector];
        } else { // Nodes/elements
            var arr = [], i;
            for (i = 0; i < selector.length; i++) {
                arr.push(selector[i]);
            }
            this.elem = arr;
        }

        return this;
    }

    W.prototype.delegate = function (eventName, targetSelector, listener, capture) {
        for (let elem of this.elem) {
            elem.addEventListener(eventName, function (e) {
                var target = e.target;
                if ($$(target).is(targetSelector)) {
                    listener.call(target, e);
                } else {
                    var parent = target.parentNode;
                    while (parent) {
                        if ($$(parent).is(targetSelector)) {
                            listener.call(parent, e);
                        }
                        parent = parent.parentNode;
                    }
                }
            }, capture);
        }
    };

    W.prototype.is = function(selector) {
        var ret;
        for (let target of this.elem) {
            for (let source of $$(selector).elem) {
                if (target.compareDocumentPosition(source) === 0) {
                    ret = true;
                    break;
                } else {
                    ret = false;
                }
            }
        }
        return ret;
    };

    $$(searchForm).delegate('click', '.bdsug li', () => {
        console.log('list search');
        setTimeout(clearBaiduAds, 1000);
    }, true);

})();
