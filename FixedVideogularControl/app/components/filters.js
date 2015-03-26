(function () {
    'use strict';
    var generalFilterModule = angular.module('vc.generalFilters', []);

    generalFilterModule.filter('timestamp', [function () {
        return function (seconds) {
            var h = "";
            if (seconds > 3600) {
                h = Math.floor(seconds / 3600) < 10 ? "0" + Math.floor(seconds / 3600) : Math.floor(seconds / 3600);
                h = h + ":";
                seconds = seconds - h * 3600;
            }
            var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
            var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
            var timestring = h + "" + m + ":" + s;
            return timestring;
        };
    }]);
    generalFilterModule.filter('getByProperty', function () {
        return function (propertyName, propertyValue, collection) {
            var i = 0, len = collection.length;
            for (; i < len; i++) {
                if (collection[i][propertyName] == propertyValue) {
                    return collection[i];
                }
            }
            return null;
        };
    }).filter('orderObjectBy', function () {
        return function (items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    });
}());