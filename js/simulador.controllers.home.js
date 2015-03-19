/**
 * Created by Maximiliano on 04/01/2015.
 */
"use strict";

/* ### CONTROLADOR DE INICIAL ### */
angular.module('simulador').controller('homeController', [
    '$scope', 'gases', 'fluidos', 'calculos', 'GRAVEDAD',
    function ($scope, gases, fluidos, calculos, GRAVEDAD) {
        var ALTURA_TANQUE_PX = 100, // 100px de altura máxima
            POS_PELO_AGUA_PX = 260;

        var canvas = null,
            working = false;

        /* Elementos dinámicos del canvas */
        var agua = new Rectangle(55, POS_PELO_AGUA_PX, 130, ALTURA_TANQUE_PX, 'rgba(0, 0, 255, .5'),
            info = new StyledText("", 790, 10, "bold large sans-serif", 'red', 'right', 'top');

        var tanqueImg = null;

        var valoresCalculo = {},
            fnCalculador = function () {};

        /* INICIALIZACIÓN */
        function init() {

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

            tanqueImg = new Rectangle(0, 237, 240, 363, 'transparent', 'img/tanque.png');

            $scope.elements = [
                new Rectangle(0, 0, 800, 600, 'white', 'img/fondo2.png'),
                tanqueImg,
                new StyledText("Simulador", 10, 10, "bold large sans-serif", 'red', 'left', 'top'),
                agua,
                info
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

        $scope.$watch('tanque.tapa', function(newVal, oldVal) {
            tanqueImg.image.src =  newVal ? "img/tanque_abierto.png" : "img/tanque.png"
        }, true);

        /* ACCIONES */
        function updateAgua (valoresCalculo) {
            var calculoAltura = math.compile("alturaFluido / alturaTanque * pixeles");
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

            if (working) {
                canvas.frame(update);
            }
        }

        $scope.initCallback = function (canvas2d) {
            canvas = canvas2d;
        };


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

            canvas.frame(update);
        };

        init();
    }
]);
