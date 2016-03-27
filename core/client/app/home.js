/*global require */

var React = require('react');
var ReactDOM = require('react-dom');

var SearchShowtimes = require('./components/search.jsx').SearchShowtimes;

var state = require('./state');

var _render = function () {
  var app_state = state.get_state();
  var main_component = React.createElement(SearchShowtimes, app_state);
  ReactDOM.render(main_component, document.getElementById('app'));
};

state.on_state_change(_render);

_render();
