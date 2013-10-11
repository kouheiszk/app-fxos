Namespace("fxos.core.config")
.define(function(ns) {
    'use strict';

    ns.provide({
        oauth: {
            consumerKey     : "e001c6f009d9486d56fe",
            consumerSecret  : "f423d5e8f1db82c99c636a08832c692b7e4e5a58",
            code            : "b03f889a7849b3b73497d45a08f4c248d3984b2c",
            redirectUri     : "http://mixi.jp/",
            requestTokenUrl : "http://api.mixi-platform.com",
            authorizationUrl: "https://mixi.jp/connect_authorize.pl",
            accessTokenUrl  : "https://secure.mixi-platform.com/2/token"
        }
    });
});
