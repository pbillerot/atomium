const React = require('react')
const ReactDOM = require('react-dom')
const {Table, Column, Cell} = require('fixed-data-table')

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myTableData: [
                { name: 'Rylan', email: 'Angelita_Weimann42@gmail.com' },
                { name: 'Amelia', email: 'Dexter.Trantow57Trantow57@hotmail.com' },
                { name: 'Estevan', email: 'Aimee7@hotmail.com' },
                { name: 'Florence', email: 'Jarrod.Bernier13@yahoo.com' },
                { name: 'Tressa', email: 'Yadira1@hotmail.com' },
            ]
        }
    }

    render() {
        return (
            <div className="window">
                <header className="toolbar toolbar-header">
                    <h1 className="title">ATOMIUM</h1>
                    <div className="toolbar-actions">
                        <div className="btn-group pull-right">
                            <button className="btn btn-default ">
                                <span className="icon icon-plus-circled"></span>
                            </button>
                            <button className="btn btn-default ">
                                <span className="icon icon-pencil"></span>
                            </button>
                            <button className="btn btn-default ">
                                <span className="icon icon-trash"></span>
                            </button>
                        </div>
                    </div>
                </header>
                <div className="window-content">
                    <div className="pane-group">
                        <div className="pane-sm sidebar" style={{ minWidth: '260px' }}>
                            <nav className="nav-group">
                                <a className="nav-group-item active">
                                    <span className="icon icon-home"></span>
                                    Accueil
                                </a>
                            </nav>
                            <nav className="nav-group">
                                <h5 className="nav-group-title">MENU APPLICATION</h5>
                                <span className="nav-group-item">
                                    <span className="icon icon-list"></span>
                                    LISTE DES COMPTES UTILISATEURS
                                </span>
                                <span className="nav-group-item">
                                    <span className="icon icon-list"></span>
                                    LISTE DES COMMANDES
                                </span>
                            </nav>
                            <nav className="nav-group">
                                <h5 className="nav-group-title"></h5>
                                <span className="nav-group-item">
                                    <span className="icon icon-help"></span>
                                    Aide
                                </span>
                                <span className="nav-group-item">
                                    <span className="icon icon-info"></span>
                                    A propos...
                                </span>
                            </nav>
                        </div>
                        <div className="pane">
                            <form style={{ margin: '15px' }}>
                                <div className="form-group">
                                    <label>Email address</label>
                                    <input type="email" className="form-control" placeholder="Email" />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" placeholder="Password" />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-control" rows="3"></textarea>
                                </div>
                                <select className="form-control">
                                    <option>Option one</option>
                                    <option>Option two</option>
                                    <option>Option three</option>
                                    <option>Option four</option>
                                    <option>Option five</option>
                                    <option>Option six</option>
                                    <option>Option seven</option>
                                    <option>Option eight</option>
                                </select>
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" onChange={() => { } } /> This is a checkbox
                                    </label>
                                </div>
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" onChange={() => { } } /> This is a checkbox too
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="radios" checked onChange={() => { } } />
                                        Keep your options open
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="radios" />
                                        Be sure to remember to check for unknown unknowns
                                    </label>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-form btn-default">Cancel</button>
                                    <button type="submit" className="btn btn-form btn-primary">OK</button>
                                </div>
                            </form>

                            <table className="table-striped" style={{ width: '95%', margin: '15px' }}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Kind</th>
                                        <th>File Size</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>photon.css</td>
                                        <td>CSS</td>
                                        <td>28K</td>
                                    </tr>
                                    <tr>
                                        <td>photon.css</td>
                                        <td>CSS</td>
                                        <td>28K</td>
                                    </tr>
                                    <tr>
                                        <td>photon.css</td>
                                        <td>CSS</td>
                                        <td>28K</td>
                                    </tr>
                                    <tr>
                                        <td>photon.css</td>
                                        <td>CSS</td>
                                        <td>28K</td>
                                    </tr>
                                </tbody>
                            </table>
                            <Table
                                rowsCount={this.state.myTableData.length}
                                rowHeight={30}
                                headerHeight={30}
                                width={400}
                                height={300}>
                                <Column
                                    header={<Cell>Name</Cell>}
                                    cell={props => (
                                        <Cell {...props}>
                                            {this.state.myTableData[props.rowIndex].name}
                                        </Cell>
                                    )}
                                    width={200}
                                    />
                                <Column
                                    header={<Cell>Email</Cell>}
                                    cell={props => (
                                        <Cell {...props}>
                                            {this.state.myTableData[props.rowIndex].email}
                                        </Cell>
                                    )}
                                    width={200}
                                    />
                            </Table>
                        </div>
                    </div>
                </div>
                <footer className="toolbar toolbar-footer">
                    <h1 className="title">Footer</h1>
                </footer>
            </div>
        )

    }
}

class MyTextCell extends React.Component {
    render() {
        const {rowIndex, field, data} = this.props;
        return (
            <Cell>
                {data[rowIndex][field]}
            </Cell>
        );
    }
}

class MyLinkCell extends React.Component {
    render() {
        const {rowIndex, field, data} = this.props;
        const link = data[rowIndex][field];
        return (
            <Cell>
                <a href={link}>{link}</a>
            </Cell>
        );
    }
}
