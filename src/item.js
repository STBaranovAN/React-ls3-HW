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
			inTempMode: false,
			tempText: "",
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

		this.deltaX = 0;
		this.deltaY = 0;

		this.inEditMode = false;
		this.timerId = null;
		this.timerDelay = 5000;
		this.responseObj = null;
	}

	componentWillMount(){
		this.setState({
			currentText: this.props.text,
			posX: this.props.posX,
			posY: this.props.posY
		});
	}

	componentDidMount(){
		let responseObj = this.responseObj;
		if(responseObj)
		{
			let temperatureText = "";
			let hasData = responseObj.hasOwnProperty("main");
			let inTempMode;

			if(hasData) {
				inTempMode = true;
				temperatureText = `${this.responseObj.main.temp} \u00B0 C`;
			} else {
				inTempMode = false;
				temperatureText = "Info by city not found!";
				clearInterval(this.timerId);
				// this.enterGetTempMode();
			}

			this.setState({
				inTempMode: inTempMode,
				tempText: temperatureText,
				err: !hasData
			}); 
		}
	}

	enterEditMode(){
		this.inEditMode = true;
		this.setState({visible: !this.state.visible});
	}

	changeView(){
		this.props.changeText(this.state.currentText, this.props.itemIndex);
		this.inEditMode = false;
		this.setState({visible: !this.state.visible});
	}

	getText(e){
		let textAreaText = e.target.value;
		this.setState({currentText: textAreaText});
	}

	startMove(e){
		window.addEventListener("mousemove", this.trackMouse);
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
		if(!this.inEditMode)
		{
			e.preventDefault();
			let posX = e.pageX - this.deltaX;
			let posY = e.pageY - this.deltaY;
			this.setState({posX: posX, posY: posY});
		}
	}

	enterGetTempMode() {
		let city = this.state.currentText; 
		if(city === "" || city === this.props.emptyNoteText)
		{
			alert("You must enter the name of city!");
			return;
		}

		let inTempMode = this.state.inTempMode;

		if(inTempMode) {
			if(this.timerId){
				clearInterval(this.timerId);
			}
			this.responseObj = null;
		} else {
			this.timerId = setInterval( () => {
				let wUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=875012f111377f30bfe2073d73e59ee8&units=metric`;

				myService(wUrl).then( data => {
					this.responseObj = data;
					this.componentDidMount();
				}, err => {
					this.setState({err: true}, () => {
						console.log(err);
					})
				} );		
			}, this.timerDelay);
		}

		this.setState({
			inTempMode: !inTempMode
		}); 
	}

	deleteNote(){
		if(this.timerId) {
			clearInterval(this.timerId);
		}
		this.props.deleteNote(this.props.itemIndex);
	}

	render() {

		/* if(this.state.err){
			return <div>Oops!!! We've got problems on server!</div>
		} */

		var btnGetTempStyleText = this.state.inTempMode ? "Stop getting current temperature" : "Start getting current temperature";

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
					<b>{this.state.currentText}</b><br/>{this.state.tempText}
				</div>
				<textarea 
					onDoubleClick={ this.changeView.bind(this) }
					onChange={this.getText.bind(this)}
					value={this.state.currentText}
					style={ {display: this.state.visible ? "none" : "block"} }>
				</textarea>
				<button
					style= { this.btnGetTempStyle }
					onClick={this.enterGetTempMode.bind(this)}
				>
					{btnGetTempStyleText}
				</button>

				<button 
					style={ this.btnDeleteStyle }
					onClick={this.deleteNote.bind(this)}
				>
					X
				</button>
			</div>
			)
	}
}