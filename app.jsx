const React = require('react')
const dico = require('./dico')
const data = require('./data')
const fs = require('fs')
const jsonfile = require('jsonfile')

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
      data: ''  // contenu du textarea
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Sélection d'un fichier dans le sidebard
   */
  handleSelect(event) {
    this.setState({ path: event.target.value, data: this.readFile(event.target.value) });
  }

  /**
   * Le textarea a été modifié
   */
  handleChange(event) {
    this.setState({ data: event.target.value });
  }

  /**
   * Lecture du fichierœ
   */
  readFile(path) {
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
            <Editor dataProps={this.state.data} pathProps={this.state.path} handleChangeProps={this.handleChange}/>
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
            <button className="btn btn-default" onClick={this.props.handleSelectProps} value={item}>{item}</button>
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
    fs.writeFile(this.props.pathProps, this.props.dataProps, (err) => {
      if (err) throw err;
      console.log(this.props.pathProps + ' a été enregistré');
    });
  }

  render() {
    const isAvecFile = this.props.pathProps.length > 0 ? true : false
    if (isAvecFile) {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <header className="toolbar toolbar-header">
            <div style={{ margin: 5 }} className="pull-left">{this.props.pathProps}</div>
            <button style={{ margin: 5 }} className="btn btn-default pull-right" onClick={this.handleRecord} >
              Enregistrer</button>
          </header>
          <textarea style={{ width: '100%', height: '93%' }}
            value={this.props.dataProps} onChange={this.props.handleChangeProps} />
        </div>
      )
    } else {
      return null
    }
  }
}
