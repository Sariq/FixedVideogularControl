(function () {
    'use strict';
    var generalServicesModules = angular.module('vc.generalServices', []);
    generalServicesModules.factory('userData', function ($http, logSvc) {
        return $http.get(vc.siteUrl + 'user/get_current_data').error(function (e) {
            logSvc.log('failed to get user data ' + e);
        });
    });

    generalServicesModules.factory('logSvc', function () {
        return {
            log: function (thing) {
                //todo:: check if we want to log to server.
                if (typeof console.log == "function") {
                    console.log(thing);
                }
            }
        };
    });
}());