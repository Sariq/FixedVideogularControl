(function () {
    "use strict";
    var vcVideoModule = angular.module('vc.video', [
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.poster",
        "com.2fdevs.videogular.plugins.buffering",
         "com.2fdevs.videogular.plugins.overlayplay",
       
        "info.vietnamcode.nampnq.videogular.plugins.flash"
    ]);

 
    vcVideoModule.directive('apiConnector', function () {
            return {restrict: "E",
                require: ['^vcMediaVideoContainer', '^videogular'],
                link: function ($scope, $element, $atts, $controllers) {
                    $controllers[0].setAPI($controllers[1]);
                }
            };
        }
    );

    vcVideoModule.directive('vcMediaVideoContainer', function ($sce, $timeout, annotationSvc) {
        return {restrict: "E",
            scope: {
                file: '=',
                mediaTime: '='
            },
            replace: true,
            templateUrl: '../app/views/media/videoContainer.html',
            controller: function ($scope, $element, $attrs) {
                $scope.config = {
                    media: [],
                    responsive: true,
                    stretch: 'fit',
                    poster: {url: ''},
                      theme: {
                    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                },
                    autoHide: false,
//                    autoHideTime: 200,
                    autoPlay: false
                };
                //add Annot Sari
                $scope.addAnnotation = function () {
                    $scope.annotations=annotationSvc.getListFromSvc();
                    $scope.$broadcast('disableAdd');
              
                    var newAnno = annotationSvc.create({
                        timestamp: $scope.API.currentTime,
                        fromUser: $scope.$root.userData.name,
                        userId: $scope.$root.userData.id,
                        mediaId: $scope.mediaId,
                        flag: 0
                    });
                    var once = $scope.$on('AnnotationAdded', function (e, newAnnoData) {
                        if (newAnnoData[0].annotation == newAnno) {//scope
                            once();
                            var newAnnoElm = newAnnoData[1]; //$element
                            $('#annotations_list').animate({ 'scr}ollTop': (newAnnoElm.position().top + (newAnnoElm.height())) }, 700);
                        }
                    });
                    $scope.annotations.push(newAnno);
                    $scope.areAllAdded = false;
                    setTimeout(function () {
                        $scope.$root.$broadcast('videoPause');
                    }, 20);
                };
                $scope.onPlayerReady = function (API) {
                    $scope.playerAPI = API;
                    console.log(API)
                };
                $scope.playerPlay = function () {
                    $scope.playerAPI.play();
                   
                };
                //add Annot Sari
                $scope.doSthonPlay = function () {
  
                 console.log("clicked");
                 $scope.API.play();
                };
                $scope.doSthonPause = function () {

                    console.log("clicked");
                    $scope.API.pause();
                };
                
                this.setAPI = function (APIObj) {
                    console.log(APIObj+" setting API");
                    
                    $scope.API = APIObj;
                };
                $scope.decodeEntities = function (text) {
                    var entities = [
                        ['amp', '&']
                    ];
                    for (var i = 0, max = entities.length; i < max; ++i)
                        text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

                    return text;
                };
            },
            link: function ($scope, $element, $attrs) {

                if (typeof $scope.mediaTime == 'undefined') {
                    $scope.mediaTime = {};
                }
             
                $scope.$on('onVgUpdateTime', function (e, data) {
                    $scope.mediaTime.current = data[0];
                    $scope.mediaTime.total = data[1];
                });
                var videoReady = false;
                $scope.$on('onVgPlayerReady', function () {
                    videoReady = true;
                });
                $scope.$on('videoSeekTime', function (e, data) {
                    if ($scope.API && !isNaN(data) && videoReady) {
                        $scope.API.seekTime(data);
                    }
                });
                $scope.$on('videoPause', function () {
                    if ($scope.API) {
                        $scope.API.pause();
                    }
                });
              
                $scope.$on('videoPlay', function () {
                    if ($scope.API) {
                        $scope.API.play();
                    }
                });
                $scope.$on('onVgPlayerReady', function () {
                    $timeout(function () {
                        if ($scope.API){
                            $scope.API.pause();}
                        $scope.$broadcast('showPoster');
                    }, 70);
                });
                
               
                if ($scope.file && $scope.file.dl_link) {
                    var sourceMedia = {src: $sce.trustAsResourceUrl($scope.decodeEntities($scope.file.dl_link)), type: 'video/mp4'};
                    $scope.config.media.push(sourceMedia);
                   
                    $scope.config.poster.url = $sce.trustAsResourceUrl($scope.file.thumbnail);
                }
            }
        };
    });
}());
