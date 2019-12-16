import React, { Component } from 'react';

class NoteInfo extends Component {

  render(){
    const note = this.props.element;
    //Used to toggle className(assigned to css) for the inputs
    const editing = this.props.editMode ? " editing": "";
    const textareaStyle = this.props.editMode ? {"height":"80px", "whiteSpace":"normal"} : {};

    return (
      <div  className="info withoutIcon">
        <div className="noteHeaderRow">
          <span><input type="text" name="name" className={"elementName" + editing} value={note.name} placeholder="Note Title" onChange={this.props.updateValue} readOnly={!this.props.editMode} /></span>
          <span className="createDate">{note.update_date}</span>
        </div>
        <textarea name="content" className={"noteContent" + editing} value={note.content} style={textareaStyle} onChange={this.props.updateValue} readOnly={!this.props.editMode}></textarea>
      </div>
    );//end return
  }//end render()
}//End ContactInfo

export default NoteInfo;
