/**
 * Created by Maximiliano Stranich on 10/04/2015.
 */

/**
 * @typedef {CanvasRect|CanvasImage|CanvasText} CanvasElement
 */

/**
 * @typedef {{x:Number, y:Number}} Pair
 * @property {Number} x
 * @property {Number} y
 */

angular.module('canvas').factory('CanvasContext2dFactory', [
    function () {
        /**
         * Canvas' context wrapper
         * @class CanvasContext2d
         */
        function CanvasContext2d(canvas, contextAttributes) {
            var _context = canvas.getContext('2d', contextAttributes),
                _elements = [],
                _scale= {
                    x: 1,
                    y: 1
                },
                _pos = {
                    x: 0,
                    y: 0
                },
                _fps = 30,
                _fpsTimers = {
                    now: Date.now(),
                    then: Date.now(),
                    first: Date.now(),
                    interval: 1000 / _fps,
                    delta: 0,
                    currentFps: _fps,
                    counter: 0
                },
                _requestAnimationFrame;
            _setFPS(_fps);

            /** @lends CanvasContext2d# */
            return {
                /**
                 * Gets the canvas elements queue
                 * @returns {[CanvasElement]}
                 */
                getElements: function () {
                    return _elements;
                },

                /**
                 * Validates and adds elements to the queue which will be rendered in the canvas
                 * @param {CanvasElement} elements
                 */
                addElements: function (elements) {
                    var msg = "Not drawable object";
                    if (angular.isArray(elements)) {
                        angular.forEach(elements, function (e) {
                            if (angular.isFunction(e.paint)) {
                                _elements.push(e);
                            } else {
                                throw [msg, e];
                            }
                        });
                    } else if (angular.isObject(elements) && angular.isFunction(elements.paint)) {
                        _elements.push(elements);
                    } else {
                        throw [msg, elements];
                    }
                },

                /**
                 * Sets the frame rate
                 * @param {Number} fps
                 */
                setFPS: function (fps) {
                    _setFPS(fps);
                },

                /**
                 * Gets the frame rate
                 * @return {number}
                 */
                getFPS: function () {
                    return _fps;
                },

                /**
                 * Gets the scale rate
                 * @return {Pair}
                 */
                getScale: function () {
                    return _scale;
                },

                /**
                 * Sets the scale rate
                 * @param {Number|Pair|Object} rate
                 * @param {Number} [rateY]
                 */
                setScale: function (rate, rateY) {
                    if (angular.isNumber(rate)) {
                        _scale.x = _scale.y = rate;
                        if (arguments.length > 1) _scale.y = rateY;
                    } else {
                        _scale.x = rate.x;
                        _scale.y = rate.y;
                    }
                },

                /**
                 * Gets the scrolling position
                 * @return {Pair}
                 */
                getPosition: function () {
                    return _pos;
                },

                /**
                 * Sets the scrolling position
                 * @param {Number|Pair|Object} position
                 * @param {Number} [positionY]
                 */
                setPosition: function (position, positionY) {
                    if (angular.isNumber(position)) {
                        _pos.x = _pos.y = position;
                        if (arguments.length > 1) _pos.y = positionY;
                    } else {
                        _pos.x = position.x;
                        _pos.y = position.y;
                    }
                },

                /**
                 * Gets the current calculated fps
                 * @return {Number}
                 */
                getWorkingFPS: function () {
                    return _fpsTimers.currentFps;
                },

                /**
                 * Clears the canvas
                 */
                clear: function () {
                    _clear();
                },

                /**
                 * Paints all added elements into the canvas, and then, calls the callback
                 * @param {function} [callback]
                 */
                frame: function (callback) {
                    function waitOrDraw () {
                        _fpsTimers.now = Date.now();
                        _fpsTimers.delta = _fpsTimers.now - _fpsTimers.then;
                        if (_fpsTimers.delta > _fpsTimers.interval) { // draw
                            _fpsTimers.then = _fpsTimers.now - (_fpsTimers.delta % _fpsTimers.interval);
                            var seconds = (_fpsTimers.then - _fpsTimers.first) / 1000;
                            _fpsTimers.currentFps = ++_fpsTimers.counter / seconds;
                            if (seconds >= 1) {
                                _fpsTimers.counter = 0;
                                _fpsTimers.first = _fpsTimers.now;
                            }

                            _clear();
                            _context.save();
                            _context.translate(-_pos.x, -_pos.y);
                            // _context.rotate(0);
                            _context.scale(_scale.x, _scale.y);
                            for (var i = 0; i < _elements.length; i++) {
                                _elements[i].paint(_context);
                            }
                            _context.restore();
                            !!callback && callback();
                        } else { // wait
                            _requestAnimationFrame(waitOrDraw);
                        }
                    }
                    waitOrDraw();
                },

                /**
                 * Creates a Blob object representing the image contained in the canvas; this file may be cached on the disk or stored in memory at the discretion of the user agent. If type is not specified, the image type is image/png. The created image is in a resolution of 96dpi. The third argument is used with image/jpeg images to specify the quality of the output.
                 * @param {Function} callback A callback function with the resulting Blob object as a single argument.
                 * @param {String} type A string indicating the image format. The default type is image/png.
                 * @param {Number} encoderOptions A number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp. If this argument is anything else, the default value for image quality is used. Other arguments are ignored.
                 */
                toBlob: function (callback, type, encoderOptions) {
                    canvas.toBlob(callback, type, encoderOptions);
                },

                /**
                 * Returns a data URIs containing a representation of the image in the format specified by the type parameter (defaults to PNG). The returned image is in a resolution of 96 dpi.
                 * @param {String} type A string indicating the image format. The default type is image/png.
                 * @param {Number} encoderOptions A number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp. If this argument is anything else, the default value for image quality is used. Other arguments are ignored.
                 * @return {String} A string containing the requested data URI.
                 */
                toDataURL: function (type, encoderOptions) {
                    return canvas.toDataURL(type, encoderOptions);
                }
            };

            function _setFPS (fps) {
                _fps = fps;
                _fpsTimers.interval = 1000 / fps;
                _requestAnimationFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, _fpsTimers.interval);
                };
            }

            function _clear() {
                _context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        return CanvasContext2d;
    }
]);

