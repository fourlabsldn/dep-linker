# Dependencies Linker

Link your npm dependencies to serve them to the front-end.

Automatically link your project's dependency files to a folder like `public/scripts`
so that you can serve them to the front end.

## Install
```
npm install --save-dev dep-linker
```

## Use
``` javascript

var depLinker = require('dep-linker');
depLinker.linkDependenciesTo('./public/scripts')
  .then(() => console.log('Finished.'));
  // Done! All your dependencies ready to be served to the front-end
```
*dev-dependencies are not linked*.

## Task runners
There still isn't a specific wrapper for any task runner, but given that this
is just javascript for now you can use it like this and it will work like a charm:

### Gulp
``` javascript
var depLinker = require('dep-linker');

gulp.task('link-dependencies', function () {
  return depLinker.linkDependenciesTo('./public/scripts');
});
```

### Grunt
``` javascript
var depLinker = require('dep-linker');

grunt.task.registerTask('link-dependencies', 'Copy npm dependencies', function () {
    var done = this.async(); // <-- must be async
    return depLinker.linkDependenciesTo('public/scripts')
      .then(() => done())
      .catch(() => done());
});

```

## Options

### Set root folder
`dep-linker` gets your dependencies from your `package.json` which is in your project's
root folder. If the script is not being run from the root folder, specify the path
to it:

``` javascript
var depLinker = require('dep-linker');
depLinker.setRoot('../../');
```
