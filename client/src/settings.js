import React, { Component } from 'react';
import { Card, Form, Button, Col, Tab, Row, Nav, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { message } from './notifications';
import Config from "./config";
import moment from 'moment';
// date picker stuff
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
// location picker
import LocationPicker from "react-location-picker";

class Images extends Component {
	constructor(props) {
		super(props);

		this.state = {profile : null, "new": null};
		this.updateValue = this.updateValue.bind(this);
		this.getImages = this.getImages.bind(this);
		this.updateImages = this.updateImages.bind(this);
		this.sendForm = this.sendForm.bind(this);
	}

	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.name]: e.target.value});
	}

	async getImages(){
		if (this.props.user_id)
			await fetch(`${Config.host}:${Config.ports.server}/profile/${this.props.user_id}`, {
				"method": "POST",
				"headers": {
					"Content-Type": "application/json"
				},
				"credentials": "include"
			}).then(response => {
				return response.json();
			}).then(json => {
				if (json.status === 200) 
					this.setState({ "profile": json.profile[0] });
				else {
					this.props.history.push("/redirect");
				}
			});
	}

	componentDidMount(){
		this.getImages();
	}

	updateImages(e) {
		let fileReader = new FileReader();
		fileReader.onload = () => {
			this.setState({"new" : fileReader.result});
		}
		if (e.target.files.length > 0)
			fileReader.readAsDataURL(e.target.files[0]);
	}

	async sendForm(e) {
		e.preventDefault();
		await fetch(`${Config.host}:${Config.ports.server}/images/upload`, {
			method: "POST",
			headers:{
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({"image" : this.state.new})
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				message("success", "New profile picture uploaded");
			}
			else
				message("error", json.message);
		});
		this.getImages();
	}

	render() {
		if (this.state.profile) {
			return (
				<div className="responsive-div setting-pane">
					<Card>
						<Card.Body>
							<Card.Title>Images</Card.Title>
							<div className="flex-div">
								{ this.state.profile.images.map((image, index) => (
										<Image
											key={index}
											image={image.image}
											id={image.id}
											getImages={this.getImages}
											history={this.props.history}
										/>
   )) }
								</div>
								<br/>
								<Form>
									<Button variant="outline-dark" onClick={this.sendForm}>Upload</Button>
									<input type="file" className="file-input mx-1" accept="image/png, image/jpeg" onChange={this.updateImages}/>
								</Form>
							</Card.Body>
						</Card>
					</div>
			);
		}
		else
			return null;
	}
}

class Image extends Component {
	constructor(props) {
		super(props);

		this.state = {show: false};
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.deleteImage = this.deleteImage.bind(this);
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	async deleteImage() {
		await fetch(`${Config.host}:${Config.ports.server}/images/delete`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include",
			"body": JSON.stringify({"image_id" : this.props.id})
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				message("success", "Image successfuly deleted");
			}
			else {
				this.props.history.push("/settings");
				message("error", "Problem with the image deletion");
			}
		});
		this.setState({show: false});
		this.props.getImages();
	}	

	render() {
		return (
			<Card border="light" className="col-md-3">
				<Card.Img src={this.props.image} variant="top"/>
				<Button key={this.props.image_id} variant="outline-danger" onClick={this.handleShow}>Delete</Button>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Warning</Modal.Title>
					</Modal.Header>
					<Modal.Body>You are going to delete an image from your profile! Are you sure that you want to do this?</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="danger" onClick={this.deleteImage}>
							Go on !
						</Button>
					</Modal.Footer>
				</Modal>
			</Card>
		);
	}
}

