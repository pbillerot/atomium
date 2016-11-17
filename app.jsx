const React = require('react')
const ReactDOM = require('react-dom')
const ReactMarkdown = require('react-markdown-it')
const sqlite3 = require('sqlite3').verbose();

import {
    Button, Card, CardActions, CardMenu, CardText, CardTitle, Cell, Chip, ChipContact, Content,
    Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
    FABButton, Footer, FooterLinkList, FooterSection, Grid, Header, Icon, IconButton, Layout, List, ListItem,
    Menu, MenuItem, Navigation, Radio, RadioGroup, Switch, Textfield, Table, TableHeader
} from 'react-mdl'

const Dico = require('./dico')
const data = require('./data')
const sqlite = require('./sqlite')
const fs = require('fs')

//import {Field} from './fields.jsx'

var PageLayout = {
    HOME: 'HOME',
    VIEW: 'VIEW',
    FORM: 'FORM',
    HELP: 'HELP'
};
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Layout
            layout: 'HOME', // HOME ou FORM
            title: Dico.application.title, // Titre de la fenêtre
            // Dialog
            about: false,
            // DICTIONNAIRE
            table: 'USERS',
            view: 'VUE_1',
            form: 'FORM_1',
            key_id: null,
            key_value: null,
            rows: [],
            action_form: 'UPDATE', // INSERT UPDATE DELETE
            fields_valid: true,
            // Tableur
            rows_selected: [],
        }
        this.handleState = this.handleState.bind(this);
        this.handleOpenView = this.handleOpenView.bind(this);
    }

    /**
    * Juste pour déclencher une actualisation de données du contexte
    */
    handleState(state) {
        //console.log(JSON.stringify(state, null, 4))
        this.setState(state)
    }

    /**
     * Enregistrement des données du formulaire dans la table
     */
    handleUpdateForm(action) {
        //console.log('handleUpdateForm: ' + action)
        let rubs = Dico.tables[this.state.table].rubs
        let fields = Dico.tables[this.state.table].forms[this.state.form].rubs
        let sql = ''

        switch (action) {
            case 'UPDATE':
                Object.keys(fields).forEach((key) => {
                    sql += sql.length > 0 ? ", " : ""
                    sql += key + " = '" + fields[key].value + "'"
                })
                sql = 'UPDATE ' + this.state.table + ' SET ' + sql
                sql += " WHERE " + this.state.key_id + " = '" + this.state.key_value + "'"
                break;
            case 'INSERT':
                Object.keys(fields).forEach((key) => {
                    sql += sql.length > 0 ? ", " : ""
                    sql += key
                })
                sql = "(" + sql + ") VALUES ("
                let val = ''
                Object.keys(fields).forEach((key) => {
                    val += val.length > 0 ? ", " : ""
                    val += "'" + fields[key].value + "'"
                })
                sql = 'INSERT INTO ' + this.state.table + ' ' + sql + val + ')'
                break;
            case 'DELETE':
                sql = 'DELETE FROM ' + this.state.table
                sql += " WHERE " + this.state.key_id + " = '" + this.state.key_value + "'"
                break;
            default:
                break;
        }

        let db = new sqlite3.Database(Dico.tables[this.state.table].basename);
        var result = (callback) => {
            db.serialize(function() {
                db.run(sql, [], function(err) {
                    if (err) {
                        console.log("ERR: " + sql)
                        throw err
                    }
                    console.log("UPDATE: " + JSON.stringify(this, null, 4))
                    callback(this)
                });
                db.close()
            });
        }
        result((res) => {
            this.handleOpenView(this.state.view)
        })
    }
    /**
     * Sélection d'une vue
     */
    handleOpenView(view) {
        this.setState({ view: view, title: Dico.tables[this.state.table].views[view].title })
        let db = new sqlite3.Database(Dico.tables[this.state.table].basename, sqlite3.OPEN_READONLY);
        let select = ''
        let rubs = Dico.tables[this.state.table].rubs
        let cols = Dico.tables[this.state.table].views[view].rubs
        this.state.key_id = Dico.tables[this.state.table].key
        Object.keys(cols).forEach((key) => {
            select += select.length > 0 ? ', ' + key : key
        })
        select = 'SELECT ' + select + ' FROM ' + this.state.table
        var result = (callback) => {
            db.serialize(function() {
                db.all(select, function(err, rows) {
                    if (err) throw err
                    console.log("VIEW: " + JSON.stringify(this, null, 4))
                    callback(rows)
                });
                db.close()
            });
        }
        result((rows) => this.setState({ layout: PageLayout.VIEW, rows_selected: [], rows: rows }))
    }

    handleOpenForm(action) {
        //console.log('handleOpenForm: ' + action)
        this.setState({ action_form: action })
        //console.log('state: ' + JSON.stringify(this.state, null, 4))

        let select = ''
        let form = this.state.form
        let rubs = Dico.tables[this.state.table].rubs
        let fields = Dico.tables[this.state.table].forms[form].rubs

        this.state.key_id = Dico.tables[this.state.table].key

        Object.keys(fields).forEach((key) => {
            select += select.length > 0 ? ', ' + key : key
            fields[key].value = ''
            //console.log(key + ': ' + JSON.stringify(rubs[key], null, 4))
        })
        //console.log(select)
        if (action == 'UPDATE') {
            select = 'SELECT ' + select + ' FROM ' + this.state.table
            select += " WHERE " + this.state.key_id + " = '" + this.state.key_value + "'"
            let db = new sqlite3.Database(Dico.tables[this.state.table].basename, sqlite3.OPEN_READONLY);
            var result = (callback) => {
                db.serialize(function() {
                    db.all(select, function(err, rows) {
                        if (err) throw err
                        console.log("FORM: " + JSON.stringify(this, null, 4))
                        callback(rows)
                    });
                    db.close()
                });
            }
            result((rows) => {
                Object.keys(fields).map(key => fields[key].value = rows[0][key])
                this.state.key_value = fields[this.state.key_id].value
                this.setState({ layout: PageLayout.FORM })
            })
        }
        if (action == 'INSERT') {
            this.setState({ layout: PageLayout.FORM })
        }
    }

    render() {
        switch (this.state.layout) {
            case PageLayout.HOME:
                return (
                    <Layout fixedHeader fixedDrawer>
                        <HeaderPage ctx={this} />
                        <Sidebar ctx={this} />
                        <Content>
                            <Portail ctx={this} />
                        </Content>
                        <FooterPage ctx={this} />
                        <APropos ctx={this} />
                    </Layout>
                )
            case PageLayout.VIEW:
                return (
                    <Layout fixedHeader fixedDrawer>
                        <HeaderPage ctx={this} />
                        <Sidebar ctx={this} />
                        <Content>
                            <Tableur ctx={this} />
                        </Content>
                        <APropos ctx={this} />
                    </Layout>
                )
            case PageLayout.FORM:
                return (
                    <Layout fixedHeader fixedDrawer>
                        <HeaderPage ctx={this} />
                        <Sidebar ctx={this} />
                        <Content>
                            <FormContent ctx={this} />
                        </Content>
                        <APropos ctx={this} />
                    </Layout>
                )
            case PageLayout.HELP:
                return (
                    <Layout fixedHeader fixedDrawer>
                        <HeaderPage ctx={this} />
                        <Sidebar ctx={this} />
                        <Content>
                            <Help ctx={this} />
                        </Content>
                        <APropos ctx={this} />
                    </Layout>
                )
            default:
                return null
        }
    }
}

