const React = require('react')
import {
    Button, Card, CardActions, CardMenu, CardText, CardTitle, Cell, Chip, ChipContact, Content,
    Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
    FABButton, Footer, FooterLinkList, FooterSection, Grid, Header, Icon, IconButton, Layout, List, ListItem,
    Menu, MenuItem, Navigation, Radio, RadioGroup, Switch, Textfield, Table, TableHeader
} from 'react-mdl'
const Dico = require('./dico')

/**
 * <Rub_Text rub={rubs[key] field={fields[key]}
 */
export class Field extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field: Dico.tables[this.props.ctx.state.table].forms[this.props.ctx.state.form].rubs[this.props.key_id],
            rub: Dico.tables[this.props.ctx.state.table].rubs[this.props.key_id],
            key: this.props.key_id,
        }
        //this.handleOnChange = this.handleOnChange.bind(this);
        //console.log(JSON.stringify(this.state.rub, null, 4))
        //console.log('constructor')
    }

    handleOnChange(value) {
        //console.log(value)
        Dico.tables[this.props.ctx.state.table].forms[this.props.ctx.state.form].fields[this.state.key].value = value
        this.state.field.value = value
        this.props.ctx.handleState({})
    }

    render() {
        switch (this.state.rub.type) {
            case 'text':
                return this.f_text()
            case 'email':
                return this.f_email()
            default:
                return <div>{this.state.rub[this.state.key]}not found</div>
        }
    }

    f_text() {
        return (
            <Textfield floatingLabel {... { label: this.state.rub.label_long }}
                {... { pattern: this.state.rub.pattern }}
                value={this.state.field.value}
                onChange={(event) => this.handleOnChange(event.target.value)} />
        )
    }

    f_email() {
        return (
            <Textfield floatingLabel {... { label: this.state.rub.label_long }}
                {... { pattern: this.state.rub.pattern }}
                value={this.state.field.value}
                onChange={(event) => this.handleOnChange(event)} />
        )
    }

}


class F_text extends Field {
    render() {
        return (
            <Textfield floatingLabel {... { label: this.state.rub.label_long }}
                {... { pattern: this.state.rub.pattern }}
                {... { value: this.state.field.value }}
                onChange={(event) => this.handleOnChange(event)} />
        )
    }
}
class F_email extends Field {
    render() {
        return (
            <Textfield floatingLabel {... { label: rub.label_long }} type="email"
                {... { value: field.value }}
                onChange={(event) => this.handleOnChange(event)} />
        )
    }
}
