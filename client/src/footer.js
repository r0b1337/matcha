import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

export default class Footer extends Component {
	render() {
		return (
			<div>
				<Navbar bg="dark" variant="dark" fixed="bottom">
					<Navbar.Text>
						{ "© apedron & rdurst" }
					</Navbar.Text>
				</Navbar>
				<Navbar bg="dark" variant="dark" style={{visibility: "hidden"}}>
					<Navbar.Text>
						{ "© apedron & rdurst" }
					</Navbar.Text>
				</Navbar>
			</div>
		);
	}
}
