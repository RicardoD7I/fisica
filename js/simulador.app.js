"use strict";

angular.module('simulador', ['ngAnimate', 'mgcrea.ngStrap', 'canvas'])
    .constant('GRAVEDAD', 9.8)
    .value('math', math)
    .config([
        function () {
            math.config({number: 'bignumber'});
        }
    ]);
