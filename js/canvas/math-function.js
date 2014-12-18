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
 * Point
 * @typedef {{}} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * MathFunction Class
 * @param {number} originX sets the origin of the coordinate axis.
 * @param {number} originY sets the origin of the coordinate axis.
 * @param {function} fn mathematical function to be graphed.
 * @param {number} from initial value of the range of values for x to graph the mathematical function.
 * @param {number} to end value of the range of values for x to graph the mathematical function.
 * @param {number} [step] increment that will be used to iterate the range of values for x, default is 1.
 * @param {number} [scaleX] horizontal scaling for plotting
 * @param {number} [scaleY] vertical scaling for plotting
 * @param {number} [lineWidth] line width
 * @param {CSSStyleDeclaration.color|string} [color] line style
 * @return {MathFunction}
 * @constructor
 */
function MathFunction(originX, originY, fn, from, to, step, scaleX, scaleY, lineWidth, color) {
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

        /** @type {CSSStyleDeclaration.color|string} */
        this.color = color;
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
        if (this.color) context.strokeStyle = this.color;
        context.lineCap = 'round';
        context.beginPath();
        for (var x = this.from; x <= this.to; x += _resolution) {
            var result = this.fn(x);
            context.lineTo((result.x || x) * (this.scaleX || 10), (-(result.y || result || 0))*(this.scaleY || 10));
        }
        context.stroke();
        context.restore();
    };

    return new MathFunction();
}
