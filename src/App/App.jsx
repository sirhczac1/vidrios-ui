import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history } from '@/helpers';
import { authenticationService } from '@/services';
import { PrivateRoute } from '@/components';
import { HomePage } from '@/Pages';
import { LoginPage } from '@/LoginPage';
import { Navbar, Nav } from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
  }

  logout() {
    authenticationService.logout();
    history.push('/login');
  }

  render() {
    const { currentUser } = this.state;
    return (
      <Router history={history}>
        <div>
          {currentUser && currentUser.role === 'admin' &&
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="mb-4">
              <Navbar.Brand href="/">
                <img src="public/VitrozaLogo.png" width="27" height="30" className="d-inline-block align-top brandLogo" alt="Vitroza"/>
                Vitroza
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
                  <Link to="/" className="nav-item nav-link">Ventas</Link>
                  <Link to="/inventario" className="nav-item nav-link">Inventario</Link>
                  <Link to="/clientes" className="nav-item nav-link">Clientes</Link>
                  <Link to="/corte" className="nav-item nav-link">Corte</Link>
                  <a onClick={this.logout} className="nav-item nav-link">Salir</a>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          }
          {currentUser && currentUser.role != 'admin' &&
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="mb-4">
              <Navbar.Brand href="/">
                <img src="public/VitrozaLogo.png" width="27" height="30" className="d-inline-block align-top brandLogo" alt="Vitroza"/>
                Vitroza
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
                  <Link to="/" className="nav-item nav-link">Ventas</Link>
                  <a onClick={this.logout} className="nav-item nav-link">Salir</a>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          }
          <PrivateRoute exact path="/" component={HomePage} />
          { currentUser === null &&
          <div className="jumbotron">
            <div className="container">
              <div className="row centerRow">
                <div className="col-md-6">
                  <Route path="/login" component={LoginPage} />
                </div>
              </div>
            </div>
          </div>
          }
        </div>
      </Router>
    );
  }
}

export { App }; 