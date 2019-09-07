import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history } from '@/helpers';
import { authenticationService } from '@/services';
import { PrivateRoute } from '@/components';
import { HomePage } from '@/Pages';
import { LoginPage } from '@/LoginPage';

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
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <div className="navbar-nav ml-auto">
                <Link to="/" className="nav-item nav-link">Ventas</Link>
                <Link to="/inventario" className="nav-item nav-link">Inventario</Link>
                <Link to="/clientes" className="nav-item nav-link">Clientes</Link>
                <Link to="/corte" className="nav-item nav-link">Corte</Link>
                <a onClick={this.logout} className="nav-item nav-link">Salir</a>
              </div>
            </nav>
          }
          {currentUser && currentUser.role != 'admin' &&
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <div className="navbar-nav ml-auto">
                <Link to="/" className="nav-item nav-link">Ventas</Link>
                <a onClick={this.logout} className="nav-item nav-link">Salir</a>
              </div>
            </nav>
          }
          <PrivateRoute exact path="/" component={HomePage} />
          <div className="jumbotron">
            <div className="container">
              <div className="row centerRow">
                <div className="col-md-6">
                  <Route path="/login" component={LoginPage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export { App }; 