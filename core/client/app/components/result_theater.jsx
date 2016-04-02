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
var TheaterResult = React.createClass({
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

var exports = TheaterResult;
module.exports = exports;