class HeaderPage extends React.Component {

    render() {
        let table = this.props.ctx.state.table
        let form = this.props.ctx.state.form
        let fields = Dico.tables[table].forms[form].rubs
        switch (this.props.ctx.state.layout) {
            case PageLayout.HOME:
                return (
                    <Header title={this.props.ctx.state.title}>
                    </Header>
                )
            case PageLayout.HELP:
                return (
                    <Header title={this.props.ctx.state.title}>
                    </Header>
                )
            case PageLayout.VIEW:
                if (this.props.ctx.state.rows_selected.length > 0) {
                    return (
                        <Header title={this.props.ctx.state.title}>
                            <Navigation>
                                <IconButton name="edit" id="action_edit"
                                    onClick={(event) => this.props.ctx.handleOpenForm('UPDATE')} />
                                <IconButton name="delete" id="action_delete"
                                    onClick={(event) => this.props.ctx.handleUpdateForm('DELETE')} />
                            </Navigation>
                        </Header>
                    )
                } else {
                    return (
                        <Header title={this.props.ctx.state.title}>
                        </Header>
                    )
                }

            case PageLayout.FORM:
                return (
                    <Header title={Dico.tables[table].forms[form].title}>
                        <Navigation>
                            <IconButton name="check" id="action_valid"
                            {... {disabled: !this.props.ctx.state.fields_valid}}
                                onClick={(event) => this.props.ctx.handleUpdateForm(this.props.ctx.state.action_form)} />
                        </Navigation>
                    </Header>
                )

            default:
                return null

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

class Portail extends React.Component {
    render() {
        return (
            <Card shadow={0} style={{ width: '80%', margin: '20px' }}>
                <CardTitle style={{ color: '#fff', height: '176px', background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover' }}>
                    Bienvenue dans ATOMIUM</CardTitle>
                <CardText>
                    Le framework pour développer des applications en décrivant
                    les rubriques, les formulaires, les vues dans un dictionnaire
                </CardText>
                <CardActions border>
                    <Button colored>Pour commencer</Button>
                </CardActions>
                <CardMenu style={{ color: '#fff' }}>
                    <IconButton name="share" />
                </CardMenu>
            </Card>
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
        this.props.ctx.handleOpenView(item)
    }
    closeDrawer() {
        document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }
    handleAPropos(e) {
        e.preventDefault
        this.closeDrawer()
        this.props.ctx.handleState({ about: true })
    }
    handleAccueil(e) {
        e.preventDefault
        this.closeDrawer()
        this.props.ctx.setState({ title: 'Aide', layout: PageLayout.HOME })
    }
    handleHelp(e) {
        e.preventDefault
        this.closeDrawer()
        this.props.ctx.setState({ title: 'Aide', layout: PageLayout.HELP })
    }
    render() {
        var viewSelected = this.props.ctx.state.view
        return (
            <Drawer title={Dico.application.title}>
                <Navigation>
                    <a onClick={(e) => this.handleAccueil(e)}><Icon name="home" /> Accueil</a>
                    {Object.keys(Dico.tables[this.props.ctx.state.table].views).map(key =>
                        <a onClick={(event) => this.handleClickView(key, event)} key={key}>
                            <Icon name="view_list" />
                            {Dico.tables[this.props.ctx.state.table].views[key].title}
                        </a>
                    )}
                    <a onClick={(e) => this.handleHelp(e)}><Icon name="help" /> Aide</a>
                    <a onClick={(e) => this.handleAPropos(e)}><Icon name="info" /> A propos</a>
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
            <Dialog open={this.props.ctx.state.about} onCancel={(data) => this.props.ctx.setState({ about: false })}>
                <DialogTitle>{Dico.application.title}</DialogTitle>
                <DialogContent>
                    <p>{Dico.application.desc}</p>
                    <p>{Dico.application.copyright}</p>
                </DialogContent>
                <DialogActions>
                    <Button type='button' onClick={(data) => this.props.ctx.setState({ about: false })}>Fermer</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

class Tableur extends React.Component {
    selectionChanged(data) {
        this.props.ctx.handleState({ rows_selected: data, key_value: data[0] })
    }
    add() {
        //this.props.ctx.handleState({ layout: PageLayout.FORM, rows_selected: [], key_value: [], action_form: 'INSERT' })
        this.props.ctx.handleOpenForm('INSERT')
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
                        rowKeyColumn={this.props.ctx.state.key_id}
                        rows={this.props.ctx.state.rows}
                        onSelectionChanged={(data) => this.selectionChanged(data)}
                        >
                        {
                            Object.keys(Dico.tables[this.props.ctx.state.table].
                                views[this.props.ctx.state.view].rubs).map(key =>
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
                <CardMenu style={{ color: '#fff' }}>
                    <FABButton colored ripple onClick={(e) => this.add()}>
                        <Icon name="add" />
                    </FABButton>
                </CardMenu>
            </Card>
        )
    }
}

class FormContent extends React.Component {
    handleOnChange(key, value) {
        let table = this.props.ctx.state.table
        let form = this.props.ctx.state.form
        let fields = Dico.tables[table].forms[form].rubs
        fields[key].value = value
        //console.log('fields: ' + JSON.stringify(fields, null, 4))        
        this.props.ctx.handleState({})
    }
    handleOnChangeForm(key, value) {
        console.log(Object.keys(this.refs))
        let is_valid = true
        Object.keys(this.refs).forEach((ref) => {
            if ( ReactDOM.findDOMNode(this.refs[ref]).classList.contains('is-invalid') ) { 
                is_valid = false
            }
            console.log(ref + ': ' + is_valid)
        })
        this.props.ctx.handleState({ fields_valid: is_valid})
    }

    render() {
        let table = this.props.ctx.state.table
        let form = this.props.ctx.state.form
        let rubs = Dico.tables[table].rubs
        let fields = Dico.tables[table].forms[form].rubs
        //console.log('fields: ' + JSON.stringify(fields, null, 4))
        return (
            <Card shadow={1} style={{ width: '90%', margin: '20px', padding: '10px' }}>
                <form>
                    {
                        Object.keys(fields).map(key =>
                            <Grid key={key}>
                                <Cell col={12}>
                                    <Field ctx={this.props.ctx} key_id={key} />
                                    {/*
                                    <Textfield floatingLabel {... { label: rubs[key].label_long }}
                                        {... { pattern: rubs[key].pattern }}
                                        value={fields[key].value}
                                        onChange={(event) => this.handleOnChange(key, event.target.value)} />
                                    */}
                                </Cell>
                            </Grid>
                        )
                    }
                </form>
            </Card>
        )
    }
}

export class Field extends React.Component {

    handleOnChange(key, value) {
        let table = this.props.ctx.state.table
        let form = this.props.ctx.state.form
        let fields = Dico.tables[table].forms[form].rubs
        fields[key].value = value
        let is_valid = true
        Object.keys(fields).forEach((key) => {
            //console.log(fields[key].ref)
            //console.log(ReactDOM.findDOMNode(fields[key].ref).classList)
            let is_invalid = ReactDOM.findDOMNode(fields[key].ref).classList.contains('is-invalid') 
            if ( is_invalid ) { 
                is_valid = false
            }
            //console.log(key + ': ' + !is_invalid)
        })
        this.props.ctx.handleState({ fields_valid: is_valid})
    }

    render() {
        let table = this.props.ctx.state.table
        let form = this.props.ctx.state.form
        let rubs = Dico.tables[table].rubs
        let fields = Dico.tables[table].forms[form].rubs
        let key = this.props.key_id

        switch (rubs[key].type) {
            case 'text':
                return (
                    <Textfield floatingLabel {... { label: rubs[key].label_long }}
                        ref={(ref) => fields[key].ref = this}
                        {... { pattern: rubs[key].pattern }}
                        {... { error: rubs[key].error }}
                        {... { required: rubs[key].required }}
                        {... { maxLength: rubs[key].length }}
                        value={fields[key].value}
                        onChange={(event) => this.handleOnChange(key, event.target.value)} />
                )
            case 'email':
                return (
                    <Textfield floatingLabel {... { label: rubs[key].label_long }}
                        ref={(ref) => fields[key].ref = this}
                        {... { pattern: "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", }}
                        {... { error: "l'email sera de la forme: name@info.net" }}
                        {... { required: rubs[key].required }}
                        {... { maxLength: rubs[key].length }}
                        value={fields[key].value}
                        onChange={(event) => this.handleOnChange(key, event.target.value)} />
                )
            default:
                return <div>{key}.type {rubs[key].type} not found</div>
        }
    }

}
