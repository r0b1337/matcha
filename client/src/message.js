import React, { Component } from 'react';
import './message.css';
import { Button }  from "react-bootstrap";
import { message } from './notifications';
import { withRouter } from "react-router";
import Config from "./config";

const socket = require("socket.io-client")(`${Config.host}:${Config.ports.server}`);

class Message extends Component {

	constructor(props) {
		super(props);

		this.state = {conversations: "", s_user: "", chat: "", messages: ""};

		this.getConversations = this.getConversations.bind(this);
		this.setSUser = this.setSUser.bind(this);
		this.setChat = this.setChat.bind(this);
		this.getMessages = this.getMessages.bind(this);
		this.eventMessage = this.eventMessage.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
	}

	async componentWillMount(){
		if (this.props.user_id === null)
			this.props.history.push("/redirect");
		else
		{
			await this.getConversations();
			socket.emit("join", {user_id: this.props.user_id});
			socket.on("message", () => {
				this.eventMessage();
			});
			this.setState({"chat": -12});
		}
	}

	async getConversations() {
		await fetch(`${Config.host}:${Config.ports.server}/chat/conversations`, {
			method: "POST",
			headers:{
				"Content-Type": "application/json"
			},
			credentials: "include",
		}).then(response => {
			return response.json();
		}).then(json => {
			if (json.status === 200) {
				this.setState({ conversations : json.conversations });
			}
		});
	}

	async getMessages() {
		if (this.state.s_user) {
			await fetch(`${Config.host}:${Config.ports.server}/chat/${this.state.s_user}`, {
				method: "POST",
				headers:{
					"Content-Type": "application/json"
				},
				credentials: "include",
			}).then(response => {
				return response.json();
			}).then(json => {
				if (json.status === 200) {
					this.setState({ messages : json.messages });
					this.scrollToBottom();
				}
			});
		}
	}

	async setChat(chat_id){
		await this.setState({"chat": chat_id});
	}

	scrollToBottom() {
		var elem = document.getElementById('msg_history');
		if (elem)
			elem.scrollTop = elem.scrollHeight;
	}

	async eventMessage() {
		await this.getMessages();
	}

	async setSUser(user_id) {
		await this.setState({"s_user": user_id});
		await this.getMessages();
	}

	render() {
		if (this.state.conversations.length) {
			return (
				<div className="container">
					<div className="messaging">
						<div className="inbox_msg">
							<div className="inbox_people">
								<div className="headind_srch">
									<div className="recent_heading">
										<h4>Recent</h4>
									</div>
								</div>
								<div className="inbox_chat">
									{
										this.state.conversations.map((conversations, index) => (<Conversations user_id={this.props.user_id} setChat={this.setChat} setSUser={this.setSUser} data={conversations} key={index}/>))
									}
								</div>
							</div>
							{
								<ShowConversation chat_id={this.state.chat} s_user={this.state.s_user} messages={this.state.messages}/>
							}
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="container">
					<div className="messaging">
						<div className="inbox_msg">
							<div className="inbox_people">
								<div className="headind_srch">
									<div className="recent_heading">
										<h4>Recent</h4>
									</div>
								</div>
							</div>
							<center>
								<div className="m-5">
									<br/>
									<h4><i>You don't have any conversations...</i></h4>
								</div>
							</center>
						</div>
					</div>
				</div>

			);
		}
	}
}

class Conversations extends Component {

	constructor(props) {
		super(props);

		this.cEvent = this.cEvent.bind(this);
	}

	async cEvent(){
		if (Number(this.props.data.second_user) === Number(this.props.user_id))
			await this.props.setSUser(this.props.data.first_user);
		else
			await this.props.setSUser(this.props.data.second_user);
		await this.props.setChat(this.props.data.id); 
	}

	render() {
		return (
			<div className="chat_list" onClick={ () => this.cEvent() }>
				<div className="chat_people">
					<div className="chat_ib">
						<h5>{ Number(this.props.data.second_user) === Number(this.props.user_id) ? this.props.data.first_user_name : this.props.data.second_user_name } 
						</h5>
					</div>
				</div>
			</div>
		);
	}
}

class ShowConversation extends Component {

	constructor(props) {
		super(props);
		this.state = {message: "", chat_id: "", target_id: ""};

		this.sendForm = this.sendForm.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	async updateValue(e) {
		e.persist();
		await this.setState({"target_id": this.props.s_user});
		await this.setState({"chat_id": this.props.chat_id});
		await this.setState({"message": e.target.value});
	}

	async sendForm(e) {
		e.preventDefault();
		if (!this.state.message.length)
			message("error", "You have to write something.");
		else {
			fetch(`${Config.host}:${Config.ports.server}/chat/message`, {
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
					message("success", "message has been sent");
					document.getElementById("message_input").value = "";
				}
				else
					message("error", json.message);
			});
		}

	}

	render() {
		if (this.props.messages.length)
		{
			return (
				<div className="mesgs">
					<div id="msg_history">
						{
							this.props.messages.map((messages, index) => (<ShowMessages s_user={this.props.s_user} data={messages} key={index}/>))
						}
					</div>
					<div className="type_msg">
						<div className="input_msg_write">
							<input className="write_msg" type="text" placeholder="Type a message..." id="message_input" name="message" onChange={ this.updateValue }/>
							<Button variant="outline-dark" className="msg_send_btn" onClick={ this.sendForm }>Send</Button>
						</div>
					</div>
				</div>

			);
		}
		else
		{
			if (Number(this.props.chat_id) === -12)
				return null;
			else
			{
			return (
				<div className="mesgs">
					<div id="msg_history">
						<center>
							<div className="m-5">
								<br/>
								<h4><i>You could start a conversation...</i></h4>
							</div>
						</center>
					</div>
					<div className="type_msg">
						<div className="input_msg_write">
							<input className="write_msg" type="text" placeholder="Type a message..." id="message_input" name="message" onChange={ this.updateValue }/>
							<Button variant="outline-dark" className="msg_send_btn" onClick={ this.sendForm }>Send</Button>
						</div>
					</div>
				</div>

			);
			}
		}
	}
}

class ShowMessages extends Component {


	render() {
		if (Number(this.props.data.user_id) === Number(this.props.s_user))
		{
			return (
				<div className="incoming_msg">
					<div className="received_msg">
						<div className="received_withd_msg">
							<p>{this.props.data.message}</p>
							<span className="time_date">{this.props.data.date}</span>
						</div>
					</div>
				</div>
			);
		} else
		{
			return (
				<div className="outgoing_msg">
					<div className="sent_msg">
						<p>{this.props.data.message}</p>
						<span className="time_date">{this.props.data.date}</span>
					</div>
				</div>
			);
		}
	}
}

export default withRouter(Message);
