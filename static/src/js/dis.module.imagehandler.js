/*global jQuery, DIS */

/* DIS/PLAY Script
   Author's name: Bjarni Olsen, bjo
   Modified by:
   Date of creation: 10/04 2015
   */

(function ($, window, DIS) {
    "use strict";

    /**
     * This module loops the dom to collect image wrapper classes.
     * It then adds the images (normal img tags and background images) to the dom
     * with a src based on screen width.
     *
     *
     * @param objectConfiguration - The configuration for the object
     * @param {jQuery|HTMLElement|string|*} objectConfiguration.container - The DOM-container for this instantiation
     * @returns {DIS.ImageHandler}
     * @constructor
     */
    DIS.ImageHandler = function (objectConfiguration) {

        var defaults = {
            resizeTimer: "",
            screenSm: 480,
            screenMd: 768,
            screenLg: 1280,
            winWidth: getDimension("width"),
            winHeight: getDimension("height"),
        },

        // Define the actual configuration for this instantiation
        configuration = $.extend(true, defaults, objectConfiguration),
        DOM = {},
        eventHandlers,
        selfScope = this;

        eventHandlers = {
            refreshAll: function () {
                configuration.winWidth = getDimension("width");
                configuration.winHeight = getDimension("height");

                $.each(DOM.images, function() {
                    loadImage(this);
                });

                $.each(DOM.bgImages, function() {
                    loadBgImage(this);
                });
            },
        };


        /**
         * This function gets the width or height of the browser window
         *
         * @param {string} type - Required string containing the "width" or "height"
         * @returns {(number|boolean)}
         */
        function getDimension(type) {
            if (type === "width") {
                return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            } else if (type === "height") {
                return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            } else {
                return false;
            }
        }


        /**
         * This function gets the image wrapper data atrributes src and alt text,
         * creates a new image and appends it to image wrapper.
         *
         * @param {HTMLElement|jQuery|string|*} image - Image wrapper element
         */
        function loadImage(image) {
            var $image, img, src, alt;
            $image = $(image);
            $image.addClass("loading");
            src = getImageSrc(image);
            img = new Image();
            img.setAttribute("class", "loaded");
            alt = image.getAttribute("data-alt");
            img.setAttribute("alt", alt);
            img.onload = function () {
                $image.find("img.loaded").remove();
                $image.removeClass("loading");
                image.appendChild(img);
            };
            img.src = src;
        }

        /**
         * This function gets the image wrapper data atrributes src and alt text
         * and creates an new image tag to download the image. 
         * It then adds it's src as a background-image.
         *
         * @param {HTMLElement|jQuery|string|*} image - Image wrapper element
         */
        function loadBgImage(image) {
            var $image, img, src, alt;
            $image = $(image);
            src = getImageSrc(image);
            img = new Image();
            img.onload = function () {
                $image.attr('style', 'background-image: url(' + src + ');');
                $image.addClass("loaded");
                $image.removeClass("loading");
            };
            img.src = src;
        }

        /**
         * This function gets the data-src from the image wrapper based on width of the browser window
         *
         * @param {HTMLElement|jQuery|string|*} image - Image wrapper element
         * @returns {string}
         */
        function getImageSrc(image) {
            var src = "";
            if (configuration.winWidth >= configuration.screenSm && configuration.winWidth < configuration.screenMd) {
                src = image.getAttribute("data-src-sm");
            } else if (configuration.winWidth >= configuration.screenMd && configuration.winWidth < configuration.screenLg) {
                src = image.getAttribute("data-src-md");
            } else if (configuration.winWidth >= configuration.screenLg) {
                src = image.getAttribute("data-src-lg");
            } else {
                src = image.getAttribute("data-src-xs");
            }
            return src;
        }

        function init() {

            // Get and store the DOM-reference to the body element
            DOM.container = $("body");

            if (!DOM.container.length) {
                throw "Given container could not be found, or no container given. That's bad!";
            } else {

                // Loop and cache all image wrappers
                DOM.images = DOM.container.find(".imagehandler");
                $.each(DOM.images, function() {
                    loadImage(this);
                });

                // Loop and cache all background image wrappers
                DOM.bgImages = DOM.container.find(".bg-imagehandler");
                $.each(DOM.bgImages, function() {
                    loadBgImage(this);
                });

                // If browser window is resized then re-calculate the image size
                $(window).resize(function() {
                    eventHandlers.refreshAll();
                });
            }
        }

        init();
        return this;
    };
}(jQuery, window, DIS));

