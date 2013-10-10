Namespace("fxos.core.config")
.define(function(ns) {
    'use strict';

    ns.provide({
        oauth: {
            consumerKey     : "e001c6f009d9486d56fe",
            consumerSecret  : "f423d5e8f1db82c99c636a08832c692b7e4e5a58",
            code            : "c66a384ff55e0bf7c8bd5ee00755ed9c07e1d9ad",
            redirectUri     : "http://mixi.jp/",
            requestTokenUrl : "http://api.mixi-platform.com",
            authorizationUrl: "https://mixi.jp/connect_authorize.pl",
            accessTokenUrl  : "https://secure.mixi-platform.com/2/token"
        }
    });
});
