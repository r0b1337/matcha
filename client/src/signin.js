import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { message } from "./notifications";
import Header from "./header";
import Footer from "./footer";
import Config from "./config";

class SignIn extends Component {
	constructor(props) {
		super(props);
		this.state = {username: "", password: "", status: false, message: ""};
		
		// required to call function with "this"
		this.sendForm = this.sendForm.bind(this);
		this.updateValue = this.updateValue.bind(this);
		this.getGeolocation = this.getGeolocation.bind(this);
	}

	getGeolocation(callback) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					callback({latitude: position.coords.latitude, longitude: position.coords.longitude})
				},
				(error) => {
					callback({latitude: null, longitude: null})
				}
			);
		} else {
			callback({latitude: null, longitude: null})
		}	
	}

	sendForm(e) {
		e.preventDefault();
		this.getGeolocation(async (res) => {
			await fetch(`${Config.host}:${Config.ports.server}/sign/in`, {
				method: "POST",
				headers:{
					"Content-Type": "application/json"
				},
				credentials: "include",
				body: JSON.stringify(this.state)
			}).then(response => {
				return response.json();
			}).then(async (json) => {
				if (json.status === 200) {
					localStorage.setItem("user_id", json.data);
					this.props.setUserId(json.data);
					this.props.history.push("/profile");
					message("success", "Signed in");
					await fetch(`${Config.host}:${Config.ports.server}/update/location`, {
						method: "POST",
						headers:{
							"Content-Type": "application/json"
						},
						credentials: "include",
						body: JSON.stringify({latitude: res.latitude, longitude: res.longitude})
					});
				}
				else
					message("error", json.message);
			});	
		});
	}

	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.name]: e.target.value});
	}

	componentDidMount() {
		if (this.props.user_id !== null)
			this.props.history.push("/redirect");
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
									<Form.Control type="password" placeholder="Password" name="password" onChange={ this.updateValue }/><br/><br/>
									<Button onClick={ this.sendForm } variant="outline-dark">Sign-in</Button>
								</Form>
						</Card.Body>
					</Card>
					<Link to="/send_password_reset">Forgot password? Click here to reset</Link><br/>
					<Link to="/sign/up">Don't have an account? Click here to sign up</Link>
				</center>
				<Footer/>
			</div>
		);
	}
}
export default withRouter(SignIn);
