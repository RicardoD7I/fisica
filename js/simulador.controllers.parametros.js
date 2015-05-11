"use strict";


/* ### CONTROLADOR DEL MODAL DE PARAMETROS DE ENTRADA ### */
angular.module('simulador').controller('parametrosController', [
    '$scope', 'math',
    function ($scope, math) {
        var volumen = math.compile("h * ( ( d / 2 ) ^ 2 ) * PI"),
            litros = math.compile("(v * n / 100) m3 to l");

        var calcCapacidadTotal = $scope.calcCapacidadTotal = function () {
            /* En m3 */
            return volumen.eval({
                h: $scope.tanque.altura || 0,
                d: $scope.tanque.diametro || 0
            }).toNumber();
        };

        $scope.calcLitrosLleno = function () {
            if (angular.isDefined($scope.tanque.altura) && angular.isDefined($scope.tanque.diametro) && angular.isDefined($scope.tanque.nivel)) {
                return litros.eval({
                    v: calcCapacidadTotal(),
                    n: math.bignumber($scope.tanque.nivel)
                }).value;
            }
        };
    }
]);
