(function(){
    /* global Config:false, OAuth:false */
    'use strict';

    var config = new Config();

    var authorize = function(state) {
        var paramState = state || "";

        // requestTokenUrl
        var action = config.oauth.authorizationUrl;

        // parameters
        var parameters = [
            ["client_id", config.oauth.consumerKey],
            ["response_type", "code"],
            ["scope", "r_profile"],
            ["state", paramState]
        ];

        var message = {
            method     : "GET",
            action     : action,
            parameters : parameters
        };

        // パラメータを含む URL の取得
        var url = OAuth.addToURL(message.action, message.parameters);
        location.href = url; // doesn't work

        // TODO
        // open authorize on iframe
        // watch iframe load event and get code param when change url to http://some.url/?code=****
    };

    authorize();
})();
