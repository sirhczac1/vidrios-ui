import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history } from '@/helpers';
import { authenticationService } from '@/services';
import { PrivateRoute } from '@/components';
import { HomePage } from '@/HomePage';
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
					{ currentUser &&
            <nav className="navbar navbar-expand navbar-dark bg-dark">
							<div className="navbar-nav">
								<Link to="/" className="nav-item nav-link">Inicio</Link>
								<a onClick={this.logout} className="nav-item nav-link">Salir</a>
							</div>
						</nav>
					}
					<div className="jumbotron">
						<div className="container">
							<div className="row">
								<div className="col-md-6 offset-md-3">
									<PrivateRoute exact path="/" component={HomePage}/>
									<Route path="/login" component={LoginPage}/>
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