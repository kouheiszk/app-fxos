Namespace('app')
.use("brook promise")
.use("fxos.net.api call")
.apply(function(ns){
    'use strict';

    var getFriends = function() {
        ns.call("https://api.mixi-platform.com/2/people/@me/@friends")
        .bind(ns.promise(function(next, value) {
          var $friendsArea = $($(".myFriends")[0]);
          for(var i = 0; i < value.entry.length; i++){
            var friendData = value.entry[i];
            console.log(friendData.displayName);
            var $friend = $("<li class='friend'></li>");
            var $friendImage = $("<aside class='pack-end'><img src='" + friendData.thumbnailUrl + "' /></aside>");
            var $friendName = $("<p class='friendName'>" + friendData.displayName + "</p>");
            $friend.append($friendImage);
            $friend.append($friendName);
            $friendsArea.append($friend);
          }
        })).run();
    };

    getFriends();
});
