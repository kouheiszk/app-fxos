Namespace("fxos.auth.oauth")
.use("brook promise")
.use("fxos.core.config oauth")
.use("fxos.system.storage save,get,remove,clear")
.define(function(ns) {
    'use strict';

    var FXOS_TOKENS_KEY = "storage.key.mixi.oauth.tokens";
    var FXOS_CODE_KEY = "storage.key.mixi.oauth.code";

    /**
     * アクセストークンを含むオブジェクトを返すpromise
     */
    var getAccessTokenPromise = function() {
        return ns.promise(function(next) {

            // tokenを呼び出し、存在する場合はそれを返す
            var savedTokensText = ns.get(FXOS_TOKENS_KEY);
            if (savedTokensText && savedTokensText !== "") {
                var savedTokens = JSON.parse(savedTokensText);
                if(savedTokens.access_token) {
                    console.log(savedTokensText);
                    next(savedTokens);
                    return;
                }
            }

            var authorization_code = ns.get(FXOS_CODE_KEY) !== null ? ns.get(FXOS_CODE_KEY) : ns.oauth.code;

            // トークンがない場合は、アクセスする
            var requestBody = "grant_type=authorization_code&client_id=" +
                            ns.oauth.consumerKey +
                            "&client_secret=" +
                            ns.oauth.consumerSecret +
                            "&code=" +
                            authorization_code +
                            "&redirect_uri=" +
                            encodeURIComponent(ns.oauth.redirectUri);

            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        // tokenを保存する　
                        ns.save(FXOS_TOKENS_KEY, xhr.responseText);
                        var tokens = JSON.parse(xhr.responseText);
                        next(tokens);
                    } else {
                        console.log(xhr.status);
                        // エラーなので、コード取得をリトライする
                        var code = prompt('Please Enter Code', '');
                        ns.save(FXOS_CODE_KEY, code);
                        getAccessTokenPromise().bind(ns.promise(function(innerPromise, tokens) {
                            next(tokens);
                        })).run();
                    }
                }
            };
            xhr.open("POST", ns.oauth.accessTokenUrl);
            xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
            xhr.send(requestBody);
        });
    };

    /**
     * APIリクエストするpromise
     */
    var getApiRequestPromise = function(path) {
        return ns.promise(function(next, value) {
            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        next(response);
                    } else {
                        console.log(xhr.status);
                        ns.clear();
                    }
                }
            };
            xhr.open("GET", path);
            xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", value.token_type + " " + value.access_token);
            xhr.send();
        });
    };

    ns.provide({
        getAccessTokenPromise: getAccessTokenPromise,
        getApiRequestPromise: getApiRequestPromise
    });
});
