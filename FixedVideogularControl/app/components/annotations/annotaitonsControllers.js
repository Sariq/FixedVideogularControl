(function () {
    "use strict";
    var annotationsModule = angular.module('vc.annotations');

    annotationsModule.controller('vc.annotationsController', function ($scope, $element, annotationSvc, $filter) {
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

        console.log(window.innerWidth );
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
           // $scope.annotations = dataList;
            //Sari - set Annotation in annotationSvc
            annotationSvc.setList($scope.annotations);
        });

        $scope.mediaTime = {duration: null, current: null};
        
        
           
        $scope.$on('annotationChanged',function() {
            for (var annotation in $scope.annotations ) {
                if (annotation.id <= 0)
                    $scope.areAllAdded = false;
            }
            $scope.areAllAdded = true;
        });
        $scope.$on('enableAdd', function () {
            $scope.addDisabled = false;
        });
        $scope.$on('disableAdd', function () {
            $scope.addDisabled = true;
        });
       
        $scope.addDisabled = false;        
        $scope.addAnnotation = function () {
            
            $scope.$broadcast('disableAdd');
            var newAnno = annotationSvc.create({
                timestamp: $scope.mediaTime.current,
                fromUser: $scope.$root.userData.name,
                userId: $scope.$root.userData.id,
                mediaId: $scope.mediaId,
                flag: 0
            });
            var once = $scope.$on('AnnotationAdded', function (e, newAnnoData) {
                if (newAnnoData[0].annotation == newAnno) {//scope
                    once();
                    var newAnnoElm = newAnnoData[1]; //$element
                    $('#annotations_list').animate({'scr}ollTop': (newAnnoElm.position().top + (newAnnoElm.height()))}, 700);
                }
            });
            $scope.annotations.push(newAnno);
            $scope.areAllAdded = false;
            setTimeout(function () {
                $scope.$root.$broadcast('videoPause');
            }, 20);
        };
    });

}());
