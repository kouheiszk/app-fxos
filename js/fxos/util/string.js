Namespace("fxos.util.string")
.define(function(ns) {
    'use strict';

    var fixedEncodeURIComponent = function(value) {
        return encodeURIComponent(value).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
    };

    ns.provide({
        encodeURIComponent : fixedEncodeURIComponent
    });
});

