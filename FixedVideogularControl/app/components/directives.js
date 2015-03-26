(function () {
    'use strict';
    var generalDirectivesModule = angular.module('vc.generalDirectives', []);


    generalDirectivesModule.directive('vcHref', ['$rootScope', function ($rootScope) {
        return {
            link: function ($scope, $element, $attrs) {
                $element.attr('href', $rootScope.baseUrl + $attrs.vcHref);
            }
        };
    }]);
    generalDirectivesModule.directive('setWidthBy',function($window){
       return {
           link:function($scope,$element,$attrs){
               var setWidth = function(){
                   $element.css('width',$($attrs.setWidthBy).width());
               };
               if ($($attrs.setWidthBy).length > 0){
                  setWidth();
               }
               $scope.$on('onVgPlayerReady', function () {
                   setWidth();
               });
               var timeVar = null;
               $($window).resize(function(){
                   if (timeVar){
                       clearTimeout(timeVar);
                   }
                   timeVar = setTimeout(function(){
                       setWidth();
                   },20);
               });
           }
       };
    });
}());