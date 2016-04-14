var React = require('react');
var ReactDOM = require('react-dom');

var Widgets = React.createClass({
  items: [
    {title: "Clock",   content: "I tell time"},
    {title: "Weather", content: "I'm cold today"}
  ],

  render: function() {
    return <Tabs items={this.items}/>;
  }
});

var Tabs = React.createClass({
  getInitialState: function(){
    return {index: 0};
  },

  clicked: function(index) {
    this.setState({index: index});
  },

  render: function() {
    self = this;
    return (
      <div>
        <ul>{this.props.items.map(function(m, i) {
          return(
              <Header title={m.title} key={i} index={i} focused={self.state.index} onClick={self.clicked.bind(self, i)} />
          );
        })}
        </ul>
        <article>{this.props.items[this.state.index].content}</article>
      </div>
    );
  }
});

var Header = React.createClass({
  fontWeight: function () {
    return(this.props.index === this.props.focused ? "bolded" : "");
  },

  render: function(){
    return (
      <li onClick={this.props.onClick } >
        <h1 className={this.fontWeight()} >
          {this.props.title}
        </h1>
      </li>
    )
  }
});

var Clock = React.createClass({
  getInitialState: function () {
    return { time: new Date() };
  },

  componentDidMount: function () {
    this.interval = setInterval(() => this.setState({ time: new Date() }), 1000)
  },


  componentWillUnmount: function () {
    clearInterval(this.interval);
    this.interval = 0;
  },

  render: function () {
    return React.createElement(
      'div',
      {},
      <span>{this.state.time.toString()}</span>
    );
  }
});

var Weather = React.createClass({
  getInitialState: () => { return {weather: {}}; },

  componentDidMount: function () {
    var self = this
    navigator.geolocation.getCurrentPosition(function(position) {
      this.getWeather(position.coords.latitude, position.coords.longitude);
    }.bind(this));
  },
  componentWillUnmount: () => { this.xhr.abort() },

  getWeather: function (lat, lon)  {
    var url, query, xhr;
    url = "http://api.openweathermap.org/data/2.5/weather";
    query = "?lat="+lat+"&lon="+lon+"&units=imperial&APPID=645c5d39c7603f17e23fcaffcea1a3c1";
    url = url + query;
    this.xhr = xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      globalXHR = xhr;
      if (xhr.status >= 200 && xhr.status <= 400) {
        
        var result = JSON.parse(xhr.responseText);
        this.setState({
          weather: result
        });
      } else {
        this.setState({weather: "error retrieveing"});
      }
    }.bind(this);

    xhr.onerror = () => { this.setState({weather: "error sending"}) }
    xhr.send();
  },

  displayWeather: function () {
    // var w = JSON.parse(this.state.weather);
    var w = this.state.weather
    
    if (this.isPacking(w)) {
      return w.main.temp+", "+w.weather[0].description;
    } else if (w instanceof Object){
      return "loading";
    } else {
      return " hi from here";
    }
  },
  isPacking: (obj) => {
    if (!(obj instanceof Object)) return false;
    for (x in obj) { return true; }
    return false
  },

  render: function () {
    return React.createElement(
      'div',
      {},
      // "hello world"
      <span>Weather: {this.displayWeather()}</span>
    );
  }
});

var NY1 = React.createClass ({
  render: () => React.createElement('div', {}, <Clock />, <Weather />)
})

var Autocomplete = require('./autocomplete');

var words = ["Shakespearean", "sonnets", "in", "middle", "school"]
document.addEventListener("DOMContentLoaded", function(){
  ReactDOM.render(<Widgets />, document.getElementById('tabs') );
  ReactDOM.render(<NY1 />, document.getElementById('weather-clock') );
  ReactDOM.render(<Autocomplete words={words}/>, document.getElementById('autocomplete') );
});

