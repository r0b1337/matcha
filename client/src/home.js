import React, { Component } from "react";
import { Carousel, Button, Card } from "react-bootstrap";
import "./style.css";

export default class Home extends Component {
	render() {
		return (
			<Carousel fade="true">
				<Carousel.Item className="home-background bg-1">
					<Carousel.Caption>
						<h1>MATCHA</h1>
						<h2>Match. Chat. Date.</h2>
						<Button	className="m-5" size="lg" variant="outline-light" onClick={ () => { this.props.history.push("/sign/up") } }>Sign-Up</Button>
						<Button className="m-5" size="lg" variant="outline-light" onClick={ () => { this.props.history.push("/sign/in") } }>Sign-In</Button>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item className="home-background bg-2">
					<Carousel.Caption>
						<Card className="m-5" style={{ width: "22vh" }} bg="transparent" border="white">
							<Card.Body>
								<Card.Title>- Fabian</Card.Title>
								<Card.Text>
									"I am using matcha everyday bro, this is dope<span role="img" aria-label="fire">🔥"</span>
								</Card.Text>
							</Card.Body>
						</Card>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item className="home-background bg-3">
					<Carousel.Caption>
						<Card className="m-4" style={{ width: "22vh" }} bg="transparent" border="white">
							<Card.Body>
								<Card.Title>- The Guardian</Card.Title>
								<Card.Text>
									"One of the best dating website we've ever tested."
								</Card.Text>
							</Card.Body>
						</Card>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
		);
	}
}
