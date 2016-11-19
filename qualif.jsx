const React = require('react')
const ReactDOM = require('react-dom')
import { Window, Content, Header, PaneGroup, Sidebar, Pane, Footer } from 'react-photonkit'

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Window>
                <Header>Header</Header>
                <Content>
                    <PaneGroup>
                        <Sidebar />
                        <Pane className="padded-more">
                            Hello, react-photonkit!!!
                        </Pane>
                    </PaneGroup>
                </Content>
                <Footer>Footer</Footer>
            </Window>
        )

    }
}

