/*global require, module */

var React = require('react');

/* search results for a movie at a particular theater
 */
var Movie = React.createClass({
  render: function() {
    return (
        <div>
        <span>{this.props.movie_data.name}</span>
        <span>{this.props.movie_data.times.join(', ')}</span>
        </div>
    );
  }
});

/* search results for a particular theater
 */
var Theater = React.createClass({
  render: function() {
    var list_body = this.props.theater_data.movies.map(
      function (movie_data, idx) {
        return (
            <li key={idx}> <Movie movie_data={movie_data} /> </li>
        );
      });
    return (
        <div>
        <h5>{this.props.theater_data.name}</h5>
        <span>{this.props.theater_data.address}</span>
        <ul>{list_body}</ul>
        </div>
    );
  }
});

/* display search results by theater
 */
var TheaterResults = React.createClass({
  render: function() {
    var list_body = this.props.theaters_data.map(
      function (theater_data, idx) {
        return (
            <li key={idx}> <Theater theater_data={theater_data} /> </li>
        );
      });
    return (
        <div>
        <h3>search results for {this.props.zip_code}</h3>
        <ul> {list_body} </ul>
        </div>
    );
  }
});

var exports = TheaterResults;
module.exports = exports;
