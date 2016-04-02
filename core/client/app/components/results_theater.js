/*global require, module */

var React = require('react');

var rt_theater_results = require('../templates/theater_results.rt');

var TheaterResults = React.createClass({
  render: rt_theater_results
});

var exports = TheaterResults;
module.exports = exports;
