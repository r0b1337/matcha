import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import Config from "./config";
import { message } from "./notifications";

import { withRouter } from "react-router";

class Affinities extends Component {
	constructor(props) {
		super(props);
		this.state = { "views": [], "likes": [] };
		this.getViews = this.getViews.bind(this);
		this.getLikes = this.getLikes.bind(this);
	}
	
	getViews() {
		fetch(`${Config.host}:${Config.ports.server}/profile/get_views`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include"
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				this.setState({ "views": json.data });
			} else {
				message("error", json.message);
			}
		});
	}

	getLikes() {
		fetch(`${Config.host}:${Config.ports.server}/profile/get_likes`, {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json"
			},
			"credentials": "include"
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				this.setState({ "likes": json.data });
			} else {
				message("error", json.message);
			}
		});
	}

	componentDidMount() {
		if (this.props.user_id === null) {
			this.props.history.push("/redirect");
		} else {
			this.getViews();
			this.getLikes();
		}
	}

	render() {
		return (
			<div>
				<div className="affinities-title">
					<div className="affinities-left">
						<h5 style={{ textAlign: "right"}}><b>people who viewed your profile</b></h5>
					</div>
					<div className="affinities-right">
						<h5 style={{ textAlign: "left"}}><b>people who liked your profile</b></h5>
					</div>
				</div>
				<div className="affinities-body">
					<ListGroup className="affinities-left">
						{ !this.state.views.length ? <ListGroup.Item disabled>none...</ListGroup.Item> : "" }
						{
							this.state.views.map((view, index) => (
								<ListGroup.Item
									key={index}
									className="affinities-cell"
									onClick={() => this.props.history.push(`/profile/${view.user_id}`)}
								>
									<b>{view.username}</b> on {view.date}
								</ListGroup.Item>
							))
						}
					</ListGroup>
					<div className="profile-separator"></div> 
					<ListGroup className="affinities-right">
						{ !this.state.likes.length ? <ListGroup.Item disabled>none...</ListGroup.Item> : "" }
						{
							this.state.likes.map((view, index) => (
								<ListGroup.Item
									key={index}
									className="affinities-cell"
									onClick={() => this.props.history.push(`/profile/${view.user_id}`)}
								>
									<b>{view.username}</b> on {view.date}
								</ListGroup.Item>
							))
						}
					</ListGroup>
				</div>
			</div>
		);
	}
}

export default withRouter(Affinities);
