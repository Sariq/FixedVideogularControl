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
                    annotationSvc.listScope.$broadcast('markAnnotation', {id: $scope.annotation.id});
                });
                if (annotationSvc.listScope && annotationSvc.listScope.mediaTime) {
                    $scope.setTimePosition(annotationSvc.listScope.mediaTime.total);
                }
            }
        };
    });
    function annotationController(argsArr, annotationSvc) {
        var $scope = argsArr[0], $element = argsArr[1];
       
        if ($scope.annotation.flag == 1) {
            $element.addClass('new');
        }
        $scope.state = {$editable: false, isMarked: false};
        $scope.mark = function (markOnly) {
           
            $element.parent().animate({
                scrollTop: $element.parent().scrollTop() + ($element.position().top - $element.parent().position().top)
            }, 700);
            $scope.state.isMarked = true;
           // $scope.$apply();
            if (!markOnly) {
                $scope.$root.$broadcast('videoSeekTime', $scope.annotation.timestamp);
                $scope.$digest();
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
             //even non logged in users should be able to delete their annotations 
             $scope.annotation.is_me = true;
            annotationSvc.listScope.$broadcast('enableAdd');
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
        $scope.$emit('AnnotationAdded',[$scope,$element]);
        $element.click(function (e) {
            if (e.target.tagName != 'BUTTON') { //filter them buttons...
                annotationSvc.listScope.$broadcast('markAnnotation', { id: $scope.annotation.id }); // self mark with event, so siblings get unmarked
                if (e)
                    e.stopPropagation();
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
            }
            else { //unmark
                $scope.state.isMarked = false;
            }
          
            $scope.$apply();
         
        });
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

    annotationsModule.directive('vcReplyAnnotation', function (annotationSvc) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                annotation: '='
            },
            templateUrl: '../app/views/media/replyAnnotation.html',
            controller: function ($scope, $element, $attrs) {
                annotationController.call(this, arguments, annotationSvc);
                //$scope.usernameIsSet = function (annotation) {
                //    return $scope.$root.usernameIsSet();
                //};
            },
            link: function ($scope, $element, $attrs) {
                AnnotationsLinkFunction.call(this, arguments, annotationSvc);
            }
        };
    });
    annotationsModule.directive('vcMediaAnnotation', function (annotationSvc, smoothScroll) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                annotation: '='
            },
            templateUrl: '../app/views/media/annotation.html',
            controller: function ($scope, $element, $attrs) {
                annotationController.call(this, arguments, annotationSvc);
                $scope.hover = function (annotation,text) {
                    //alert(angular.toJson(annotation))
                   
                    return annotation.showMe = !annotation.showMe;
                }
                //Sari
                $scope.toggleFlag = function (annotation) {
                    alert(annotation.flag)

                    annotation.flag = !annotation.flag;
                }
                $scope.gotoAnchor = function (x) {

                   // $('#myDiv').animate({ scrollTop: $("#anchor5000").offset().top }, 5000);
                   // alert()
                    //var element = document.getElementById('anchor' + 269);
                    //smoothScroll(element);
                    //x = 4;
                    //var newHash = 'anchor' + x;
                    //if ($location.hash() !== newHash) {
                    //    // set the $location.hash to `newHash` and
                    //    // $anchorScroll will automatically scroll to it
                    //    $location.hash('anchor' + x);
                    //} else {
                    //    // call $anchorScroll() explicitly,
                    //    // since $location.hash hasn't changed
                    //    $anchorScroll();
                    //}
                };
                //Sari
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

}());



!function () { "use strict"; var e = angular.module("smoothScroll", []), t = function (e, t) { t = t || {}; var n = t.duration || 800, o = t.offset || 0, a = t.easing || "easeInOutQuart", c = t.callbackBefore || function () { }, r = t.callbackAfter || function () { }, f = function () { return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop }; setTimeout(function () { var t, l, u = f(), i = 0, s = function (e, t) { return "easeInQuad" == e ? t * t : "easeOutQuad" == e ? t * (2 - t) : "easeInOutQuad" == e ? .5 > t ? 2 * t * t : -1 + (4 - 2 * t) * t : "easeInCubic" == e ? t * t * t : "easeOutCubic" == e ? --t * t * t + 1 : "easeInOutCubic" == e ? .5 > t ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 : "easeInQuart" == e ? t * t * t * t : "easeOutQuart" == e ? 1 - --t * t * t * t : "easeInOutQuart" == e ? .5 > t ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t : "easeInQuint" == e ? t * t * t * t * t : "easeOutQuint" == e ? 1 + --t * t * t * t * t : "easeInOutQuint" == e ? .5 > t ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t : t }, d = function (e) { var t = 0; if (e.offsetParent) do t += e.offsetTop, e = e.offsetParent; while (e); return t = Math.max(t - o, 0) }, b = d(e), k = b - u, m = function () { var t = f(); l != b && t != b && window.innerHeight + t < document.body.scrollHeight || (clearInterval(I), r(e)) }, v = function () { i += 16, t = i / n, t = t > 1 ? 1 : t, l = u + k * s(a, t), window.scrollTo(0, l), m() }; c(e); var I = setInterval(v, 16) }, 0) }; e.factory("smoothScroll", function () { return t }), e.directive("smoothScroll", ["smoothScroll", function (e) { return { restrict: "A", scope: { callbackBefore: "&", callbackAfter: "&" }, link: function (t, n, o) { (void 0 === o.scrollIf || "true" === o.scrollIf) && setTimeout(function () { var a = function (e) { if (o.callbackBefore) { var n = t.callbackBefore({ element: e }); "function" == typeof n && n(e) } }, c = function (e) { if (o.callbackAfter) { var n = t.callbackAfter({ element: e }); "function" == typeof n && n(e) } }; e(n[0], { duration: o.duration, offset: o.offset, easing: o.easing, callbackBefore: a, callbackAfter: c }) }, 0) } } }]), e.directive("scrollTo", ["smoothScroll", function (e) { return { restrict: "A", scope: { callbackBefore: "&", callbackAfter: "&" }, link: function (t, n, o) { var a; n.on("click", function (n) { if (n.preventDefault(), a = document.getElementById(o.scrollTo)) { var c = function (e) { if (o.callbackBefore) { var n = t.callbackBefore({ element: e }); "function" == typeof n && n(e) } }, r = function (e) { if (o.callbackAfter) { var n = t.callbackAfter({ element: e }); "function" == typeof n && n(e) } }; return e(a, { duration: o.duration, offset: o.offset, easing: o.easing, callbackBefore: c, callbackAfter: r }), !1 } }) } } }]) }();