angular.module('canvas').factory('CanvasRectFactory', [
    'CanvasUtils',
    function (CanvasUtils) {
        /**
         * Canvas rect element
         * @class CanvasRect
         * @param {Object} [params] Initial values for constructor
         */
        function CanvasRect(params) {
            /** @lends CanvasRect# */
            var _r = {
                /** @type {Number} */
                x: 0,

                /** @type {Number} */
                y: 0,

                /** @type {Number} */
                width: 0,

                /** @type {Number} */
                height: 0,

                /** @type {String|CanvasGradient|CanvasPattern}*/
                fillStyle: null,

                /** @type {Number} */
                angle: 0,

                /** @type {Pair} */
                scale: {
                    x: 1,
                    y: 1
                }
            };
            angular.extend( _r, params || {});

            /**
             * Draws this element to specified canvas' context
             * @memberOf CanvasRect#
             * @param {CanvasRenderingContext2D} context
             */
            _r.paint = function (context) {
                context.save();
                context.translate(_r.x, _r.y);
                context.scale(_r.scale.x, _r.scale.y);
                context.rotate(CanvasUtils.toRadians(_r.angle));
                context.fillStyle = _r.fillStyle;
                context.fillRect(-_r.width / 2, -_r.height / 2, _r.width, _r.height);
                context.restore();
            };
            return _r;
        }
        return CanvasRect;
    }
]);

angular.module('canvas').factory('CanvasCircleFactory', [
    function () {
        /**
         * Canvas circle element
         * @class CanvasCircle
         * @param {Object} [params] Initial values for constructor
         */
        function CanvasCircle(params) {
            /** @lends CanvasCircle# */
            var _c = {
                /** @type {Number} */
                x: 0,

                /** @type {Number} */
                y: 0,

                /** @type {Number} */
                radius: 0,

                /** @type {String|CanvasGradient|CanvasPattern}*/
                fillStyle: null,

                /** @type {Pair} */
                scale: {
                    x: 1,
                    y: 1
                }
            };
            angular.extend( _c, params || {});

            /**
             * Draws this element to specified canvas' context
             * @memberOf CanvasCircle#
             * @param {CanvasRenderingContext2D} context
             */
            _c.paint = function (context) {
                context.save();
                context.translate(_c.x, _c.y);
                context.scale(_c.scale.x, _c.scale.y);
                context.fillStyle = _c.fillStyle;
                context.beginPath();
                context.arc(_c.x - _c.radius/2, _c.y - _c.radius/2, _c.radius, 0, 2 * Math.PI, false);
                context.fill();
                context.restore();
            };
            return _c;
        }
        return CanvasCircle;
    }
]);

