/*global require, console */

/* DIS/PLAY gulpfile
 Author's name: Anders Gissel, Bjarni Olsen
 Modified by:

 **********************************************************************************************************************
 **********************************************************************************************************************

 Welcome to the Frontline gulpfile. Almost everything you need to get started is in this file, although
 if you are just setting up your project from scratch, you do need to edit a few things:

    1) Start by running this command to get the basic NPM modules installed:
            npm install

    2) Then, you need to select a CSS preprocessor, which is either LESS or SASS.

    3) Go to the definition for "cssPreprocessor" a bit down, and set your choice accordingly

    4) Install the associated package, by running:
            npm install --save-dev gulp-less
       or
            npm install --save-dev gulp-sass

    5) Fire up gulp by running "npm run gulp", or check the README.md for information about debugging JS
        and similar. At some point you'll need to edit this file again, but there's plenty of
        comments to start on, so you should be in good hands.

    6) Have fun!


 */



(function () {
    "use strict";

    /**
     * SETUP
     *
     * You should pay attention to the "important" block just below!
     */
    var gulp = require('gulp'),

    // *************************************************
    // *************************************************
    // IMPORTANT!
    // Without this variable, the script will NOT run!
    //
    // Set to "less" or "sass", as the case may be.
    // Please note that neither package is included in
    // package.json per default.
    // *************************************************
    // *************************************************
        cssPreprocessor = '', // must be lowercase!
    // *************************************************
    // *************************************************
    // That's it, really. But you're welcome to read on. ;-)



    // Placeholder for loaded modules, so we won't have to require them more than once. See the function disRequire()
    // further down for more.
        resolvedModules = {};



    /**
     * Internal function for loading required NPM-modules. The usual methodology is to just load *everything* at the top
     * of the gulpfile, but as the file grows bigger and includes more and more modules, the initialization time will
     * get longer and longer and longer.
     * Utilizing this function will enable us to only load the modules we need for any given task, and to NOT load
     * heavy image processors if all we really need for the current run is a JSLint.
     *
     * @param {string} functionName - must correspond to an NPM module name, such as "gulp-less" or "yargs".
     * @returns {function}
     */
    function disRequire(functionName) {
        var returnData;

        // If the function has already been resolved and loaded, just return the cached data now.
        if (resolvedModules[functionName]) {
            returnData = resolvedModules[functionName];
        } else {
            // Utilize NPM to require the requested module
            returnData = require(functionName);
            // Save the object reference for later so we may reuse it.
            resolvedModules[functionName] = returnData;
        }

        // Return the new function.
        return returnData;
    }


    /**
     * This function checks whether or not you've configured your gulpfile properly, with regards
     * to which CSS preprocessor to use.
     */
    function checkCssPreprocessorConfiguation() {
        var colors = disRequire("colors");

        // Throw an ugly error if cssProcessor hasn't been set to something we recognize.
        if (cssPreprocessor !== "less" && cssPreprocessor !== "sass") {
            console.log(" ");
            console.log("**********************************************************************".bgRed.black.bold);
            console.log("************************** ERROR!!!1!11one ***************************".bgRed.black.bold);
            console.log("**********************************************************************".bgRed.black.bold);
            console.log(" ");
            console.log("'cssProcessor' must be set to either 'less' or 'sass'!".red.bold);
            console.log("Please edit gulpfile.js accordingly, then run one of the following");
            console.log("commands:");
            console.log(" ");
            console.log("> " + "npm install --save-dev gulp-less".magenta);
            console.log(" ");
            console.log("or");
            console.log(" ");
            console.log("> " + "npm install --save-dev gulp-sass".magenta);
            console.log(" ");
            console.log("**********************************************************************".bgRed.black.bold);
            console.log("**********************************************************************".bgRed.black.bold);
            console.log("**********************************************************************".bgRed.black.bold);
            console.log(" ");
            throw ("Aborting!");
        }
    }

    gulp.task("checkCssPreprocessor", function () {
        checkCssPreprocessorConfiguation();
    });



    /**
     * Callback function to let the user know when (and why) stuff is automatically happening while Gulp is running.
     *
     * @param {Event} event
     */
    function watcherCallback(event) {
        var colors = disRequire("colors"),
            msg = 'File ' + event.path + ' was ' + event.type + ', running tasks...',
            msgLength = Math.max(msg.length, 60) + 1;
        console.log(new Array(msgLength).join("=").white.bold);
        console.log(msg.white.bold);
    }





    /**
     * DEFAULT TASK
     *
     * This function runs unless you specifically specify a task (by running "gulp resourcecopy",
     * "gulp less", or similar). It performs the usual subtasks (copying resources, compiling
     * CSS and JS), and then sets up file watchers to handle livereload and compile-on-change
     * actions.
     */
    gulp
        .task('default',
            // These are the tasks that are run in succession when gulp is started. If the variable "cssPreprocessor"
            // is not set, however, an ugly error message will be displayed instead.
            cssPreprocessor ?
                    [
                        'resourcecopy',
                        cssPreprocessor, // Will be either "less" or "sass", dependent on what you've selected above.
                        'js',
                        'lint'
                    ] :
                    [
                        // This task will fire if you haven't selected a preprocessor. Shame on you!
                        'checkCssPreprocessor'
                    ],
            // Once all the tasks have finished, this callback will fire to set up the watchers and live-reload.
            function () {
                var liveReload = disRequire("gulp-livereload");

                // Set up the livereload-server.
                liveReload.listen();

                // Watch the entire DIST folder and refresh the browser when changes happen.
                gulp
                    .watch(['static/dist/**'])
                    .on('change', liveReload.changed);

                // Watch JS-folder(s) for changes, and compile/lint as necessary.
                gulp
                    .watch('static/src/js/**/*.js', ['js', 'lint'])
                    .on('change', watcherCallback);

                // Watch LESS- or SASS-folder for changes, and compile as necessary.
                gulp
                    .watch('static/src/' + cssPreprocessor + '/**/*.*', [cssPreprocessor])
                    .on('change', watcherCallback);
            });









    /**
     * JAVASCRIPT
     *
     * Set up a task for compiling javascript. This will both compile the main javascript file,
     * containing all your various vendor modules as well as your own code, and the legacy
     * script file needed for IE8 (and below) for understanding modern web code.
     *
     * DO NOT include Modernizr or jQuery here. The former should be included explicitly in the
     * page headers, along with legacy.min.js, the latter should ideally be included in the page
     * footer along with your main JS file.
     */
    gulp
        .task('js', function () {

            // Set up variables for the NPM modules we'll need, and load those we're sure to run.
            var concat,
                uglify,
                cmdArguments = disRequire('yargs').argv,
                colors = disRequire("colors"),
                plumber = disRequire("gulp-plumber");

            if (cmdArguments.debug) {
                console.log(" ");
                console.log("   ************************************************".yellow);
                console.log("   * SCRIPT IS BEING COMPILED IN DEBUG-MODE!      *".yellow);
                console.log("   * No minification will be performed.           *".yellow);
                console.log("   ************************************************".yellow);
                console.log(" ");

                // Get the concat-module ready
                concat = disRequire("gulp-concat");
            } else {
                // Get the uglify-module ready
                uglify = disRequire("gulp-uglifyjs");
            }

            gulp.src([
                // 'static/src/js/vendor/some.jquery.plugin.js',
                // 'static/src/js/vendor/some.other.jquery.plugin.js',
                // 'static/src/js/vendor/jquery.*.js', // Include all jQuery-plugin files, usually named jQuery.pluginname.js, unconditionally. Use with caution.
                'static/src/js/dis.main.js',
                'static/src/js/dis.module.*.js'
            ])
                .pipe(plumber())
                .pipe(cmdArguments.debug ?
                        // Just concatenate, since we're in debug-mode at this stage.
                        concat("main.min.js") :
                        // Uglify the javascript files into "main.min.js"
                        // and create a sourcemap file that matches.
                        uglify('main.min.js', {
                            outSourceMap: true,
                            sourceRoot: '../../../',
                            mangle: false
                        })
                    )
                .pipe(plumber.stop())
                // Render the output into the DIST folder
                .pipe(gulp.dest('static/dist/js'));
                // You can duplicate the line above as many times as you want,
                // for example to render into BUILD (which would avoid a publish in VS):
                //     .pipe(gulp.dest('../BUILDFOLDER/static/dist/js'))
                //     .pipe(gulp.dest('../another-folder/static/dist/js'))
                //     .pipe(gulp.dest('../a-third-folder/static/dist/js'))
                // Just be mindful of the last semicolon!


            // Create a file for legacy-browsers, such as IE8 and below, to get rudimentary support for HTML5 and similar.
            gulp.src([
                'static/src/js/vendor/consolelogfix.min.js',
                'static/src/js/vendor/html5shiv-printshiv.js',
                'static/src/js/vendor/respond.min.js'
            ])
                .pipe(plumber())
                // Uglify the javascript files into "legacy.min.js"
                // and create a sourcemap file
                .pipe(cmdArguments.debug ?
                        // Just concatenate, since we're in debug-mode at this stage.
                        concat('legacy.min.js') :
                        // Uglify the javascript files into "legacy.min.js", but without
                        // a sourcemap, since IE8 doesn't understand that anyway.
                        uglify('legacy.min.js', {
                            outSourceMap: false,
                            sourceRoot: '../../../',
                            mangle: false
                        }))
                .pipe(plumber.stop())
                // Render the output into the DIST folder
                .pipe(gulp.dest('static/dist/js'));
        });








    /**
     * JS Linter
     *
     * Set up task for JSHint.
     */
    gulp
        .task("lint", function () {
            var jshint = disRequire("gulp-jshint");

            gulp.src("static/src/js/*.js")
                // Run file through JSHint
                .pipe(jshint())
                // Pipe the result of that through to the JSHint reporter
                .pipe(jshint.reporter("default"));
        });







    /**
     * LESS
     *
     * Set up task for LESS
     */
    gulp
        .task('less', function () {

            // Get all the NPM-modules ready.
            var less = disRequire("gulp-less"),
                cssPrefixer = disRequire("gulp-autoprefixer"),
                plumber = disRequire("gulp-plumber"),
                rename = disRequire("gulp-rename"),
                minifyCss = disRequire("gulp-minify-css");

            gulp.src('static/src/less/main.less')
                .pipe(plumber())
                // Run file through LESS-compiler
                .pipe(less())
                // Auto-prefix CSS3-properties
                .pipe(cssPrefixer({cascade: false}))
                // Minify the CSS
                .pipe(minifyCss())
                // Rename CSS file
                .pipe(rename({suffix: '.min', extname: '.css'}))
                .pipe(plumber.stop())
                // Render the output into the DIST folder
                .pipe(gulp.dest('static/dist/css'));

            // See the "JS"-task for an example of how to copy the rendered file(s) into other folders,
            // such as the build-folder referenced by Visual Studio.
        });






    /**
     * SASS
     *
     * Set up task for SASS
     */
    gulp
        .task('sass', function () {

            // Get all the NPM-modules ready.
            var sass = disRequire("gulp-sass"),
                cssPrefixer = disRequire("gulp-autoprefixer"),
                plumber = disRequire("gulp-plumber"),
                rename = disRequire("gulp-rename"),
                minifyCss = disRequire("gulp-minify-css");

            gulp.src('static/src/sass/main.scss')
                .pipe(plumber())
                // Run file through SASS-compiler
                .pipe(sass())
                // Auto-prefix CSS3-properties
                .pipe(cssPrefixer({cascade: false}))
                // Minify the CSS
                .pipe(minifyCss())
                // Rename CSS file
                .pipe(rename({suffix: '.min', extname: '.css'}))
                .pipe(plumber.stop())
                // Render the output into the DIST folder
                .pipe(gulp.dest('static/dist/css'));

            // See the "JS"-task for an example of how to copy the rendered file(s) into other folders,
            // such as the build-folder referenced by Visual Studio.
        });







    /**
     * RESOURCECOPY
     *
     * Set up tasks for copying folders and files to /dist/
     * and compress images.
     *
     * TODO: needs some SVG optimation.
     */
    gulp
        .task('resourcecopy', function () {

            var imageop, plumber;

            gulp.src([
                'static/src/fonts/*.*',
                'static/src/js/vendor/modernizr*',
                'static/src/js/vendor/jquery-*'
            ], { base: 'static/src' })
                // Render the output into the DIST folder
                .pipe(gulp.dest('static/dist'));



            // Enable this block if you want automatic image compression/optimization.
            // BEWARE: this task probably needs some work!
            /*
            imageop = disRequire("gulp-image-optimization");
            plumber = disRequire("gulp-plumber");
            gulp.src([
                'static/src/img/*.{png,jpg,jpeg,gif,svg}'
            ], { base: 'static/src' })
                .pipe(plumber())
                .pipe(imageop({
                    optimizationLevel: 5,
                    progressive: true,
                    interlaced: true,
                    quality: '65-80'
                }))
                .pipe(plumber.stop())
                // Render the output into the DIST folder
                .pipe(gulp.dest('static/dist'));
             */
        });








    /**
     * IMAGES
     *
     * Set up task for IMAGES
     * Run this task: 'npm run gulpimg'
     *
     * TODO: needs some SVG optimation.
     */
    gulp
        .task('images', function () {
            var imageop = disRequire("gulp-image-optimization"),
                plumber = disRequire("gulp-plumber");

            gulp.src([
                'static/src/img/*.{png,jpg,jpeg,gif,svg}'
            ], { base: 'static/src' })
                .pipe(plumber())
                .pipe(imageop({
                    optimizationLevel: 5,
                    progressive: true,
                    interlaced: true,
                    quality: '65-80'
                }))
                .pipe(plumber.stop())
                // Render the output into the DIST folder
                .pipe(gulp.dest('static/dist'));
        });







    /**
     * SVG icons with PNG fallback
     *
     * WORK IN PROGRESS - DO NOT USE (YET)!
     *
     * Automatically creates a partial for you to use in your LESS or SASS project.
     * Creates inline data-URIs in the CSS for the SVGs, to combat potential trouble
     * using spritesheets in responsive designs.
     *
     * Please see the generated file for how to extend your selectors to use the
     * icons. This will save you a lot of bytes when reusing icons across the site.
     */
    gulp.task('iconify', function () {

        // Check to see if the cssPreprocessor variable is set correctly.
        checkCssPreprocessorConfiguation();

        var iconify = disRequire("gulp-iconify"),
            rename = disRequire("gulp-rename"),
            del = disRequire("del");

        iconify({
            src: 'static/src/svg/*.svg',
            pngOutput: 'static/dist/svgPngFallback',
            scssOutput: 'static/src/' + cssPreprocessor,
            styleTemplate: 'static/src/_gulp_iconify.' + cssPreprocessor +'.mustache',
            svgoOptions: {
                enabled: true,
                options: {
                    plugins: [
                        { removeUnknownsAndDefaults: false },
                        { mergePaths: false }
                    ]
                }
            }
        }, function () {
            console.log("Callback");
        });

        // Iconify creates these two files no matter what. We don't need 'em.
        del([
            'static/src/' + cssPreprocessor + '/icons.fallback.scss',
            'static/src/' + cssPreprocessor + '/icons.png.scss'
        ]);

        // Rename the source file so it matches our naming scheme.
        gulp
            .src('static/src/' + cssPreprocessor + '/icons.svg.scss')
            .pipe(rename({
                basename: '_svgicons',
                extname: '.' + (cssPreprocessor === "sass" ? "scss" : "less")
            }))
            .pipe(gulp.dest('static/src/' + cssPreprocessor));

        // Delete the source file as well.
        del([
            'static/src/' + cssPreprocessor + '/icons.svg.scss'
        ]);
    });







}());
