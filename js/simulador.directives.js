/**
 * Created by Maximiliano on 03/01/2015.
 */
"use strict";

angular.module('simulador').directive('numberRange', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {model: '=ngModel', min: '=?', max: '=?', step:'=?', unit: '@?'},
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
                    scope.model =  math.eval(scope.model + '-' + (scope.step || 1)).toNumber();
                }
            };
        }
    }
}]);


angular.module('simulador').directive('context2d', [function () {
    return {
        restrict: 'A',
        scope: { initCallback: '=?', elements: '=?', renderSizeHeight: '=?', renderSizeWidth: '=?'},
        link: function (scope, element, attrs) {
            if (element[0].tagName == 'CANVAS') {
                var canvas2d = new Canvas2d(element[0]);
                if (attrs.background) {
                  var context = element[0].getContext('2d');
                  var imageObj = new Image();

                  imageObj.onload = function() {
                    context.drawImage(imageObj, 0, 0);
                  };

                  imageObj.src = attrs.background;          
                }


                if (angular.isArray(scope.elements)) {
                    canvas2d.elements = scope.elements;
                }

                if (angular.isNumber(scope.renderSizeHeight) && angular.isNumber(scope.renderSizeWidth)) {
                    canvas2d.setRenderSize(scope.renderSizeWidth, scope.renderSizeHeight);
                }

                if (angular.isFunction(scope.initCallback)) {
                    scope.initCallback(canvas2d);
                }
            }
        }
    }
}]);
