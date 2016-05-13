# Dependencies Linker

Copy your npm dependencies to server them to the front-end.

Automatically copy your project's dependency files to a folder like `public/scripts`
so that you can serve them to the front end.

## Install
```
npm install --save-dev dep-linker
```

## Use
``` javascript

var DepLinker = require('dep-linker');
DepLinker.copyDependenciesTo('./public/scripts')
  .then(function () {
    console.log('Finished.');
  });

  // Done! All your dependencies ready to be served to the front-end
```
*dev-dependencies are not copied*.

## Task runners
There still isn't a specific wrapper for any task runner, but given that this
is just javascript for now you can use it like this:
### Gulp
``` javascript
var DepLinker = require('dep-linker');

gulp.task('copy-dependencies', function () {
  return DepLinker.copyDependenciesTo('./public/scripts');
});
```
### Grunt
``` javascript
var DepLinker = require('dep-linker');

grunt.task.registerTask('copy-dependencies', 'Copy npm dependencies', function() {
  return DepLinker.copyDependenciesTo('./public/scripts');
});

```

## Options
### Copy whole folders
By default `dep-linker` copies just the main file of your dependencies,
so you have a structure that looks like this:
```
.
├── package.json
└── public
    └── scripts
       ├── angular.js
       ├── bootstrap.js
       ├── fl-assert.js
       ├── fl-form.js
       ├── jquery.js
       └── x-div.js
```

You can set the `copyWholeFolder` flag to true and copy everything within the
dependency's main file folder like this:
``` javascript
DepLinker.copyDependenciesTo('./public/scripts', true);
```

You will end up with a folder structure like this:
```
.
├── package.json
├── public
│   └── scripts
│       ├── angular
│       │   ├── angular-csp.css
│       │   ├── angular.js
│       │   ├── angular.min.js
│       │   ├── angular.min.js.gzip
│       │   ├── angular.min.js.map
│       │   ├── bower.json
│       │   ├── index.js
│       │   ├── package.json
│       │   └── README.md
│       ├── bootstrap
│       │   ├── bootstrap.js
│       │   ├── bootstrap.min.js
│       │   └── npm.js
│       ├── fl-assert
│       │   ├── assert.js
│       │   └── assert.js.map
│       ├── fl-form
│       │   ├── es6-fl-form.js
│       │   └── fl-form.js
│       ├── jquery
│       │   ├── jquery.js
│       │   ├── jquery.min.js
│       │   ├── jquery.min.map
│       │   ├── jquery.slim.js
│       │   ├── jquery.slim.min.js
│       │   └── jquery.slim.min.map
│       └── x-div
│           └── x-div.js
└── README.md

```
### Set root folder
`dep-linker` gets your dependencies from your `package.json` which is in your project's
root folder. If the script is not being run from the root folder, specify the path
to it:

``` javascript
var DepLinker = require('dep-linker');
DepLinker.setRoot('../../');
```
