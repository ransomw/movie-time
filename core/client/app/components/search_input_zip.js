/*global require, module */

var React = require('react');

var rt_search_input = require('../templates/search_input.rt');

var actions = require('../state').actions;

/* test for valid zip code
 */
var _is_valid_zip = function (str_zip) {
  return str_zip.match(/^\d{5}$/);
};

var ZipSearchInput = React.createClass({
  getInitialState: function() {
    return {
      str_search: ''
    };
  },

  handle_change_str_search: function(ev) {
    this.setState({str_search: ev.target.value});
  },

  handle_click_search: function (ev) {
    actions.search_zip(this.state.str_search);
    this.setState({str_search: ''});
  },

  is_zip_valid: function () {
    return _is_valid_zip(this.state.str_search);
  },

  show_input_err: function () {
    return !(this.state.str_search === '' ||
             _is_valid_zip(this.state.str_search));
  },

  render: rt_search_input
});

var exports = ZipSearchInput;

module.exports = exports;