class Email extends Component {
	constructor(props) {
		super(props);
		this.state = {new_email: ""};

		// required to call function with 'this'
		this.sendForm = this.sendForm.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	sendForm(e) {

		e.preventDefault();
		fetch(`${Config.host}:${Config.ports.server}/update/email`, {
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
				this.props.history.push("/settings");
				message("success", "Email updated");
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
				<div className="responsive-div setting-pane">
					<Card>
						<Card.Body>
							<Card.Title>Email</Card.Title>
							<Form>
								<Form.Control type="text" placeholder="New email" name="new_email" onChange={ this.updateValue }/><br/>
								<Button onClick={ this.sendForm } variant="outline-dark">Update email address</Button>
							</Form>
						</Card.Body>
					</Card>
				</div>
			</div>
		);
	}
}

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {username: "",
		firstname: "",
		lastname: "",
		gender: "",
		sexual_orientation: "",
		bio: "",
		date_of_birth: undefined,
		selectedDate: undefined};

		// required to call function with 'this'
		this.preFill = this.preFill.bind(this);
		this.handleDayChange = this.handleDayChange.bind(this);
		this.sendForm = this.sendForm.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	handleDayChange(day) {
		this.setState({ date_of_birth: moment(day).format("YYYY-MM-DD HH:mm:ss"), selectedDate: day});
	}

	sendForm(e) {

		e.preventDefault();
		fetch(`${Config.host}:${Config.ports.server}/update/`, {
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
				this.props.history.push("/settings");
				message("success", "Profile updated successfuly");
			}
			else
				message("error", json.message);
		});

	}

	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.name]: e.target.value});
	}

	preFill(){
		fetch(`${Config.host}:${Config.ports.server}/profile/${this.props.user_id}`, {
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
				this.setState({
					"firstname": json.profile[0].firstname ? json.profile[0].firstname : "",
					"lastname": json.profile[0].lastname ? json.profile[0].lastname: "",
					"bio": json.profile[0].bio ? json.profile[0].bio : "",
					"gender": json.profile[0].gender ? json.profile[0].gender : "",
					"date_of_birth": json.profile[0].date_of_birth ? json.profile[0].date_of_birth : "",
					"sexual_orientation": json.profile[0].sexual_orientation ? json.profile[0].sexual_orientation : "",
					"selectedDate": json.profile[0].date_of_birth ? moment(json.profile[0].date_of_birth).toDate() : null
				});
			}
		});
	}
	
	componentDidMount(){
		this.preFill();
	}

	render() {
		return (
			<div>
				<div className="responsive-div setting-pane">
					<Card>
						<Card.Body>
							<Card.Title>Informations</Card.Title>
							<Form>
								<Form.Control type="text" placeholder="Firstname" name="firstname" value={this.state.firstname} onChange={ this.updateValue }/><br/>
								<Form.Control type="text" placeholder="Lastname" name="lastname" value={this.state.lastname} onChange={ this.updateValue }/><br/>
								<Form.Control as="select" name="gender" value={this.state.gender} onChange={ this.updateValue }>
									<option>Choose gender...</option>
									<option>male</option>
									<option>female</option>
								</Form.Control><br/>
								<Form.Control as="select" name="sexual_orientation" value={this.state.sexual_orientation} onChange={ this.updateValue }>
									<option>Choose sexual orientation...</option>
									<option>heterosexual</option>
									<option>homosexual</option>
									<option>bisexual</option>
								</Form.Control><br/>
								<DatePicker
									selected={this.state.selectedDate}
									onChange={this.handleDayChange}
									placeholderText="Birthdate"
									className="form-control"
									dateFormat="dd/MM/yyyy"
								/>
								<br/>
								<br/>
								<Form.Control as="textarea" placeholder="Bio" name="bio" value={this.state.bio} onChange={ this.updateValue }/><br/>
								<Button onClick={ this.sendForm } variant="outline-dark">Update informations</Button>
							</Form>
						</Card.Body>
					</Card>
				</div>
			</div>
		);
	}
}

class Password extends Component {
	constructor(props) {
		super(props);
		this.state = {old_password: "", new_password: "", confirm: ""};

		// required to call function with 'this'
		this.sendForm = this.sendForm.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	sendForm(e) {

		e.preventDefault();
		if (this.state.new_password !== this.state.confirm)
			message("error", "Passwords does not match");

		else {
			fetch(`${Config.host}:${Config.ports.server}/update/password`, {
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
					this.props.history.push("/settings");
					message("success", "Password updated successfuly");
				}
				else
					message("error", json.message);
			});
		}
	}

	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.name]: e.target.value});
	}

	render() {
		return (
			<div>
				<div className="responsive-div setting-pane">
					<Card>
						<Card.Body>
							<Card.Title>Password</Card.Title>
							<Form>
								<Form.Control type="password" placeholder="Old password" name="old_password" onChange={ this.updateValue }/><br/>
								<Form.Control type="password" placeholder="New password" name="new_password" onChange={ this.updateValue }/><br/>
								<Form.Control type="password" placeholder="Confirm" name="confirm" onChange={ this.updateValue }/><br/>
								<Button onClick={ this.sendForm } variant="outline-dark">Change password</Button>
							</Form>
						</Card.Body>
					</Card>
				</div>
			</div>
		);
	}
}

