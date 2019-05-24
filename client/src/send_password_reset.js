import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { message } from "./notifications";
import Header from "./header";
import Footer from "./footer";
import Config from "./config";

class SendPasswordReset extends Component {
	constructor(props) {
		super(props);
		this.state = { "email": "" };
		this.sendForm = this.sendForm.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	sendForm(e) {
		e.preventDefault();
		fetch(`${Config.host}:${Config.ports.server}/account/send_password_reset`, {
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
				message("success", "Sent password-reset link");
			} else {
				message("error", json.message);
			}
		});

	}

	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.name]: e.target.value});
	}

	render() {
		return (
			<div>
				<Header user_id={null}/>
				<center>
					<Card className="m-5 responsive-div">
						<Card.Body>
							<Card.Title>Need a password-reset link?</Card.Title><br/>
								<Form>
									<Form.Control type="text" placeholder="E-mail address" name="email" onChange={ this.updateValue }/><br/><br/>
									<Button onClick={ this.sendForm } variant="outline-dark">Reset password</Button>
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

export default withRouter(SendPasswordReset);
