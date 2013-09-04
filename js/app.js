(function(){
    'use strict';

    if(!config) return;

    console.log('config readed');

    var oauth = new OAuth(config.oauth);

    oauth.fetchRequestToken(openAuthoriseWindow, failureHandler);

    function openAuthoriseWindow(url)
    {
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
        }, failureHandler);
    }

    function failureHandler(data)
    {
        console.error(data);
    }
})();
