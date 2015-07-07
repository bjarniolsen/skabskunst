# PROJECT NAME

**This is a default README file. Please edit it to fit your new shining project.**

Short synopsis describing the project.
Umbraco / Sitecore / Sharepoint / 

Need help with Markdown syntax?
[cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet "Markdown cheatsheet")



## Contributors

Team members: Ozzy Osbourne (Frontend), Nikki Sixx (Backend), Lemmy Kilmister (Project lead), Wendy O. Williams (Design), Rob Halford (Backend).

Date of creation: 10/09 - 2014

Modified by: Udo Dirkschneider (Frontend)

Modified date: 16/10 2014



## FRONTEND DOCUMENTATION

All frontend files are located in `/static` folder.
Frontend resources are compiled with the NodeJS-module Gulp, the configuration for which is located in `gulpfile.js` and `package.json`.

### Install frontend build tools

#### Install NodeJS
To compile the source files (LESS/SASS) to CSS and minify the JS you need to use Gulp, and in order to use Gulp, you need to install NodeJS first.
If you've already done that on your system, skip this bit. Otherwise, get NodeJS here:

[Install Node.js](http://nodejs.org/download/ "Node JS website")

... and install it.

If you get some weird runtime errors once you start running `npm` commands, it's due to some bugs in the installer. Just copy the error message,
and Google will help you out in a jiffy. It's usually a simple matter of creating a folder or two.

#### Install site-specific Gulp modules
This installs Gulp and all Gulp modules used for this site.

```
c:\path\to\project\root\folder> npm install
```

Wait for the NodeJS package manager (npm) to install all required Gulp modules. You need only do this once, or if the package information (found inside package.json) changes.


> **NOTE TO FRONTEND DEVELOPER!**

> If you prefer LESS instead of SASS, then run this command: `npm install gulp-less --save-dev`.
> Then remove SASS from both `package.json` and `gulpfile.js` afterwards.

### Run Gulp
Run this command to start Gulp:

```
c:\path\to\project\root\folder\ > npm run gulp
```

Gulp 'watches' file changes and builds CSS and JS from the source files automatically.

### CSS
(SASS / LESS).

SASS/LESS is located in `/static/sass/` or `/static/less/` and Gulp builds it to `/static/dist/`. CSS is minified.

> Remember to describe any LESS/SASS specific structures and wizardry that is not obvious.

> **Remember to alter gulpfile.js and choose SASS or LESS.**

### Javascript
(jQuery / Other).

All source code is placed inside `/static/src/js/`, and compiled into `/static/dist/js/`, which is then the only
folder needed on the webserver. All JS is uglified.

jQuery and other plugins are located in vendor/plugins. As a rule, you should only include uncompressed files
(including headers, for versions and copyrights), and let Gulp minify them by including them in your workflow.



### Debugging in Internet Explorer

```
c:\path\to\project\root\folder> npm run gulpdebug
```

or

```
c:\path\to\project\root\folder> gulp js --debug
```

This builds the JS _without_ using minification. This lets you debug the code in Internet Explorer more easily.
Please don't check in the un-minified file, though, or you will be forced to buy everyone cake. And beer.




### Livereload
Livereload is activated in Gulpfile.js, which enables you to make frontend changes and see them live without reloading the entire page.

To use it you need to install this Chrome extension:

```
http://bit.ly/IKI2MY
```

Or the same for Firefox:

```
http://mzl.la/1uAab9V
```

Or if you need to Livereload another browser (eg. on a mobile phone/tablet) then place this script before `</body>` tag:

`<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>`

> Remember to remove it before you deploy to production!


## BACKEND DOCUMENTATION

[Projectroom](https://url/to/projectroom/documentation/)

> Paste the content of DeveloperGuide.docx here




## Troubleshoot'n
...
