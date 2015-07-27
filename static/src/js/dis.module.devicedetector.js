/*global jQuery, DIS */

/* DIS/PLAY Script
 Author's name: ...
 Modified by:
 Client name: ...
 Date of creation: ...
 */

DIS.DeviceDetector = (function ($) {

    var indicator, timerId, state, isMobile, selfScope = this;

    this.getState = function() {
        if ('getComputedStyle' in window) {
            state = window.getComputedStyle(
                indicator, ':before'
            ).getPropertyValue('content');

            state = state.replace(/['"]/g, "");
        }
        return state;
    };

    this.isMobile = function() {
        if (selfScope.getState() === "xsmall" || selfScope.getState() === "small") {
            return true;
        } else {
            return false;
        }

    };

    this.isLegacyIE = function() {
        var root = document.getElementsByTagName('html')[0].getAttribute("class").indexOf("lt-ie10");
        if ( root > -1 ) {
            return true;
        } else {
            return false;
        }
    };

    function handleState(event) {
        clearTimeout(timerId);
        timerId = setTimeout(function() {
            $(window).trigger("dis.refresh");
        }, 300);
    }

    function init() {
        // Create the state-indicator element
        indicator = document.createElement('div');
        indicator.className = 'state-indicator';
        document.body.appendChild(indicator);

        $(window).on("resize",  function(event){
            handleState(event);
        });
    }

    init();

    return this;
}(jQuery));
