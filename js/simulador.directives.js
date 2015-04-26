"use strict";

angular.module('simulador').directive('numberRange', [
    '$interval', 'math',
    function ($interval, math) {
        return {
            restrict: 'A',
            replace: true,
            scope: {model: '=ngModel', min: '=?', max: '=?', step: '=?', unit: '@?'},
            templateUrl: 'view/numberRange.html',
            link: function (scope, element, attrs) {
                scope.elemId = attrs.id;
                scope.elemName = attrs.name;
                element.removeAttr('id').removeAttr('name');

                attrs.$observe('ngRequired', function (newValue) {
                    scope.isRequired = newValue;
                });

                scope.inc = function () {
                    if (!angular.isDefined(scope.max) || angular.isDefined(scope.max) && scope.model < scope.max) {
                        scope.model = math.eval(scope.model + '+' + (scope.step || 1)).toNumber();
                    }
                };

                scope.dec = function () {
                    if (!angular.isDefined(scope.min) || angular.isDefined(scope.min) && scope.model > scope.min) {
                        scope.model = math.eval(scope.model + '-' + (scope.step || 1)).toNumber();
                    }
                };

                var autoRepeater = null;
                scope.mouseDown = function (action) {
                    if (!autoRepeater) autoRepeater = $interval(action, 100);
                };

                scope.mouseUp = function () {
                    if (!!autoRepeater) {
                        $interval.cancel(autoRepeater);
                        autoRepeater = null;
                    }
                };
            }
        }
    }
]);
