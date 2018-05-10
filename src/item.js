import React from "react";
//import {Component} from "react";


export default class Item extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			visible: true,
			currentText: "",
			posX: "",
			posY: ""
		}
		this.btnStyle = {
			position: "absolute",
			bottom: "5px",
			right: "5px" 
		}
		this.trackMouse = this.trackMouse.bind(this);

		this.deltaX = 0;
		this.deltaY = 0;

		this.inEditMode = false;
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

	deleteNote(){
		this.props.deleteNote(this.props.itemIndex);
	}

	render() {

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
					{this.state.currentText}
				</div>
				<textarea 
					onDoubleClick={ this.changeView.bind(this) }
					onChange={this.getText.bind(this)}
					value={this.state.currentText}
					style={ {display: this.state.visible ? "none" : "block"} }>
				</textarea>

				<button 
					style={ this.btnStyle }
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