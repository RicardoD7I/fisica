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
        return function (origenXpx, origenYpx, xInicialMt, yInicialMt, velocidadInicial, anguloTubo, gravedad, maxDistanceCallback, progressionDistanceCallback) {
            var x = xInicialMt,
                y = yInicialMt,
                velX0 = velocidadInicial * Math.cos(anguloTubo * (Math.PI / 180)),
                velY0 = velocidadInicial * Math.sin(anguloTubo * (Math.PI / 180)),
                velX = velX0,
                velY = velY0,
                deltaTiempo = 1 / FPS;

            var circle = CanvasCircleFactory({
                x: origenXpx + x * ESCALA_PX_MT,
                y: origenYpx - y * ESCALA_PX_MT,
                radius: 2,
                fillStyle: 'rgba(0, 0, 255, .5)'
            });

            var _instance = {
                isMoving: true,
                getX : function () {
                    return x;
                },
                paint: paintAndUpdate
            };

            return _instance;

            function paintAndUpdate (context) {
                circle.paint(context);
                x = _posicionFinal(x, velX, 0, deltaTiempo);
                y = _posicionFinal(y, velY, gravedad, deltaTiempo);
                if (y < 0) {
                    y = 0;
                    x = _posicionFinal(xInicialMt, velX0, 0, _tiempoFinal(yInicialMt, velY0, gravedad));
                    _instance.paint = circle.paint;
                    _instance.isMoving = false;
                    maxDistanceCallback(x - xInicialMt);
                    progressionDistanceCallback(x - xInicialMt);
                }
                velX = _velocidadFinal(velX, 0, deltaTiempo);
                velY = _velocidadFinal(velY, gravedad, deltaTiempo);
                circle.x = origenXpx + x * ESCALA_PX_MT;
                circle.y = origenYpx - y * ESCALA_PX_MT;
            }

            function _posicionFinal(posicionInicial, velocidadInicial, aceleracion, tiempo) {
                return posicionInicial + (velocidadInicial * tiempo) + (.5 * aceleracion * Math.pow(tiempo, 2));
            }

            function _velocidadFinal(velocidad, aceleracion, tiempo) {
                return velocidad + aceleracion * tiempo;
            }

            function _tiempoFinal (posicionInicial, velocidadInicial, aceleracion) {
                return Math.max(
                    (-velocidadInicial - Math.sqrt(Math.pow(velocidadInicial, 2) - 2 * aceleracion * posicionInicial)) / aceleracion,
                    (-velocidadInicial + Math.sqrt(Math.pow(velocidadInicial, 2) - 2 * aceleracion * posicionInicial)) / aceleracion
                );
            }
        }
    }
]);
