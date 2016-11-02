'use babel';

import React from 'react';
import ReactDOM from 'react-dom'

export default class Main extends React.Component {
  render() {
      var myStyle = {
         fontSize: 100,
         color: '#FF0000'
      }

      return (
        <div className="window">
          <Header />
          <Content />
          <Footer />
        </div>
      );
  }
}

class Header extends React.Component {
   render() {
      return (
         <header className="toolbar toolbar-header">
            <h1 className="title">HEADER</h1>
         </header>
      );
   }
}

class Footer extends React.Component {
   render() {
      return (
         <footer className="toolbar toolbar-footer">
            <div className="title">
            <a href="https://github.com/pbillerot/atomium" target="_blank">Github</a>
            </div>
         </footer>
      );
   }
}

class Content extends React.Component {
   render() {
      return (
        <div className="window-content">
          <div className="pane-group">
            <div className="pane-sm sidebar">SIDEBAR</div>
            <div className="pane">CONTENT</div>
          </div>
        </div>
      );
   }
}


