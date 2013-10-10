Namespace('app')
.use("brook promise")
.use("fxos.net.api call")
.apply(function(ns){
    'use strict';

    var getFriends = function() {
        ns.call("https://api.mixi-platform.com/2/people/@me/@friends")
        .bind(ns.promise(function(next, value) {
            console.log(value.entry[0].displayName);
        })).run();
    };

    getFriends();
});
