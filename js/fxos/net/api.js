Namespace("fxos.net.api")
.use("brook promise")
.use("fxos.auth.oauth getAccessTokenPromise,getApiRequestPromise")
.define(function(ns) {
    'use strict';

    /**
     * call api
     *
     * @param path {string} https://api.mixi-platform.com/2/people/@me/@self
     */
    var call = function(path) {
        return ns.getAccessTokenPromise()
            .bind(ns.getApiRequestPromise(path));
    };

    ns.provide({
        call: call
    });
});

