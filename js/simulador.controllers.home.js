"use strict";

/* ### CONTROLADOR DE INICIAL ### */
angular.module('simulador').controller('homeController', [
    '$scope', '$q', 'math', 'fluidos', 'calculos', 'GRAVEDAD', 'PRESION_ATMOSFERICA', 'FPS', 'ESCALA_PX_MT', 'GotaFactory', 'CanvasContextService', 'CanvasUtils', 'CanvasRectFactory', 'CanvasImageFactory', 'CanvasSVGFactory', 'CanvasTextFactory',
    function ($scope, $q, math, fluidos, calculos, GRAVEDAD, PRESION_ATMOSFERICA, FPS, ESCALA_PX_MT, GotaFactory, CanvasContextService, CanvasUtils, CanvasRectFactory, CanvasImageFactory, CanvasSVGFactory, CanvasTextFactory) {
        var OFFSET_EJE_X = 600; //posición, de arriba hacia abajo, del eje X en px dentro del canvas.

        var canvasContext = null, /* Elementos dinámicos del canvas */
            ejeX = CanvasRectFactory({
                y: OFFSET_EJE_X + 2,
                height: 4,
                fillStyle: '#FFFFFF'
            }),
            labelsEjeX = [],
            base = CanvasSVGFactory(),
            tanque = CanvasSVGFactory(),
            tapa = CanvasSVGFactory(),
            agua = CanvasRectFactory({
                fillStyle: 'rgba(0, 0, 255, .75)'
            }),
            basicElements = [ejeX, base, tanque, tapa, agua],
            status = angular.element('#status')[0],
            ultimaGota,
            velocidadMaxima = null,
            distanciaMaxima = null,
            velocidadActual = null,
            distanciaActual = null;

        var valoresCalculo = {},
            fnCalculador = angular.noop;

        var timer = function () {
            var _startTime,
                _interval = null,
                outputTiempo = angular.element('#tiempo')[0],
                outputNivel = angular.element('#nivel')[0],
                outputVelMax = angular.element('#velMax')[0],
                outputDistMax = angular.element('#distMax')[0],
                outputVelAct = angular.element('#velAct')[0],
                outputDistAct = angular.element('#distAct')[0],
                timer;

            function updateOutput(statusMessage) {
                status.textContent = statusMessage;
                outputTiempo.textContent = (Date.now() - _startTime) / 1000;
                outputNivel.textContent = calculos.truncate(valoresCalculo.alturaInicial / $scope.tanque.altura * 100, 3);
                outputVelMax.textContent = calculos.truncate(velocidadMaxima || valoresCalculo.velocidadSalida, 3);
                outputDistMax.textContent = calculos.truncate(distanciaMaxima || distanciaActual, 3);
                outputVelAct.textContent = calculos.truncate(math.number(valoresCalculo.velocidadSalida), 3);
                outputDistAct.textContent = calculos.truncate(distanciaActual || 0, 3);
            }

            return timer = {
                start: function () {
                    _startTime = Date.now();
                    status.textContent = 'Simulando...';
                    outputTiempo.textContent = outputNivel.textContent =
                        outputVelMax.textContent = outputDistMax.textContent =
                            outputVelAct.textContent = outputDistAct.textContent = 0;

                    _interval = setInterval(function () {
                        updateOutput('Simulando...');
                    }, 1000);
                    return timer;
                },
                stop: function () {
                    !!_interval && clearInterval(_interval);
                    updateOutput('Detenido');
                    return timer;
                },
                reset: function () {
                    !_interval && (status.textContent = 'Detenido');
                    return timer;
                }
            }
        }();

        $scope.FPS = FPS;

        $scope.tanque = {
            altura: 2, // en Metros
            diametro: 2, // en Metros
            nivel: 50, // porcentaje: 0 a 100
            tapa: false,
            presionGas: PRESION_ATMOSFERICA, // en Pascales
            alturaPlataforma: 3.6, // en Metros
            orificio: {
                ubicacion: 'LATERAL',
                diametro: 30, // en CM
                altura: 0, // en Metros
                angulo: 0
            },
            fluido: null
        };

        $scope.loadingResources = true;

        /* INICIALIZACIÓN */
        function init() {
            $scope.working = false;

            $q.all({
                context: CanvasContextService.getInstance('canvasSimulador'),
                images: $q.all({
                    base: CanvasUtils.loadImageURL('img/base.svg'),
                    tanque: CanvasUtils.loadImageURL('img/tanque.svg'),
                    tapa: CanvasUtils.loadImageURL('img/tapa.svg')
                }),
                fluidosResponse: fluidos()
            }).then(function (resources) {
                // init enums
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
                canvasContext = resources.context;
                canvasContext.addElements(basicElements);
                updateTanque();
                $scope.loadingResources = false;
                status.textContent = 'Detenido';
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
            updateViewportAndAxis();
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

        function updateViewportAndAxis () {
            var alturaTotal = Math.ceil($scope.tanque.alturaPlataforma + $scope.tanque.altura + (tapa.height / ESCALA_PX_MT)) * ESCALA_PX_MT,
                radioTanque = Math.ceil($scope.tanque.diametro / 2) * ESCALA_PX_MT,
                distanciaTotal = Math.ceil($scope.tanque.diametro + (distanciaMaxima || 0)) * ESCALA_PX_MT,
                scale = Math.min(600 / alturaTotal, 800 / distanciaTotal);
            ejeX.x = distanciaTotal / 2 + radioTanque;
            ejeX.width = distanciaTotal;
            for(var i = labelsEjeX.length; i * 100 < distanciaTotal; i++) {
                var label = new CanvasTextFactory({
                    x: i * 100 + radioTanque + 4,
                    y: OFFSET_EJE_X + 2,
                    text: i + 'm |',
                    font: "bold large sans-serif",
                    fillStyle: '#FFFFFF',
                    align: 'right',
                    baseline: 'top'
                });
                labelsEjeX.push(label);
                canvasContext.addElements(label);
            }
            canvasContext.setScale(scale);
            canvasContext.setPosition({ x: -(radioTanque + 50) * scale, y: (OFFSET_EJE_X - 600 / scale + 20) * scale});
        }

        function update () {
            fnCalculador(valoresCalculo);

            if (valoresCalculo.alturaInicial > valoresCalculo.alturaTubo) {
                updateAgua(valoresCalculo);
                canvasContext.addElements(ultimaGota = GotaFactory(
                    0, OFFSET_EJE_X, // en PX
                    valoresCalculo.salidaGota.x, valoresCalculo.salidaGota.y, // en Metros
                    valoresCalculo.velocidadSalida,
                    $scope.tanque.orificio.angulo,
                    -GRAVEDAD,
                    function (maxDistance) {
                        distanciaMaxima = distanciaMaxima || maxDistance;
                    },
                    function (currentDistance) {
                        distanciaActual = currentDistance;
                    }
                ));
                velocidadMaxima = velocidadMaxima || math.number(valoresCalculo.velocidadSalida);
                updateViewportAndAxis();
            } else {
                fnCalculador = angular.noop;
            }
            $scope.working = $scope.working && ultimaGota.isMoving; //detenido por fuera o porque se terminó de mover la última gota

            if ($scope.working) {
                canvasContext.frame(update);
            } else {
                timer.stop();
                canvasContext.frame();
            }
        }

        $scope.updateTanque = updateTanque;

        $scope.startSimulation = function () {
            $scope.working = true;
            velocidadMaxima = null;
            velocidadMaxima = null;
            distanciaMaxima = null;
            velocidadActual = null;
            distanciaActual = null;

            labelsEjeX.splice(0, labelsEjeX.length);  // empty array
            canvasContext.getElements().splice(0, canvasContext.getElements().length); // empty array
            canvasContext.addElements(basicElements);
            timer.reset().start();

            valoresCalculo = {
                gravedad: GRAVEDAD,

                /*Datos gas*/
                presionGas: $scope.tanque.tapa ? $scope.tanque.presionGas : PRESION_ATMOSFERICA,

                /*Datos Liquido*/
                densidadLiquido: $scope.tanque.fluido.densidad,
                alturaInicial: math.eval($scope.tanque.altura + ' * ' + $scope.tanque.nivel + ' / 100'), //alturaInicial se refiere a la altura del liquido desde el fondo del tanque hasta el pelo de agua
                presionSalida: PRESION_ATMOSFERICA,

                /*Datos Tanque*/
                areaOrificio: calculos.area.eval({d: math.unit($scope.tanque.orificio.diametro, 'cm').toNumber('m') }),
                alturaTubo: ($scope.tanque.orificio.ubicacion == 'LATERAL') ? $scope.tanque.orificio.altura : 0,
                areaBaseTanque: calculos.area.eval({d: parseFloat($scope.tanque.diametro)}),

                /*Salida*/
                velocidadSalida: 0,
                salidaGota: {
                    x: ($scope.tanque.orificio.ubicacion == 'LATERAL') ? $scope.tanque.diametro / 2 : 0,
                    y: $scope.tanque.alturaPlataforma + $scope.tanque.orificio.altura
                }
            };

            updateAgua(valoresCalculo);

            fnCalculador = $scope.tanque.tapa ?  calculos.estadoTanque.conTapa : calculos.estadoTanque.sinTapa;

            canvasContext.frame(update);
        };

        $scope.stopSimulation = function () {
            $scope.working = false;
        };

        init();
    }
]);
