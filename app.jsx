const React = require('react')
const ReactMDL = require('react-mdl')
const ReactMarkdown = require('react-markdown')
const sqlite3 = require('sqlite3').verbose();

import {
    Button, Card, CardActions, CardMenu, CardText, CardTitle, Chip, ChipContact, Content,
    Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
    Footer, FooterLinkList, FooterSection, Header, Icon, IconButton, Layout, List, ListItem,
    Menu, MenuItem, Navigation, Radio, RadioGroup, Textfield, Table, TableHeader
} from 'react-mdl'

const Dico = require('./dico')
const data = require('./data')
const sqlite = require('./sqlite')
const fs = require('fs')

var ContentType = {
    EDITOR: 'EDITOR',
    VIEW: 'VIEW',
    HELP: 'HELP'
};

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Titre de la fenêtre
            title: Dico.application.title,
            // Dialog
            apropos: false,
            // Type de contenu à afficher dans le container principal
            content: null, // ContentType
            // DICTIONNAIRE
            table: 'USERS',
            view: 'VUE_1',
            form: 'FORM_1',
            rows: [],
            // Tableur
            rowsSelected: [],
        }
        this.handleState = this.handleState.bind(this);
        this.handleClickView = this.handleClickView.bind(this);
    }

    /**
    * Juste pour déclencher une actualisation de données du contexte
    */
    handleState(state) {
        console.log(JSON.stringify(state, null, 4))
        this.setState(state)
    }

    /**
     * Sélection d'une vue
     */
    handleClickView(view, event) {
        //console.log('Select: ' + view)
        this.setState({ view: view, title: Dico.tables[this.state.table].views[view].title })
        let db = new sqlite3.Database(Dico.tables[this.state.table].basename, sqlite3.OPEN_READONLY);
        let select = ''
        let cols = Dico.tables[this.state.table].views[view].cols
        //console.log(JSON.stringify(cols['IDUSER'], null, 4))
        Object.keys(cols).forEach((key) => {
            select += select.length > 0 ? ', ' + key : key
        })
        select = 'SELECT ' + select + ' FROM ' + this.state.table
        //console.log(select)
        var getAll = (callback) => {
            db.serialize(function() {
                db.all(select, function(err, rows) {
                    if (err) throw err
                    callback(rows)
                });
                db.close()
            });
        }
        getAll((rows) => this.handleState({ content: ContentType.VIEW, rows: rows }))
    }

    render() {
        return (
            <div >
                <Layout fixedHeader fixedDrawer>
                    <HeaderPage ctx={this} />
                    <Sidebar ctx={this} />
                    <Content>
                        <ContentPage ctx={this} />
                    </Content>
                    <FooterPage ctx={this} />
                    <APropos ctx={this} />
                </Layout>
            </div>
        )
    }
}

class ContentPage extends React.Component {
    render() {
        switch (this.props.ctx.state.content) {
            case ContentType.VIEW:
                return <Tableur ctx={this.props.ctx} />
            case ContentType.HELP:
                return <Help ctx={this.props.ctx} />
            default:
                return null
        }
    }
}

class HeaderPage extends React.Component {
    render() {
      if (this.props.ctx.state.rowsSelected.length > 0) {
        return (
            <Header title={this.props.ctx.state.title}>
                <Navigation>
                    <IconButton name="edit" id="action_edit" />
                    <IconButton name="delete" id="action_delete" />
                </Navigation>
            </Header>
        )
      } else {
        return (
            <Header title={this.props.ctx.state.title}>
            </Header>
        )
      }
    }
}

