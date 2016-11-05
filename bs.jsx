const React = require('react')
const dico = require('./dico')
const data = require('./data')
const fs = require('fs')
const jsonfile = require('jsonfile')

import {
  Breadcrumb, Button, Col, ControlLabel, FormControl, FormGroup, Grid, Modal,
  Nav, Navbar, NavItem, Row, Well
} from 'react-bootstrap';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: data.files, // liste des fichiers à afficher dans le sidebar
      path: '', // fichier courant sélectionné
      data: ''  // contenu du textarea
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRecord = this.handleRecord.bind(this);
  }

  /**
   * Sélection d'un fichier dans le sidebard
   */
  handleSelect(item) {
    this.setState({ path: item, data: this.readFile(item) });
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

  /**
   * Demande d'enregistrement
   */
  handleRecord(event) {
    fs.writeFile(this.state.path, this.state.data, (err) => {
      if (err) throw err;
      console.log(this.state.path + ' a été enregistré');
    });
  }

  render() {
    return (
      <div>
        <Header />
        <Content items={this.state.items}
          data={this.state.data} path={this.state.path}
          handleSelect={this.handleSelect} handleChange={this.handleChange} />
        <Footer path={this.state.path} handleRecord={this.handleRecord}/>
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <Navbar staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">{dico.application.name}</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    );
  }
}

class Footer extends React.Component {

  render() {
    const isAvecFile = this.props.path.length > 0 ? true : false
    if (isAvecFile) {
      return (
        <Navbar fixedBottom>
          <Navbar.Form pullRight>
            <Button onClick={this.props.handleRecord}>Enregistrer</Button>
          </Navbar.Form>
        </Navbar>
      )
    } else {
      return (
        <Navbar fixedBottom>
        </Navbar>
      );

    }
  }
}

/**
 * Alimentation de la partie centrale
 */
class Content extends React.Component {

  render() {
    return (
      <Grid style={{ height: '100%' }}>
        <Row style={{ height: '100%' }}>
          <Col xs={3} style={{ height: '100%' }}>
            <Sidebar items={this.props.items} handleSelect={this.props.handleSelect} />
          </Col>
          <Col xs={9} style={{ height: '100%' }}>
            <Editor data={this.props.data} path={this.props.path} handleChange={this.props.handleChange} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

class Sidebar extends React.Component {
  render() {
    return (
      <Nav bsStyle="pills" stacked activeKey={1} onSelect={this.props.handleSelect} style={{ height: '100%' }}>
        {this.props.items.map(item =>
          <NavItem key={item} eventKey={item}>{item}</NavItem>
        )}
      </Nav>
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
    fs.writeFile(this.props.path, this.props.data, (err) => {
      if (err) throw err;
      console.log(this.props.path + ' a été enregistré');
    });
  }

  render() {
    const isAvecFile = this.props.path.length > 0 ? true : false
    if (isAvecFile) {
      return (
        <div style={{ height: '100%' }}>
          <FormGroup controlId="formControlsTextarea" style={{ height: '100%' }}>
            <ControlLabel>{this.props.path}</ControlLabel>
            <FormControl componentClass="textarea" placeholder="textarea" style={{ height: '100%' }}
              value={this.props.data} onChange={this.props.handleChange}
              />
          </FormGroup>
        </div>
      )
    } else {
      return <Well style={{ height: '100%' }}>{dico.application.name}</Well>
    }
  }
}
