import React from 'react'
const ReactMDL = require('react-mdl')
import {
  Button, Card, CardActions, CardMenu, CardText, CardTitle, Chip, ChipContact, Content,
  Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  Footer, FooterLinkList, FooterSection, Header, Icon, IconButton, Layout, List, ListItem,
  Menu, MenuItem, Navigation, Radio, RadioGroup, Textfield
} from 'react-mdl'

const dico = require('./dico')
const data = require('./data')
const fs = require('fs')
const jsonfile = require('jsonfile')
const db = require('./db')

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: data.files, // liste des fichiers à afficher dans le sidebar
      path: '', // fichier courant sélectionné
      pathNew: '', // demande ouverture d'un nouveau fichier
      data: '',  // contenu du textarea
      buttonDisabled: true,
      openDialogConfirm: false      
    }
    this.handleActionMenu = this.handleActionMenu.bind(this);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRecord = this.handleRecord.bind(this);

    this.handleOpenDialogConfirm = this.handleOpenDialogConfirm.bind(this);
    this.handleCloseDialogConfirm = this.handleCloseDialogConfirm.bind(this);
    this.handleValidDialogConfirm = this.handleValidDialogConfirm.bind(this);
  }

  /**
   * Sélection d'un fichier dans le sidebard
   */
  handleActionMenu(arg) {
    console.log('action: ' + arg)
    let sql = new db.TestSql()
    sql.read()
  }
  

  /**
   * Sélection d'un fichier dans le sidebard
   */
  handleSelect(item) {
    console.log('Select: ' + item)
    if ( ! this.state.buttonDisabled ) { 
      // le fichier courant a été modifié
      this.handleOpenDialogConfirm()
      this.setState({ pathNew: item });
    } else {
      this.setState({ path: item, data: this.readFile(item) });
    }
  }

  /**
   * Le textarea a été modifié
   */
  handleChange(event) {
    this.setState({ data: event.target.value });
    this.setState({ buttonDisabled: false })
  }

  /**
   * Lecture du fichierœ
   */
  readFile(path) {
    let data = fs.readFileSync(path)
    this.setState({ buttonDisabled: true })
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
      this.setState({ buttonDisabled: true })
    });
  }

  /**
   * Dialog demande confirmation abandon modification
   */
  handleOpenDialogConfirm() {
    this.setState({openDialogConfirm: true});
  }
  handleCloseDialogConfirm() {
    this.setState({openDialogConfirm: false});
  }
  handleValidDialogConfirm(item) {
    this.setState({openDialogConfirm: false});
    // l'abandon des modifs a été confirmé
    // on peut l'écraser avec le nouveau fichier
    this.setState({ path: this.state.pathNew, data: this.readFile(this.state.pathNew) });
  }

  render() {
    return (
      <div >
        <Layout fixedHeader fixedDrawer>
          <HeaderPage handleActionMenu={this.handleActionMenu}/>
          <Sidebar items={this.state.items} handleSelect={this.handleSelect} />
          <Content>
            <Editor data={this.state.data}
              path={this.state.path}
              buttonDisabled={this.state.buttonDisabled}
              handleChange={this.handleChange}
              handleRecord={this.handleRecord}
            />
          </Content>
          <FooterPage />
          <DialogConform openDialogConfirm={this.state.openDialogConfirm}
            handleCloseDialogConfirm={this.handleCloseDialogConfirm}
            handleValidDialogConfirm={this.handleValidDialogConfirm}
          />
        </Layout>
      </div>
    )
  }
}

class HeaderPage extends React.Component {
  github(event) {
    window.open(dico.application.url
      , 'github'
      , 'toolbar=0,status=0,width=1024,height=800');
  }
  render() {
    return (
      <Header title={dico.application.name}>
        <Navigation>
          <IconButton name="more_vert" id="menu-id" />
          <Menu target="menu-id" align="right">
            <MenuItem onClick={this.props.handleActionMenu}>Action</MenuItem>
            <MenuItem>Another Action</MenuItem>
            <MenuItem disabled>Disabled Action</MenuItem>
            <MenuItem>Yet Another Action</MenuItem>
          </Menu>
        </Navigation>
      </Header>
    )
  }
}

class FooterPage extends React.Component {
  github(event) {
    window.open(dico.application.url
      , 'github'
      , 'toolbar=0,status=0,width=1024,height=800');
  }
  render() {
    return (
      <Footer size="mini">
        <FooterSection type="bottom">
          <FooterLinkList>
            <a href="javascript: ;" onClick={this.github}>Github</a>
          </FooterLinkList>
        </FooterSection>
      </Footer>
    )
  }
}

class Sidebar extends React.Component {
  handleClick(item, event) {
    event.preventDefault()
    // on ferme le Drawer
    var d = document.querySelector('.mdl-layout');
    d.MaterialLayout.toggleDrawer();
    this.props.handleSelect(item, event)
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
              onClick={this.props.handleRecord}><Icon name="backup"/> Enregistrer</Button>
          </CardMenu>
        </Card>
      )
    } else {
      return null
    }
  }
}

class DialogConform extends React.Component {
  render() {
      return (
        <Dialog open={this.props.openDialogConfirm} onCancel={this.props.handleCloseDialogConfirm}>
          <DialogTitle>Demande confirmation</DialogTitle>
          <DialogContent>
            <p>Confirmez-vous l'abandon des modifications effectuées sur le fichier ?</p>
          </DialogContent>
          <DialogActions>
            <Button type='button' onClick={this.props.handleCloseDialogConfirm}>Annuler</Button>
            <Button type='button' onClick={this.props.handleValidDialogConfirm}>Je confirme l'abandon</Button>
          </DialogActions>
        </Dialog>
      )
  }
}
