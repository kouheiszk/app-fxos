Namespace("fxos.net.api")
.use("fxos.auth.oauth apiRequest")
.define(function(ns) {
    'use strict';

    /**
     * call api
     *
     * @param path {string} https://api.mixi-platform.com/2/people/@me/@self
     */
    var call = function(path) {
        return ns.apiRequest('GET', path);
    };

    ns.provide({
        call: call
    });
});

