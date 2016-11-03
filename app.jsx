'use babel';

import React from 'react';
const dico = require('./dico')
const data = require('./data')
const fs = require('fs')

export default class Main extends React.Component {
  render() {
      var myStyle = {
         fontSize: 100,
         color: '#FF0000'
      }

      return (
        <div className="window">
          <Header />
          <TodoApp />
          <Footer />
        </div>
      );
  }
}

class Header extends React.Component {
   render() {
      return (
         <header className="toolbar toolbar-header">
            <h1 className="title">{dico.application.name}</h1>
         </header>
      );
   }
}

class Footer extends React.Component {
   render() {
      return (
         <footer className="toolbar toolbar-footer">
            <div className="title">
            <a href={dico.application.url} target="_blank">Github</a>
            </div>
         </footer>
      );
   }
}
const myStyle = {
    width: '100%',
    height: '100%'
}

class Content extends React.Component {
   constructor(props) {
      super(props);
		
      this.state = {
         value: 'Initial data...'
      }

      this.updateState = this.updateState.bind(this);
      this.handleTextArea = this.handleTextArea(this)
   }

   updateState(event) {
     console.log(event.target.value)
      this.setState({value: event.target.value});
   }

   handleTextArea(event) {
     console.log(event)
   }

  select(p) {
    console.log(p.item)
    this.updateState(p.item)
  }
  
  render() {
      return (
        <div className="window-content">
          <div className="pane-group">
            <div className="pane-sm sidebar">
              <nav className="nav-group">
                <h5 className="nav-group-title">Fichiers</h5>
                {data.files.map(item =>
                  <span key = {item} className="nav-group-item" onClick={this.updateState} data-value={item}>                    
                    {item}
                  </span> 
                )}
              </nav>
                
            </div>
            <div className="pane">
              <textarea style={{width: '100%', height: '95%'}} value={this.state.value} onChange={this.handleTextArea}/>
            </div>
          </div>
        </div>
      );
  }
}

class ListItems extends React.Component {
   render() {
     console.log(this.props.data.item)
      return (
         <div>
            <p>{this.props.data.item}</p>
         </div>
      );
   }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {items: [], text: ''};
  }

  render() {
    return (
      <div>
        <h3>TODO</h3>
        <TodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange} value={this.state.text} />
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var newItem = {
      text: this.state.text,
      id: Date.now()
    };
    this.setState((prevState) => ({
      items: prevState.items.concat(newItem),
      text: ''
    }));
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    );
  }
}
