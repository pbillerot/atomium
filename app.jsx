const React = require('react')
const dico = require('./dico')
const data = require('./data')
const fs = require('fs')

export default class Main extends React.Component {
  render() {
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

/**
 * Alimentation de la partie centrale
 */
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: data.files, // liste des fichiers à afficher dans le sidebar
      path: '', // fichier courant sélectionné
      data: ''
    }
    this.handleSelect = this.handleSelect.bind(this);
  }

  /**
   * Sélection d'un fichier dans le sidebard
   */
  handleSelect(event) {
    console.log(`handleSelect: {event.target.value}`)
    this.setState({ path: event.target.value, data: this.readFile(event.target.value) });
  }

  /**
   * Lecture du fichierœ
   */
  readFile(path) {
    console.log(`readFile: {path}`)
    let data = fs.readFileSync(path)
    return data
  }


  render() {
    return (
      <div className="window-content">
        <div className="pane-group">
          <div className="pane-sm sidebar">
            <Sidebar itemsProps={this.state.items} handleSelectProps={this.handleSelect} />
          </div>
          <div className="pane">
            <Editor dataProps={this.state.data} />
          </div>
        </div>
      </div>
    );
  }
}

class Sidebar extends React.Component {
  render() {
    return (
      <nav className="nav-group">
        <h5 className="nav-group-title">Fichiers</h5>
        {this.props.itemsProps.map(item =>
          <span key={item} className="nav-group-item">
            <button onClick={this.props.handleSelectProps} value={item}>{item}</button>
          </span>
        )}
      </nav>

    );
  }
}

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.handleRecord = this.handleRecord.bind(this);
  }

  /**
   * Demande d'enregistrement
   */
  handleRecord(event) {
    console.log(event.target.value)
  }

  // on ne traite pas le changement de contenu du textarea
  handleChange(event) {
    // ras
  }

  render() {
    return (
      <textarea style={{ width: '100%', height: '98%' }}
        value={this.props.dataProps} onChange={this.handleChange} />
    );
  }
}