angular.module('canvas').factory('CanvasImageFactory', [
    'CanvasUtils',
    function (CanvasUtils) {
        /**
         * Canvas image element
         * @class
         * @param {Object} [params] Initial values for constructor
         */
        function CanvasImage(params) {
            /** @lends CanvasImage */
            var _i = {
                /** @type {Number} */
                x: 0,

                /** @type {Number} */
                y: 0,

                /** @type {HTMLImageElement} */
                image: new Image(),

                /** @type {Number} */
                angle: 0,

                /** @type {Pair} */
                scale: {
                    x: 1,
                    y: 1
                }
            };
            angular.extend(_i, params || {});
            /**
             * Draws this element to specified canvas' context
             * @memberOf CanvasImage#
             * @param {CanvasRenderingContext2D} context
             */
            _i.paint = function (context) {
                if (_i.image && _i.image.src != "") {
                    context.save();
                    context.translate(_i.x, _i.y);
                    context.scale(_i.scale.x, _i.scale.y);
                    context.rotate(CanvasUtils.toRadians(_i.angle));
                    context.translate(-_i.image.naturalWidth / 2, -_i.image.naturalHeight / 2);
                    context.drawImage(_i.image, 0, 0);
                    // TODO: Add slicing functionality
                    // context.drawImage(_i.image, 0, 0, _i.image.naturalWidth, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
                    context.restore();

                }
            };
            return _i;
        }

        return CanvasImage;
    }
]);

angular.module('canvas').factory('CanvasSVGFactory', [
    'CanvasUtils',
    function (CanvasUtils) {
        /**
         * Canvas image element
         * @class
         * @param {Object} [params] Initial values for constructor
         */
        function CanvasSVG(params) {
            /** @lends CanvasSVG */
            var _s = {
                /** @type {Number} */
                x: 0,

                /** @type {Number} */
                y: 0,

                /** @type {Number} */
                width: 0,

                /** @type {Number} */
                height: 0,

                /** @type {HTMLImageElement} */
                image: new Image(),

                /** @type {Number} */
                angle: 0,

                /** @type {Pair} */
                scale: {
                    x: 1,
                    y: 1
                }
            };
            angular.extend(_s, params || {});
            /**
             * Draws this element to specified canvas' context
             * @memberOf CanvasSVG#
             * @param {CanvasRenderingContext2D} context
             */
            _s.paint = function (context) {
                if (_s.image && _s.image.src != "") {
                    context.save();
                    context.translate(_s.x, _s.y);
                    context.scale(_s.scale.x, _s.scale.y);
                    context.rotate(CanvasUtils.toRadians(_s.angle));
                    context.translate(-_s.width / 2, -_s.height / 2);
                    context.drawImage(_s.image, 0, 0, _s.width, _s.height);
                    context.restore();
                }
            };
            return _s;
        }

        return CanvasSVG;
    }
]);

angular.module('canvas').factory('CanvasTextFactory', [
    function () {
        /**
         * Canvas text element
         * @param {Object} [params] Initial values for constructor
         * @class
         */
        function CanvasText(params) {
            /** @lends CanvasText */
            var _t = {
                /** @type {string} */
                text: '',

                /** @type {number} */
                x: 0,

                /** @type {number} */
                y: 0,

                /** @type {CSSStyleDeclaration.font|string} */
                font: null,

                /** @type {String|CanvasGradient|CanvasPattern} */
                fillStyle: null,

                /** @type {CSSStyleDeclaration.textAlign|string} */
                align: null,

                /** @type {CSSStyleDeclaration.baseline|string} */
                baseline: null
            };
            angular.extend(_t, params || {});

            /**
             * Draws this element to specified canvas' context
             * @memberOf CanvasText#
             * @param {CanvasRenderingContext2D} context
             */
            _t.paint = function (context) {
                if (!!_t.text) {
                    context.save();
                    context.font = _t.font;
                    context.textAlign = _t.align;
                    context.textBaseline = _t.baseline;
                    context.fillStyle = _t.fillStyle;
                    context.fillText(_t.text, _t.x, _t.y);
                    context.restore();
                }
            };
            return _t;
        }

        return CanvasText;
    }
]);
