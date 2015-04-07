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

    vcVideoModule.directive('vcMediaVideoContainer', function ($sce, $timeout, annotationSvc,$rootScope) {
        return {restrict: "E",
            scope: {
                file: '=',
                mediaTime: '='
            },
            replace: true,
            templateUrl: '../app/views/media/videoContainer.html',
            controller: function ($scope, $element, $attrs) {
                $scope.addDisabled = true;
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
                    autoPlay: false,

                };

                //sari
                $scope.updateTimeFlag = true;
                //add Annot
                $scope.addAnnotation = function () {
                // self mark with event, so siblings get unmarked
                    $scope.$broadcast('disableAdd');
                    $rootScope.$broadcast('addAnnotTest', $scope.API.currentTime);
                };

                //mark the annotition by the current time in video
                $scope.currentAnnotationIndex = 0;  //reset when video is finished
               // annotationSvc.setAnnotIndex($scope.currentAnnotationIndex)
                var x = 0;
               
                $scope.onUpdateTime = function ($currentTime, $duration) {
                    x++;
                    if ($scope.updateTimeFlag) {
                      //  $scope.currentAnnotationIndex = annotationSvc.getAnnotIndex();
                       // console.log($scope.currentAnnotationIndex)
                        $scope.annotations = annotationSvc.getListFromSvc();
                        $scope.myAnnotationArr = [];

                        if ($scope.annotations[$scope.currentAnnotationIndex].timestamp <= $scope.API.currentTime) {
                            annotationSvc.listScope.$broadcast('markAnnotation', { id: $scope.annotations[$scope.currentAnnotationIndex].id, opts: true });
                            $scope.currentAnnotationIndex++;
                           // annotationSvc.setAnnotIndex($scope.currentAnnotationIndex)
                        }
                    }
                    if (x == 2) { //get in twice ** need to check
                        $scope.updateTimeFlag = true; //to make update by the progress bar wheb annotation selected
                        x = 0;
                    }
                }
               
                //enable add button in player
                $scope.$on('enableAdd', function () {
                    $scope.addDisabled = false;
                });
                //disable add button in player
                $scope.$on('disableAdd', function () {
                    
                    $scope.addDisabled = true;
                });

                //Seeks to a specified time position
                $scope.$on('videoSeekTime', function (e, annotTime) {
                    $scope.updateTimeFlag = false;
                    $scope.API.seekTime(annotTime / 1000)
                });
                //sari
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
                //$scope.$on('videoSeekTime', function (e, data) {
                //    if ($scope.API && !isNaN(data) && videoReady) {
                //        $scope.API.seekTime(data);
                //    }
                //});
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
