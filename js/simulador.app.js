/**
 * Created by Maximiliano on 03/01/2015.
 */
"use strict";

angular.module('simulador', ['ngAnimate', 'mgcrea.ngStrap'])
    .constant('GRAVEDAD', 9.8)
    .config([
        function () {
            mathjs.config({number: 'bignumber'});
        }
    ]);
