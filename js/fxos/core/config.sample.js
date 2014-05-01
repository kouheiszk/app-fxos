Namespace("fxos.core.config")
.define(function(ns) {
    'use strict';

    /**
    * Get code from this URL
    * https://mixi.jp/connect_authorize.pl?client_id=e001c6f009d9486d56fe&scope=r_profile
    */
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
