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
    }

    $(function () {
        init();
    });


}(jQuery, DIS, window));

