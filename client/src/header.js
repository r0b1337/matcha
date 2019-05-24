import React, { Component } from "react";
import { withRouter } from "react-router";
import { Navbar, Nav, Button } from "react-bootstrap";
import Notifications, { message } from "./notifications";
import Config from "./config";

import logo from "./logo.png";

class SignButton extends Component {
	constructor(props) {
		super(props);

		this.state = {logged : false};

		// This binding is necessary to make `this` work in the callback
		this.toggle = this.toggle.bind(this);
	}

	toggle(e) {
		e.preventDefault();

		fetch(`${Config.host}:${Config.ports.server}/sign/out`, {
			method: "POST",
			headers:{
				"Content-Type": "application/json"
			},
			credentials: "include",
		}).then(response => {
			return response.json();
		}).then (json => {
			if (json.status === 200) {
				localStorage.setItem("user_id", null);
				this.props.setUserId(null);
				this.props.history.push("/");
				message("success", "Signed out");
			}
		});
			
	}

	render () {

		if (localStorage.getItem("user_id") !== null) {
			return (
				<Button onClick={ this.toggle } variant="outline-light">Sign-out</Button>
			);
		}
		else {
			return (
				<Button onClick={ this.props.history.push("/sign/in") } variant="outline-light">Sign-in</Button>
			);
		}
	}

}

class LoggedNavbar extends Component {
	render () {
		return (
			<Nav>
				<Nav.Link onClick = { () => { this.props.history.push("/profile") } }>Profile</Nav.Link>
				<Nav.Link onClick = { () => { this.props.history.push("/affinities") } }>Affinities</Nav.Link>
				<Nav.Link onClick = { () => { this.props.history.push("/search") } }>Search</Nav.Link>
				<Nav.Link onClick = { () => { this.props.history.push("/chat") } }>Chat</Nav.Link>
				<Nav.Link onClick = { () => { this.props.history.push("/settings") } }>Settings</Nav.Link>
				<Notifications user_id={this.props.user_id}/>
			</Nav>
		);
	}
}

class Header extends Component {
	// setting the document title to our project name
	componentDidMount() {
		document.title = "Matcha";
	}

	render() {
		return (
			<div>
				<Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" fixed="top">
					<Navbar.Brand href="#" onClick= {() => { this.props.history.push("/") }}>
					<b>{" MATCHA "}</b>
					<img
						alt=""
						src= { logo }
						width="30"
						height="30"
						className="d-inline-block align-top"
					/>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav"/>
					<Navbar.Collapse id="responsive-navbar-nav">
						{this.props.user_id !== null ? <LoggedNavbar history= { this.props.history } user_id={this.props.user_id}/> : ""}
						<Navbar.Collapse className="justify-content-end">
							{this.props.user_id !== null ? <SignButton history= { this.props.history } setUserId= { this.props.setUserId }/> : ""}
						</Navbar.Collapse>
					</Navbar.Collapse>
				</Navbar>
				<Navbar bg="dark" variant="dark" style={{visibility: "hidden"}}>
					<Navbar.Brand> 
					<b>{" MATCHA "}</b>
					<img
						alt=""
						src= { logo }
						width="30"
						height="30"
						className="d-inline-block align-top"
					/>
					</Navbar.Brand>
				</Navbar>
			</div>
		);
	}
}

export default withRouter(Header);
