const React = require('react')
const ReactMDL = require('react-mdl')

import {
    Button, Card, CardActions, CardMenu, CardText, CardTitle, Chip, ChipContact, Content,
    Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
    Footer, FooterLinkList, FooterSection, Header, Icon, IconButton, Layout, List, ListItem,
    Menu, MenuItem, Navigation, Radio, RadioGroup, Textfield, Table, TableHeader
} from 'react-mdl'

const fs = require('fs')

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialogConfirm: false,
            buttonDisabled: true,
            path: this.props.ctx.state.path,
            data: ''  // contenu du textarea
        }
    }

    /**
    * Sélection d'un fichier dans le sidebard
    */
    handleSelect(item) {
        console.log('Select: ' + item)
        if (!this.state.buttonDisabled) {
            // le fichier courant a été modifié
            this.setState({ openDialogConfirm: true, pathNew: item })
        } else {
            this.setState({
                path: item,
                data: this.readFile(item),
            })
        }
    }

    /**
   * Le textarea a été modifié
   */
    handleChange(event) {
        this.setState({ data: event.target.value, buttonDisabled: false })
    }

    /**
     * Lecture du fichier
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

    render() {
        return (
            <Card style={{ width: '100%', margin: 'auto' }}>
                <CardTitle>{this.state.path}</CardTitle>
                <CardText>
                    <textarea rows={22} style={{ width: '100%', height: '100%' }}
                        value={this.state.data}
                        onChange={this.handleChange} />
                </CardText>
                <CardMenu style={{ color: '#fff' }}>
                    <Button id="button_id" raised colored disabled={this.state.buttonDisabled}
                        onClick={this.handleRecord}><Icon name="backup" /> Enregistrer</Button>
                </CardMenu>
            </Card>
        )
    }
}
/**
 * à revoir
 */
class DialogConfirm extends React.Component {
    render() {
        return (
            <Dialog open={this.props.ctx.state.openDialogConfirm}
                onCancel={this.props.ctx.handleState({ openDialogConfirm: false })}>
                <DialogTitle>Demande confirmation</DialogTitle>
                <DialogContent>
                    <p>Confirmez-vous l'abandon des modifications effectuées sur le fichier ?</p>
                </DialogContent>
                <DialogActions>
                    <Button type='button' onClick={this.props.ctx.handleState({ openDialogConfirm: false })}>Annuler</Button>
                    <Button type='button' onClick={this.props.ctx.handleState(
                        { openDialogConfirm: false, path: this.state.pathNew, data: this.readFile(this.state.pathNew) })}>
                        Je confirme l'abandon</Button>
                </DialogActions>
            </Dialog>
        )
    }
}
