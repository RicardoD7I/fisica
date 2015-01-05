/**
 * Created by Maximiliano on 04/01/2015.
 */
"use strict";


/* ### CONTROLADOR DEL MODAL DE PARAMETROS DE ENTRADA ### */
angular.module('simulador').controller('parametrosController', ['$scope', function ($scope) {
    var volumen = math.compile("h * ( ( d / 2 ) ^ 2 ) * PI"),
        litros = math.compile("(v * n / 100) m3 to l"),
        m3toL = math.compile("volumen m3 to l");

    function parseNumberOrZero (number) {
        if (angular.isDefined(number) && angular.isDefined(number.toString)) {
            var n = /\d*(?:\.\d+)?/g.exec(number.toString())[0];
            var parsed = math.eval(n);
            if (angular.isDefined(parsed)) return parsed;
        }
        return 0;
    }

    var calcCapacidadTotal = $scope.calcCapacidadTotal = function () {
        /* En m3 */
        return volumen.eval({
            h: parseNumberOrZero($scope.tanque.altura),
            d: parseNumberOrZero($scope.tanque.diametro)
        }).toNumber();
    };

    $scope.calcLitrosLleno = function () {
        if (angular.isDefined($scope.tanque.altura) && angular.isDefined($scope.tanque.diametro) && angular.isDefined($scope.tanque.nivel)) {
            return litros.eval({
                v: calcCapacidadTotal(),
                n: parseNumberOrZero($scope.tanque.nivel)
            }).value;
        }
    };
}]);
