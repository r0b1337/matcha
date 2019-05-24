import React, { Component } from "react";
import { withRouter } from "react-router";
import { message } from "./notifications";
import Header from "./header";
import Footer from "./footer";
import Config from "./config";
import qs from "query-string";

class ConfirmAccount extends Component {
	constructor(props) {
		super(props);
		this.state = { "token": "" };
		this.sendForm = this.sendForm.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	sendForm() {
		fetch(`${Config.host}:${Config.ports.server}/account/confirm`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include",
			"body": JSON.stringify(this.state)
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				this.props.history.push("/sign/in");
				message("success", "account confirmed");
			} else {
				message("error", json.message);
			}
		});

	}

	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.name]: e.target.value});
	}

	componentDidMount() {
		this.setState({ "token": qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).token });
	}

	render() {
		if (this.state.token && this.state.token.length) {
			return (
				<div>
					<Header user_id={null}/>
					<center>
						{ this.sendForm() }
					</center>
					<Footer />
				</div>
			);
		} else {
			return (<div></div>);
		}
	}
}

export default withRouter(ConfirmAccount);
