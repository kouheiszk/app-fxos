Namespace("fxos.auth.oauth")
.use("brook promise")
.use("fxos.core.config oauth")
.use("fxos.system.storage save,get,remove")
.define(function(ns) {
    'use strict';

    var FXOS_TOKENS_KEY = "storage.key.mixi.oauth.tokens";
    var FXOS_CODE_KEY = "storage.key.mixi.oauth.code";

    var getCodeFromPrompt = function() {
        var code = prompt('Please Enter Code', '');
        console.log(code);
        return code;
    };

    var getAccessTokenFromRefreshTokenPromise = function() {
        return ns.promise(function(next) {
            var requestBody = "grant_type=refresh_token&client_id=" +
                            ns.oauth.consumerKey +
                            "&client_secret=" +
                            ns.oauth.consumerSecret +
                            "&refresh_token=" +
                              ns.oauth.refreshiToken;

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
                        // refresh_tokenを用いたOAuthのエラーなので、全工程リトライ
                        ns.remove(FXOS_TOKENS_KEY);
                        ns.remove(FXOS_CODE_KEY);
                        var code = getCodeFromPrompt();
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

            var authorization_code = ns.get(FXOS_CODE_KEY) !== null ? ns.get(FXOS_CODE_KEY) : getCodeFromPrompt();

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
                        var code = getCodeFromPrompt();
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
     * GET APIリクエストするpromise
     */
    var getApiRequestPromise = function(path) {
        return ns.promise(function(next, tokens) {
            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        next(response);
                    } else {
                        console.log(xhr.status);
                        getAccessTokenFromRefreshTokenPromise().bind(
                            getApiRequestPromise(path),
                            ns.promise(function(innerPromise, response) {
                                next(response);
                            })
                        ).run();
                    }
                }
            };
            xhr.open("GET", path);
            xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", tokens.token_type + " " + tokens.access_token);
            xhr.send();
        });
    };

    /**
     * POST APIリクエストするpromise
     */
    var getPOSTApiRequestPromise = function(path, data) {
        return ns.promise(function(next, tokens) {
            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        next(response);
                    } else {
                        console.log(xhr.status);
                        getAccessTokenFromRefreshTokenPromise().bind(
                            getApiRequestPromise(path),
                            ns.promise(function(innerPromise, response) {
                                next(response);
                            })
                        ).run();
                    }
                }
            };
            xhr.open("POST", path);
            xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", tokens.token_type + " " + tokens.access_token);
            xhr.send(JSON.stringify(data));
        });
    };

    ns.provide({
        getAccessTokenPromise: getAccessTokenPromise,
        getApiRequestPromise: getApiRequestPromise
    });
});
