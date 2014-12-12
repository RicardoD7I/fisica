/**
 * Created by mstranich on 27/11/2014.
 */
"use strict";

/**
 * Range of numbers
 * @typedef {{}} Range
 * @property {number} from
 * @property {number} to
 */


/**
 * MathFunction Class
 * @param {number} originX sets the origin of the coordinate axis.
 * @param {number} originY sets the origin of the coordinate axis.
 * @param {function} fn mathematical function to be graphed.
 * @param {number} from initial value of the range of values for x to graph the mathematical function.
 * @param {number} to end value of the range of values for x to graph the mathematical function.
 * @param {number} [step] increment that will be used to iterate the range of values for x, default is 1.
 * @param {number} [scaleX]
 * @param {number} [scaleY]
 * @param {CSSStyleDeclaration.stroke} [strokeStyle]
 * @param {number} [lineWidth]
 * @return {MathFunction}
 * @constructor
 */
function MathFunction(originX, originY, fn, from, to, step, scaleX, scaleY, lineWidth, strokeStyle) {
    /**
     * @class MathFunction
     * @constructor
     */
    function MathFunction() {

        /** @type {number} */
        this.originX = originX;

        /** @type {number} */
        this.originY = originY;

        /** @type {Function} */
        this.fn = fn;

        /** @type {number} */
        this.from = from;

        /** @type {number} */
        this.to = to;

        /** @type {number} */
        this.resolution = step;

        /** @type {number} */
        this.scaleX = scaleX;

        /** @type {number} */
        this.scaleY = scaleY;

        /** @type {number} */
        this.lineWidth = lineWidth;

        /** @type {CSSStyleDeclaration.color} */
        this.strokeStyle = strokeStyle;
    }

    /**
     * Draws a mathematical function on specified canvas' context
     * @param {CanvasRenderingContext2D} context
     */
    MathFunction.prototype.paint = function (context) {
        var _resolution = Math.abs(this.resolution || 1);

        context.save();
        context.translate(this.originX, this.originY);
        if (this.lineWidth) context.lineWidth = this.lineWidth;
        if (this.strokeStyle) context.strokeStyle = this.strokeStyle;
        context.beginPath();
        for (var x = this.from; x <= this.to; x += _resolution) {
            context.lineTo(x * (this.scaleX || 10), (-this.fn(x))*(this.scaleY || 10));
        }
        context.stroke();
        context.restore();
    };

    return new MathFunction();
}