class FooterPage extends React.Component {
    github(event) {
        window.open(Dico.application.url
            , 'github'
            , 'toolbar=0,status=0,width=1024,height=800');
    }
    render() {
        return (
            <Footer size="mini">
                <FooterSection type="bottom">
                    <FooterLinkList>
                        <a href="javascript: ;" onClick={this.github}>Github</a>
                        <a href="javascript: ;" onClick={(data) => new sqlite.Table('USERS').dump()}>Dump</a>
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
        this.closeDrawer()
        this.props.ctx.handleSelect(item, event)
    }
    handleClickView(item, event) {
        event.preventDefault()
        // on ferme le Drawer
        this.closeDrawer()
        this.props.ctx.handleClickView(item, event)
    }
    closeDrawer() {
        document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }
    handleAPropos(e) {
        e.preventDefault
        this.closeDrawer()
        this.props.ctx.handleState({ apropos: true })
    }
    handleHelp(e) {
        e.preventDefault
        this.closeDrawer()
        this.props.ctx.setState({ title: 'Aide', content: ContentType.HELP })
    }
    render() {
        var viewSelected = this.props.ctx.state.view
        return (
            <Drawer title={Dico.application.title}>
                <Navigation>
                    {Object.keys(Dico.tables[this.props.ctx.state.table].views).map(key =>
                        <a onClick={(event) => this.handleClickView(key, event)} key={key}
                        selected={viewSelected == key ? 'is_active': ''} active>
                            {Dico.tables[this.props.ctx.state.table].views[key].title}
                        </a>
                    )}
                    <hr />
                    <a onClick={(e) => this.handleHelp(e)}>Aide</a>
                    <a onClick={(e) => this.handleAPropos(e)}>A propos</a>
                </Navigation>
            </Drawer>
        );
    }
}

class Help extends React.Component {
    render() {
        let data = fs.readFileSync(__dirname + '/help.md', 'utf8')
        return (
            <Card style={{ width: '100%', margin: 'auto' }}>
                <CardText>
                    <ReactMarkdown source={data} />
                </CardText>
            </Card>
        )
    }
}

class APropos extends React.Component {
    render() {
        return (
            <Dialog open={this.props.ctx.state.apropos} onCancel={(data) => this.props.ctx.setState({ apropos: false })}>
                <DialogTitle>{Dico.application.title}</DialogTitle>
                <DialogContent>
                    <p>{Dico.application.desc}</p>
                    <p>{Dico.application.copyright}</p>
                </DialogContent>
                <DialogActions>
                    <Button type='button' onClick={(data) => this.props.ctx.setState({ apropos: false })}>Fermer</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

class Tableur extends React.Component {
    selectionChanged(data) {
        this.props.ctx.handleState({ rowsSelected: data })
    }
    render() {
        return (
            <Card style={{ width: '100%', margin: 'auto' }}>
                {/*
                <CardTitle>{Dico.tables[this.props.ctx.state.table].
                    views[this.props.ctx.state.view].label}</CardTitle>
                */}
                <CardText>
                    <Table
                        shadow={0}
                        sortable
                        selectable
                        rowKeyColumn='IDUSER'
                        rows={this.props.ctx.state.rows}
                        onSelectionChanged={(data) => this.selectionChanged(data)}
                        >
                        {
                            Object.keys(Dico.tables[this.props.ctx.state.table].
                                views[this.props.ctx.state.view].cols).map(key =>
                                    <TableHeader key={key}
                                        name={key}
                                        tooltip={Dico.tables[this.props.ctx.state.table].rubs[key].tooltip}
                                        >
                                        {Dico.tables[this.props.ctx.state.table].rubs[key].label_short}
                                    </TableHeader>
                                )
                        }
                    </Table>
                </CardText>
                {/*
                <CardMenu style={{ color: '#fff' }}>
                    <Button id="button_id" raised><Icon name="help" /> Guide</Button>
                </CardMenu>
                */}
            </Card>
        )
    }
}

function getObj(objs, id) {
    var response = null
    objs.forEach((obj) => {
        if (obj.id == id) {
            response = obj
        }
    });
    if (response == null) throw new Error('Element "' + id + '" not found')
    //console.dir(response)
    return response;
}