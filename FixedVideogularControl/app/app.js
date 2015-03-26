(function () {
    'use strict';
            
               var vcModule = angular.module('vc', [
		'ngGrid',
        'vc.generalDirectives',
        'vc.generalServices',
        'vc.generalFilters',
        
         'ngResource',
        'ngAnimate',
        'ngDialog'          
    ]);
    vcModule.config(function ($httpProvider) {
        //in realuty currently the CI app does not look for csrf in the headers like normal modern frameworks but makes us do the ugly
        // transformation of data below, the commented rows were spared because of the use of the input transformation in MY_SECURITY
        $httpProvider.defaults.xsrfCookieName = 'vc_csrf_cookie_name';
        $httpProvider.defaults.xsrfHeaderName = 'vc_csrf_test_name';
//        $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
        $httpProvider.defaults.transformRequest.unshift(function (data, headers) {
                if (data) {
                    angular.extend(data, vc.csrf);
                    // data =$.param(data);
                }
                return data;
            }
        );
    });

    vcModule.run(function ($rootScope, userData) {
        $rootScope.usernameIsSet = function () {
            var ret = false;
            if ($rootScope.userData &&
                typeof $rootScope.userData.name != 'undefined' &&
                $rootScope.userData.name.length > 0) {
                ret = true;
            }
            return ret;
        };
        if (typeof vc != 'undefined') {
            $rootScope.baseUrl = vc.baseUrl;
            $rootScope.siteUrl = vc.siteUrl;
        }
        userData.success(function (userData) {
            $rootScope.userData = userData || {};
        });

    });


}());
  