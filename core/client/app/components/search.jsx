/*global require, module */

var React = require('react');

var TheaterResults = require('./results_theater.js');

var SearchError = require('../state').SearchError;
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

  render: function() {
    var show_str_search_err = !(this.state.str_search === '' ||
                                _is_valid_zip(this.state.str_search));
    var enable_search_button = _is_valid_zip(this.state.str_search);
    var err_msg = null;
    if (show_str_search_err) {
      err_msg = (
          <span>invalid zip code</span>
      );
    }
    return (
        <div>
        <form action="javascript:void(0);">
        <input
      type="text" placeholder="zip code"
      value={this.state.str_search}
      onChange={this.handle_change_str_search}
        />
        <button
      disabled={!enable_search_button}
      onClick={this.handle_click_search}>search</button>
        </form>
        {err_msg}
        </div>
    );
  }
});

var SearchShowtimes = React.createClass({
  render: function() {
    var search_results = this.props.search_results;
    var component_search_results = null;
    if (this.props.is_searching) {
      component_search_results = (
          <div>
          <span>loading...</span>
          </div>
      );
    } else {
      if (search_results) {
        if (search_results instanceof SearchError) {
          component_search_results = (
              <span>{search_results.span_text()}</span>
          );
        } else {
          component_search_results = (
              <TheaterResults
            theaters_data={this.props.search_results}
            zip_code={this.props.str_search_zip}
              />
          );
        }
      }
    }
    return (
        <div>
        <h2>search showtimes</h2>
        <ZipSearchInput />
        {component_search_results}
        </div>
    );
  }
});


var exports = {};

exports.SearchShowtimes = SearchShowtimes;

module.exports = exports;
