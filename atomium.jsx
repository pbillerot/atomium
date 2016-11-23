const React = require('react')
const ReactDOM = require('react-dom')
const ReactMarkdown = require('react-markdown-it')
const sqlite3 = require('sqlite3').verbose();
const {Table, Column, Cell} = require('fixed-data-table')
const {Button, Card, Footer, Header, Toolbar, Window} = require('./components.jsx')


const Dico = require('./dico')
const data = require('./data')
const sqlite = require('./sqlite')
const fs = require('fs')

function isRubTemporary(key) {
    return /^_/g.test(key)
}

var PageLayout = {
    HOME: 'HOME',
    VIEW: 'VIEW',
    FORM: 'FORM',
    HELP: 'HELP'
};
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Layout
            layout: 'HOME', // voir PageLayout
            title: Dico.application.title, // Titre de la fenêtre
            // Dialog
            about: false,
            // DICTIONNAIRE
            table: null,
            view: null,
            form: null,
            // Formulaire
            key_id: null,
            key_value: null,
            action_form: 'UPDATE', // INSERT UPDATE DELETE
            form_valid: false,
            // Tableur
            rows: [],
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
                    if (!isRubTemporary(key)) {
                        sql += sql.length > 0 ? ", " : ""
                        sql += key + " = '" + fields[key].value + "'"
                    }
                })
                sql = 'UPDATE ' + this.state.table + ' SET ' + sql
                sql += " WHERE " + this.state.key_id + " = '" + this.state.key_value + "'"
                break;
            case 'INSERT':
                Object.keys(fields).forEach((key) => {
                    if (!isRubTemporary(key)) {
                        sql += sql.length > 0 ? ", " : ""
                        sql += key
                    }
                })
                sql = "(" + sql + ") VALUES ("
                let val = ''
                Object.keys(fields).forEach((key) => {
                    if (!isRubTemporary(key)) {
                        val += val.length > 0 ? ", " : ""
                        val += "'" + fields[key].value + "'"
                    }
                })
                sql = 'INSERT INTO ' + this.state.table + ' ' + sql + val + ')'
                break;
            case 'DELETE':
                let sqlin = ""
                this.state.rows_selected.forEach((key) => {
                    sqlin += sqlin.length > 0 ? "," : "("
                    sqlin += "'" + key + "'"
                })
                sqlin += ")"
                sql = 'DELETE FROM ' + this.state.table
                sql += " WHERE " + this.state.key_id + " in " + sqlin
                break;
            default:
                break;
        }

        let db = new sqlite3.Database(Dico.tables[this.state.table].basename);
        var result = (callback) => {
            db.serialize(function () {
                db.run(sql, [], function (err) {
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
            this.handleOpenView()
        })
    }
    /**
     * Sélection d'une vue
     */
    handleOpenView() {
        this.setState({ title: Dico.tables[this.state.table].views[this.state.view].title })
        let db = new sqlite3.Database(Dico.tables[this.state.table].basename, sqlite3.OPEN_READONLY);
        let select = ''
        let rubs = Dico.tables[this.state.table].rubs
        let cols = Dico.tables[this.state.table].views[this.state.view].rubs
        this.state.key_id = Dico.tables[this.state.table].key
        Object.keys(cols).forEach((key) => {
            if (!isRubTemporary(key))
                select += select.length > 0 ? ', ' + key : key
        })
        select = 'SELECT ' + select + ' FROM ' + this.state.table
        var result = (callback) => {
            db.serialize(function () {
                db.all(select, function (err, rows) {
                    if (err) {
                        console.log("VIEW: " + select)
                        throw err
                    }
                    console.log("VIEW: " + JSON.stringify(this, null, 4))
                    callback(rows)
                });
                db.close()
            });
        }
        result((rows) => {
            //console.log(JSON.stringify(rows))
            var tableur = []
            rows.forEach((row) => {
                // insertion des colonnes des rubriques temporaires
                let ligne = {}
                let key_value = ''
                Object.keys(cols).forEach(key => {
                    if (key == this.state.key_id) {
                        key_value = row[key]
                    }
                    if (isRubTemporary(key)) {
                        ligne[key] = key_value
                    } else {
                        ligne[key] = row[key]
                    }
                })
                tableur.push(ligne)
            })
            //console.log(JSON.stringify(tableur))
            this.setState({ layout: PageLayout.VIEW, rows_selected: [], rows: tableur })
        })
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
            if (!isRubTemporary(key)) {
                select += select.length > 0 ? ', ' + key : key
                fields[key].value = ''
            }
            //console.log(key + ': ' + JSON.stringify(rubs[key], null, 4))
        })
        //console.log(select)
        if (action == 'UPDATE') {
            select = 'SELECT ' + select + ' FROM ' + this.state.table
            select += " WHERE " + this.state.key_id + " = '" + this.state.key_value + "'"
            let db = new sqlite3.Database(Dico.tables[this.state.table].basename, sqlite3.OPEN_READONLY);
            var result = (callback) => {
                db.serialize(function () {
                    db.all(select, function (err, rows) {
                        if (err) throw err
                        console.log("FORM: " + JSON.stringify(this, null, 4))
                        callback(rows)
                    });
                    db.close()
                });
            }
            result((rows) => {
                Object.keys(fields).map(key => {
                    if (!isRubTemporary(key)) {
                        fields[key].value = rows[0][key]
                    } else {
                        fields[key].value = ''
                    }
                })
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
                    <Window>
                        <HeaderPage ctx={this} />
                        <Sidebar ctx={this} />
                        <Content>
                            <Portail ctx={this} />
                        </Content>
                        <FooterPage ctx={this} />
                        <APropos ctx={this} />
                    </Window>
                )
            case PageLayout.VIEW:
                return (
                    <Window>
                        <HeaderPage ctx={this} />
                        <Sidebar ctx={this} />
                        <Content>
                            <Tableur ctx={this} />
                        </Content>
                        <APropos ctx={this} />
                    </Window>
                )
            case PageLayout.FORM:
                return (
                    <Window>
                        <HeaderPage ctx={this} />
                        <Sidebar ctx={this} />
                        <Content>
                            <FormContent ctx={this} />
                        </Content>
                        <APropos ctx={this} />
                    </Window>
                )
            case PageLayout.HELP:
                return (
                    <Window>
                        <HeaderPage ctx={this} />
                        <Sidebar ctx={this} />
                        <Content>
                            <Help ctx={this} />
                        </Content>
                        <APropos ctx={this} />
                    </Window>
                )
            default:
                return null
        }
    }
}

