/**
 * Created by Maximiliano on 04/01/2015.
 */
"use strict";

angular.module('simulador').factory('gases', ['$http', function($http) {
    return function () {
        return $http.get('json/gases.json');
    };
}]);

angular.module('simulador').factory('fluidos', ['$http', function($http) {
    return function () {
        return $http.get('json/fluidos.json');
    };
}]);