Namespace("fxos.core.config")
.define(function(ns) {
    'use strict';

    ns.provide({
        oauth: {
            consumerKey     : "e001c6f009d9486d56fe",
            consumerSecret  : "f423d5e8f1db82c99c636a08832c692b7e4e5a58",
            redirectUri     : "http://mixi.jp/",
            requestTokenUrl : "http://api.mixi-platform.com",
            authorizationUrl: "https://mixi.jp/connect_authorize.pl",
            accessTokenUrl  : "https://secure.mixi-platform.com/2/token"
        }
    });
});
