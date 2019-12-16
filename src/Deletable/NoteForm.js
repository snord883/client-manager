import React, { Component } from 'react';
import ConfirmDelete from '../components/ConfirmDelete';

//Child of NoteForm(below) and used to loop through the each Note of a client
//States:
//    editMode: if newNote then start off in editMode, if existing note then turn off editMode
//    confirmDelete: toggle for displaying the ConfirmDelete (component)
//    note: note of the client, keep track of edits
//Props:
//    note: note of the client, keep track of initial values
//    newNote: (T/F) is it a new notes
//    onDeleteNote: Function passed from NoteForm(below) to delete note
//        Used in this class; also passed along to ConfirmDelete (components)
class NoteRow extends Component{
  constructor(props){
    super(props);
    this.state = {
      editMode: props.newNote,
      confirmDelete: false,
      note: props.note
    }
  }

  //Toggle editMode
  //when the state changes it will trigger render since it depends on the state
  toggleEditMode = (e) => {
    const { editMode} = this.state;
    this.setState({editMode: !editMode});
  }

  //update values when changed
  updateValue = (e) => {
    const {note} = this.state;
    this.setState({
      note: { ...note, [e.target.name]: e.target.value }
    });
  }

  //cancle values (restore info with the initial note)
  cancelEdits = (e) => {
    this.toggleEditMode(e);

    //If it's a new note and you cancel the form, just delete the note entirely
    if (this.props.newNote) {
      this.props.onDeleteNote(this.state.note);
    }
    this.setState({
      note:this.props.note
    });
  }

  //need a confirmation for deleted element, so include ConfirmDelete (components)
  toggleConfirmDelete = (e) => {
    const {confirmDelete} = this.state;
    this.setState({
      confirmDelete: !confirmDelete
    });
  }

  render(){
    const {note} = this.state;
    const editing = this.state.editMode ? " editing": "";
    const textareaStyle = this.state.editMode ? {"height":"80px", "whiteSpace":"normal"} : {};
    return(
      <form className="NoteRow">
        <div  className="info">
          <div className="noteHeaderRow">
            <span><input type="text" name="title" className={"noteTitle" + editing} value={note.name} placeholder="Note Title" onChange={this.updateValue} readOnly={!this.state.editMode} /></span>
            <span className="createDate">{note.update_date}</span>
          </div>
          <textarea name="content" className={"noteContent" + editing} value={note.content} style={textareaStyle} onChange={this.updateValue} readOnly={!this.state.editMode}></textarea>
        </div>

        { // ICON section //editMode determines the icons displayed (ternary operator)
          (this.state.editMode)
          ? <span>
             <a className="rightNavIcons" onClick={this.cancelEdits}><i className="far fa-times-circle"></i></a>
             <a className="rightNavIcons" onClick={this.toggleEditMode}><i className="fas fa-save"></i></a>
            </span>
          : <div style={{"display": "inline-block"}} > {/* Had to put in a div otherwise react didn't recongize the change in the svg that is created from the icon/className*/}
             <a className="rightNavIcons" onClick={this.toggleConfirmDelete}><i className="fas fa-trash-alt"></i></a>
             <a className="rightNavIcons" onClick={this.toggleEditMode}><i className="fas fa-pencil-alt"></i></a>
            </div>
        }{/* End ICON section*/}

        {/* Show the ConfirmDelete display or show nothing */}
        {(this.state.confirmDelete)&&<ConfirmDelete type={'note'} element={note} name={note.name} onCancel={this.toggleConfirmDelete.bind(this)} onDelete={this.props.onDeleteNote}/>}
      </form>
    );//end return
  }//end render()
};//End NoteRow class



//This class is used to create the note section of ClientPage
//States:
//    notes: notes of the client, keep track of edits
//Props:
//    notes: notes of the client, keep track of initial values
//Parent of NoteRow (above)
class NoteForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      notes: props.notes
    }
  }

  //Function for adding a blank note to the notes
  handleAddNote = () =>{
    const {notes} = this.state;
    //If "notes" are "undefined" will return a falsy values, then newID is set to 1
    const newID = (notes) ? Math.max(...Object.keys(notes)) + 1 : 1;
    const date = new Date();
    const today = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    let newNote = {_id:newID, title:'', content:'', update_date: today};

    this.setState({
      notes:{
        ...notes,
        [newID]:newNote
      }
    });
  }

  //Function for deleting note from Notes
  //  Used in NoteRow (above) to handle new notes that are cancelled before being saved
  //  Used in ConfirmDelete (components) to delete any note
  handleDeleteNote = (note) => {
    let updatedNotes = this.state.notes;
    //IF there is more than 1 contact delete the element
    //else if there is only 1 contact set the contacts to undefined
    if (Object.keys(updatedNotes).length>1) {
      delete updatedNotes[note._id];
    } else{
      updatedNotes = undefined;
    }
    this.setState({
      notes: updatedNotes
    });
  }

  render(){
    //if notes is undefined return just the heading
    // (or was added because when all of the notes are deleted the obeject is left as {})
    if(!this.state.notes){
      return (
        <div className="NoteForm">
          <div className="sectionHeader">
            <div className="headerTitle">NOTES</div>
            <a className="addIcon" onClick={this.handleAddNote}><i className="fas fa-plus-circle"></i></a>
          </div>
        </div>
      );
    }

    const notes = Object.values(this.state.notes);
    const rows = [];

    notes.forEach((note) => {
      //newNote set to true/false based on if the note has a title
      const newNote = (note.name==='');
      //create the NoteRow
      rows.push(<NoteRow key={note._id} note={note} newNote={newNote} onDeleteNote={this.handleDeleteNote.bind(this)}/>);
      //Add line breaks after each one and remove the last one after loop
      rows.push(<hr key={'hr' + note._id} />);
    });
    //remove the last line break
    rows.pop();

    return (
      <div className="NoteForm">
        <div className="sectionHeader">
          <div className="headerTitle">NOTES</div>
          <a className="addIcon" onClick={this.handleAddNote}><i className="fas fa-plus-circle"></i></a>
        </div>
        <div className="noteInfo">
          {/* Array of the notes from the above loop and pushed to the NoteRow (above) */}
          {rows}
        </div>
      </div>
    );//end return
  }//end render()
};//End NoteForm class

export default NoteForm;
