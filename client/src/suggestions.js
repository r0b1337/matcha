import React, { Component } from "react";
import { Card, Col, Button } from "react-bootstrap";
import Config from "./config";
import { message } from "./notifications";
import moment from "moment"
import "./style.css";

import { withRouter } from "react-router";

export class Suggestion extends Component {	
	constructor(props){
		super(props);

		this.state = {is_liked: false};
		
		this.isLiked = this.isLiked.bind(this);
		this.like = this.like.bind(this);
	}
	
	toRad(Value) {
		return Value * Math.PI / 180;
	}

	componentDidMount(){
		this.isLiked();
	}

	async isLiked(){
		this.setState({is_liked: this.props.data.is_liked});
	}
			
	like() {
		fetch(`${Config.host}:${Config.ports.server}/profile/like`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include",
			"body" : JSON.stringify({"target_id": this.props.data.id})
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				message("success", json.message);
				this.setState({is_liked: this.state.is_liked ? false : true});
			}
			else {
				message("error", json.message);
			}
		});
	}

	getDistance() {
		let lat1 = this.props.data.latitude;
		let lon1 = this.props.data.longitude;
		let lat2 = this.props.latitude;
		let lon2 = this.props.longitude;
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

	render() {

		let _NAME = `${this.props.data.firstname} ${this.props.data.lastname}`;
		let _AGE = moment().diff(this.props.data.date_of_birth, "YEARS");
		let _DISTANCE = this.getDistance();
		let _IMAGE = this.props.data.images[0] ? this.props.data.images[0].image : Config.default_profile_picture;
		let _INTERESTS = this.props.data.interests.slice(0, 3).join(", ");
		return (
			<Col style={{ "marginTop": "2rem", "marginBottom": "2rem", "marginLeft": "auto", "marginRight": "auto", "maxWidth": "22rem", "minWidth": "15rem" }}>
				<Card style={{ "height": "50%" }} bg="light" border="secondary">
					<Card.Img className="card-sugg-img" variant="top" src={ _IMAGE } height="50%"/>
					<Card.Body>
						<span onClick={() => this.props.history.push(`/profile/${this.props.data.id}`)} style={{ textDecoration: "none" }}>
							<Card.Title className="clickable">{ _NAME }, { _AGE }</Card.Title>
						</span>
						<Card.Subtitle className="mb-2 text-muted"><i>{ _DISTANCE } kilometers away from you</i></Card.Subtitle>
						<Card.Text>
							{ _INTERESTS }
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<center>
						<small className="text-muted"><Button variant="outline-danger" size="lg" onClick={this.like}>♥ { this.state.is_liked ? "Unlike" : "Like" }</Button></small>
						</center>
					</Card.Footer>
				</Card>
			</Col>
		);
	}
}

class Suggestions extends Component {
	constructor(props) {
		super(props);
		this.state = { "suggestions": [], "latitude": null, "longitude": null };
		this.getSuggestions = this.getSuggestions.bind(this);
		this.getUserLocation = this.getUserLocation.bind(this);
		this.getInterests = this.getInterests.bind(this);
		this.getDistance = this.getDistance.bind(this);
		this.getCommon = this.getCommon.bind(this);
		this.filterByAge = this.filterByAge.bind(this);
		this.filterByLocation = this.filterByLocation.bind(this);
		this.filterByPopularity = this.filterByPopularity.bind(this);
		this.filterByInterests = this.filterByInterests.bind(this);
	}

	getSuggestions() {
		fetch(`${Config.host}:${Config.ports.server}/suggestions`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include"
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				this.setState({ "suggestions": json.suggestions });
			} else {
				message("error", json.message);
			}
		});
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
			this.getSuggestions();
			this.getInterests();
			this.getUserLocation();
		}
	}
	
	toRad(Value) {
		return Value * Math.PI / 180;
	}

	getDistance(lat2, lon2) {
		let lat1 = this.state.latitude;
		let lon1 = this.state.longitude;
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

	getInterests(){
		fetch(`${Config.host}:${Config.ports.server}/profile/get_interests`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include"
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				this.setState({ "interests": json.data});
			}
		});
	}

	getCommon(t_ints){
		let u_ints = this.state.interests;
		let commons = u_ints.filter(u_int => t_ints.some(t_int => t_int.toLowerCase() === u_int.toLowerCase()));
		return commons.length;
	}

	filterByAge(){
		this.setState({"suggestions": this.state.suggestions.sort((a, b) => moment().diff(a.date_of_birth, "YEARS") - moment().diff(b.date_of_birth, "YEARS"))});
	}

	filterByLocation(){
		this.setState({"suggestions": this.state.suggestions.sort((a, b) => this.getDistance(a.latitude, a.longitude) - this.getDistance(b.latitude, b.longitude))});
	}

	filterByPopularity(){
		this.setState({"suggestions": this.state.suggestions.sort((a, b) => b.popularity_score - a.popularity_score)});
	}

	filterByInterests(){
		this.setState({"suggestions": this.state.suggestions.sort((a, b) => this.getCommon(b.interests) - this.getCommon(a.interests))});
	}

	render() {
		if (this.state.suggestions.length === 0) {
			return (
				<center>
					<div className="m-5">
						<br/>
						<h4><i>No profile matches your preferences...</i></h4>
					</div>
				</center>
			);
		} else {
			return (
				<div className="m-4">
					<div className="flex-div">
						<Button variant="danger" onClick={ this.filterByAge }>Sort by age</Button>
						<Button variant="danger" onClick={ this.filterByLocation }>Sort by location</Button>
						<Button variant="danger" onClick={ this.filterByPopularity }>Sort by popularity</Button>
						<Button variant="danger" onClick={ this.filterByInterests }>Sort by interests</Button>
					</div>
					{	
						this.state.suggestions.map((suggestion, index) => (
							<Suggestion data={suggestion} key={index} history={this.props.history}
								latitude={this.state.latitude} longitude={this.state.longitude}/>
						))
					}
				</div>
			);
		}
	}
}

export default withRouter(Suggestions);
