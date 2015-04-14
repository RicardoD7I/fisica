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
    'CanvasCircleFactory',
    function (CanvasCircleFactory) {
        return function (origenX, origenY, xInicial, yInicial, longitudTubo, anguloTubo, velocidadInicial, gravedad) {
            var x = xInicial,
                y = yInicial,
                recta = longitudTubo,
                velX = velocidadInicial * Math.cos(anguloTubo * (Math.PI / 180)),
                velY = velocidadInicial * Math.sin(anguloTubo * (Math.PI / 180));


            var circle = CanvasCircleFactory({
                radius: 2,
                fillStyle: 'rgba(0, 0, 255, .5)'
            });

            function _posFinal(x, y, vx, vy, ax, ay, t) {
                return {
                    x: x + vx * t + .5 * ax * Math.pow(t, 2),
                    y: y + vy * t + .5 * ay * Math.pow(t, 2)
                }
            }

            function _velFinal(vx, vy, ax, ay, t) {
                return {
                    x: vx + ax * t,
                    y: vy + ay * t
                };
            }

            function update () {
                if (x > 0 && y > 0) {
                    var nuevaPos = _posFinal(x, y, velX, velY, 0, (recta > 0) ? 0 : gravedad, 1 / 60);
                    var nuevaVel = _velFinal(velX, velY, 0, gravedad, 1 / 60);
                    x = nuevaPos.x;
                    y = nuevaPos.y;
                    velX = nuevaVel.x;
                    velY = nuevaVel.y;
                    circle.x = origenX + x;
                    circle.y = origenY - y;
                }
            }

            return {
                paint: function (context) {
                    update();
                    circle.paint(context);
                }
            };
        }
    }
]);
