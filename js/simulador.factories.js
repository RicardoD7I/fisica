"use strict";

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

            var _instance = {
                isMoving: true,
                paint: paintAndUpdate
            };

            return _instance;

            function paintAndUpdate (context) {
                circle.paint(context);
                x = _posicionFinal(x, velX, 0, deltaTiempo);
                y = _posicionFinal(y, velY, gravedad, deltaTiempo);
                if (y < 0) {
                    y = 0; // TODO: al ubicar Y en 0, ubicar X en donde corresponde.
                    _instance.paint = circle.paint;
                    _instance.isMoving = false;
                }
                velX = _velocidadFinal(velX, 0, deltaTiempo);
                velY = _velocidadFinal(velY, gravedad, deltaTiempo);
                circle.x = origenXpx + x * ESCALA_PX_MT;
                circle.y = origenYpx - y * ESCALA_PX_MT;
            }

            function _posicionFinal(posicionInicial, velocidad, aceleracion, tiempo) {
                return posicionInicial + (velocidad * tiempo) + (.5 * aceleracion * Math.pow(tiempo, 2));
            }

            function _velocidadFinal(velocidad, aceleracion, tiempo) {
                return velocidad + aceleracion * tiempo;
            }
        }
    }
]);
