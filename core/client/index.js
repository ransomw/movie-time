/*global require, module, __dirname */

var path = require('path');
var fs = require('fs');

const browserify = require('browserify');
const watchify = require('watchify');
const react_templatify = require('react-templatify');
const jsx_transform = require('./jsx_transform');

const build_js_file = function (path_src, path_out, opt_args) {
	const opts = opt_args || {};
	const make_write_bundle = function (bfy, path_bundle) {
		return function () {
      return new Promise(function (resolve, reject) {
			  var stream_bundle = bfy.bundle();
			  stream_bundle.pipe(fs.createWriteStream(path_bundle));
			  stream_bundle.on('end', function () {
				  resolve();
			  });
      });
		};
	};
  const arr_plugins = [];
  if (opts.cts) {
    arr_plugins.push(watchify);
  }
  const arr_transforms = [];
  arr_transforms.push(jsx_transform);
  arr_transforms.push(react_templatify);
	const bfy = browserify({
    entries: [path_src],
    cache: {},
    packageCache: {},
    debug: true, // source maps
    plugin: arr_plugins,
    transform: arr_transforms
  });
  var write_bundle = make_write_bundle(bfy, path_out);
  if (opts.cts) {
    bfy.on('update', write_bundle);
  }
  return write_bundle();
};

const build_js = function (dir_out, opt_args) {
  return Promise.all([
    build_js_file(
      path.join(__dirname, 'app', 'home.js'),
      path.join(dir_out, 'home.js'),
      opt_args
    )
  ]);
};

var exports = {};

exports.build_js = build_js;

module.exports = exports;
