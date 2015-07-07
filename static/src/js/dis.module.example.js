/*global jQuery, DIS */

/* DIS/PLAY Script
 Author's name: ...
 Modified by:
 Client name: ...
 Date of creation: ...
 */


// This closure is where you define which global variables you want. Your naming at THIS point should
// reflect what you want to call your variables inside your closure; their actual name in the global
// scope is referenced at the bottom (during call-time). So go look there as well!
(function ($, window, DIS) {
    "use strict";


    /**
     * This module is an example of how you might build a module for the site. Use code as needed, and then remove from
     * your development project!
     *
     *
     * @param objectConfiguration - The configuration for the object
     * @param {jQuery|HTMLElement|string|*} objectConfiguration.container - The DOM-container for this instantiation
     * @returns {DIS.ExampleModule}
     * @constructor
     */
    DIS.ExampleModule = function (objectConfiguration) {

        // First, set up your "global" vars for use inside this function. JSLint prefers you bunch up all your
        // var-statements in one single block, so that's what we're doing here. This also gives you the added
        // benefit of easily being able to see which variables are unused, if your editor supports that kind
        // of thing.

            // "defaults" should contain your default settings. These will be used unless overridden by something else when
            // the module is loaded.
        var defaults = {
                SomeValue: "This is an example that can be overridden by passing {SomeValue: 'Something else'} to the constructor."
            },

            // This is where we define the actual configuration for this instantiation. We use jQuery's extend(), which
            // lays "objectConfiguration" on top of "defaults", the result of which is put into "configuration". You can then
            // use "configuration.SomeValue" wherever you need it in this script. The first "true" is to enable deep-recursion
            // on the extender, which enables you to extend objects within objects. See jQuery's manual for more on this. You
            // can remove "true" entirely if your configuration only contains a single level, like you see in the example above.
            configuration = $.extend(true, defaults, objectConfiguration),

            // Set up an empty object that will contain our DOM elements later. This is done to minimize the number of times
            // jQuery has to look through the DOM to find the element you want to work on.
            DOM = {},

            // This is an empty placeholder that we will populate with functions later. It's only here for example-reasons.
            eventHandlers,

            // Reference to the current scope, usable inside callbacks et al. to reference this module (instead of whatever
            // scope the function might be running in.) You will not realize the awesomeness of this until you have experienced
            // the hell that is scope-confusion in javascript, so for now just go with it. Basically, you can use "selfScope"
            // instead of "this" when you need to refer to this module instantiation.
            selfScope = this;



        // This is an example of how you might bundle together "private" functions that relate to each other. In this
        // case, we'll gather all event handlers in the same object so they're easily referenced later.
        eventHandlers = {

            /**
             * An example of a refresh-action.
             */
            refreshAll: function () {
                window.console.log("Performing refresh-action...");
                // Perform any action here, such as:
                // $.ajax({...})
            },


            /**
             * An example of a click handler.
             *
             * @param {Event} e
             */
            someClickEvent: function (e) {
                e.preventDefault();
            }

        };


        /**
         * This function is "private", which means it will only be accessible from inside this module. You can run it
         * from any point by running thisIsAPrivateFunction(), but ONLY inside this instantiation.
         *
         * @param {string} someString - Required string containing the name of your favorite beer.
         * @param {Array} [someArray] - Optional array of stuff.
         */
        function thisIsAPrivateFunction(someString, someArray) {
            window.console.log(someString);

            if (someArray instanceof Array && someArray.length) {
                window.console.log(someArray.join(", "));
            }
        }




        /**
         * This function is "public" (notice "this."), which means that once your module is instantiated, it will expose
         * this function as a usable function, like so:
         *
         *      var example = new DIS.ExampleModule({ container: $('#whatever' });
         *      example.someFunction();
         *
         * Not only that, but because this function returns "selfScope" at the end, you're able to chain together more
         * functions if you have them, like so:
         *
         *      example.someFunction().someOtherFunction();
         *
         * These two functions will now run in succession.
         *
         *
         * @returns {DIS.ExampleModule}
         */
        this.someFunction = function () {

            // Run an internal function. We can do this because although this function is public, it resides inside the
            // same scope as the private function does. So we have direct access to everything, even though the "outside"
            // can never touch it. Neat, huh?
            thisIsAPrivateFunction("Indian Pale Ale");

            // Return the "selfScope", as explained in the comment block above.
            return selfScope;
        };





        /**
         * Initialization function, which is run when the module is "booting".
         */
        function init() {

            // Get and store the DOM-reference to the container we've been given.
            DOM.container = $(configuration.container);

            if (!DOM.container.length) {
                // If we haven't got a container at this point, throw a hissy fit!
                throw "Given container could not be found, or no container given. That's bad!";
            } else {

                // At this point we know that at least the container exists, so now we can map all the objects
                // we'll need inside it. Such as this button:
                DOM.submitButton = DOM.container.find("[type=submit]");
                // Bind an internal click handler to the button.
                DOM.submitButton.click(eventHandlers.someClickEvent);

                // Since we're inside a unique scope, and we have a DOM-reference to work with, we can bind custom
                // events as well as regular ones. In this case, we'll run the "refresh"-action when the "dis.refresh"
                // event is run:
                DOM.container.on("dis.refresh", eventHandlers.refreshAll);


                // You can now trigger the event from any script across the site like so:
                //
                //      $("#whatever-element").trigger("dis.refresh");
                //
                // or
                //
                //      $("section.some-class").trigger("dis.refresh");
                //
                // I recommend you look into this article, to see how you can pass arguments to the event callbacks:
                // https://api.jquery.com/trigger/




                // If you need to access this module later, and you want to be sure you can always dig up this scope
                // again, you could do this:
                //
                //      DOM.container.data("disScope", selfScope);
                //
                // After that, any script in your stack can do this:
                //
                //      var exampleCode = $('#someElement').data("disScope");
                //      exampleCode.someFunction();
                //
                // But I would recommend you use an event-driven design, as explained above, instead.


            }
        }

        // Once everything is ready, run the init-function to get the ball rolling.
        init();

        // Return the current scope.
        return this;
    };



// This is where you define the global parameters you pass into your closure. You'll want to pass in any
// big stuff you'll need inside your script. Minor stuff can always be accessed through window.someVariable.
}(jQuery, window, DIS));