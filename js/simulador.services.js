"use strict";

angular.module('simulador').service('calculos', [
    'math', 'FPS',
    function (math, FPS) {
        /* ESTADO TANQUE CON O SIN TAPA */
        var _calculoCaudal = math.compile("areaOrificio * velocidadSalida"),
            _calcularAltura = math.compile("((altura * baseTanque) - caudal / " + FPS + ") / baseTanque");

        /* ESTADO TANQUE SOLO CON TAPA */
        var _calculoPresionGas = math.compile("densidadGas * gravedad * alturaGas"),// TODO: candidato a remover
            _calcularVelocidadConGas = math.compile("sqrt(((2 * (presionGas - presionSalida)) / densidadLiquido) + 2 * gravedad * (alturaInicial - alturaTubo))");

        /* ESTADO TANQUE SIN SIN TAPA */
        var _calcularVelocidadSinGas = math.compile("sqrt(2 *  gravedad * (alturaInicial - alturaTubo))");

        /* OTRAS FUNCIONES AUXILIARES */
        var _calculoArea = math.compile("((d / 2) ^ 2) * PI"),
            _calculoAlturaTanquePX = math.compile("alturaFluido / alturaTanque * pixeles");

        /* -------- */
        this.estadoTanque = {
            conTapa: function (valoresCalculo) {
                valoresCalculo.velocidadSalida = _calcularVelocidadConGas.eval(valoresCalculo);
                valoresCalculo.alturaInicial = _calcularAltura.eval({
                    altura: valoresCalculo.alturaInicial,
                    baseTanque: valoresCalculo.areaBaseTanque,
                    caudal: _calculoCaudal.eval(valoresCalculo)
                });
            },

            sinTapa: function (valoresCalculo) {
                valoresCalculo.velocidadSalida = _calcularVelocidadSinGas.eval(valoresCalculo);
                valoresCalculo.alturaInicial = _calcularAltura.eval({
                    altura: valoresCalculo.alturaInicial,
                    baseTanque: valoresCalculo.areaBaseTanque,
                    caudal: _calculoCaudal.eval(valoresCalculo)
                });
            }
        };
        this.area = _calculoArea;
        this.alturaTanquePX = _calculoAlturaTanquePX;
    }
]);