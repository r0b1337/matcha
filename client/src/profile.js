import React, { Component } from "react";
import { Carousel, Image, Button, Modal, Form, Badge } from "react-bootstrap";
import Config from "./config";
import { message } from "./notifications";
import moment from "moment";

import { withRouter } from "react-router";

class StatusBadge extends Component {
	render() {
		if (moment().diff(this.props.last_seen, "minutes") > 1)
			return (<Badge variant="secondary"> last seen {this.props.last_seen} </Badge>);
		else
			return (<Badge variant="success"> online </Badge>);
	}
}

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = { "profile": "", "latitude": 0, "longitude": 0 };
		this.getProfile = this.getProfile.bind(this);
		this.getUserLocation = this.getUserLocation.bind(this);
	}

	toRad(Value) {
		return Value * Math.PI / 180;
	}

	getDistance() {
		let lat1 = this.state.profile.latitude;
		let lon1 = this.state.profile.longitude;
		let lat2 = this.state.latitude;
		let lon2 = this.state.longitude;
		let R = 6371; // km
		let dLat = this.toRad(lat2-lat1);
		let dLon = this.toRad(lon2-lon1);
		lat1 = this.toRad(lat1);
		lat2 = this.toRad(lat2);

		let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		let d = R * c;
		return Math.round(d * 10) / 10;
	}

	getProfile() {
		let user_id = this.props.match.params.user_id ? this.props.match.params.user_id : this.props.user_id;
		fetch(`${Config.host}:${Config.ports.server}/profile/${user_id}`, {
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
				message("error", "This profile doesn't exist.");
			}
		});
		if (this.props.match.params.user_id){
			fetch(`${Config.host}:${Config.ports.server}/profile/view`, {
				"method": "POST",
				"headers": {
					"Content-Type": "application/json"
				},
				"credentials": "include",
				"body": JSON.stringify({"target_id": this.props.match.params.user_id})
			});
		}
	}

	getUserLocation() {
		fetch(`${Config.host}:${Config.ports.server}/profile/get_location`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include"
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				this.setState({ "latitude": json.data.latitude });
				this.setState({ "longitude": json.data.longitude });
			} else {
				message("error", json.message);
			}
		});

	}

	componentDidMount() {
		if (this.props.user_id === null) {
			this.props.history.push("/redirect");
		} else {
			this.getProfile();	
			this.getUserLocation();
		}
	}

	render() {
		let _NAME = `${this.state.profile.firstname} ${this.state.profile.lastname}`;
		let _GENDER = this.state.profile.gender;
		let _AGE = this.state.profile.date_of_birth ? moment().diff(this.state.profile.date_of_birth, "YEARS") : "?";
		let _USERNAME = this.state.profile.username;
		let _INTERESTS = this.state.profile.interests ? this.state.profile.interests.join(", ") : "";
		let _BIO = this.state.profile.bio ? this.state.profile.bio : "";
		let _DISTANCE = this.getDistance();
		let _IMAGES = this.state.profile.images && this.state.profile.images.length ?
			this.state.profile.images : [{ "image":Config.default_profile_picture }];
		let _SCORE = this.state.profile.popularity_score;
		return (
				<div className="profile my-1">
					<div className="profile-left">
						<Carousel slide={false} interval={3000} prevIcon={null} nextIcon={null}>
							{
								_IMAGES.map((image, index) => (
									<Carousel.Item key={index}>
										<Image
											className="profile-picture"
											src={ image.image }
										/>
									</Carousel.Item>
								))
							}	
						</Carousel>
						<br/>
						{ this.props.match.params.user_id ? <Buttons user_id={this.props.match.params.user_id}/> : "" }
					</div>
					<div className="profile-separator"></div> 
					<div className="profile-right">
						<div className="profile-details">
							<p className="profile-main">
								<span className="profile-name">{ _NAME }</span> — { _USERNAME }<br/>
								<span className="profile-agd">
									{ _AGE } y/o • { _GENDER } { this.props.match.params.user_id ? "• " + _DISTANCE + " km from you" : "" }
								</span>
							</p>
							<StatusBadge last_seen={this.state.profile.last_seen}/>
							<Badge className="mx-1" variant="dark">popularity score: { _SCORE || "0" }</Badge>
							{ this.state.profile.has_liked ? <Badge variant="danger">Has liked you</Badge> : null }
							<br/>
							<br/>
							<p>{ _INTERESTS }</p>
							<p>{ _BIO }</p>
						</div>
					</div>
				</div>
		);
	}
}

class Buttons extends Component {
	constructor(props) {
		super(props);

		this.state = {
			"show": false,
			"reason": "",
			"details": "",
			"is_liked": false,
			"is_blocked": false
		}

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.updateValue = this.updateValue.bind(this);

		this.like = this.like.bind(this);
		this.report = this.report.bind(this);
		this.block = this.block.bind(this);

		this.isLikedBlocked = this.isLikedBlocked.bind(this);
	}

	like() {
		fetch(`${Config.host}:${Config.ports.server}/profile/like`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include",
			"body" : JSON.stringify({ "target_id": this.props.user_id })
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				message("success", json.message);
				this.setState({ "is_liked": this.state.is_liked ? false : true });
			} else {
				message("error", json.message);
			}
		});
	}
	
	report() {
		fetch(`${Config.host}:${Config.ports.server}/profile/report`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include",
			"body" : JSON.stringify({ "target_id": this.props.user_id, "reason": this.state.reason, "details": this.state.details })
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) 
				message("success", "user reported");
			else
				message("error", json.message);
			this.setState({ "show": false });
		});
	}

	block() {
		fetch(`${Config.host}:${Config.ports.server}/profile/block`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include",
			"body" : JSON.stringify({ "target_id": this.props.user_id })
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				message("success", json.message);
				this.setState({ "is_blocked": this.state.is_blocked ? false : true });
			} else {
				message("error", json.message);
			}
		});
	}

	async isLikedBlocked(){
		await fetch(`${Config.host}:${Config.ports.server}/profile/${this.props.user_id}`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include"
		}).then(response => {
			return response.json();
		}).then(async json => {
			if (json.status === 200) 
				await this.setState({ "is_liked": json.profile[0].is_liked, "is_blocked": json.profile[0].is_blocked });
		});
	}

	handleClose() {
		this.setState({ "show": false });
	}

	handleShow() {
		this.setState({ "show": true });
	}

	updateValue(e) {
		e.preventDefault();
		this.setState({ [e.target.name]: e.target.value });
	}

	componentDidMount(){
		this.isLikedBlocked();
	}

	render() {
		return (
			<div className="profile-buttons">
				<Button variant="outline-danger" size="lg" onClick={this.like}>
					♥ { this.state.is_liked ? "Unlike" : "Like" }
				</Button>
				<Button variant="outline-secondary" className="mx-2" size="lg" onClick={this.handleShow}>
					☟ Report
				</Button>
				<Button variant="outline-dark" size="lg" onClick={this.block}>
					⊖  { this.state.is_blocked ? "Unblock" : "Block" }
				</Button>

				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>User Report</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Control as="select" name="reason" onChange={ this.updateValue }>
							<option>disrespect</option>
							<option>harassment</option>
							<option>fake account</option>
							<option>other...</option>
						</Form.Control><br/>
						<Form.Control as="textarea" placeholder="Details..." name="details" onChange={ this.updateValue }/><br/>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="success" onClick={this.report}>
							Report
						</Button>
					</Modal.Footer>
				</Modal>

			</div>
		);
	}
}

export default withRouter(Profile);
