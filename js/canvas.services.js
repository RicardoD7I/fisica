/**
 * Created by Maximiliano Stranich on 11/04/2015.
 */

angular.module('canvas').service('CanvasUtils', [
    '$q',
    function ($q) {
        this.loadImageURL = function (url) {
            var deferred = $q.defer(),
                image = new Image();
            image.src = url;
            image.onload = function () {
                deferred.resolve(image);
            };
            return deferred.promise;
        };

        /**
         * Transform angles in degrees to radians
         * @param {number} degrees
         * @return {number}
         * @private
         */
        this.toRadians = function (degrees) {
            return degrees * (Math.PI / 180);
        }
    }
]);

angular.module('canvas').service('CanvasContextService', [
    '$q', 'CanvasContext2dFactory',
    function ($q, CanvasContext2dFactory) {
        var _contextInstancesMap = {},
            _contextInstancesArray = [],
            _listeners = [];

        /**
         * Returns a new canvas context wrapper instance
         * @param canvas
         * @param instanceName
         * @param contextAttributes
         * @return {CanvasContext2d}
         */
        this.newInstance = function (canvas, instanceName, contextAttributes) {
            var instance = CanvasContext2dFactory(canvas, contextAttributes);
            !!instanceName && (_contextInstancesMap[instanceName] = instance);
            _contextInstancesArray.push(instance);
            angular.forEach(_listeners, function (l) {
                if (l.instanceName == instanceName || l.instanceName == _contextInstancesArray.length - 1) {
                    l.deferred.resolve(instance);
                }
            });
            return instance;
        };

        /**
         * Returns a existent canvas context wrapper instance
         * @param instanceName
         * @return {Promise}
         */
        this.getInstance = function (instanceName) {
            var deferred = $q.defer();

            if (angular.isNumber(instanceName) && _contextInstancesArray[instanceName]) {
                deferred.resolve(_contextInstancesArray[instanceName]);
            } else if (_contextInstancesMap[instanceName]) {
                deferred.resolve(_contextInstancesMap[instanceName]);
            } else {
                _listeners.push({
                    instanceName: instanceName,
                    deferred: deferred
                });
            }

            return deferred.promise;
        };
    }
]);
