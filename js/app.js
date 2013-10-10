(function(){
    /* global Config:false */
    'use strict';

    var config = new Config();

    var getAccessToken = function() {
        var requestBody = "grant_type=authorization_code&client_id=" +
                          config.oauth.consumerKey +
                          "&client_secret=" +
                          config.oauth.consumerSecret +
                          "&code=" +
                          config.oauth.code +
                          "&redirect_uri=" +
                          config.oauth.redirectUri;
                          //encodeURIComponent(config.oauth.redirectUri);

        console.log(requestBody);

        $.ajax({
            type        : "POST",
            data        : requestBody,
            dataType    : "json",
            url         : config.oauth.accessTokenUrl,
            headers     : {
                "Content-type" : "application/x-www-form-urlencoded;charset=utf-8"
            },
            success     : function(result, status) {
                console.log(status);
                console.log(result);
            },
            error       : function(xhr, status, error) {
                console.log(xhr);
                console.log(status);
                console.log(error);
            }
        });
    };

    getAccessToken();
})();
