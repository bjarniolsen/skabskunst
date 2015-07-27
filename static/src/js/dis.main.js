/*global jQuery */

/* DIS/PLAY Script
 Author's name: ...
 Modified by:
 Client name: ...
 Date of creation: ...
 */

var DIS = DIS || {};

(function ($, DIS, window) {
    "use strict";

    function init() {
        // cache dom
        window.$body = $("body");
        window.$sitewrapper = window.$body.find(".site-wrapper");

        // init modules
        var modal = new DIS.Modal({ container: $('[role="region"]') });

        // Get and store screen state from DeviceDetector
        //screenState = DIS.DeviceDetector.getState();
        //console.log(screenState, DIS.DeviceDetector.isMobile());
    }

    $(function () {
        init();
    });


}(jQuery, DIS, window));

