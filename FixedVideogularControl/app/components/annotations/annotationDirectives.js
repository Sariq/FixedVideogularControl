(function () {
    "use strict";
    var annotationsModule = angular.module('vc.annotations');

    annotationsModule.directive('annotationMarkers', function ($compile) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var annolist = $element.find('#annotation-markers-wrapper');
                $element.parent().bind('mouseenter', function () {
                    $scope.$apply(function () {
                        $scope.hovering = true;
                    });
                });
                $element.parent().bind('mouseleave', function () {
                    $scope.$apply(function () {
                        $scope.hovering = false;
                    });
                });
                if ($scope.allowAnnotate) {
                    $scope.$watchCollection('annotations', function (newVal) {
                        annolist.children().remove();
                        angular.forEach(newVal, function (annotation) {
                            var annoScope = $scope.$new(true);
                            annoScope.$watch(function () {
                                return $scope.hovering;
                            }, function (newval) {
                                annoScope.pinShow = newval;
                            });
                            annoScope.annotation = annotation;
                            var markerHtml = angular.element('<annotation-marker data-timestamp="{{ annotation.timestamp }}"></annotation-marker>');
                            var marker = $compile(markerHtml)(annoScope);
                            annolist.append(marker);
                        });
                    });
                }
            }
        };
    });
    annotationsModule.directive('annotationList', function (annotationSvc) {
        return {
            
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                annotationSvc.listScope = $scope;
    
            }
        };
    });
    annotationsModule.directive('annotationMarker', function (annotationSvc) {
        return {
             restrict: 'E',
            replace: true,
            template: '<span class="annotation-marker">' +
                '<i class="fa fa-circle simpleShowAni" ng-show="pinShow" ></i></span>',
            controller: function ($scope, $element, $attrs) {
                $scope.setTimePosition = function (movieTime) {
                    if ($attrs.timestamp > 0) {
                        var margin = $attrs.timestamp / movieTime * 100;
                        $element.css('margin-left', margin.toFixed(4) + '%');
                    }
                };
                $scope.pinShow = false;
            },
            link: function ($scope, $element, $attrs) {
                // annolist.find('span.annotation-marker i.fa-circle').hide("slow");
                if ($scope.annotation.flag == 1) {
                    $element.addClass('new');
                }
                var timeSet = $scope.$root.$on('onVgUpdateTime', function (e, data) {
                    if (!isNaN(data[1])) { // check if we got the time as an integer so we can definatly know we will manage to set the position by the time
                        timeSet();
                    }
                    $scope.setTimePosition(data[1]);
                });
                annotationSvc.listScope.$on('markAnnotation', function (e, data) { // show Pin on eleemnt click
                    $scope.showPin = (data.id == $scope.annotation.id) ? true : false;
                });
                $element.click(function () {
         
                    annotationSvc.listScope.$broadcast('markAnnotation', { id: $scope.annotation.id });

                });
                if (annotationSvc.listScope && annotationSvc.listScope.mediaTime) {
                    $scope.setTimePosition(annotationSvc.listScope.mediaTime.total);
                }
            }
        };
    });
    function annotationController(argsArr, annotationSvc, $rootScope) {
        var $scope = argsArr[0], $element = argsArr[1];
       
        if ($scope.annotation.flag == 1) {
            $element.addClass('new');
        }
        $scope.state = {$editable: false, isMarked: false};
        $scope.mark = function (markOnly) {
           
            if (!$scope.state.isMarked) {
                $element.parent().animate({
                    scrollTop: $element.parent().scrollTop() + ($element.position().top - $element.parent().position().top)
                }, 700);
                $scope.state.isMarked = true;
                if (!markOnly) {
                    $scope.$root.$broadcast('videoSeekTime', $scope.annotation.timestamp);
                    $scope.$digest();
                }
            }
        };
        $scope.dismissOnPlayWatcher = null;
        $scope.save = function () {
            $scope.state.$editable = false;
            if (typeof $scope.dismissOnPlayWatcher === 'function') {
                $scope.dismissOnPlayWatcher();
            }
            console.log("linking inside1");
            $scope.annotation.save();
           
            annotationSvc.setAnnotIndexById($scope.annotation.id)
             //even non logged in users should be able to delete their annotations 
            $scope.annotation.is_me = true;
            //Sari
            annotationSvc.listScope.$broadcast('enableAdd');  //Enable add button
            //Sari
            $scope.$root.$broadcast('videoPlay');
            $scope.$root.$broadcast('annotationChanged');

        };
        $scope.cancelSave = function () {
            console.log("linking inside2");
            annotationSvc.listScope.$broadcast('enableAdd');
            $scope.annotation.delete();
            $scope.$root.$broadcast('annotationChanged');
            $scope.$root.$broadcast('videoPlay');
        };
        $scope.userHasWritten = function (annotation) {
            if (annotation.is_me)
                return true;
            if (annotation.userId && $scope.$root.userData)
                return $scope.$root.userData.id == annotation.userId;
        };
       
        $scope.usernameIsSet = function (annotation) {
                return $scope.$root.usernameIsSet();
        };
    }

    function AnnotationsLinkFunction(argsArr, annotationSvc) {
        
        var $scope = argsArr[0], $element = argsArr[1];
        $scope.$emit('AnnotationAdded', [$scope, $element]);
        //console.log($element)
        $element.click(function (e) {
         
      
            if (e.target.tagName != 'BUTTON') { //filter them buttons...
               
                annotationSvc.listScope.$broadcast('markAnnotation', { id: $scope.annotation.id }); // self mark with event, so siblings get unmarked
                //Sari
                //child mark issue
                if (e)
                    e.stopPropagation();
                //Sari


            }
        });
        $scope.$watch(function () {
            if ($scope.$parent.mediaTime) {
                return Math.floor($scope.$parent.mediaTime.current);
            } // currently working by round seconds only
        }, function (videoTime) {
            if (videoTime === parseInt($scope.annotation.timestamp)) {
                annotationSvc.listScope.$broadcast('markAnnotation', {id: $scope.annotation.id, opts: true}); //  self mark with event, so siblings get unmarked
            }
        });
        $scope.$on('markAnnotation', function (e, data) {
                   
            if (data.id == $scope.annotation.id) {
                $scope.mark(data.opts);
                annotationSvc.setAnnotIndexById($scope.annotation.id);
            }
            else { //unmark
                $scope.state.isMarked = false;
            }
          
            $scope.$apply();
        });
        //Sari
        //newAnnot mark 
        var temp_id = 0;//need to be replaced with real id
        $scope.$on('markNewAnnotation', function (e, data) {
            if (!$scope.annotation.id) {
                $scope.state.isMarked = true;
                $scope.annotation.id = temp_id; 
                temp_id++;
            } else {
                $scope.state.isMarked = false;
            }
            
        });
        //Sari

        $scope.$watch('state.$editable', function (newVal) {
            if (newVal) {
                $element.find('.comment textarea').focus();
                $scope.dismissOnPlayWatcher = $scope.$root.$on('onVgPlay', function () {
                    $scope.dismissOnPlayWatcher(); //remove the watcher
                    $scope.cancelSave();
                });
            }
        });
        $scope.$watch('annotation.id', function (newVal) {
            if (!newVal) {
                $scope.state.$editable = true;
            }
            else
                $scope.state.$editable = false;
        });
    }

    annotationsModule.directive('vcReplyAnnotation', function (annotationSvc, $rootScope) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                annotation: '='
            },
            templateUrl: '../app/views/media/replyAnnotation.html',
            controller: function ($scope, $element, $attrs) {
                annotationController.call(this, arguments, annotationSvc, $rootScope);
            },
            link: function ($scope, $element, $attrs) {
                AnnotationsLinkFunction.call(this, arguments, annotationSvc);
            }
        };
    });
    annotationsModule.directive('vcMediaAnnotation', function (annotationSvc) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                annotation: '='
            },
            templateUrl: '../app/views/media/annotation.html',
            controller: function ($scope, $element, $attrs) {
                annotationController.call(this, arguments, annotationSvc);
            },
            link: function ($scope, $element) {
                AnnotationsLinkFunction.call(this, arguments, annotationSvc);
                $scope.replyDisabled = false;
                $scope.$on('enableAdd', function () {
                    $scope.replyDisabled = false;
                });
                $scope.$on('disableAdd', function () {
                    $scope.replyDisabled = true;
                });
                $scope.addReply = function () {
                    $scope.$root.$broadcast('videoPause');
                    annotationSvc.listScope.$broadcast('disableAdd');
                    var child = annotationSvc.create({
                        parentId: $scope.annotation.id,
                        mediaId: $scope.annotation.mediaId,
                        timestamp: $scope.annotation.timestamp,
                        fromUser: $scope.$root.userData.name,
                        userId: $scope.$root.userData.id,
                        flag: 0
                    }, true);
                    $scope.annotation.addChild(child);
                    //todo: the following line is a bit crude breaking of MVC ...
                    // we should make a list directive that will be in charge of all the scrolling
                    $element.parent().animate({
                        scrollTop: $element.parent().scrollTop() + ($element.position().top - $element.parent().position().top)
                    }, 700);
                };
            }
        };
    });


    //sari
    annotationsModule.directive('autoFocus', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                attrs.$observe("autoFocus", function (newValue) {
                    if (newValue === "true")
                        $timeout(function () { element.focus() });
                });
            }
        };
    });
    //sari
}());



