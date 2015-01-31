/**
 * Created by Maximiliano on 29/01/2015.
 */
"use strict";

/**
 * Gota (o más bien, partícula) de agua
 * @param {number} origenX
 * @param {number} origenY
 * @param {number} xInicial
 * @param {number} yInicial
 * @param {number} longitudTubo
 * @param {number} anguloTubo
 * @param {number} velocidadInicial
 * @param {number} gravedad
 * @param {number} [escalaX]
 * @param {number} [escalaY]
 * @return {Gota}
 * @constructor
 */
function Gota(origenX, origenY, xInicial, yInicial, longitudTubo, anguloTubo, velocidadInicial, gravedad, escalaX, escalaY) {
    var x = xInicial,
        y = yInicial,
        recta = longitudTubo,
        velX = velocidadInicial * Math.cos(anguloTubo * (Math.PI / 180)),
        velY = velocidadInicial * Math.sin(anguloTubo * (Math.PI / 180));


    /**
     * @class Gota
     * @constructor
     */
    function Gota() {
        /** @type {number} */
        this.escalaX = escalaX || 10;

        /** @type {number} */
        this.escalaY = escalaY || 10;
    }

    /**
     * Dibuja un punto azul que representa una partícula de agua en el canvas,
     * luego actualiza su posición para la siguiente iteración
     * @param {CanvasRenderingContext2D} context
     */
    Gota.prototype.paint = function (context) {
        if (x > 0 && y > 0) {
            var nuevaPos = posFinal(x, y, velX, velY, 0, (recta > 0) ? 0 : gravedad, 1 / 60);
            var nuevaVel = velFinal(velX, velY, 0, gravedad, 1 / 60);
            x = nuevaPos.x;
            y = nuevaPos.y;
            velX = nuevaVel.x;
            velY = nuevaVel.y;
        }

        context.save();
        context.translate(origenX, origenY);
        context.fillStyle = 'rgba(0, 0, 255, .5)';
        context.beginPath();
        context.arc(x, -y, 2, 0, 2 * Math.PI, true);
        context.fill();
        context.restore();
    };

    return new Gota();
}
