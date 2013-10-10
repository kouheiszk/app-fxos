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
                          //config.oauth.redirectUri;
                          encodeURIComponent(config.oauth.redirectUri);

        // console.log(requestBody);

        var xhr = new XMLHttpRequest({mozSystem: true});
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) { // DONE
                if (xhr.status === 200) { // OK
                    alert(xhr.responseText);
                } else {
                    alert("status = " + xhr.status);
                }
            }
        };
        xhr.open("POST", config.oauth.accessTokenUrl);
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
        xhr.send(requestBody);
    };

    getAccessToken();
})();
