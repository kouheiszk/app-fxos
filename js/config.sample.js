var Config = (function(){
    'use strict';

    return {
        oauth: {
            consumerKey: "hoge",
            consumerSecret: "fuga",
            requestTokenUrl: "https://secure.mixi-platform.com/2/token",
            authorizationUrl: "https://mixi.jp/connect_authorize.pl",
            accessTokenUrl: "https://secure.mixi-platform.com/2/token"
        }
    };
});
