// react
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Favicon from "react-favicon";
import Config from "./config";

// matcha app components
import Header from "./header";
import Footer from "./footer";
import Home from "./home";
import SignIn from "./signin";
import SignUp from "./signup";
import Profile from "./profile";
import Suggestions from "./suggestions";
import Settings from "./settings";
import Redirect from "./redirect";
import Search from "./search";
import Chat from "./message";
import SendPasswordReset from "./send_password_reset"
import ResetPassword from "./reset_password"
import ConfirmAccount from "./confirm_account"
import Affinities from "./affinities"

// css styles
import "./bootstrap.min.css";
import "./style.css";

// react-toastify stuff to render styled notifications/pop-ups
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

// lastseen timer
import LastSeen from "./lastseen";

// react-router used for routing
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = { user_id : (localStorage.getItem("user_id") === "null" ? null : localStorage.getItem("user_id") ) };

		this.getUserId = this.getUserId.bind(this);
		this.setUserId = this.setUserId.bind(this);

		this.confirmSession = this.confirmSession.bind(this);
	}	

	getUserId() {
		return this.state.user_id;
	}
	
	setUserId(id) {
		this.setState( { user_id : id } );
		return ;
	}

	async confirmSession(){
		if (this.state.user_id) {
			await fetch(`${Config.host}:${Config.ports.server}/profile/${this.state.user_id}`, {
				"method": "POST",
				"headers": {
					"Content-Type": "application/json"
				},
				"credentials": "include"
			}).then(response => {
				return response.json();
			}).then(async json => {
				if (json.status === 400) {
					localStorage.setItem("user_id", null);
					this.setState({user_id: null});
				}
			});
		}
	}
	
	componentDidMount(){
		this.confirmSession();
	}

	render() {
		return (
		<div>
			<LastSeen user_id={this.state.user_id}/>
			<Favicon url="http://www.iconarchive.com/download/i86051/graphicloads/100-flat-2/favourite-heart.ico" />
			<ToastContainer toastClassName="toast-container" bodyClassName="toast-body" closeButton={false} hideProgressBar={true} autoClose={1500}/>
			<Router>
				<div>
					{ this.state.user_id ? <Header
					setUserId= { this.setUserId }
					user_id = { this.state.user_id }/> : null }
					<Switch>
						<Route exact path="/" component={ this.state.user_id ? Suggestions : Home }/>
						<Route path="/sign/in" component={ () => <SignIn
						setUserId={ this.setUserId } 
						user_id={ this.state.user_id }/> }/> 
						<Route path="/sign/up" component={ SignUp }/> 
						<Route exact path="/profile" component={ () => <Profile user_id={ this.state.user_id }/> }/>
						<Route path="/profile/:user_id" component = { Profile }/>
						<Route path="/chat" component={ () => <Chat user_id={ this.state.user_id }/> }/> 
						<Route path="/settings" component={ () => <Settings user_id={this.state.user_id}/> }/>
						<Route path="/suggestions" component={ Suggestions }/>
						<Route path="/search" component={ () => <Search user_id={this.state.user_id}/> }/>
						<Route path="/redirect" component={ Redirect }/>
						<Route path="/send_password_reset" component={ SendPasswordReset }/>
						<Route path="/reset_password" component={ ResetPassword }/>
						<Route path="/confirm_account" component={ ConfirmAccount }/>
						<Route path="/affinities" component={ Affinities }/>
						<Route component={ Redirect }/>
					</Switch>
					{ this.state.user_id ? <Footer/> : null }
				</div>
			</Router>
		</div>
		);
	}
}

ReactDOM.render((<App/>), document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
