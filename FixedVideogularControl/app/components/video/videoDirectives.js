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
        return {
            restrict: "E",
            require: ['^vcMediaVideoContainer', '^videogular'],
            link: function ($scope, $element, $atts, $controllers) {
                $controllers[0].setAPI($controllers[1]);
            }
        };
    }
    );

    //Sari
    vcVideoModule.directive("addButton",
        function () {
            return {
                restrict: "E",
                require: "^videogular",
                template: '<div ng-show="!addDisabled" ng-click="addAnnotation()" class="add-annot-btn" >+</div>'
            }
        }
    );


    //Sari

   
    vcVideoModule.directive('vcMediaVideoContainer', function ($sce, $timeout, annotationSvc, $rootScope) {
        return {
            restrict: "E",
            scope: {
                file: '=',
                mediaTime: '='
            },
            replace: true,
            templateUrl: '../app/views/media/videoContainer.html',
            controller: function ($scope, $element, $attrs) {
               $scope.annotations =


    [
        { fromUser: "test", "children": [], "id": "268", "timestamp": "0", "comment": "asf", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "asfasf", "flag": false },
         { fromUser: "test", "children": [{ fromUser: "sari", "children": [], "id": "272", "timestamp": "1000", "comment": "comment Test", "parent_id": "271", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "aaa", "flag": false }], "id": "271", "timestamp": "1000", "comment": "Hello", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "aaa", "flag": false },
         { fromUser: "test", "children": [], "id": "261", "timestamp": "10000", "comment": "take this scene out", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "Bunker", "flag": false },
         { fromUser: "test", "children": [], "id": "243", "timestamp": "15000", "comment": "test etest", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "wsefwef", "flag": false },
         { fromUser: "test", "children": [], "id": "244", "timestamp": "20000", "comment": "teswe", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "wsefwef", "flag": false },
         { fromUser: "test", "children": [], "id": "245", "timestamp": "25000", "comment": "teswe", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "wsefwef", "flag": false },
        { fromUser: "test", "children": [], "id": "246", "timestamp": "35000", "comment": "sample______", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "wsefwef", "flag": false },
        { fromUser: "test", "children": [], "id": "269", "timestamp": "40000", "comment": "hi hi", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "hao", "flag": false },
        { fromUser: "test", "children": [], "id": "197", "timestamp": "45000", "comment": "sdf", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "Test", "flag": false },
        { fromUser: "test", "children": [], "id": "267", "timestamp": "50000", "comment": "The music is a bit loud here", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "joe", "flag": false },
        { fromUser: "test", "children": [], "id": "258", "timestamp": "55000", "comment": "At the point where the annotation pins flash- I would give it some more time before they fade back out.", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "Scott A.", "flag": false },
        { fromUser: "test", "children": [], "id": "201", "timestamp": "60000", "comment": "The collaboration feature is something I'd use for certain customers, but not all of them", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "Alene", "flag": false },
        { fromUser: "test", "children": [{ fromUser: "sari", "children": [], "id": "210", "timestamp": "65000", "comment": "As many as you like. There's no official limit, it's basically a question of how many people you WANT to invite to collaborate. We've tested the annotation tool for up to 20 collaborators and it worked smoothly.", "parent_id": "209", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "Arik", "flag": false }, { fromUser: "sari", "children": [], "id": "247", "timestamp": "65000", "comment": "a fwef waefwae waef we", "parent_id": "209", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "wsefwef", "flag": false }], "id": "209", "timestamp": "65000", "comment": "How many collaborators can you add to a video?", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "David", "flag": false },
        { fromUser: "test", "children": [{ fromUser: "sari", "children": [], "id": "274", "timestamp": "70000", "comment": "hi", "parent_id": "242", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "jake", "flag": false }], "id": "242", "timestamp": "70000", "comment": "how are you?", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "wsefwef", "flag": false }
    ]
               $scope.onUpdate = function (currentTime, timeLapse, params) {
                   annotationSvc.listScope.$broadcast('markAnnotation', { id: params.id, opts: true });
                   console.log(params.id)
               };
                var annotationArray = [];
                for (var i = 0;i < $scope.annotations.length; i++) {
                    var annotation = {}
                  
                    var start = $scope.annotations[i].timestamp / 1000;
                    if (i + 1 < $scope.annotations.length) {
                        var end = ($scope.annotations[i + 1].timestamp / 1000) - 0.1;
                        annotation.params = $scope.annotations[i];
                        annotation.onUpdate = $scope.onUpdate;
                    } else {
                        var end = $scope.annotations[i].timestamp / 1000;
                        annotation.params = $scope.annotations[i];
                        annotation.onComplete = $scope.onUpdate;
                    }
                    annotation.timeLapse = {
                        start: start,
                        end: end
                    };

                    annotationArray.push(annotation);
                   
                }
                console.log(annotationArray)

              
                $scope.addDisabled = true;
                $scope.config = {
                    media: [],
                    responsive: true,
                    stretch: 'fit',
                    poster: { url: '' },
                    theme: {
                        url: "/FixedVideogularControl/tests/css/videogular.css"
                    },
                    autoHide: false,
                    //                    autoHideTime: 200,
                    autoPlay: false,
                    cuePoints: {
                        annotationArray: annotationArray
                            //[{timeLapse: {start: 0,end: 0},onComplete: $scope.myonLeave,}]
                    }

                };

                //sari
          
                $scope.myFun = function () { alert() }
                $scope.updateTimeFlag = true;
                //add Annot
                $scope.addAnnotation = function () {
                    $scope.$broadcast('disableAdd');//disable add button
                    $rootScope.$broadcast('addAnnotation', $scope.API.currentTime);
                };

                //mark the annotition by the current time in video
                $scope.currentAnnotationIndex = 0;  //reset when video is finished
                // annotationSvc.setAnnotIndex($scope.currentAnnotationIndex)
                var x = 0;

                //$scope.onUpdateTime = function ($currentTime, $duration) {
                //    x++;
                //    if ($scope.updateTimeFlag) {
                //        //  $scope.currentAnnotationIndex = annotationSvc.getAnnotIndex();
                //        // console.log($scope.currentAnnotationIndex)
                //        $scope.annotations = annotationSvc.getListFromSvc();
                //        $scope.myAnnotationArr = [];

                //        if ($scope.annotations[$scope.currentAnnotationIndex].timestamp <= $scope.API.currentTime) {
                //            annotationSvc.listScope.$broadcast('markAnnotation', { id: $scope.annotations[$scope.currentAnnotationIndex].id, opts: true });
                //            $scope.currentAnnotationIndex++;
                //            // annotationSvc.setAnnotIndex($scope.currentAnnotationIndex)
                //        }
                //    }
                //    if (x == 2) { //get in twice ** need to check
                //        $scope.updateTimeFlag = true; //to make update by the progress bar wheb annotation selected
                //        x = 0;
                //    }
                //}

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
                    console.log(APIObj + " setting API");

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
                //console.log($element[0].children[1].children[4].children[0].children[0])
                console.log($element[0].children[1].children[4])
                console.log($element)
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
                        if ($scope.API) {
                            $scope.API.pause();
                        }
                        $scope.$broadcast('showPoster');
                    }, 70);
                });


                if ($scope.file && $scope.file.dl_link) {
                    var sourceMedia = { src: $sce.trustAsResourceUrl($scope.decodeEntities($scope.file.dl_link)), type: 'video/mp4' };
                    $scope.config.media.push(sourceMedia);

                    $scope.config.poster.url = $sce.trustAsResourceUrl($scope.file.thumbnail);
                }
            }
        };
    });
}());
//(function () {
//    'use strict';
//    angular.module('uk.ac.soton.ecs.videogular.plugins.cuepoints', [])
//        .directive(
//            'vgCuepoints',
//            [function () {
//                return {
//                    restrict: 'E',
//                    require: '^videogular',
//                    templateUrl: 'bower_components/videogular-cuepoints/cuepoints.html',
//                    scope: {
//                        cuepoints: '=vgCuepointsConfig',
//                        theme: '=vgCuepointsTheme',
//                    },
//                    link: function ($scope, elem, attr, API) {
//                        // shamelessly stolen from part of videogular's updateTheme function
//                        function updateTheme(value) {
//                            if (value) {
//                                var headElem = angular.element(document).find("head");
//                                headElem.append("<link rel='stylesheet' href='" + value + "'>");
//                            }
//                        }

//                        $scope.calcLeft = function (cuepoint) {
//                            if (API.totalTime === 0) return '-1000';

//                            var videoLength = API.totalTime.getTime() / 1000;
//                            return (cuepoint.time * 100 / videoLength).toString();
//                        };

//                        updateTheme($scope.theme);
//                    },
//                };
//            }]);
//})();