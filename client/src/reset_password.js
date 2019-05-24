import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { message } from "./notifications";
import Header from "./header";
import Footer from "./footer";
import Config from "./config";
import qs from "query-string";

class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = { "new_password": "", "confirm_password": "", "token": "" };
		this.sendForm = this.sendForm.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	sendForm(e) {
		e.preventDefault();
		fetch(`${Config.host}:${Config.ports.server}/account/reset_password`, {
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
				message("success", "Password changed");
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
		return (
			<div>
				<Header user_id={null}/>
				<center>
					<Card className="m-5 responsive-div">
						<Card.Body>
							<Card.Title>Reset password</Card.Title><br/>
								<Form>
									<Form.Control type="password" placeholder="New password" name="new_password" onChange={ this.updateValue }/><br/>
									<Form.Control type="password" placeholder="Confirm new password" name="confirm_password" onChange={ this.updateValue }/><br/><br/>
									<Button onClick={ this.sendForm } variant="outline-dark">Apply changes</Button>
								</Form>
						</Card.Body>
					</Card>
					<Link to="/sign/in">Didn't mean to reset password? Click here to sign in</Link>
				</center>
				<Footer/>
			</div>
		);
	}
}

export default withRouter(ResetPassword);
