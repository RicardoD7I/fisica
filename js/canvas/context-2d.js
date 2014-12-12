/**
 * Created by Maximiliano on 05/12/2014.
 */
"use strict";

/**
 * @typedef {(Rectangle|StyledText|MathFunction)} CanvasElement
 */

/**
 * Canvas2d class
 * @param {HTMLCanvasElement} canvas
 * @return {Canvas2d}
 * @constructor
 */
function Canvas2d(canvas) {
    var _context = canvas.getContext('2d');
    var _apiRequestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    /**
     * @class Canvas2d
     * @constructor
     */
    function Canvas2d() {
        /** @type {CanvasElement[]} */
        this.elements = [];
    }

    /**
     * Clears the canvas
     */
    Canvas2d.prototype.clear = function () {
        _context.clearRect(0, 0, canvas.width, canvas.height);
    };

    /**
     * Paints all added elements into the canvas, and then, calls the callback
     * @param {function} [callback]
     * @this Canvas2d
     */
    Canvas2d.prototype.frame = function (callback) {
        /** @type {CanvasElement[]} */
        var _elements = this.elements || [];
        var _callback = callback || function () {};
        var _clear = this.clear;

        _apiRequestAnimationFrame.call(window, function () {
            _clear();
            for (var i = 0; i < _elements.length; i++) {
                _elements[i].paint(_context);
            }
            _callback();
        });
    };

    return new Canvas2d();
}

