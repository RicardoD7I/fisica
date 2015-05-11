/**
 * Created by mstranich on 09/04/2015.
 */

angular.module('canvas').directive('canvas', [
    'CanvasUtils', 'CanvasContextService',
    function (CanvasUtils, CanvasContextService) {
        return {
            restrict: 'E',
            scope: {
                instanceName: '@?id',
                context: '@?',
                contextAttributes:'=?',
                elements: '=?',
                fps: '=?',
                scale: '=?'
            },
            link: function (scope, element, attrs) {
                var context;
                // At the moment, forced to context 2D
                // if (!scope.context || scope.context == '2d') {
                context = CanvasContextService.newInstance(element[0], scope.instanceName, scope.contextAttributes);
                //}

                if (angular.isArray(scope.elements) || angular.isObject(scope.elements)) context.addElements(scope.elements);
                !!scope.fps && context.setFPS(scope.fps);
                !!scope.scale && context.setScale(scope.scale);
            }
        }
    }
]);
