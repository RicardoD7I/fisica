"use strict";

angular.module('simulador').service('calculos', [
    function () {
        /* ESTADO TANQUE CON O SIN TAPA */
        var _calculoCaudal = math.compile("areaOrificio * velocidadSalida");
        var _calcularAltura = math.compile("((altura * baseTanque) - caudal / 60) / baseTanque");
        var _prevenirNegativos = math.compile("v < 0 ? 0 : v");

        /* ESTADO TANQUE SOLO CON TAPA */
        var _calculoPresionGas = math.compile("densidadGas * gravedad * alturaGas");
        var _calculoPresionSalida = math.compile("presionGas + densidadLiquido * gravedad * alturaInicial - 0.5 * densidadLiquido * square( velocidadSalida ) - densidadLiquido * gravedad * alturaTubo");
        var _calcularVelocidadConGas = math.compile("sqrt( (( 2 * ( presionGas - presionSalida ) ) / densidadLiquido) + 2 * gravedad * alturaInicial)");

        /* ESTADO TANQUE SIN SIN TAPA */
        var _calcularVelocidadSinGas = math.compile("sqrt( 2 *  gravedad * alturaInicial)");

        /* OTRAS FUNCIONES AUXILIARES */
        var _calculoArea = math.compile("( ( d / 2 ) ^ 2 ) * PI");
        var _calculoAlturaTanquePX = math.compile("alturaFluido / alturaTanque * pixeles");

        /* -------- */
        this.estadoTanque = {
            conTapa: function (valoresCalculo) {
                valoresCalculo.presionGas = _calculoPresionGas.eval(valoresCalculo);
                valoresCalculo.presionSalida = _calculoPresionSalida.eval(valoresCalculo);
                valoresCalculo.velocidadSalida = _calcularVelocidadConGas.eval(valoresCalculo);
                valoresCalculo.alturaInicial = _calcularAltura.eval({
                    altura: valoresCalculo.alturaInicial,
                    baseTanque: valoresCalculo.areaBaseTanque,
                    caudal: _calculoCaudal.eval(valoresCalculo)
                });
                valoresCalculo.alturaInicial = _prevenirNegativos.eval({v: valoresCalculo.alturaInicial});
            },

            sinTapa: function (valoresCalculo) {
                valoresCalculo.velocidadSalida = _calcularVelocidadSinGas.eval(valoresCalculo);
                valoresCalculo.alturaInicial = _calcularAltura.eval({
                    altura: valoresCalculo.alturaInicial,
                    baseTanque: valoresCalculo.areaBaseTanque,
                    caudal: _calculoCaudal.eval(valoresCalculo)
                });
                valoresCalculo.alturaInicial = _prevenirNegativos.eval({v: valoresCalculo.alturaInicial});
            }
        };
        this.area = _calculoArea;
        this.alturaTanquePX = _calculoAlturaTanquePX;
    }
]);