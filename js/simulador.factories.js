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
    'CanvasCircleFactory', 'FPS', 'ESCALA_PX_MT',
    function (CanvasCircleFactory, FPS, ESCALA_PX_MT) {
        return function (origenXpx, origenYpx, xInicialMt, yInicialMt, velocidadInicial, anguloTubo, gravedad) {
            var x = xInicialMt,
                y = yInicialMt,
                velX = velocidadInicial * Math.cos(anguloTubo * (Math.PI / 180)),
                velY = velocidadInicial * Math.sin(anguloTubo * (Math.PI / 180)),
                deltaTiempo = 1 / FPS;

            var circle = CanvasCircleFactory({
                x: origenXpx + x * ESCALA_PX_MT,
                y: origenYpx - y * ESCALA_PX_MT,
                radius: 2,
                fillStyle: 'rgba(0, 0, 255, .5)'
            });

            return {
                paint: function (context) {
                    circle.paint(context);
                    update();
                }
            };

            function _posicionFinal(posicionInicial, velocidadInicial, aceleracion, tiempo) {
                return posicionInicial + velocidadInicial * tiempo + .5 * aceleracion * Math.pow(tiempo, 2);
            }

            function _velocidadFinal(velocidadInicial, aceleracion, tiempo) {
                return velocidadInicial + aceleracion * tiempo;
            }

            function update () {
                if (y > 0) {
                    x = _posicionFinal(x, velX, 0, deltaTiempo);
                    y = _posicionFinal(y, velY, gravedad, deltaTiempo);
                    if (y < 0) {
                        y = 0;
                        // TODO: al ubicar Y en 0, ubicar X en donde corresponde.
                    }
                    velX = _velocidadFinal(velX, 0, deltaTiempo);
                    velY = _velocidadFinal(velY, gravedad, deltaTiempo);
                    circle.x = origenXpx + x * ESCALA_PX_MT;
                    circle.y = origenYpx - y * ESCALA_PX_MT;
                }
            }
        }
    }
]);
