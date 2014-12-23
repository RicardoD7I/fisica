    var GRAVEDAD = 9.8;

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