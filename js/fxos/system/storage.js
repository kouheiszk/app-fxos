Namespace("fxos.system.storage")
.define(function(ns) {
    'use strict';

    var save = function(key, value) {
        localStorage.setItem(key, value);
    };

    var get = function(key) {
        return localStorage.getItem(key);
    };

    var remove = function(key) {
        localStorage.removeItem(key);
    };

    var clear = function() {
        localStorage.clear();
    };

    ns.provide({
        save   : save,
        get    : get,
        remove : remove,
        clear  : clear
    });
});
