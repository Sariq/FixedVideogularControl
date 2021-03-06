(function () {
    "use strict";
    var annotationsModule = angular.module('vc.annotations');

    annotationsModule.controller('vc.annotationsController', function ($rootScope,$timeout, $scope, $element, annotationSvc, $filter, $anchorScroll, $location) {
        //  $element.data('$$ngAnimateState',{disabled:false,running:true});
        $scope.annotations = [];
        $scope.contributors = [];
        $scope.areAllAdded = true;
        $scope.resizeFlag = false;
        $scope.video_width = -1;
        $scope.container_width = 0;
        $scope.container_height = 0;
        $scope.video_ratio = 1.5626;
        $scope.resizediv_flag = true;

        var videoheight = $('#video-part').height();
        $('#filter_area').css('height', 380 - videoheight + 'px');
        if (window.innerWidth > 1079){            
            $scope.resizediv_flag = true;
        }else{
            $scope.resizediv_flag = false;
        }

        $scope.onStartResize = function(ev){
            $scope.resizeFlag = true;
            $scope.video_width = document.getElementById("video-part").clientWidth;
            $scope.container_width = document.getElementById("annotations-module").clientWidth;
            $scope.container_height = document.getElementById("annotations-module").clientHeight;
        };

        $scope.onResizeWidth = function(ev){
            if ($scope.resizeFlag === true ){
                var w_width = window.innerWidth;
                var offsetX = ev.clientX;
                offsetX = offsetX - document.getElementById("video-part").getBoundingClientRect().left;
                var otherWidth = $scope.container_width - offsetX - 9;
                var offsetH = offsetX / $scope.video_ratio;
                if (offsetX < 100 || offsetX > 1079 || otherWidth < 200 || offsetH > ($scope.container_height - 50) ){
                    return;
                }
                
                document.getElementById("video-part").style.width = offsetX + "px";
                document.getElementById("video-part").style.height = offsetH + "px";
                document.getElementById("annotations_data").style.width = otherWidth + "px";
            }
        };

        $scope.onStopResize = function(ev){
            $scope.resizeFlag = false;
        };

        $scope.filter = {
            filterToggle: function (contribName) {
                if (!$scope.filter.checkFilter(contribName)) {
                    $scope.filter.filteredAuthors.push(contribName);
                } else {
                    $scope.filter.filteredAuthors.splice($scope.filter.filteredAuthors.indexOf(contribName), 1);
                }
            },
            filteredAuthors: [],
            checkFilter: function (contribName) {
                return ($.inArray(contribName, $scope.filter.filteredAuthors) !== -1);
            },
            checkAnnotationUserNotInFilter: function (anotation) {
                if (angular.isObject(anotation) && anotation.fromUser) {
                    return ($.inArray(anotation.fromUser, $scope.filter.filteredAuthors) === -1);
                }
            },
            showAll: function () {
                $scope.filter.filteredAuthors = [];
            },
            hideAll: function () {
                var contsList = [];
                angular.forEach($scope.contributors, function (contributor) {
                    contsList.push(contributor.name);
                });
                $scope.filter.filteredAuthors = angular.copy(contsList);
            }
        };
        $scope.$watchCollection('annotations', function (annotationsArr) {
            var contributors = [];
            angular.forEach(annotationsArr, function (annotation) {
                if ($filter('getByProperty')('name', annotation.fromUser, contributors) === null) {
                    var newContributor = {name: annotation.fromUser, hasNew: false};
                    if (annotation.flag == 1) {
                        newContributor.hasNew = true;
                    }
                    contributors.push(newContributor);
                }
                if (annotation.flag == 1) { // we need to check if previously added contribuor now should be marked as having new annotations
                    var found = $filter('getByProperty')('name', annotation.fromUser, contributors);
                    if (found) {
                        found.hasNew = true;
                    }
                }


            });
            $scope.contributors = contributors;
        });
     
        
        $scope.mediaId = $scope.file.file_id;
        annotationSvc.getList($scope.mediaId).then(function (dataList) {
            //Sari - for Test
            //$scope.annotations = dataList;

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
        { fromUser: "test", "children": [{fromUser: "sari", "children": [], "id": "210", "timestamp": "65000", "comment": "As many as you like. There's no official limit, it's basically a question of how many people you WANT to invite to collaborate. We've tested the annotation tool for up to 20 collaborators and it worked smoothly.", "parent_id": "209", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "Arik", "flag": false }, {fromUser: "sari", "children": [], "id": "247", "timestamp": "65000", "comment": "a fwef waefwae waef we", "parent_id": "209", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "wsefwef", "flag": false }], "id": "209", "timestamp": "65000", "comment": "How many collaborators can you add to a video?", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "David", "flag": false },
        { fromUser: "test", "children": [{fromUser: "sari", "children": [], "id": "274", "timestamp": "70000", "comment": "hi", "parent_id": "242", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "jake", "flag": false }], "id": "242", "timestamp": "70000", "comment": "how are you?", "parent_id": "0", "is_hidden": 0, "votes_up": null, "votes_down": null, "user_id": -2, "from": "wsefwef", "flag": false }
    ]
            //set Annotation in annotationSvc
            annotationSvc.setList($scope.annotations);
            //Sari
        });
       
        $scope.mediaTime = {duration: null, current: null};
        
        
           
        $scope.$on('annotationChanged',function() {
            for (var annotation in $scope.annotations ) {
                if (annotation.id <= 0)
                    $scope.areAllAdded = false;
            }
            $scope.areAllAdded = true;
        });
        //Sari
        // enable add button
        $scope.$on('enableAdd', function () {
            $scope.addDisabled = false;
        });
        //disable add button
        $scope.$on('disableAdd', function () {
            $scope.addDisabled = true;
        });

        //BroadCasted from videoDirective
        $scope.$on('addAnnotation', function (info, currentTime) {
            $scope.addAnnotation(currentTime);
        });
        $scope.addDisabled = false;
        //add annotation
        $scope.addAnnotation = function (currentTime) {
            
            $scope.$broadcast('disableAdd');
            var newAnno = annotationSvc.create({
                timestamp: currentTime,
                fromUser: $scope.$root.userData.name,
                userId: $scope.$root.userData.id,
                mediaId: $scope.mediaId,
                flag: 0
            });
         
            var once = $scope.$on('AnnotationAdded', function (e, newAnnoData) {
         
                once();
                $timeout(function () {  //delay for compile the new element
                    var newAnnoElm = $('.mytest').filter(function () {
                        return this.id === '';
                    });
                    newAnnoElm.parent().animate({
                        scrollTop: newAnnoElm.parent().scrollTop() + (newAnnoElm.position().top - newAnnoElm.parent().position().top)
                    }, 700);
                    //marks the new annotation
                    $scope.$root.$broadcast('markNewAnnotation');

                    $scope.areAllAdded = false;
                    setTimeout(function () {
                        $scope.$root.$broadcast('videoPause');
                    }, 20);
     
                });
            }, 0)
            //Sari
            $scope.annotations.push(newAnno);
        };
        //Sari

        //Resize Cols
        $(function () {
            $('.resize').resizable({
                handles: 's,e',
                minWidth: 150,
                maxWidth: 1200,
                resize: function (event, ui) {
                    
                    var x = ui.element.outerWidth();
                    var y = ui.element.outerHeight();
                    
                    var par = $(this).parent().width();
                    var mypar = $(this).parent().height();
                    var ele = ui.element;
                    var factor = par - x;
                    var myFac = mypar - y;
                    $.each(ele.siblings(), function (idx, item) {
                        //ele.siblings().eq(idx).css('height', myFac  + 'px');
                        ele.siblings().eq(idx).css('width', (factor) + 'px');
                       // ele.siblings().eq(idx).css('heigth', (10) + 'px');
                    });
                    //var videoheight = 100 * $('#video-part').height() / mypar;
                       
                
                    var videoheight = $('#video-part').height();
                    $('#filter_area').css('height', y - videoheight -50 + 'px');
                    if (x >= (par - 100)) {
                        $(".resize").resizable("option", "maxWidth", ui.size.width);
                        return;
                    }

                    $rootScope.$broadcast('cuePointesUpdate');

                }
            });

            $('.sp:not(.resize)').resizable({
                handles: 's',
                start: function (event, ui) {
                    $('iframe').css('pointer-events', 'none');
                },
                stop: function (event, ui) {
                    $('iframe').css('pointer-events', 'auto');
                },
                resize: function (event, ui) {
                    var x = ui.element.outerWidth();
                    var y = ui.element.outerHeight();
                    var par = $(this).parent().width();
                    var ele = ui.element;

                    $.each(ele.siblings(), function (idx, item) {
                        //  ele.siblings().eq(idx).css('height', y + 'px');
                    });
                }
            });

        });

    });
    //Sari
}());
