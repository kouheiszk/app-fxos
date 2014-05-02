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
    var call = function(url) {
        return ns.apiRequest('GET', url);
    };

    var post = function(url, data) {
        var encodedData = _.map(data, function(value, key, list) {
            return ns.encodeURIComponent(key) + '=' + ns.encodeURIComponent(value)
        }).join('&');
        console.log(encodedData);
        return ns.apiRequest('POST', url, encodedData);
    };

    var postJson = function(url, data) {
        var jsonData = JSON.stringify(data);
        return ns.apiRequest('POST', url, jsonData, 'application/json');
    };

    ns.provide({
        call: call,
        post: post
    });
});

