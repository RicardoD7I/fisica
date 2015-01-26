    var GRAVEDAD = 9.8;

    var valoresCalculo = {

        gravedad: GRAVEDAD,
        /*
         Datos gas
         */
        densidadGas: 0,
        alturaGas: 0,

        /*
         Datos Liquido
         */
        densidadLiquido: 0,
        alturaInicial: 0,
        presion: 0,

        /*
        Datos Tanque
        */
        areaOrificio: 0,
        alturaTubo: 0,
        areaBaseTanque: 0,

        /*
        Salida
         */
        velocidadSalida: 0

    };

    /**
     * Velocidad final
     * @param {number} vx velocidad inicial horizontal
     * @param {number} vy velocidad inicial vertical
     * @param {number} ax  aceleración horizontal
     * @param {number} ay  aceleración vertical
     * @param {number} t tiempo
     * @return {{x: number, y: number}}
     */
    function velFinal(vx, vy, ax, ay, t) {
        return {
            x: vx + ax * t,
            y: vy + ay * t
        };
    }

    /**
     * Movimiento parabólico
     * @param {number} x posición horizontal inicial
     * @param {number} y posición vertical inicial
     * @param {number} vx velocidad horizontal inicial
     * @param {number} vy velocidad vertical inicial
     * @param {number} ax aceleración horizontal
     * @param {number} ay aceleración vertical
     * @param {number} t tiempo
     * @return {{x: number, y: number}}
     */
    function posFinal(x, y, vx, vy, ax, ay, t) {
        return {
            x: x + vx * t + .5 * ax * Math.pow(t, 2),
            y: y + vy * t + .5 * ay * Math.pow(t, 2)
        }
    }

    /*
     * Calculamos la velocidad de salida del orificio
     *
     * Calculamos el caudal
     *
     * Ya sabiendo sacamos: Volumen de liquido que se reduce para la proxima ejecucion y calculamos las nuevas alturas para la proxima ejecucion
     *
     * */
    function calculosTanque(valoresCalculo) {
    	//var altura = valoresEntrada.alturaInicial;
    	//var velocidad = valoresEntrada.velocidad;

        //valoresCalculo.velocidad =

    }

    function velocidadSalidaTanqueConTapa(valoresCalculo){

        var calculoPresionGas = math.compile("densidadGas * gravedad * alturaGas");
        valoresCalculo.presionGas = calculoPresionGas.eval(valoresCalculo).toNumber();

        var calculoPresionSalida = math.compile("presionGas + densidadLiquido * gravedad * alturaInicial - 0.5 * densidadLiquido * square( velocidadSalida ) - densidadLiquido * gravedad * alturaTubo");
        valoresCalculo.presionSalida = calcularPresionSalida.eval(valoresCalculo).toNumber();

        var calcularVelocidad = math.compile("sqrt( (( 2 * ( presionGas - presionSalida ) ) / densidadLiquido) + 2 * gravedad * alturaInicial)");
        valoresCalculo.velocidad = calcularVelocidad.eval(valoresCalculo).toNumber();

        var calculoCaudal = math.compile("areaOrificio * velocidad");
        var caudal = calculoCaudal.eval(valoresCalculo).toNumber();

        var volumenARestar = caudal / 60;

    }

    function velocidadSalidaTanqueSinTapa(valoresCalculo){

        var calcularVelocidad = math.compile("sqrt( 2 *  gravedad * alturaInicial)");
        valoresCalculo.velocidad = calcularVelocidad.eval(valoresCalculo).toNumber();

    }