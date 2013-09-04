(function(){
    /* global Config:false, OAuth:false */
    'use strict';

    var config = new Config();
    var oauth = new OAuth(config.oauth);

    oauth.fetchRequestToken(openAuthoriseWindow, failureHandler);

    function openAuthoriseWindow(url)
    {
        alert('success');

        var wnd = window.open(url, 'authorise');
        setTimeout(waitForPin, 100);

        function waitForPin()
        {
            if (wnd.closed)
            {
                var pin = prompt("Please enter your PIN", "");
                oauth.setVerifier(pin);
                oauth.fetchAccessToken(getSomeData, failureHandler);
            }
            else
            {
                setTimeout(waitForPin, 100);
            }
        }
    }

    function getSomeData()
    {
        oauth.get("https://api.twitter.com/1.1/statuses/home_timeline.json", function (data) {
            alert(data);
        }, failureHandler);
    }

    function failureHandler(data)
    {
        alert('failed');

        console.error(data);
    }
})();
