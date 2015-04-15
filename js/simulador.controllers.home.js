"use strict";

/* ### CONTROLADOR DE INICIAL ### */
angular.module('simulador').controller('homeController', [
    '$scope', '$q', 'math', 'gases', 'fluidos', 'calculos', 'GRAVEDAD', 'FPS', 'ESCALA_PX_MT', 'GotaFactory', 'CanvasContextService', 'CanvasUtils', 'CanvasRectFactory', 'CanvasCircleFactory', 'CanvasImageFactory', 'CanvasSVGFactory', 'CanvasTextFactory',
    function ($scope, $q, math, gases, fluidos, calculos, GRAVEDAD, FPS, ESCALA_PX_MT, GotaFactory, CanvasContextService, CanvasUtils, CanvasRectFactory, CanvasCircleFactory, CanvasImageFactory, CanvasSVGFactory, CanvasTextFactory) {
        var OFFSET_EJE_X = 600; //posición, de arriba hacia abajo, del eje X en px dentro del canvas.

        var canvasContext = null,
            working = false;

        /* Elementos dinámicos del canvas */
        var base = CanvasSVGFactory(),
            tanque = CanvasSVGFactory(),
            tapa = CanvasSVGFactory(),
            agua = CanvasRectFactory({
                fillStyle: 'rgba(0, 0, 255, .5)'
            }),
            info = CanvasTextFactory({
                x: 790,
                y: 10,
                text: 'Detenido',
                font: "bold large sans-serif",
                fillStyle: 'red',
                align: 'right',
                baseline: 'top'
            });

        var valoresCalculo = {},
            fnCalculador = function () {};

        $scope.FPS = FPS;

        $scope.tanque = {
            altura: 2,
            diametro: 2,
            nivel: 50, // porcentaje: 0 a 100
            tapa: false,
            gas: null,
            alturaPlataforma: 3.6,
            orificio: {
                ubicacion: 'LATERAL',
                diametro: 0,
                altura: 0,
                largo: 0,
                angulo: 0
            },
            fluido: null
        };

        $scope.loadingResources = true;

        /* INICIALIZACIÓN */
        function init() {
            $q.all({
                context: CanvasContextService.getInstance('canvasSimulador'),
                images: $q.all({
                    base: CanvasUtils.loadImageURL('img/base.svg'),
                    tanque: CanvasUtils.loadImageURL('img/tanque.svg'),
                    tapa: CanvasUtils.loadImageURL('img/tapa.svg')
                }),
                gasesResponse: gases(),
                fluidosResponse: fluidos()
            }).then(function (resources) {
                $scope.loadingResources = false;

                // init enums
                $scope.gases = resources.gasesResponse.data;
                $scope.fluidos = resources.fluidosResponse.data;
                if (!$scope.tanque.fluido) {
                    $scope.tanque.fluido = $scope.fluidos[0];
                }

                // init images
                angular.extend(base, {
                    image: resources.images.base,
                    width: resources.images.base.naturalWidth,
                    height: resources.images.base.naturalHeight
                });
                angular.extend(tanque, {
                    image: resources.images.tanque,
                    width: resources.images.tanque.naturalWidth,
                    height: resources.images.tanque.naturalHeight
                });
                agua.width = resources.images.tanque.naturalWidth;

                angular.extend(tapa, {
                    width: resources.images.tapa.naturalWidth,
                    height: resources.images.tapa.naturalHeight
                });
                $scope.$watch('tanque.tapa', function(newVal) {
                    tapa.image =  newVal ? resources.images.tapa : null;
                }, true);

                // init canvas
                window.ctx = canvasContext = resources.context;
                canvasContext.addElements([
                    base,
                    tanque,
                    tapa,
                    agua,
                    info
                ]);
                updateTanque();
            })
        }

        /* ACCIONES */
        function updateTanque() {
            base.scale.x = tanque.scale.x = agua.scale.x = tapa.scale.x = $scope.tanque.diametro * ESCALA_PX_MT / tanque.width;
            base.scale.y = $scope.tanque.alturaPlataforma * ESCALA_PX_MT / base.height;
            base.y = OFFSET_EJE_X - base.height * base.scale.y / 2;
            tanque.scale.y = $scope.tanque.altura * ESCALA_PX_MT / tanque.height;
            tanque.y = OFFSET_EJE_X - base.height * base.scale.y - tanque.height * tanque.scale.y / 2;
            tapa.y = OFFSET_EJE_X - base.height * base.scale.y - tanque.height * tanque.scale.y - tapa.height * tapa.scale.y / 2;
            canvasContext.frame();
        }

        function updateAgua (valoresCalculo) {
            agua.height = math.number(calculos.alturaTanquePX.eval({
                alturaFluido: valoresCalculo.alturaInicial,
                alturaTanque: $scope.tanque.altura,
                pixeles: tanque.height * tanque.scale.y
            }));
            agua.y = tanque.y + tanque.height * tanque.scale.y / 2 - agua.height / 2;
        }

        function update () {
            fnCalculador(valoresCalculo);
            updateAgua(valoresCalculo);

            if (agua.height > 1) {
                canvasContext.addElements(GotaFactory(
                    0, OFFSET_EJE_X, // en PX
                    $scope.tanque.diametro / 2, $scope.tanque.alturaPlataforma, // en MT
                    math.number(valoresCalculo.velocidadSalida),
                    $scope.tanque.orificio.angulo,
                    -GRAVEDAD
                ));
            }

            if (working) {
                canvasContext.frame(update);
            }
        }

        window.frame = update;

        $scope.updateTanque = updateTanque;

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

            canvasContext.frame(update);
        };

        init();
    }
]);
