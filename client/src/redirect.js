import React, { Component } from 'react';
import ReactTimeout from 'react-timeout';	
import Spinner from './spinner';

class Redirect extends Component {
	constructor(props) {
		super(props);

		this.state = { redirect: false };
		this.redirect = this.redirect.bind(this);
	}

	redirect() {
		this.props.history.push("/");
	}

	render() {
		return(
			<div>
				<h1 className="text-center my-5">Redirecting...</h1>
				<Spinner/>
				{ this.props.setTimeout(this.redirect, 3000) }
			</div>
		);
	}
}

export default ReactTimeout(Redirect);
