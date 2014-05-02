Namespace('app')
.use("fxos.net.api call")
.use("fxos.system.storage clear")
.apply(function(ns) {
    'use strict';

    var $index = $("#index");
    var $detail = $("#detail");
    var $listArea = $("#JS_listArea");

    var clearList = function() {
        $listArea.empty();
    };

    var getFriends = function() {
        clearList();
        ns.call("https://api.mixi-platform.com/2/people/@me/@friends")
        .then(function(value) {
            for(var i = 0; i < value.entry.length; i++){
                var data = value.entry[i];
                var $item = $('<li class="friend"></li>');
                var $thumbnail = $('<aside class="pack-end"><img alt="placeholder" src="' + data.thumbnailUrl + '"></aside>');
                var $title = $('<a href="#"><p class="title">' + data.displayName + '</p></a>');
                $item.append($thumbnail);
                $item.append($title);
                $listArea.append($item);
            }
        });
    };

    var getAlbums = function() {
        clearList();
        ns.call("https://api.mixi-platform.com/2/photo/albums/@me/@self/")
        .then(function(value) {
            for(var i = 0; i < value.entry.length; i++){
                var data = value.entry[i];
                var $item = $('<li class="album"></li>').attr({
                    'data-album-id' : data.id
                });
                var $thumbnail = $('<aside class="pack-end"><img alt="placeholder" src="' + data.thumbnailUrl + '"></aside>');
                var $title = $('<a href="#"><p class="title">' + data.title + '</p></a>');
                $item.append($thumbnail);
                $item.append($title);
                $listArea.append($item);

                // add event listener
                $item.on('click', function(e) {
                    var $element = $(this);
                    var albumId = $element.data('album-id');
                    getAlbumPhotos(albumId);
                });
            }
        });
    };

    var getAlbumPhotos = function(albumId) {
        if (!albumId) return;
        clearList();
        ns.call("https://api.mixi-platform.com/2/photo/mediaItems/@me/@self/" + albumId + "/")
        .then(function(value) {
            for(var i = 0; i < value.entry.length; i++){
                var data = value.entry[i];
                console.log(data);
                var $item = $('<li class="album"></li>').attr({
                    'data-album-id' : data.albumId,
                    'data-photo-id' : data.id
                });
                var $thumbnail = $('<aside class="pack-end"><img alt="placeholder" src="' + data.thumbnailUrl + '"></aside>');
                var $title = $('<a href="#"><p class="title">' + data.title + '</p></a>');
                $item.append($thumbnail);
                $item.append($title);
                $listArea.append($item);

                // add event listener
                $item.on('click', function(e) {
                    var $element = $(this);
                    var albumId = $element.data('album-id');
                    var photoId = $element.data('photo-id');
                    getPhotoDetail(albumId, photoId);
                });
            }
        });
    };

    var getPhotoDetail = function(albumId, photoId) {
        if (!albumId || !photoId) return;

        // output log
        console.log(albumId);
        console.log(photoId);

        // comment

    };

    // Friend

    $("#JS_friendList").on('click', function() {
        getFriends();
    });

    // Photo

    $("#JS_albumList").on('click', function() {
        getAlbums();
    });

    $("#JS_logout").on('click', function() {
        clearList();
        ns.clear();
    });
});
