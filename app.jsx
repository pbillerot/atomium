import React from 'react'
const ReactMDL = require('react-mdl')
import {
  Button, Card, CardActions, CardMenu, CardText, CardTitle, Content, Drawer, Footer, Header, Layout, List, ListItem,
  Navigation, Radio, RadioGroup, Textfield
} from 'react-mdl'

const dico = require('./dico')
const data = require('./data')
const fs = require('fs')
const jsonfile = require('jsonfile')

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: data.files, // liste des fichiers à afficher dans le sidebar
      path: '', // fichier courant sélectionné
      data: '',  // contenu du textarea
      buttonDisabled: true 
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRecord = this.handleRecord.bind(this);
  }

  /**
   * Sélection d'un fichier dans le sidebard
   */
  handleSelect(item) {
    console.log('Select: ' + item)
    this.setState({ path: item, data: this.readFile(item) });
  }

  /**
   * Le textarea a été modifié
   */
  handleChange(event) {
    this.setState({ data: event.target.value });
    this.setState({buttonDisabled: false})
    //document.querySelector('#button_id').removeAttribute('disabled')
  }

  /**
   * Lecture du fichierœ
   */
  readFile(path) {
    let data = fs.readFileSync(path)
    return data
  }

  /**
   * Demande d'enregistrement
   */
  handleRecord(event) {
    console.log('recording...')
    fs.writeFile(this.state.path, this.state.data, (err) => {
      if (err) throw err;
      console.log(this.state.path + ' a été enregistré');
      this.setState({buttonDisabled: true})
      //document.querySelector('#button_id').setAttribute('disabled', 'disabled')
    });
  }

  render() {
    return (
      <div >
        <Layout fixedHeader fixedDrawer>
          <Header title={dico.application.name} />
          <Sidebar items={this.state.items} handleSelect={this.handleSelect} />
          <Content>
            <Editor data={this.state.data}
              path={this.state.path}
              buttonDisabled={this.state.buttonDisabled}
              handleChange={this.handleChange}
              handleRecord={this.handleRecord} />
          </Content>
          <Footer size="mini" />
        </Layout>
      </div>
    )
  }
}

class Sidebar extends React.Component {
  handleClick(item, event) {
    event.preventDefault()
    this.props.handleSelect(item, event)
    // on ferme le Drawer
    var d = document.querySelector('.mdl-layout');
    d.MaterialLayout.toggleDrawer();
  }
  render() {
    return (
      <Drawer title={dico.application.menuTitle}>
        <Navigation>
          {this.props.items.map(item =>
            <a onClick={(event) => this.handleClick(item, event)} key={item}>{item}</a>
          )}
        </Navigation>
      </Drawer>
    );
  }
}

class Editor extends React.Component {
  render() {
    const isAvecFile = this.props.path.length > 0 ? true : false
    if (isAvecFile) {
      return (
        <Card style={{ width: '100%', margin: 'auto' }}>
          <CardTitle>{this.props.path}</CardTitle>
          <CardText>
            <textarea rows={22} style={{ width: '100%', height: '100%' }}
              value={this.props.data}
              onChange={this.props.handleChange} />
          </CardText>
          <CardMenu style={{ color: '#fff' }}>
            <Button id="button_id" raised colored disabled={this.props.buttonDisabled} 
              onClick={this.props.handleRecord}>Enregistrer</Button>
          </CardMenu>
        </Card>
      )
    } else {
      return null
    }
  }
}

