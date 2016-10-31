'use babel';
import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

//import FlatButton from 'material-ui/Flat-button/index'
import RaisedButton from 'material-ui/RaisedButton';

injectTapEventPlugin()

const App = () => (
 <MuiThemeProvider muiTheme={getMuiTheme()}>
    <RaisedButtonExampleSimple />
 </MuiThemeProvider>
)

export default class Main extends React.Component {
  render() {
    //return <div>Hello from React with ES6 :)</div>;
    return <MuiThemeProvider muiTheme={getMuiTheme()}>
      <RaisedButtonExampleSimple />
    </MuiThemeProvider>
  }
}

class H1 extends React.Component {
  render() {
    return <h1>Hello from React with ES6 :)</h1>;
  }
}

const style = {
  margin: 5,
};

const RaisedButtonExampleSimple = () => (
  <div>
    <RaisedButton label="Default" style={style} />
    <RaisedButton label="Primary" primary={true} style={style} />
    <RaisedButton label="Secondary" secondary={true} style={style} />
    <RaisedButton label="Disabled" disabled={true} style={style} />
    <br />
    <br />
    <RaisedButton label="Full width" fullWidth={true} />
  </div>
);