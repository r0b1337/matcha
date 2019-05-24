import { toast } from 'react-toastify';
import React, { Component } from "react";
import { withRouter } from "react-router";
import { NavDropdown, Badge } from "react-bootstrap";
import Config from "./config";

export const message = (variant, message) => {
	if (variant && message) {
		message = message.charAt(0).toUpperCase() + message.substr(1);
		message = message + ".";
		if (variant === "success")
			toast.success(message);
		if (variant === "error")
			toast.error(message);
	}
};

const socket = require("socket.io-client")(`${Config.host}:${Config.ports.server}`);

class Notifications extends Component{
	constructor(props){
		super(props);
	
		this.state = {notifications : null, new: false};
		
		this.getNotifications = this.getNotifications.bind(this);
		this.readNotifications = this.readNotifications.bind(this);
		this.redirect = this.redirect.bind(this);
	}

	async componentDidMount(){
		await this.getNotifications();
		if (this.state.notifications && this.state.notifications[0] && this.state.notifications[0].read === 0)
			this.setState({new: true});
		socket.emit("join", {user_id: this.props.user_id});
		socket.on("notification", () => {
			this.getNotifications();
			this.setState({new: true});
			});
	}

	async getNotifications() {
		await fetch(`${Config.host}:${Config.ports.server}/notifications`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include"
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) 
				this.setState({ "notifications": json.data });
			else {
				message("error", "This profile doesn't exist.");
			}
		});
	}

	async readNotifications() {
		await fetch(`${Config.host}:${Config.ports.server}/notifications/read`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include"
		});	
		await this.setState({"new": false});
	}

	redirect(target_id){
		this.props.history.push(`/profile/${target_id}`);
		this.getNotifications();
	}

	render() {
		if (this.state.notifications && this.state.notifications.length > 0) {
			return(
				<div>
				<NavDropdown title="Notifications" className={this.state.new ? "notification-new" : ""} onClick={this.readNotifications}>
					{ this.state.notifications.map((notification, index) => (
						<NavDropdown.Item key={index} onClick={ () => this.redirect(notification.target_id) }>{notification.details} {notification.read === 0 ? <Badge variant="danger">New</Badge> : null}</NavDropdown.Item>
					  ))
					}
				</NavDropdown>
				</div>
			);
		}
		else {
			return (
				<NavDropdown title="Notifications">
					<NavDropdown.Item>You have no new notifications...</NavDropdown.Item>
				</NavDropdown>		
			);
		}
	}
}

export default withRouter(Notifications);
