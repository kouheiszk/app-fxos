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
            var $friend = $("<div class='friend'></div>");
            var $friendImage = $("<img src='" + friendData.thumbnailUrl + "' />");
            var $friendName = $("<div class='friendName'>" + friendData.displayName + "</div>");
            $friend.append($friendImage);
            $friend.append($friendName);
            $friendsArea.append($friend);
          }
        })).run();
    };

    getFriends();
});
