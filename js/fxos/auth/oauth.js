Namespace("fxos.auth.oauth")
.use("fxos.core.config oauth")
.use("fxos.system.storage save,get,remove")
.define(function(ns) {
    'use strict';

    var FXOS_TOKENS_KEY = "storage.key.mixi.oauth.tokens";
    var FXOS_CODE_KEY = "storage.key.mixi.oauth.code";

    var wrapPromise = function(value) {
        var dfd = $.Deferred();
        dfd.resolve(value);
        return dfd.promise();
    };

    var wrapErrorPromise = function(value) {
        var dfd = $.Deferred();
        dfd.fail(value);
        return dfd.promise();
    };

    var getAuthorizationCodeFromPrompt = function() {
        var code = prompt('Please Enter Code', '');
        console.log(code);
        return code;
    };

    var accessTokenFromRefreshTokenPromise = function() {
        var requestBody = "grant_type=refresh_token" +
                          "&client_id=" + ns.oauth.consumerKey +
                          "&client_secret=" + ns.oauth.consumerSecret +
                          "&refresh_token=" + ns.oauth.refreshiToken;

        var dfd = $.Deferred();
        var xhr = new XMLHttpRequest({ mozSystem : true });
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    // tokenを保存する
                    ns.save(FXOS_TOKENS_KEY, xhr.responseText);
                    var tokens = JSON.parse(xhr.responseText);
                    dfd.resolve(tokens);
                } else {
                    console.log(xhr);
                    // refresh_tokenを用いたOAuthのエラーなので、全工程リトライ
                    ns.remove(FXOS_TOKENS_KEY);
                    ns.remove(FXOS_CODE_KEY);
                    var code = getAuthorizationCodeFromPrompt();
                    ns.save(FXOS_CODE_KEY, code);
                    accessTokenPromise().then(function(tokens) {
                        dfd.resolve(tokens);
                    });
                }
            }
        };
        xhr.open("POST", ns.oauth.accessTokenUrl);
        xhr.setRequestHeader('Content-Type' , 'application/x-www-form-urlencoded');
        xhr.send(requestBody);

        return dfd.promise();
    };

    /**
     * アクセストークンを含むオブジェクトを返すpromise
     */
    var accessTokenPromise = function() {
        // tokenを呼び出し、存在する場合はそれを返す
        var savedTokensText = ns.get(FXOS_TOKENS_KEY);
        if (savedTokensText && savedTokensText !== "") {
            var savedTokens = JSON.parse(savedTokensText);
            if(savedTokens.access_token) {
                console.log(savedTokensText);
                return wrapPromise(savedTokens);
            }
        }

        var authorization_code = ns.get(FXOS_CODE_KEY) !== null ? ns.get(FXOS_CODE_KEY) : getAuthorizationCodeFromPrompt();

        // トークンがない場合は、アクセスする
        var requestBody = "grant_type=authorization_code" +
                          "&client_id=" + ns.oauth.consumerKey +
                          "&client_secret=" + ns.oauth.consumerSecret +
                          "&code=" + authorization_code +
                          "&redirect_uri=" + encodeURIComponent(ns.oauth.redirectUri);

        var dfd = $.Deferred();

        var xhr = new XMLHttpRequest({mozSystem: true});
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    // tokenを保存する
                    ns.save(FXOS_TOKENS_KEY, xhr.responseText);
                    var tokens = JSON.parse(xhr.responseText);
                    dfd.resolve(tokens);
                } else {
                    console.log(xhr);
                    // エラーなので、コード取得をリトライする
                    var code = getAuthorizationCodeFromPrompt();
                    ns.save(FXOS_CODE_KEY, code);
                    accessTokenPromise().then(function(tokens) {
                        dfd.resolve(tokens);
                    });
                }
            }
        };
        xhr.open("POST", ns.oauth.accessTokenUrl);
        xhr.setRequestHeader('Content-Type' , 'application/x-www-form-urlencoded');
        xhr.send(requestBody);

        return dfd.promise();
    };

    /**
     * APIリクエストするpromise
     */
    var apiRequest = function(method, url, data, contentType) {
        if (method === '' || url === '') return wrapErrorPromise('undefined method or url.');
        if (data !== '') console.log(data);
        contentType = contentType || 'application/x-www-form-urlencoded';

        return accessTokenPromise().then(function(tokens) {
            var dfd = $.Deferred();
            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        dfd.resolve(response);
                    } else {
                        if (xhr.status == '401') {
                            // Authorization Required
                            accessTokenFromRefreshTokenPromise().then(function(tokens) {
                                return apiRequest(method, url);
                            }).then(function(response) {
                                dfd.resolve(response);
                            });
                        } else {
                            console.log(xhr);
                        }
                    }
                }
            };
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', contentType);
            xhr.setRequestHeader('Authorization', tokens.token_type + ' ' + tokens.access_token);
            xhr.send(data);

            return dfd.promise();
        });
    };

    ns.provide({
        apiRequest: apiRequest
    });
});
