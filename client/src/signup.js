import React, { Component } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { message } from './notifications';
import Header from "./header";
import Footer from "./footer";
import Config from "./config";

export default class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			email: "",
			firstname: "",
			lastname: "",
			password: ""
		};

		// required to call function with 'this'
		this.sendForm = this.sendForm.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	sendForm(e) {

		e.preventDefault();
		fetch(`${Config.host}:${Config.ports.server}/sign/up`, {
			method: "POST",
			headers:{
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify(this.state)
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				this.props.history.push("/sign/in");
				message("success", "You registered successfuly")
			}
			else
				message("error", json.message);
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
							<Card.Title>Credentials</Card.Title><br/>
							<Form>
								<Form.Control type="text" placeholder="Username" name="username" onChange={ this.updateValue }/><br/>
								<Form.Control type="text" placeholder="Email" name="email" onChange={ this.updateValue }/><br/>
								<Form.Control type="text" placeholder="Firstname" name="firstname" onChange={ this.updateValue }/><br/>
								<Form.Control type="text" placeholder="Lastname" name="lastname" onChange={ this.updateValue }/><br/>
								<Form.Control type="password" placeholder="Password" name="password" onChange={ this.updateValue }/><br/><br/>
								<Button onClick={ this.sendForm } variant="outline-dark">Sign-up</Button>
							</Form>
						</Card.Body>
					</Card>
					<Link to="/sign/in">Already have an account? Click here to sign in</Link>
				</center>
				<Footer/>
			</div>
		);
	}
}
