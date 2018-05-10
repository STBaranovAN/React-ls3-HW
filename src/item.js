import React from "react";
import myService from "./myservice";
//import {Component} from "react";


export default class Item extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			visible: true,
			currentText: "",
			posX: "",
			posY: "",
			btnGetTempStyleText: "Start getting current temperature",
			responseObj: null,
			err: false
		}

		this.btnDeleteStyle = {
			position: "absolute",
			top: "5px",
			right: "5px" 
		}

		this.btnGetTempStyle = {
			position: "absolute",
			bottom: "5px",
			left: "5px",
			right: "5px"
		}

		this.trackMouse = this.trackMouse.bind(this);
		this.getTemperature = this.getTemperature.bind(this);

		this.deltaX = 0;
		this.deltaY = 0;

		this.inEditMode = false;
		this.requestingTemperatureMode = false;
		this.timerId;
		this.timerDelay = 4000;
	}

	componentWillMount(){
		this.setState({
			currentText: this.props.text,
			posX: this.props.posX,
			posY: this.props.posY
		});
	}

	enterEditMode(){
		this.inEditMode = true;
		this.setState({visible: !this.state.visible});
	}

	changeView(){
		this.setState({visible: !this.state.visible});
		this.props.changeText(this.state.currentText, this.props.itemIndex);
		this.inEditMode = false;
	}

	getText(e){
		let textAreaText = e.target.value;
		this.setState({currentText: textAreaText});
	}

	startMove(e){
		window.addEventListener("mousemove", this.trackMouse);

		/* console.log( this.itemDiv.offsetTop );
		console.log( this.itemDiv.offsetLeft ); */

		this.deltaX = e.pageX - this.itemDiv.offsetLeft;
		this.deltaY = e.pageY - this.itemDiv.offsetTop;
	}

	stopMove(){
		window.removeEventListener("mousemove", this.trackMouse);
		this.props.changePos({
			posX: this.state.posX, 
			posY: this.state.posY
		}, this.props.itemIndex);
	}

	trackMouse(e){
		//console.log(e.pageX + " " + e.pageY);

		if(!this.inEditMode)
		{
			e.preventDefault();

			let posX = e.pageX - this.deltaX;
			let posY = e.pageY - this.deltaY;

			this.setState({posX: posX, posY: posY});
		}
		// this.setState({posX: e.pageX, posY: e.pageY});
	}

	tempModeEnter() {
		let city = this.state.currentText; 
		if(city === "" || city === this.props.emptyNoteText)
		{
			alert("You must enter the name of city!");
			return;
		}

		if(this.requestingTemperatureMode) {
			clearInterval(this.timerId);
			this.setState({responseObj: ""});
		} else {
			this.timerId = setInterval( () => {

				let wUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=875012f111377f30bfe2073d73e59ee8&units=metric`;

				myService(wUrl).then( data => {
					this.setState({responseObj: data}, () => {
						console.log(this.state);
					})
				}, err => {
					this.setState({err: true}, () => {
						console.log(err);
					})
				} );		
			}, this.timerDelay);
		}

		this.requestingTemperatureMode = !this.requestingTemperatureMode;
		this.setState({btnGetTempStyleText: this.requestingTemperatureMode ? "Stop getting current temperature" : "Start getting current temperature"});
	}

	getTemperature(city){
		let cityName = city;
		// let wUrl = "http://api.openweathermap.org/data/2.5/weather?q=Minsk,by&APPID=875012f111377f30bfe2073d73e59ee8&units=metric";
		let wUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=875012f111377f30bfe2073d73e59ee8&units=metric`;

		myService(wUrl).then( data => {
			this.setState({responseObj: data}, () => {
				console.log(this.state);
			})
		}, err => {
			this.setState({err: true}, () => {
				console.log(err);
			})
		} );
	}

	deleteNote(){
		this.props.deleteNote(this.props.itemIndex);
	}

	render() {
		if(this.state.err){
			return <div>Oops!!! We have a problems!</div>
		}

		let responseObj = this.state.responseObj ? this.state.responseObj.main.temp : "";
		let temperatureText = responseObj !== "" ? `${responseObj} \u00B0 C` : responseObj;

		return (
			<div 
				ref={ itemDiv => {
					this.itemDiv = itemDiv;
				} } 
				className="note" 
				style={ {	left: this.state.posX + "px",
						top: this.state.posY + "px"	} }
				onMouseDown={this.startMove.bind(this)}
				onMouseUp={this.stopMove.bind(this)}			
				>
				<div 
					className="note_text"
					style={ {display: this.state.visible ? "block" : "none"} }
					onDoubleClick={ this.enterEditMode.bind(this) }>
					<b>{this.state.currentText}</b><br/>{temperatureText}
				</div>
				<textarea 
					onDoubleClick={ this.changeView.bind(this) }
					onChange={this.getText.bind(this)}
					value={this.state.currentText}
					style={ {display: this.state.visible ? "none" : "block"} }>
				</textarea>
				<button
					style= { this.btnGetTempStyle }
					// onClick={this.getTemperature.bind(this)}
					onClick={this.tempModeEnter.bind(this)}
				>
					{this.state.btnGetTempStyleText}
				</button>

				<button 
					style={ this.btnDeleteStyle }
					/*onClick={ () => {
						this.props.deleteItem(this.props.itemIndex)
					} } */
					onClick={this.deleteNote.bind(this)}
				>
					X
				</button>
			</div>
			)
	}
}