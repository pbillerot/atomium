'use babel';
import React from 'react'
import Appbar from 'muicss/lib/react/appbar'
import Button from 'muicss/lib/react/button'
import Container from 'muicss/lib/react/container'
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import Panel from 'muicss/lib/react/panel';

export default class Main extends React.Component {
  render() {
    return (
      <div>
      <ContainerExample />
      </div>
    )
  }
}

class ContainerExample extends React.Component {
  onClick() {
    console.log('clicked on button');
  }
  
  render() {
    return (
      <div>
        <AppbarExample />
        <Container>
          <Panel>
            <Button onClick={this.onClick}>My Button</Button>
          </Panel>
        </Container>
      </div>
    );
  }
}

class AppbarExample extends React.Component {
  render() {
    let s1 = {verticalAlign: 'middle'};
    let s2 = {textAlign: 'right'};

    return (
      <Appbar>
       <table width="100%">
         <tbody>
           <tr style={s1}>
             <td className="mui--appbar-height">Left Side</td>
             <td className="mui--appbar-height" style={s2}>Right Side</td>
           </tr>
         </tbody>
       </table>
      </Appbar>
    );
  }
}

class DropdownExample extends React.Component {
  render() {
    return (
      <Dropdown color="primary" label="Dropdown">
        <DropdownItem link="#/link1">Option 1</DropdownItem>
        <DropdownItem>Option 2</DropdownItem>
        <DropdownItem>Option 3</DropdownItem>
        <DropdownItem>Option 4</DropdownItem>
      </Dropdown>
    );
  }
}

class LigneExample extends React.Component {
  render() {
    let style = {height: '10px'};

    return (
      <div>
        <div className="mui--bg-primary" style={style}></div>
        <div className="mui--bg-primary-dark" style={style}></div>
        <div className="mui--bg-primary-light" style={style}></div>
        <br />
        <div className="mui--bg-accent" style={style}></div>
        <div className="mui--bg-accent-dark" style={style}></div>
        <div className="mui--bg-accent-light" style={style}></div>
        <br />
        <div className="mui--bg-danger" style={style}></div>
      </div>
    );
  }
}

class H1 extends React.Component {
  render() {
    return <h1>Hello from React with ES6 :)</h1>;
  }
}
