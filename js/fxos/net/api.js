Namespace("fxos.net.api")
.use("fxos.util.string encodeURIComponent")
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

    var post = function(path, data) {
        var encodedData = _.map(data, function(value, key, list) {
            return ns.encodeURIComponent(key) + '=' + ns.encodeURIComponent(value)
        }).join('&');
        console.log(encodedData);
        return ns.apiRequest('POST', path, encodedData);
    };

    ns.provide({
        call: call,
        post: post
    });
});

