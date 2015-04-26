"use strict";

angular.module('simulador', ['ngAnimate', 'mgcrea.ngStrap', 'canvas'])
    .constant('GRAVEDAD', math.bignumber(9.8))
    .constant('FPS', 30) // 30 cuadros por segundo
    .constant('ESCALA_PX_MT', 100) // 100 px : 1 mt
    .constant('math', math)
    .config([
        'math',
        function (math) {
            math.config({number: 'bignumber'});
        }
    ]);
