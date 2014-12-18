/**
 * Created by Maximiliano on 05/12/2014.
 */
"use strict";

/**
 * Styled text for canvas
 * @param {string} text
 * @param {number} [x]
 * @param {number} [y]
 * @param {CSSStyleDeclaration.font|string} [font]
 * @param {CSSStyleDeclaration.color|string} [color]
 * @param {CSSStyleDeclaration.textAlign|string} [align]
 * @param {CSSStyleDeclaration.baseline|string} [baseline]
 * @return {StyledText}
 * @constructor
 */
function StyledText(text, x, y, font, color, align, baseline) {
    /**
     * Evaluates if a string is null, undefined or empty
     * @param {string} str
     * @return {boolean}
     * @private
     */
    function _isNullOrWhiteSpace (str) {
        return typeof str === 'undefined' || str === null || str.match(/^ *$/) !== null;
    }

    /**
     * @class StyledText
     * @constructor
     */
    function StyledText() {
        /** @type {string} */
        this.text = text || "";

        /** @type {number} */
        this.x = x || 0;

        /** @type {number} */
        this.y = y || 0;

        /** @type {CSSStyleDeclaration.font|string} */
        this.font = font;

        /** @type {CSSStyleDeclaration.color|string} */
        this.color = color;

        /** @type {CSSStyleDeclaration.textAlign|string} */
        this.align = align;

        /** @type {CSSStyleDeclaration.baseline|string} */
        this.baseline = baseline;
    }

    /**
     * Draws a styled text on specified canvas' context
     * @param {CanvasRenderingContext2D} context
     */
    StyledText.prototype.paint = function (context) {
        context.save();
        if (!_isNullOrWhiteSpace(this.font)) context.font = this.font.toString();
        if (!_isNullOrWhiteSpace(this.font)) context.textAlign = this.align.toString();
        if (!_isNullOrWhiteSpace(this.font)) context.textBaseline = this.baseline.toString();
        if (!_isNullOrWhiteSpace(this.font)) context.fillStyle = this.color.toString();
        context.fillText(this.text, this.x, this.y);
        context.restore();
    };

    return new StyledText();
}
