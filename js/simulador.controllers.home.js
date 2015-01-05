/**
 * Created by Maximiliano on 04/01/2015.
 */
"use strict";

/* ### CONTROLADOR DE INICIAL ### */
angular.module('simulador').controller('homeController', ['$scope', 'gases', 'fluidos', function ($scope, gases, fluidos) {
    var canvas = null,
        working = false;

    /* Elementos dinámicos del canvas */
    var mathFn = new MathFunction(185, 358, function (t) {
            return posFinal(0, 0, 15, 10, 0, -GRAVEDAD, t / 60);
        }, 0, 0, .5, null, null, 5, 'blue'),
        agua = new Rectangle(55, 260, 130, 100, 'rgba(0, 0, 255, .5'),
        info = new StyledText("", 790, 10, "bold large sans-serif", 'red', 'right', 'top');

    /* INICIALIZACIÓN */
    function init() {
        $scope.tanque = {
            altura: 0,
            diametro: 0,
            nivel: 50,
            tapa: false,
            gas: null,
            alturaPlataforma: 0,
            orificio: {
                ubicacion: 'LATERAL',
                diametro: 0,
                altura: 0,
                largo: 0,
                angulo: 0
            },
            fluido: null
        };

        $scope.elements = [
            new Rectangle(0, 0, 800, 600, 'white', 'img/fondo2.png'),
            new Rectangle(0, 237, 240, 363, 'transparent', 'img/tanque.png'),
            new StyledText("Simulador", 10, 10, "bold large sans-serif", 'red', 'left', 'top'),
            agua,
            info,
            mathFn
        ];

        gases().success(function (response) {
            $scope.gases = response;
        });
        fluidos().success(function (response) {
            $scope.fluidos = response;
            if (!$scope.tanque.fluido) {
                $scope.tanque.fluido = $scope.fluidos[0];
            }
        });
    }

    /* ACCIONES */
    function update () {
        agua.y += 1 / 3;
        agua.height = 360 - agua.y;
        if (agua.y >= 360) {
            agua.y = 260;
        }

        mathFn.to++;
        if (mathFn.to == 300) {
            mathFn.to = 0;
            working = false;
        }

        info.text = "Tiempo: " + Math.floor(mathFn.to / 60).toString() + " seg";

        if (working) {
            canvas.frame(update);
        }
    }

    $scope.initCallback = function (canvas2d) {
        canvas = canvas2d;
    };

    $scope.startSimulation = function () {
        working = true;
        canvas.frame(update);
    };

    init();
}]);
