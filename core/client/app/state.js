/*global require, module */

/**
 * simplified version of flux pattern found in libraries like redux..
 * while usual guarantees are expected outside of this module, namely,
 * 1) the state object itself is read-only and immutable,
 * 2) state is updated by 'actions' (implemented here as functions)
 *    which may not return stateful data, and
 * 3) updates to state are commucated by event-like mechanisms,
 * the internal implementation is free to be (and is very) ad-hoc.
 */

var _ = require('lodash');
var freeze = require('deep-freeze');
var nets = require('nets');

var INITIAL_STATE = {
  str_search_zip: '',
  search_results: undefined,
  is_searching: false
};

// private variables
console.log("setting app initial state");
var _app_state = _.cloneDeep(INITIAL_STATE);
var _change_listeners = [];

/**
 * custom Error type example:
 * this sort of boilerplate allows usual throw and try/catch semantics
 * with additional state (arguments to constructor) and functionality
 * (prototype functions).
 */
var SearchError = function (message) {
  this.name = 'SearchError';
  this.message = message || "search error";
  this.stack = (new Error()).stack;
};
SearchError.prototype = Object.create(Error.prototype);
SearchError.prototype.constructor = SearchError;
SearchError.prototype.span_text = function () {
  return this.message;
};

// state is read-only and immutable outside of this module
var get_state = function () {
  return freeze(_.cloneDeep(_app_state));
};

var on_state_change = function (fn) {
  _change_listeners.push(fn);
};

var _update_state = function (new_state) {
  _app_state = new_state;
  _change_listeners.forEach(function (fn) {
    fn();
  });
};

var _start_search = function () {
  var old_state = _.cloneDeep(_app_state);
  var new_state = _.cloneDeep(old_state);
  new_state.is_searching = true;
  _update_state(new_state);
};

var action_search_zip = function (str_search) {
  var old_state = _.cloneDeep(_app_state);
  var new_state = _.cloneDeep(old_state);
  _start_search();
  nets({
    url: 'api/zipcodes/' + str_search,
    jar: true, // cookies
    json: true,
    encoding: undefined
  }, function(err, resp, body) {
    if (err) {
      new_state.search_results = new SearchError(
        "server communication error");
    } else {
      if (body.theaters) {
        new_state.str_search_zip = str_search;
        new_state.search_results = body.theaters;
      } else {
        new_state.search_results = new SearchError(
          "server response error");
      }
    }
    new_state.is_searching = false;
    _update_state(new_state);
  });
};


var exports = {};

exports.get_state = get_state;
exports.on_state_change = on_state_change;
exports.actions = Object.freeze({
  search_zip: action_search_zip
});
exports.SearchError = SearchError;

module.exports = exports;
