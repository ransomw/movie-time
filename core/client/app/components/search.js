/*global require, module */

var React = require('react');

var TheaterResults = require('./results_theater.js');

var rt_search_loading = require('../templates/search_loading.rt');
var rt_search_error = require('../templates/search_error.rt');
var rt_search_showtimes = require('../templates/search_showtimes.rt');

var SearchError = require('../state').SearchError;

var ZipSearchInput = require('./search_input_zip');

var SearchLoading = React.createClass({
  render: rt_search_loading
});

var SearchErrorComp = React.createClass({
  render: rt_search_error
});

var SearchShowtimes = React.createClass({

  get_component_search_results: function () {
    var search_results = this.props.search_results;
    var component_search_results = null;
    if (this.props.is_searching) {
      return React.createElement(
        SearchLoading, {});
    }
    if (!search_results) {
      return null;
    }
    if (search_results instanceof SearchError) {
      return React.createElement(
        SearchErrorComp, {
          search_err: search_results
        });
    }
    return React.createElement(
      TheaterResults, {
        theaters_data: this.props.search_results,
        zip_code: this.props.str_search_zip
      });
  },

  render: rt_search_showtimes
});


var exports = {};

exports.SearchShowtimes = SearchShowtimes;

module.exports = exports;