class HeaderPage extends React.Component {

    render() {
        let table = this.props.ctx.state.table
        let view = this.props.ctx.state.view
        let form = this.props.ctx.state.form
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
                if (this.props.ctx.state.rows_selected.length == 1) {
                    return (
                        <Header title={this.props.ctx.state.title}>
                            <Toolbar>
                                <Button color="default" icon="plus-circled"
                                    onClick={(event) => {
                                        this.props.ctx.state.form = Dico.tables[table].views[view].form_update
                                        this.props.ctx.handleOpenForm('UPDATE')
                                    }
                                    } />
                                <Button color="default" icon="trash"
                                    onClick={(event) => {
                                        this.props.ctx.handleUpdateForm('DELETE')
                                    }
                                    } />
                            </Toolbar>
                        </Header>
                    )
                } else if (this.props.ctx.state.rows_selected.length > 1) {
                    return (
                        <Header title={this.props.ctx.state.title}>
                            <Toolbar>
                                <Button color="default" icon="trash"
                                    onClick={(event) => this.props.ctx.handleUpdateForm('DELETE')} />
                            </Toolbar>
                        </Header>
                    )
                } else {
                    return (
                        <Header title={this.props.ctx.state.title}>
                        </Header>
                    )
                }

            case PageLayout.FORM:
                {/* 
                    <Header title={<span><IconButton name="arrow_back"
                        onClick={(e) => this.props.ctx.handleState({ layout: PageLayout.VIEW, rows_selected: [] })} />
                        <span>{Dico.tables[table].forms[form].title}</span></span>}>
                        <Toolbar>
                            <IconButton name="check" id="action_valid"
                                {... { disabled: !this.props.ctx.state.form_valid }}
                                onClick={(event) => this.props.ctx.handleUpdateForm(this.props.ctx.state.action_form)} />
                        </Toolbar>
                    </Header>
                */}

                return (
                    <Header title={this.props.ctx.state.title}>
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
            <Footer>
                <a href="javascript: ;" onClick={this.github}>Github</a>
                <a href="javascript: ;" onClick={(data) => new sqlite.Table('USERS').dump()}>Dump</a>
            </Footer>
        )
    }
}

