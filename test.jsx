import React from 'react'
import './node_modules/react-mdl/extra/material.js';
const ReactMDL = require('react-mdl')
import { Button, Content, Drawer, Footer, Header, Layout, List, ListItem, 
    Navigation, Radio, RadioGroup, Textfield } from 'react-mdl'

const dico = require('./dico')
const data = require('./data')
const fs = require('fs')
const jsonfile = require('jsonfile')

// export the React MDL components globally to use them without the ReactMDL prefix
// for (const component in ReactMDL) {
//     if (ReactMDL.hasOwnProperty(component)) {
//         window[component] = ReactMDL[component];
//     }
// }

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
    }

    /**
     * Sélection d'un fichier dans le sidebard
     */
    handleSelect(obj) {
        console.log(obj)
        //event.preventDefault();
        //this.setState({ path: event.target.value, data: this.readFile(event.target.value) });
        //this.setState({ path: event.target.data-value, data: this.readFile(event.target.data-value) });
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
            <div >
                <Layout fixedHeader fixedDrawer>
                    <Header title={dico.application.name} />
                    <Sidebar items={this.state.items} handleSelect={this.handleSelect} />
                    <Content>
                        <Editor data={this.state.data} 
                        path={this.state.path} 
                        handleChange={this.handleChange} />
                    </Content>
                    <Footer size="mini" />
                </Layout>
            </div>
        )
    }
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }
    /**
     * Sélection d'un fichier dans le sidebard
     */
    handleSelect(e) {
        console.log(e.target.value)
        //event.preventDefault();
        //this.setState({ path: event.target.value, data: this.readFile(event.target.value) });
        //this.setState({ path: event.target.data-value, data: this.readFile(event.target.data-value) });
    }

    render() {
        return (
            <Drawer title={dico.application.menuTitle}>
                <RadioGroup container="ul" childContainer="li" name="radio_group_id" value={0}>
                    {this.props.items.map(item =>
                        <Radio onChange={this.handleSelect} key={item} value={item}>{item}</Radio>
                    )}
                </RadioGroup>
            </Drawer>
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
                <div style={{ width: '100%', height: '100%' }}>
                    <textarea style={{ width: '100%', height: '93%' }}
                        value={this.props.data} onChange={this.props.handleChange} />
                </div>
            )
        } else {
            return null
        }
    }
}


class Footer1 extends React.Component {
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
class Content1 extends React.Component {
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
                        <Editor dataProps={this.state.data} pathProps={this.state.path} handleChangeProps={this.handleChange} />
                    </div>
                </div>
            </div>
        );
    }
}

class Editor1 extends React.Component {
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
