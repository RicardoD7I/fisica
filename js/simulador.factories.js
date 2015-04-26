"use strict";

angular.module('simulador').factory('gases', [
    '$http',
    function($http) {
        return function () {
            return $http.get('json/gases.json');
        };
    }
]);

angular.module('simulador').factory('fluidos', [
    '$http',
    function($http) {
        return function () {
            return $http.get('json/fluidos.json');
        };
    }
]);

angular.module('simulador').factory('GotaFactory', [
    'CanvasCircleFactory', 'calculos', 'math', 'FPS', 'ESCALA_PX_MT',
    function (CanvasCircleFactory, calculos, math, FPS, ESCALA_PX_MT) {
        return function (origenXpx, origenYpx, xInicialMt, yInicialMt, velocidadInicial, anguloTubo, gravedad) {
            var x = xInicialMt,
                y = yInicialMt,
                velX = math.eval('vel * cos(theta * (PI / 180))', {
                    vel: velocidadInicial,
                    theta: anguloTubo
                }),
                velY = math.eval('vel * sin(theta * (PI / 180))', {
                    vel: velocidadInicial,
                    theta: anguloTubo
                }),
                deltaTiempo = math.eval('1 / ' + FPS);

            var circle = CanvasCircleFactory({
                x: origenXpx + x * ESCALA_PX_MT,
                y: origenYpx - y * ESCALA_PX_MT,
                radius: 2,
                fillStyle: 'rgba(0, 0, 255, .75)'
            });

            return {
                paint: function (context) {
                    circle.paint(context);
                    update();
                }
            };

            function update () {
                if (y > 0) {
                    x = calculos.posicionFinal.eval({
                        posicionInicial: x,
                        velocidadInicial: velX,
                        aceleracion: 0,
                        tiempo: deltaTiempo
                    });
                    y = calculos.posicionFinal.eval({
                        posicionInicial: y,
                        velocidadInicial: velY,
                        aceleracion: gravedad,
                        tiempo: deltaTiempo
                    });
                    velX = calculos.velocidadFinal.eval({
                        velocidadInicial: velX,
                        aceleracion: 0,
                        tiempo: deltaTiempo
                    });
                    velY = calculos.velocidadFinal.eval({
                        velocidadInicial: velY,
                        aceleracion: gravedad,
                        tiempo: deltaTiempo
                    });
                    if (math.number(y) < 0) {
                        y = 0;
                        // TODO: al ubicar Y en 0, ubicar X en donde corresponde.
                    }
                    circle.x = origenXpx + math.number(x) * ESCALA_PX_MT;
                    circle.y = origenYpx - math.number(y) * ESCALA_PX_MT;
                }
            }
        }
    }
]);
