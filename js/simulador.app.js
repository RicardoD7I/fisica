/**
 * Created by Maximiliano on 03/01/2015.
 */
"use strict";

angular.module('simulador', ['ngAnimate', 'mgcrea.ngStrap']);

angular.module('simulador').config([function () {
    mathjs.config({ number: 'bignumber' });
}]);
