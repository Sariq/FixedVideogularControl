(function () {
'use strict';
        var clipViewModule = angular.module('vc.clipView', [
                'vc',
                'vc.video',
                'vc.annotations'
        ]);
        clipViewModule.run(function (userData, clipData, $rootScope) {
        console.log("a");
                $rootScope.windowHeight = $(window).height();
                $rootScope.tvHeight = 0;
                if ($(".tvInner").length) {
        $rootScope.tvHeight = $(".tvInner").height();
                console.log("tcheight:" + $rootScope.tvHeight + " windowHeight:" + $rootScope.windowHeight);
                $rootScope.annoPartHeight = $rootScope.tvHeight - Math.min($rootScope.windowHeight / 2, 350);
                console.log("Height should be :" + $rootScope.annoPartHeight);
        }
        else {
            $rootScope.annoPartHeight =($rootScope.windowHeight/2-64);
        }
        $rootScope.file = clipData;
                userData.then(function () { // makes the app wait for userData
                console.log("b");
                        $rootScope.userChosenName = '';
                        $rootScope.setUserName = function () {
                        if ($rootScope.userChosenName.length > 2){
                        $rootScope.userData.name = $rootScope.userChosenName; }
                        };
                });
                }
            );
            })();            
   