class Interests extends Component {
	constructor(props) {
		super(props);
		this.state = { interests : "" };

		// required to call function with 'this'
		this.sendForm = this.sendForm.bind(this);
		this.preFill = this.preFill.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	sendForm(e) {

		e.preventDefault();
		fetch(`${Config.host}:${Config.ports.server}/update/interests`, {
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
				this.props.history.push("/settings");
				message("success", "Updated interests successfuly");
			}
			else
				message("error", json.message);
		});

	}
	
	preFill(){
		fetch(`${Config.host}:${Config.ports.server}/profile/get_interests`, {
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
				this.setState({
					"interests": json.data.join(",")
				});
			}
		});
	}

	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.name]: e.target.value.split(",") });
	}

	componentDidMount(){
		this.preFill();
	}

	render() {
		return (
			<div>
				<div className="responsive-div setting-pane">
					<Card>
						<Card.Body>
							<Card.Title>Interests</Card.Title>
							<Form>
								<Form.Control type="text" placeholder="#bike,#natation,#dicksucking,#hashtag..." value={this.state.interests} name="interests" onChange={ this.updateValue }/><br/>
								<Button onClick={ this.sendForm } variant="outline-dark">Update interests</Button>
							</Form>
						</Card.Body>
					</Card>
				</div>
			</div>
		);
	}
}

class Location extends Component {
	constructor(props){
		super(props);

		this.state = {
						"address": null,
						"position": {
							"lat": 0,
							"lng": 0
						}
		};
	
		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.updateLocation = this.updateLocation.bind(this);
		this.getLocation = this.getLocation.bind(this);
	}

	handleLocationChange ({ position, address }) {
		this.setState({ position, address });
	}

	async updateLocation(){
		await fetch(`${Config.host}:${Config.ports.server}/update/location`, {
						method: "POST",
						headers:{
							"Content-Type": "application/json"
						},
						credentials: "include",
						body: JSON.stringify({latitude: this.state.position.lat, longitude: this.state.position.lng})
		}).then(response => {
			return response.json();
		}).then(json => {
			if(json.status === 200)
				message("success", "Your location has been updated successfuly");
			else
				message("error", json.message);
		})
	}

	async getLocation(){
			await fetch(`${Config.host}:${Config.ports.server}/profile/get_location`, {
						method: "POST",
						headers:{
							"Content-Type": "application/json"
						},
						credentials: "include"
		}).then(response => {
			return response.json();
		}).then(json => {
			if(json.status === 200)
				this.setState({"position": { "lat": json.data.latitude, "lng": json.data.longitude } });
		})
	
	}

	componentDidMount(){
		this.getLocation();
	}

	render(){
		return (
		  <div>
			  <div>
				  <LocationPicker
					  containerElement={ <div style={ {height: '100%'} } /> }
					  mapElement={ <div style={ {height: '400px'} } /> }
					  defaultPosition={ this.state.position }
					  zoom={11}
					  onChange={this.handleLocationChange}
				  />
			  </div>
			  <center><Button className="my-5" variant="outline-dark" onClick={this.updateLocation}>Update location</Button>
			  <h5>{this.state.address}</h5></center>
		  </div>
		);
	}
}

class Settings extends Component {
	render() {
		return (
			<div className="m-5 responsive-div">
				<Tab.Container id="settings-tabs" defaultActiveKey="first">
					<Row>
						<Col sm={3}>
							<Nav variant="pills" className="flex-column">
								<Nav.Item>
									<Nav.Link eventKey="first">Profile</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="second">Password</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="third">Email</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="fourth">Interests</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="fifth">Images</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="sixt">Location</Nav.Link>
								</Nav.Item>
							</Nav>
						</Col>
						<Col sm={9}>
							<Tab.Content className="responsive-div">
								<Tab.Pane eventKey="first">
									<Profile 
										history={this.props.history}
										user_id={this.props.user_id}/>
								</Tab.Pane>
								<Tab.Pane eventKey="second">
									<Password history={this.props.history}/>
								</Tab.Pane>
								<Tab.Pane eventKey="third">
									<Email history={this.props.history}/>
								</Tab.Pane>
								<Tab.Pane eventKey="fourth">
									<Interests history={this.props.history}
									user_id={this.props.user_id}/>
								</Tab.Pane>
								<Tab.Pane eventKey="fifth">
									<Images
										history={this.props.history}
										user_id={this.props.user_id}/>
								</Tab.Pane>
								<Tab.Pane eventKey="sixt">
									<Location history={this.props.history}/>
								</Tab.Pane>
							</Tab.Content>
						</Col>
					</Row>
				</Tab.Container>
			</div>
		);
	}
}

export default withRouter(Settings);
