/**
 * Created by Maximiliano on 04/01/2015.
 */
"use strict";

/* ### CONTROLADOR DE INICIAL ### */
angular.module('simulador').controller('homeController', ['$scope', 'gases', 'fluidos', function ($scope, gases, fluidos) {
    var ALTURA_TANQUE_PX = 100, // 100px de altura máxima
        POS_PELO_AGUA_PX = 260;

    var canvas = null,
        working = false;

    /* Elementos dinámicos del canvas */
    var mathFn = new MathFunction(185, 358, function (t) {
            return posFinal(0, 0, 15, 10, 0, -GRAVEDAD, t / 60);
        }, 0, 0, .5, null, null, 5, 'blue'),
        agua = new Rectangle(55, POS_PELO_AGUA_PX, 130, ALTURA_TANQUE_PX, 'rgba(0, 0, 255, .5'),
        info = new StyledText("", 790, 10, "bold large sans-serif", 'red', 'right', 'top');

    var area = math.compile("( ( d / 2 ) ^ 2 ) * PI");

    var valoresCalculo = {},
        fnCalculador = function () {};

    /* INICIALIZACIÓN */
    function init() {
        $scope.tanque = {
            altura: 0,
            diametro: 0,
            nivel: 50, // porcentaje: 0 a 100
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
            info//,
             /*mathFn,*/
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
    function updateAgua (valoresCalculo) {
        var calculoAltura = math.compile("alturaFluido / alturaTanque * pixeles");
        //agua.height = (valoresCalculo.alturaInicial.toNumber() / $scope.tanque.altura) * ALTURA_TANQUE_PX;
        agua.height = math.number(calculoAltura.eval({
            alturaFluido: valoresCalculo.alturaInicial,
            alturaTanque: $scope.tanque.altura,
            pixeles: ALTURA_TANQUE_PX
        }));
        agua.y = POS_PELO_AGUA_PX + (ALTURA_TANQUE_PX - agua.height);
    }

    function update () {
        fnCalculador(valoresCalculo);
        updateAgua(valoresCalculo);

        if (!(agua.y >= POS_PELO_AGUA_PX + ALTURA_TANQUE_PX)) {
            canvas.elements.push(
                new Gota(0, 580, 185, 220,
                    math.number($scope.tanque.orificio.largo),
                    math.number($scope.tanque.orificio.angulo),
                    math.number(valoresCalculo.velocidadSalida),
                    -GRAVEDAD));
        }

        //info.text = "Tiempo: " + Math.floor(mathFn.to / 60).toString() + " seg";

        if (working) {
            canvas.frame(update);
        }
    }

    $scope.initCallback = function (canvas2d) {
        canvas = canvas2d;
    };

    $scope.startSimulation = function () {
        working = true;

        console.info($scope.tanque);

        valoresCalculo = {
            gravedad: GRAVEDAD,

            /*Datos gas*/
            densidadGas: math.bignumber($scope.tanque.gas ? $scope.tanque.gas.densidad : 0), // TODO: parche, checkear luego
            alturaGas: math.bignumber($scope.tanque.altura * ((100 - $scope.tanque.nivel)/100)),

            /*Datos Liquido*/
            densidadLiquido: math.bignumber($scope.tanque.fluido.densidad),
            alturaInicial: math.bignumber($scope.tanque.altura * ($scope.tanque.nivel/100)), //alturaInicial se refiere a la altura del liquido desde el fondo del tanque hasta el pelo de agua
            presionSalida: math.bignumber(0),

            /*Datos Tanque*/
            areaOrificio: math.bignumber(area.eval({d: parseFloat($scope.tanque.orificio.diametro)})),
            alturaTubo: math.bignumber($scope.tanque.orificio.altura),
            areaBaseTanque: math.bignumber(area.eval({d: parseFloat($scope.tanque.diametro)})),

            /*Salida*/
            velocidadSalida: math.bignumber(0)

        };

        updateAgua(valoresCalculo);

        fnCalculador = $scope.tanque.tapa ?  calculaEstadoTanqueConTapa : calculaEstadoTanqueSinTapa;

        canvas.frame(update);
    };

    init();
}]);
