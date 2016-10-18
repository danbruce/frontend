import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class Navbar extends Component {
	render() {
		const { user, onToggleMenu, onGimmieInvite } = this.props;
		return (
			<div id="navbar">
				<div className="container">
					<div className="row">
						<a id="logotype" className="col-md-1" href={__BUILD__.BASE_URL}>
							<img src="https://s3.amazonaws.com/static.qri.io/svg/qri.svg" />
						</a>
						<div className="col-md-4 offset-md-3">
							<small className="alpha caps">VERY MUCH A WORK IN PROGRESS.</small>
						</div>
						<div className="menu col-md-4">
							{ 
								user ? 
									<Link to={`/${user.username}`}>{user.username}</Link> : 
									<button className="btn btn-small btn-primary" onClick={onGimmieInvite}>gimmie beta</button>
							}
							<a className="glyphicon glyphicon-menu-hamburger" onClick={onToggleMenu}> MENU</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Navbar.propTypes = {
	user : React.PropTypes.oneOfType([
		React.PropTypes.object, 
		React.PropTypes.null]),

	onToggleMenu : React.PropTypes.func.isRequired,
	onGimmieInvite : React.PropTypes.func.isRequired
}

Navbar.defaultProps = {
}