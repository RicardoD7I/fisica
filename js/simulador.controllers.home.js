"use strict";

/* ### CONTROLADOR DE INICIAL ### */
angular.module('simulador').controller('homeController', [
    '$scope', '$q', 'math', 'gases', 'fluidos', 'calculos', 'GRAVEDAD', 'GotaFactory', 'CanvasContextService', 'CanvasUtils', 'CanvasRectFactory', 'CanvasCircleFactory', 'CanvasImageFactory', 'CanvasSVGFactory', 'CanvasTextFactory',
    function ($scope, $q, math, gases, fluidos, calculos, GRAVEDAD, GotaFactory, CanvasContextService, CanvasUtils, CanvasRectFactory, CanvasCircleFactory, CanvasImageFactory, CanvasSVGFactory, CanvasTextFactory) {
        var ALTURA_TANQUE_PX = 200, // 200px de altura máxima
            POS_PELO_AGUA_PX = 140;

        var canvasWrapper = null,
            working = false;

        /* Elementos dinámicos del canvas */
        var base = CanvasSVGFactory({
                x: 150,
                y: 416,
                height: 368,
                width: 200
            }),
            tanque = CanvasSVGFactory({
                x: 150,
                y: 140,
                height: 200,
                width: 200
            }),
            tapa = CanvasSVGFactory({
                x: 150,
                y: 35,
                height: 10,
                width: 200
            }),
            agua = CanvasRectFactory({
                x: 150,
                y: POS_PELO_AGUA_PX,
                width: 200,
                height: ALTURA_TANQUE_PX,
                fillStyle: 'rgba(0, 0, 255, .5)'
            }),
            info = CanvasTextFactory({
                text: '',
                x: 790,
                y: 10,
                font: "bold large sans-serif",
                fillStyle: 'red',
                align: 'right',
                baseline: 'top'
            });

        var images = {
            base: CanvasUtils.loadImageURL('img/base.svg'),
            tanque: CanvasUtils.loadImageURL('img/tanque.svg'),
            tapa: CanvasUtils.loadImageURL('img/tapa.svg')
        };

        var valoresCalculo = {},
            fnCalculador = function () {};

        $scope.tanque = {
            altura: 1,
            diametro: 1,
            nivel: 50, // porcentaje: 0 a 100
            tapa: false,
            gas: null,
            alturaPlataforma: 10,
            orificio: {
                ubicacion: 'LATERAL',
                diametro: 0,
                altura: 0,
                largo: 0,
                angulo: 0
            },
            fluido: null
        };

        /* INICIALIZACIÓN */
        function init() {
            $q.all(images).then(function (loadedImages) {
                base.image = loadedImages.base;
                tanque.image = loadedImages.tanque;

                $scope.$watch('tanque.tapa', function(newVal, oldVal) {
                    tapa.image =  newVal ? loadedImages.tapa : null;
                }, true);
            });

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

        CanvasContextService.getInstance('canvasSimulador').then(function (contextWrapper) {
            canvasWrapper = contextWrapper;

            contextWrapper.addElements([
                base,
                tanque,
                tapa,
                agua,
                info
            ]);


        });

        /* ACCIONES */
        function updateAgua (valoresCalculo) {
            agua.height = math.number(calculos.alturaTanquePX.eval({
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
                canvasWrapper.addElements(GotaFactory(
                    0, 580, 185, 220,
                    math.number($scope.tanque.orificio.largo),
                    math.number($scope.tanque.orificio.angulo),
                    math.number(valoresCalculo.velocidadSalida),
                    -GRAVEDAD
                ));
            }

            if (working) {
                canvasWrapper.frame(update);
            }
        }

        $scope.startSimulation = function () {
            working = true;

            var seconds = 0;

            var updateTimer = function() {
                setTimeout(function(){
                    info.text = "Tiempo: " + seconds.toString() + " seg";
                    seconds++;
                    if (working) {
                        updateTimer()
                    }
                }, 1000);
            };

            updateTimer();

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
                areaOrificio: math.bignumber(calculos.area.eval({d: parseFloat($scope.tanque.orificio.diametro)})),
                alturaTubo: math.bignumber($scope.tanque.orificio.altura),
                areaBaseTanque: math.bignumber(calculos.area.eval({d: parseFloat($scope.tanque.diametro)})),

                /*Salida*/
                velocidadSalida: math.bignumber(0)
            };

            updateAgua(valoresCalculo);

            fnCalculador = $scope.tanque.tapa ?  calculos.estadoTanque.conTapa : calculos.estadoTanque.sinTapa;

            canvasWrapper.frame(update);
        };

        init();
    }
]);
