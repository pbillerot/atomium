const React = require('react')
const dico = require('./dico')
const data = require('./data')
const fs = require('fs')
const jsonfile = require('jsonfile')

// import {
//   Breadcrumb, Button, Col, ControlLabel, FormControl, FormGroup, Grid, Modal,
//   Nav, Navbar, NavItem, Row, Well
// } from 'react-bootstrap';

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
    this.handleRecord = this.handleRecord.bind(this);
  }

  /**
   * Sélection d'un fichier dans le sidebard
   */
  handleSelect(item) {
    console.log(item)
    this.setState({ path: item, data: this.readFile(item) });
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

  /**
   * Demande d'enregistrement
   */
  handleRecord(event) {
    fs.writeFile(this.state.path, this.state.data, (err) => {
      if (err) throw err;
      console.log(this.state.path + ' a été enregistré');
    });
  }

  render() {
    return (
      <Layout >
        <Header />
        <Sidebar items={this.state.items} handleSelect={this.handleSelect} />
        <Content items={this.state.items} data={this.state.data} path={this.state.path}
          handleChange={this.handleChange} handleRecord={this.handleRecord} />
        <Footer path={this.state.path} />
      </Layout>
    );
  }

  render1() {
    return (
      <Model />
    );
  }

}

class Layout extends React.Component {
  render() {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        {this.props.children}
      </div>
    )
  }
}

class Header extends React.Component {
  render() {
    return (
      <div className="android-header mdl-layout__header mdl-layout__header--waterfall">
        <div className="mdl-layout__header-row">
          <span className="android-title mdl-layout-title">
            <img className="android-logo-image" src="images/android-logo.png" />
          </span>
          {/* Add spacer, to align navigation to the right in desktop */}
          <div className="android-header-spacer mdl-layout-spacer"></div>
          {/* logo sur la barre sur mobile */}
          <span className="android-mobile-title mdl-layout-title">
            <img className="android-logo-image" src="images/android-logo.png" />
          </span>
          {/* Menu sur la droite */}
          <button className="android-more-button mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect" id="more-button">
            <i className="material-icons">more_vert</i>
          </button>
          <ul className="mdl-menu mdl-js-menu mdl-menu--bottom-right mdl-js-ripple-effect" htmlFor="more-button">
            <li className="mdl-menu__item">5.0 Lollipop</li>
            <li className="mdl-menu__item">4.4 KitKat</li>
            <li disabled className="mdl-menu__item">4.3 Jelly Bean</li>
            <li className="mdl-menu__item">Android History</li>
          </ul>
        </div>
      </div>
    )
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div />
    )
  }
}
class Sidebar extends React.Component {
  _handleClick(item, event) {
    event.preventDefault()
    this.props.handleSelect(item)
  }
  render() {
    return (
      <div className="android-drawer mdl-layout__drawer">
        <span className="mdl-layout-title">
          <img className="android-logo-image" src="images/android-logo-white.png" />
        </span>
        <nav className="mdl-navigation">
          {this.props.items.map(item =>
            <a className="mdl-navigation__link" href="" key={item} onClick={(event) => this._handleClick(item, event)}>{item}</a>
          )}
        </nav>
      </div>
    )
  }
}

class Content extends React.Component {
  render() {
    return (
      <div className="android-content mdl-layout__content">
        <a name="top"></a>
        <Editor data={this.props.data} path={this.props.path} handleChange={this.props.handleChange} />
      </div>
    )
  }
}

class Editor extends React.Component {
  render() {
    const isAvecFile = this.props.path.length > 0 ? true : false
    if (isAvecFile) {
      return (
        <div className="mdl-grid" style={{ height: '100%' }}>
          <textarea style={{ height: '100%' }} value={this.props.data} onChange={this.props.handleChange}>
          </textarea>
        </div>
      )
    } else {
      return (
        <div className="android-be-together-section mdl-typography--text-center">
          <div className="logo-font android-slogan">Bienvenue dans atomium.</div>
          <div className="logo-font android-sub-slogan">...</div>
        </div>

      )
    }
  }
}