class Portail extends React.Component {
    render() {
        return (
            <Card>
                <div>
                    Le framework pour développer des applications en décrivant
                    les rubriques, les formulaires, les vues dans un dictionnaire
                </div>
            </Card>
        )
    }
}

class SidebarPage extends React.Component {
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
        var table = 'TEX'
        return (
            <Sidebar>
                <NavGroup>
                    <a onClick={(e) => this.handleAccueil(e)}><Icon name="home" /> Accueil</a>
                </NavGroup>
                {
                    Object.keys(Dico.tables).map(table =>
                        <LinkView table={table} key={table} ctx={this.props.ctx} />
                    )
                }
                <NavGroup>
                    <a onClick={(e) => this.handleHelp(e)}><Icon name="help" /> Aide</a>
                    <a onClick={(e) => this.handleAPropos(e)}><Icon name="info" /> A propos</a>
                </NavGroup>
            </Sidebar>
        );
    }
}
class LinkView extends React.Component {
    handleClickView(table, view, event) {
        event.preventDefault()
        // on ferme le Drawer
        this.closeDrawer()
        this.props.ctx.state.table = table
        this.props.ctx.state.view = view
        this.props.ctx.handleOpenView()
    }
    closeDrawer() {
        document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }
    render() {
        return (
            <NavGroup>
                {
                    Object.keys(Dico.tables[this.props.table].views).map(view =>
                        <a onClick={(event) => this.handleClickView(this.props.table, view, event)} key={view}>
                            <Icon name="view_list" />
                            {Dico.tables[this.props.table].views[view].title}
                        </a>
                    )
                }
            </NavGroup>
        )
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
    add(form) {
        this.props.ctx.handleState({ form: form, rows_selected: [], key_value: [], action_form: 'INSERT' })
        this.props.ctx.handleOpenForm('INSERT')
    }
    render() {
        let table = this.props.ctx.state.table
        let view = this.props.ctx.state.view
        let rubs = Dico.tables[table].rubs
        let cols = Dico.tables[table].views[view].rubs
        let form_add = Dico.tables[table].views[view].form_add
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
                            Object.keys(cols).map(key =>
                                <TableHeader key={key}
                                    name={key}
                                    cellFormatter={(value) => <CellFormatter ctx={this.props.ctx} rub={rubs[key]} value={value} />}
                                    {... { tooltip: rubs[key].tooltip }}
                                    >
                                    {rubs[key].label_short}
                                </TableHeader>
                            )
                        }
                    </Table>
                </CardText>
                <CardMenu style={{ color: '#fff' }}>
                    <FABButton colored ripple onClick={(e) => this.add(form_add)}>
                        <Icon name="add" />
                    </FABButton>
                </CardMenu>
            </Card>
        )
    }
}

class CellFormatter extends React.Component {
    render() {
        switch (this.props.rub.type) {
            case 'button':
                return <IconButton name="edit"
                    onClick={(e) => {
                        this.props.ctx.state.form = this.props.rub.form
                        this.props.ctx.state.key_value = this.props.value
                        this.props.ctx.handleOpenForm('UPDATE')
                    } } />

            default:
                return <span>{this.props.value}</span>
        }

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
            if (ReactDOM.findDOMNode(this.refs[ref]).classList.contains('is-invalid')) {
                is_valid = false
            }
            console.log(ref + ': ' + is_valid)
        })
        this.props.ctx.handleState({ form_valid: is_valid })
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
            if (is_invalid) {
                is_valid = false
            }
            //console.log(key + ': ' + !is_invalid)
        })
        this.props.ctx.handleState({ form_valid: is_valid })
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
            case 'button':
                return (
                    <IconButton name="edit" />
                )
            default:
                return <div>{key}.type {rubs[key].type}not found</div>
        }
    }

}
