/**
 * Created by Maximiliano on 05/12/2014.
 */
"use strict";

/**
 * Canvas Rectangle
 * @param {number} [x]
 * @param {number} [y]
 * @param {number} [width]
 * @param {number} [height]
 * @param {CSSStyleDeclaration.color|string} [fillColor]
 * @param {string} [imageSrc]
 * @param {number} [angle]
 * @param {number} [slicingX]
 * @param {number} [slicingY]
 * @return {Rectangle}
 * @constructor
 */
function Rectangle(x, y, width, height, fillColor, imageSrc, angle, slicingX, slicingY) {
    /**
     * Transform angles in degrees to radians
     * @param {number} degrees
     * @return {number}
     * @private
     */
    function _degreesToRadians (degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * @class Rectangle
     * @constructor
     */
    function Rectangle() {
        /** @type {number} */
        this.x = x || 0;

        /** @type {number} */
        this.y = y || 0;

        /** @type {number} */
        this.width = width || 0;

        /** @type {number} */
        this.height = height || this.width;

        /** @type {string} */
        this.fillStyle = fillColor || "#000000";

        /** @type {Image} */
        this.image = new Image();
        if (imageSrc) this.image.src = imageSrc;

        /** @type {number} */
        this.angle = angle || 0;

        /** @type {number} */
        this.slicingX = slicingX || 0;

        /** @type {number} */
        this.slicingY = slicingY || 0;
    }

    /**
     * Draws a rectangle or paints an image on the specified canvas' context
     * @param {CanvasRenderingContext2D} context
     */
    Rectangle.prototype.paint = function (context) {
        context.save();
        context.translate(this.x, this.y);
        context.translate(this.width / 2, this.height / 2);
        context.rotate(_degreesToRadians(this.angle));
        if (!this.image || (this.image && this.image.src == "")) {
            context.fillStyle = this.fillStyle;
            context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            context.drawImage(this.image, this.slicingX, this.slicingY, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        context.restore();
    };

    return new Rectangle();
}
