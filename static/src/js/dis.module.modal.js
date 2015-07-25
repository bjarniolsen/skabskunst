/*global jQuery, DIS */

/* DIS/PLAY Script
   Author's name: Bjarni Olsen, bjo
   Modified by:
   Date of creation: 10/04 2015
   */

(function ($, window, DIS) {
    "use strict";

    /**
     * @param objectConfiguration - The configuration for the object
     * @param {jQuery|HTMLElement|string|*} objectConfiguration.container - The DOM-container for this instantiation
     * @returns {DIS.modal}
     * @constructor
     */
    DIS.Modal = function (objectConfiguration) {

        var defaults = {
        },

        // Define the actual configuration for this instantiation
        configuration = $.extend(true, defaults, objectConfiguration),
        DOM = {},
        eventHandlers,
        selfScope = this;

        eventHandlers = {
            refreshAll: function () {
            },
        };

        function buildModal() {
            var modal = $('<div class="modal visuallyhidden"/>'),
                closer = $('<button type="button">Luk</button>'),
                image = $('<img src="" alt="" />'),
                info = $('<p/>'),
                address = $('<span class="address"/>'),
                artist = $('<span class="artist"/>'),
                overlay = $('<div class="overlay visuallyhidden"/>');

            // append dom into modal
            info.append(address, artist);
            modal.append(closer, image, info);

            // save reference to modal and overlay
            DOM.modal = modal;
            DOM.overlay = overlay;
            window.$body.append(DOM.modal, DOM.overlay);
        }


        function appendToModal(box) {
            // save reference to clicked box
            DOM.box = box;

            // get info from box...
            var imageSrc = box.find("img").attr("src").replace("thumb/", "large/", "gi"),
                address = box.find(".address").text(),
                artist = box.find(".artist").text();

            // ...and insert it into modal
            DOM.modal.find("img").attr("src", imageSrc);
            DOM.modal.find(".address").text(address);
            DOM.modal.find(".artist").text(artist);

            // give focus to close button
            var closer = DOM.modal.find("button").focus();

            // add event to close modal
            closer.on("click", function(event) {
                // hide modal
                DOM.modal.addClass("visuallyhidden");
                // hide overlay
                DOM.overlay.addClass("visuallyhidden");
                // give focus back to the clicked box
                DOM.box.focus();
            });

            // show modal
            DOM.modal.removeClass("visuallyhidden");

            // show overlay
            DOM.overlay.removeClass("visuallyhidden");
        }

        function init() {

            // Get and store the DOM-reference to the body element
            DOM.container = $(configuration.container);

            if (!DOM.container.length) {
                throw "Given container could not be found, or no container given. That's bad!";
            } else {
                // cache dom
                DOM.boxes = DOM.container.find(".box");

                DOM.boxes.on("click", function(event) {
                    appendToModal($(this));
                });

                buildModal();
            }
        }

        init();
        return this;
    };
}(jQuery, window, DIS));
