/*global require, module, Buffer */

/**
 * lifted from reactify npm package to remove unoffical
 * (i.e. not maintained by fb) react-related dep.
 */

var ReactTools = require('react-tools');
var through    = require('through');

function reactify(filename, options) {
  options = options || {};

  var buf = [];

  function write(chunk) {
    if (!Buffer.isBuffer(chunk)) {
      chunk = new Buffer(chunk);
    }
    return buf.push(chunk);
  }

  function compile() {
    var source = Buffer.concat(buf).toString();
    // jshint -W040
    if (isJSXFile(filename, options)) {
      try {
        var output = ReactTools.transform(source, {
          es5: options.target === 'es5',
          sourceMap: true,
          sourceFilename: filename,
          stripTypes: options['strip-types'] || options.stripTypes,
          harmony: options.harmony || options.es6
        });
        this.queue(output);
      } catch (error) {
        error.name = 'ReactifyError';
        error.message = filename + ': ' + error.message;
        error.fileName = filename;
        this.emit('error', error);
      }
    } else {
      this.queue(source);
    }
    return this.queue(null);
    // jshint +W040
  }

  return through(write, compile);
}

function isJSXFile(filename, options) {
  if (options.everything) {
    return true;
  } else {
    // removing js extension drops source-map support
    var extensions = ['jsx', 'js']
          .concat(options.extension)
          .concat(options.x)
          .filter(Boolean)
          .map(function(ext) {
            return ext[0] === '.' ? ext.slice(1) : ext;
          });
    return new RegExp('\\.(' + extensions.join('|') + ')$')
      .exec(filename);
  }
}

module.exports = reactify;
