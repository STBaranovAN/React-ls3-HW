import React from "react";
import Item from "./item";
import uuid from "uuid";

export default class Board extends React.Component {
	constructor(props){
		super(props);
		this.addNote = this.addNote.bind(this);
		this.emptyNoteText = "Enter city name by double click";

		this.state = {
			allNotes: []
		}
	}

	componentWillMount(){
		let notes = [];
		if(localStorage.yellowNotes) {
			notes = JSON.parse(localStorage.yellowNotes);
			if(notes.length > 0)
			{
				this.uId = notes[notes.length - 1].id;
				this.setState({allNotes: notes});
			}
		}
		

			
		// setTimeout(()=>{
			
		// }, 600);
		
	}

	generateId(){
		this.uId = this.uId || 0;
		return this.uId++;
	}

	changeText(newText, index){
		let arr = [...this.state.allNotes];
		arr[index].text = newText;
		this.setState({allNotes: arr}, function(){
			console.log(this.state.allNotes);
			this.saveAllNotes();
		});


	}

	changePos(posObj, index){
		let arr = [...this.state.allNotes];
		arr[index].posX = posObj.posX;
		arr[index].posY = posObj.posY;
		this.setState({allNotes: arr}, function(){
			console.log(this.state.allNotes);
			this.saveAllNotes();
		});
	}

	addNote(){

		let noteObj = {
			text: this.emptyNoteText,
			posX: 50,
			posY: 50,
			id: uuid.v4()
		}

		let arr = [...this.state.allNotes];
		arr.push(noteObj);
		this.setState({allNotes: arr}, console.log(this.state));

		//this.state.allNotes.push(noteObj);
	}

	deleteNote(index){
		let arr = [...this.state.allNotes]
		arr.splice(index, 1);
		this.setState({allNotes: arr}, function(){
			console.log(this.state.allNotes);
			this.saveAllNotes();
		});
	}

	saveAllNotes(){
		localStorage.yellowNotes = JSON.stringify(this.state.allNotes);
		console.log(localStorage.yellowNotes);
	}
	
	render() {

		let allNotes;

		allNotes = this.state.allNotes ? this.state.allNotes : [];

		let notes = allNotes.map( (item, index) => {
			return <Item 
				key={item.id} 
				text={item.text}
				posX={item.posX}
				posY={item.posY}
				itemIndex={index}
				emptyNoteText={this.emptyNoteText}
				changeText={this.changeText.bind(this)}
				changePos={this.changePos.bind(this)}
				deleteNote={this.deleteNote.bind(this)}
			 />
		} );

		
		return (
			<div className="board">
				<button onClick={this.addNote} className="newnote">+</button>
				{notes}
			</div>
			)
	}
}

		