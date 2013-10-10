Namespace("fxos.auth.oauth")
.use("brook promise")
.use("fxos.core.config oauth")
.define(function(ns) {
    'use strict';

    /**
     * アクセストークンを含むオブジェクトを返すpromise
     */
    var getAccessTokenPromise = function() {
        return ns.promise(function(next) {

            var savedTokens = false;
            if(savedTokens) {
                next(savedTokens);
                return;
            }

            // トークンがない場合は、アクセスする
            var requestBody = "grant_type=authorization_code&client_id=" +
                            ns.oauth.consumerKey +
                            "&client_secret=" +
                            ns.oauth.consumerSecret +
                            "&code=" +
                            ns.oauth.code +
                            "&redirect_uri=" +
                            encodeURIComponent(ns.oauth.redirectUri);

            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        next(response);
                    } else {
                        console.log(xhr.status);
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
