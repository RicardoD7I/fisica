"use strict";

angular.module('simulador').service('calculos', [
    'math', 'FPS',
    function (math, FPS) {
        /* ESTADO TANQUE CON O SIN TAPA */
        var _calculoCaudal = math.compile("areaOrificio * velocidadSalida"),
            _calcularAltura = math.compile("((altura * baseTanque) - caudal / " + FPS + ") / baseTanque");

        /* ESTADO TANQUE SOLO CON TAPA */
        var _calcularVelocidadConGas = math.compile("sqrt(((2 * (presionGas - presionSalida)) / densidadLiquido) + 2 * gravedad * (alturaInicial - alturaTubo))"),
            _evaluarGoteoConGas = math.compile('(presionGas + densidad * gravedad * (alturaLiquido - alturaTubo) - presionSalida) <= (coeficiente / diametro / 2)');

        /* ESTADO TANQUE SIN SIN TAPA */
        var _calcularVelocidadSinGas = math.compile("sqrt(2 *  gravedad * (alturaInicial - alturaTubo))"),
            _evaluarGoteoSinGas = math.compile('(densidad * gravedad * (alturaLiquido - alturaTubo)) <= (coeficiente / diametro / 2)');

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
                valoresCalculo.goteo = _evaluarGoteoConGas.eval({
                    presionGas: valoresCalculo.presionGas,
                    densidad: valoresCalculo.densidadLiquido,
                    gravedad: valoresCalculo.gravedad,
                    alturaLiquido: valoresCalculo.alturaInicial,
                    alturaTubo: valoresCalculo.alturaTubo,
                    presionSalida: valoresCalculo.presionSalida,
                    coeficiente: valoresCalculo.coeficienteTensionSuperficial,
                    diametro: valoresCalculo.diametroTanque
                });
                if (valoresCalculo.alturaInicial < valoresCalculo.alturaTubo) {
                    valoresCalculo.alturaInicial = valoresCalculo.alturaTubo;
                }
            },

            sinTapa: function (valoresCalculo) {
                valoresCalculo.velocidadSalida = _calcularVelocidadSinGas.eval(valoresCalculo);
                valoresCalculo.alturaInicial = _calcularAltura.eval({
                    altura: valoresCalculo.alturaInicial,
                    baseTanque: valoresCalculo.areaBaseTanque,
                    caudal: _calculoCaudal.eval(valoresCalculo)
                });
                valoresCalculo.goteo = _evaluarGoteoSinGas.eval({
                    presionGas: valoresCalculo.presionGas,
                    densidad: valoresCalculo.densidadLiquido,
                    gravedad: valoresCalculo.gravedad,
                    alturaLiquido: valoresCalculo.alturaInicial,
                    alturaTubo: valoresCalculo.alturaTubo,
                    presionSalida: valoresCalculo.presionSalida,
                    coeficiente: valoresCalculo.coeficienteTensionSuperficial,
                    diametro: valoresCalculo.diametroTanque
                });
                if (valoresCalculo.alturaInicial < valoresCalculo.alturaTubo) {
                    valoresCalculo.alturaInicial = valoresCalculo.alturaTubo;
                }
            }
        };
        this.area = _calculoArea;
        this.alturaTanquePX = _calculoAlturaTanquePX;
        this.truncate = function (value, nDecimals) {
            var base = Math.pow(10, nDecimals);
            return Math.floor(value * base) / base;
        }
    }
]);