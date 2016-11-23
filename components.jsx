const React = require('react')
const ReactDOM = require('react-dom')
const {Table, Column, Cell} = require('fixed-data-table')

export class IconButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        console.log(e)
        this.props.onClick(e)
    }
    render() {
        return (
            <button className={'btn btn-large btn-' + this.props.color}
                onClick={(e) => this.props.onClick('warning')} value="BIC">
                {
                    this.props.icon
                        ? <span className={'icon icon-' + this.props.icon}>{this.props.title}</span>
                        : this.props.title
                }

            </button>
        )
    }
}
IconButton.propTypes = {
    color: React.PropTypes.oneOf(['default', 'positive', 'negative', 'warning']),
    icon: React.PropTypes.string
}
IconButton.defaultProps = {
    color: 'default',
    icon: null
}

export class Card extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export class Content extends React.Component {
    render() {
        return (
            <div className="w3-main w3-padding-64" style={{ marginLeft: '250px' }}>
                {this.props.children}
            </div>
        )
    }
}

export class Footer extends React.Component {
    render() {
        return (
            <footer className="w3-container w3-theme" style={{ paddingLeft: '32px' }}>
                {this.props.children}
            </footer>
        )
    }
}

export class Header extends React.Component {
    render() {
        return (
            <div id="myTop" className="w3-top w3-container w3-padding-16 w3-theme-l1 w3-large w3-show-inline-block">
                <i className="fa fa-bars w3-opennav w3-hide-large w3-xlarge w3-margin-left w3-margin-right"
                    onClick={(e) => this.props.ctx.handleMenu('open', null)}
                    ></i>
                <span id="myIntro">W3.CSS: Introduction</span>
                <a className="w3-btn-floating-large w3-theme-action"
                    style={{ position: 'fixed', top: '72px', right: '24px' }}>+</a>
                <ul className="w3-navbar w3-light-grey w3-border" style={{ position: 'fixed', top: '6px', right: '16px' }}>
                    <li><a href="#"><i className="fa fa-search"></i></a></li>
                    <li><a href="#"><i className="fa fa-envelope"></i></a></li>
                    <li><a href="#"><i className="fa fa-globe"></i></a></li>
                    <li><a href="#"><i className="fa fa-sign-in"></i></a></li>
                </ul>
            </div>
        )
    }
}

export class Nav extends React.Component {
    render() {
        return (
            <a href="/html/default.asp" onClick={(e) => this.props.ctx.handleMenu('open', this.props.id)}
                className={this.props.ctx.w3_menu_current == this.props.id ? 'w3-light-grey w3-medium' : ''}
                >{this.props.children}</a>
        )
    }
}

export class NavGroup extends React.Component {
    render() {
        let menu_current_open = this.props.ctx.state.w3_menu_current == this.props.menu_id ? true : false
        return (
            <div className="myMenu"
                style={{ display: menu_current_open ? 'block' : 'none' }}>
                <div className="w3-container w3-padding-top">
                    <h3>{this.props.ctx.state.w3_menu[this.props.menu_id]}</h3>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export class Toolbar extends React.Component {
    render() {
        return (
            <div />
        )
    }
}

export class Sidebar extends React.Component {
    render() {
        let w3_sidebar_open = this.props.ctx.state.w3_sidebar_open
        return (
            <div>
                <nav className="w3-sidenav w3-collapse w3-white w3-animate-left w3-card-2"
                    style={{ zIndex: 3, width: '250px', display: this.props.ctx.state.w3_sidebar_open ? 'block' : 'none' }} id="mySidenav">
                    <a href="#" className="w3-border-bottom w3-large w3-theme-dark">{this.props.title}</a>
                    <a href="javascript:void(0)"
                        onClick={(e) => this.props.ctx.handleMenu('close', null)}
                        className="w3-text-red w3-hide-large w3-closenav w3-large">Close <i className="fa fa-remove"></i></a>
                    {this.props.children}
                </nav >
                <div className="w3-overlay w3-hide-large w3-animate-opacity"
                    onClick={(e) => this.props.ctx.handleMenu('close', null)}
                    style={{ cursor: 'pointer', display: this.props.ctx.state.w3_sidebar_open ? 'block' : 'none' }}
                    id="myOverlay"></div>
            </div>
        )
    }
}
export class Window extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
