Namespace("fxos.core.config")
.define(function(ns) {
    'use strict';

    ns.provide({
        oauth: {
            consumerKey     : "CONSUMER KEY",
            consumerSecret  : "CONSUMER SECRET",
            code            : "CODE",
            redirectUri     : "REDIRECT URI",
            requestTokenUrl : "http://api.mixi-platform.com",
            authorizationUrl: "https://mixi.jp/connect_authorize.pl",
            accessTokenUrl  : "https://secure.mixi-platform.com/2/token"
        }
    });
});
