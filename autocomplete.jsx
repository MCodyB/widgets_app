var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var Autocomplete = React.createClass({
  getInitialState: () => { return {value: ""} },

  updateVal: function (e) {
    this.setState({value: e.target.value})
  },

  setVal: function (e) {
    this.setState({value: e.target.textContent})
  },

  render: function() {
    return <article>
      <input
        id='q'
        type='text'
        value={this.state.value}
        onChange={this.updateVal} />
      <ul>
        <ReactCSSTransitionGroup
         transitionName="auto"
         transitionEnterTimeout={500}
         transitionLeaveTimeout={500} >{
          this.props.words.map(function(word, i) {
            console.log(word)
            if (word.match("^" + this.state.value)) {
              return <li key={i} onClick={this.setVal}>{word}</li>;
            }
          }.bind(this))
        }</ReactCSSTransitionGroup>
      </ul>
      </article>;
  }
});

module.exports = Autocomplete;