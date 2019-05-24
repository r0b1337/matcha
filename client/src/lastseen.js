import { Component } from "react";
import ReactTimeout from "react-timeout";
import Config from "./config";

class LastSeen extends Component {
	constructor(props){
		super(props);

		this.state = {"interval_id" : null};
	}

	render(){
		return null;
	}

	async componentDidMount(){
		if (this.props.user_id)
			await fetch(`${Config.host}:${Config.ports.server}/is_alive`, {
				method: "POST",
				headers:{
					"Content-Type": "application/json"
				},
				credentials: "include"
			});
		this.interval = this.props.setInterval(async () => {
			if (this.props.user_id !== null) {  
				await fetch(`${Config.host}:${Config.ports.server}/is_alive`, {
					method: "POST",
					headers:{
						"Content-Type": "application/json"
					},
					credentials: "include"
				});
			}
			else
				this.props.clearInterval(this.interval);
		}, 10000);
	}
}

export default ReactTimeout(LastSeen);