class Model extends React.Component {
  render() {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        {/* Header */}
        <div className="android-header mdl-layout__header mdl-layout__header--waterfall">
          <div className="mdl-layout__header-row">
            <span className="android-title mdl-layout-title">
              <img className="android-logo-image" src="images/android-logo.png" />
            </span>
            {/* Add spacer, to align navigation to the right in desktop */}
            <div className="android-header-spacer mdl-layout-spacer"></div>
            {/* barre de recherche */}
            <div className="android-search-box mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right mdl-textfield--full-width">
              <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search-field">
                <i className="material-icons">search</i>
              </label>
              <div className="mdl-textfield__expandable-holder">
                <input className="mdl-textfield__input" type="text" id="search-field" />
              </div>
            </div>
            {/* Navigation horizontale qui disparaît sur mobile */}
            <div className="android-navigation-container">
              <nav className="android-navigation mdl-navigation">
                <a className="mdl-navigation__link mdl-typography--text-uppercase" href="">Phones</a>
                <a className="mdl-navigation__link mdl-typography--text-uppercase" href="">Tablets</a>
                <a className="mdl-navigation__link mdl-typography--text-uppercase" href="">Wear</a>
                <a className="mdl-navigation__link mdl-typography--text-uppercase" href="">TV</a>
                <a className="mdl-navigation__link mdl-typography--text-uppercase" href="">Auto</a>
                <a className="mdl-navigation__link mdl-typography--text-uppercase" href="">One</a>
                <a className="mdl-navigation__link mdl-typography--text-uppercase" href="">Play</a>
              </nav>
            </div>
            {/* logo sur la barre sur mobile */}
            <span className="android-mobile-title mdl-layout-title">
              <img className="android-logo-image" src="images/android-logo.png" />
            </span>
            {/* Menu sur la droite */}
            <button className="android-more-button mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect" id="more-button">
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-js-menu mdl-menu--bottom-right mdl-js-ripple-effect" htmlFor="more-button">
              <li className="mdl-menu__item">5.0 Lollipop</li>
              <li className="mdl-menu__item">4.4 KitKat</li>
              <li disabled className="mdl-menu__item">4.3 Jelly Bean</li>
              <li className="mdl-menu__item">Android History</li>
            </ul>
          </div>
        </div>
        {/* Sidebar */}
        <div className="android-drawer mdl-layout__drawer">
          <span className="mdl-layout-title">
            <img className="android-logo-image" src="images/android-logo-white.png" />
          </span>
          <nav className="mdl-navigation">
            <a className="mdl-navigation__link" href="">Phones</a>
            <a className="mdl-navigation__link" href="">Tablets</a>
            <a className="mdl-navigation__link" href="">Wear</a>
            <a className="mdl-navigation__link" href="">TV</a>
            <a className="mdl-navigation__link" href="">Auto</a>
            <a className="mdl-navigation__link" href="">One</a>
            <a className="mdl-navigation__link" href="">Play</a>
            <div className="android-drawer-separator"></div>
            <span className="mdl-navigation__link" href="">Versions</span>
            <a className="mdl-navigation__link" href="">Lollipop 5.0</a>
            <a className="mdl-navigation__link" href="">KitKat 4.4</a>
            <a className="mdl-navigation__link" href="">Jelly Bean 4.3</a>
            <a className="mdl-navigation__link" href="">Android history</a>
            <div className="android-drawer-separator"></div>
            <span className="mdl-navigation__link" href="">Resources</span>
            <a className="mdl-navigation__link" href="">Official blog</a>
            <a className="mdl-navigation__link" href="">Android on Google+</a>
            <a className="mdl-navigation__link" href="">Android on Twitter</a>
            <div className="android-drawer-separator"></div>
            <span className="mdl-navigation__link" href="">For developers</span>
            <a className="mdl-navigation__link" href="">App developer resources</a>
            <a className="mdl-navigation__link" href="">Android Open Source Project</a>
            <a className="mdl-navigation__link" href="">Android SDK</a>
          </nav>
        </div>
        {/* Contenu */}
        <div className="android-content mdl-layout__content">
          <a name="top"></a>
          {/* section d'acceuil */}
          <div className="android-be-together-section mdl-typography--text-center">
            <div className="logo-font android-slogan">be together. not the same.</div>
            <div className="logo-font android-sub-slogan">welcome to android... be yourself. do your thing. see what's going on.</div>
            <div className="logo-font android-create-character">
              <a href=""><img src="images/andy.png" /> create your android character</a>
            </div>
            {/* bouton go to autre section */}
            <a href="#screens">
              <button className="android-fab mdl-button mdl-button--colored mdl-js-button mdl-button--fab mdl-js-ripple-effect">
                <i className="material-icons">expand_more</i>
              </button>
            </a>
          </div>
          {/* Diaporama */}
          <div className="android-screen-section mdl-typography--text-center">
            <a name="screens"></a>
            <div className="mdl-typography--display-1-color-contrast">Powering screens of all sizes</div>
            <div className="android-screens">
              <div className="android-wear android-screen">
                <a className="android-image-link" href="">
                  <img className="android-screen-image" src="images/wear-silver-on.png" />
                  <img className="android-screen-image" src="images/wear-black-on.png" />
                </a>
                <a className="android-link mdl-typography--font-regular mdl-typography--text-uppercase" href="">Android Wear</a>
              </div>
              <div className="android-phone android-screen">
                <a className="android-image-link" href="">
                  <img className="android-screen-image" src="images/nexus6-on.jpg" />
                </a>
                <a className="android-link mdl-typography--font-regular mdl-typography--text-uppercase" href="">Phones</a>
              </div>
              <div className="android-tablet android-screen">
                <a className="android-image-link" href="">
                  <img className="android-screen-image" src="images/nexus9-on.jpg" />
                </a>
                <a className="android-link mdl-typography--font-regular mdl-typography--text-uppercase" href="">Tablets</a>
              </div>
              <div className="android-tv android-screen">
                <a className="android-image-link" href="">
                  <img className="android-screen-image" src="images/tv-on.jpg" />
                </a>
                <a className="android-link mdl-typography--font-regular mdl-typography--text-uppercase" href="">Android TV</a>
              </div>
              <div className="android-auto android-screen">
                <a className="android-image-link" href="">
                  <img className="android-screen-image" src="images/auto-on.jpg" />
                </a>
                <a className="android-link mdl-typography--font-regular mdl-typography--text-uppercase mdl-typography--text-left" href="">Coming Soon: Android Auto</a>
              </div>
            </div>
          </div>
          {/* section wear */}
          <div className="android-wear-section">
            <div className="android-wear-band">
              <div className="android-wear-band-text">
                <div className="mdl-typography--display-2 mdl-typography--font-thin">The best of Google built in</div>
                <p className="mdl-typography--headline mdl-typography--font-thin">
                  Android works perfectly with your favourite apps like Google Maps,
                Calendar and YouTube.
              </p>
                <p>
                  <a className="mdl-typography--font-regular mdl-typography--text-uppercase android-alt-link" href="">
                    See what's new in the Play Store&nbsp;<i className="material-icons">chevron_right</i>
                  </a>
                </p>
              </div>
            </div>
          </div>
          {/* section custom */}
          <div className="android-customized-section">
            <div className="android-customized-section-text">
              <div className="mdl-typography--font-light mdl-typography--display-1-color-contrast">Customised by you, for you</div>
              <p className="mdl-typography--font-light">
                Put the stuff that you care about right on your home screen: the latest news, the weather or a stream of your recent photos.
              <br />
                <a href="" className="android-link mdl-typography--font-light">Customise your phone</a>
              </p>
            </div>
            <div className="android-customized-section-image"></div>
          </div>
          {/* section more */}
          <div className="android-more-section">
            <div className="android-section-title mdl-typography--display-1-color-contrast">More from Android</div>
            <div className="android-card-container mdl-grid">
              <div className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp">
                <div className="mdl-card__media">
                  <img src="images/more-from-1.png" />
                </div>
                <div className="mdl-card__title">
                  <h4 className="mdl-card__title-text">Get going on Android</h4>
                </div>
                <div className="mdl-card__supporting-text">
                  <span className="mdl-typography--font-light mdl-typography--subhead">Four tips to make your switch to Android quick and easy</span>
                </div>
                <div className="mdl-card__actions">
                  <a className="android-link mdl-button mdl-js-button mdl-typography--text-uppercase" href="">
                    Make the switch
                   <i className="material-icons">chevron_right</i>
                  </a>
                </div>
              </div>

              <div className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp">
                <div className="mdl-card__media">
                  <img src="images/more-from-4.png" />
                </div>
                <div className="mdl-card__title">
                  <h4 className="mdl-card__title-text">Create your own Android character</h4>
                </div>
                <div className="mdl-card__supporting-text">
                  <span className="mdl-typography--font-light mdl-typography--subhead">Turn the little green Android mascot into you, your friends, anyone!</span>
                </div>
                <div className="mdl-card__actions">
                  <a className="android-link mdl-button mdl-js-button mdl-typography--text-uppercase" href="">
                    androidify.com
                   <i className="material-icons">chevron_right</i>
                  </a>
                </div>
              </div>

              <div className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp">
                <div className="mdl-card__media">
                  <img src="images/more-from-2.png" />
                </div>
                <div className="mdl-card__title">
                  <h4 className="mdl-card__title-text">Get a clean customisable home screen</h4>
                </div>
                <div className="mdl-card__supporting-text">
                  <span className="mdl-typography--font-light mdl-typography--subhead">A clean, simple, customisable home screen that comes with the power of Google Now: Traffic alerts, weather and much more, just a swipe away.</span>
                </div>
                <div className="mdl-card__actions">
                  <a className="android-link mdl-button mdl-js-button mdl-typography--text-uppercase" href="">
                    Download now
                   <i className="material-icons">chevron_right</i>
                  </a>
                </div>
              </div>

              <div className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp">
                <div className="mdl-card__media">
                  <img src="images/more-from-3.png" />
                </div>
                <div className="mdl-card__title">
                  <h4 className="mdl-card__title-text">Millions to choose from</h4>
                </div>
                <div className="mdl-card__supporting-text">
                  <span className="mdl-typography--font-light mdl-typography--subhead">Hail a taxi, find a recipe, run through a temple – Google Play has all the apps and games that let you make your Android device uniquely yours.</span>
                </div>
                <div className="mdl-card__actions">
                  <a className="android-link mdl-button mdl-js-button mdl-typography--text-uppercase" href="">
                    Find apps
                   <i className="material-icons">chevron_right</i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* footer */}
          <footer className="android-footer mdl-mega-footer">
            <div className="mdl-mega-footer--top-section">
              {/* boutons réseaux sociaux */}
              <div className="mdl-mega-footer--left-section">
                <button className="mdl-mega-footer--social-btn"></button>
                &nbsp;
              <button className="mdl-mega-footer--social-btn"></button>
                &nbsp;
              <button className="mdl-mega-footer--social-btn"></button>
              </div>
              {/* back to top */}
              <div className="mdl-mega-footer--right-section">
                <a className="mdl-typography--font-light" href="#top">
                  Back to Top
                <i className="material-icons">expand_less</i>
                </a>
              </div>
            </div>
            {/* copyright */}
            <div className="mdl-mega-footer--middle-section">
              <p className="mdl-typography--font-light">Satellite imagery: © 2014 Astrium, DigitalGlobe</p>
              <p className="mdl-typography--font-light">Some features and devices may not be available in all areas</p>
            </div>
            {/* menus */}
            <div className="mdl-mega-footer--bottom-section">
              <a className="android-link android-link-menu mdl-typography--font-light" id="version-dropdown">
                Versions
              <i className="material-icons">arrow_drop_up</i>
              </a>
              <ul className="mdl-menu mdl-js-menu mdl-menu--top-left mdl-js-ripple-effect" htmlFor="version-dropdown">
                <li className="mdl-menu__item">5.0 Lollipop</li>
                <li className="mdl-menu__item">4.4 KitKat</li>
                <li className="mdl-menu__item">4.3 Jelly Bean</li>
                <li className="mdl-menu__item">Android History</li>
              </ul>
              <a className="android-link android-link-menu mdl-typography--font-light" id="developers-dropdown">
                For Developers
              <i className="material-icons">arrow_drop_up</i>
              </a>
              <ul className="mdl-menu mdl-js-menu mdl-menu--top-left mdl-js-ripple-effect" htmlFor="developers-dropdown">
                <li className="mdl-menu__item">App developer resources</li>
                <li className="mdl-menu__item">Android Open Source Project</li>
                <li className="mdl-menu__item">Android SDK</li>
                <li className="mdl-menu__item">Android for Work</li>
              </ul>
              <a className="android-link mdl-typography--font-light" href="">Blog</a>
              <a className="android-link mdl-typography--font-light" href="">Privacy Policy</a>
            </div>

          </footer>
        </div>
      </div>

    )
  }
}

