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


    /**
     * Example function. Nothing more.
     *
     * @returns {string}
     */
    function whateverTinyFunctionYouWant() {
        return "Hey!";
    }



    function init() {

        // Let's say we want to instantiate our ExampleModule (see dis.module.example.js) on all occurrences
        // of the "article" element. We can do this like so:
        $("article").each(function () {

            // Instantiate the new module. It will set itself up and run all initialization scripts, so at this point
            // you shouldn't HAVE to do more, depending on your code and how complex your module is.
            var exampleArticle = new DIS.ExampleModule({ container: this });

            // However, you can, of course, run a public function on the new module at once:
            exampleArticle.someFunction();

            // You might want to save the module reference some way. If not, you can only communicate with the module
            // through events (see the example code for more), or by storing the module reference on the container
            // (again, see the example core) and then fetching that. I do recommend events.
            // Here's how you could store the reference:
            //
            //      someArray.push(exampleArticle);
            //
            // You can then iterate through someArray later, and run public functions on each item. Still, as I said
            // before, events are better. Because they just are!


            // This, for example, is how you'd trigger the "refresh"-event:
            $(this).trigger("dis.refresh");
        });

        window.console.log("Everything is ready!");


        // Do you want to store a variable on the global scope? Are you CERTAIN!? Okay, then do this:
        window.whatever = "lulz";


        whateverTinyFunctionYouWant();

        // Initialize image handler module
        var imagehandler = new DIS.ImageHandler();
    }



    // Initialize the main script(s) once the DOM is ready. Not only does this mean that all your DOM-references will
    // work, but more importantly: Gulp is compiling all your scripts into one big file, but the closures are run as soon
    // as they're available. Meaning: if your "main" closure is run BEFORE your "module"-closure, it might try to instantiate
    // your modules before the browser actually knows them. Using jQuery's ready-function alleviates this problem.
    $(function () {
        init();
    });


}(jQuery, DIS, window));

