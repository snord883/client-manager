import React, { Component } from 'react';
import ContactInfo from './ContactInfo';
import NoteInfo from './NoteInfo';
import UserInfo from './UserInfo';
import ConfirmDelete from '../components/ConfirmDelete';


const getEmptyElement = (type, newID) => {
  switch (type) {
    case 'contact':
      return {_id:newID, name:'', primary_contact:'', position:'',email:'',phone:''};
    case 'note':
      const date = new Date();
      const today = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      return {_id:newID, name:'', content:'', update_date: today};
    case 'user':
      return {_id:newID, name:'', superAdmin:false, email:'', username:'', password:''};
    default:
      return {_id:newID};
  }
}

//Child of SubSectionForm(below) and used to loop through the each element
//States:
//    editMode: if newElement then start off in editMode, if existing element then turn off editMode
//    confirmDelete: toggle for displaying the ConfirmDelete (component)
//    element: element, keep track of edits
//Props:
//    element: element, keep track of initial values
//    newElement: (T/F) is it a new element
//    onDeleteElement: Function passed from SubSectionForm(below) to delete element
//        Used in this class; also passed along to ConfirmDelete (components)
class SubSectionRow extends Component{
  constructor(props){
    super(props);
    this.escFunction = this.escFunction.bind(this);
    this.state = {
      editMode: props.newElement,
      confirmDelete: false,
      element: props.element
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
    const {element} = this.state;
    //Special value assignment since "checkbox" uses checked rather than value
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({
      element: { ...element, [e.target.name]: value}
    });
  }

  //cancle values (restore info with the initial element)
  cancelEdits = (e) => {
    //If it's a new element and you cancel the form, just delete the element entirely
    if (this.props.newElement) {
      this.props.onDeleteElement(this.state.element);
    }else{
      //Turn off editMode
      this.setState({editMode: false});
      //Reset the element data
      this.setState({
        element:this.props.element
      });
    }
  }

  handleSave = (e) => {
    //we don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    this.toggleEditMode();

    this.props.onSave(this.state.element);
  }

  //need a confirmation for deleted element, so include ConfirmDelete (components)
  toggleConfirmDelete = (e) => {
    const {confirmDelete} = this.state;
    this.setState({
      confirmDelete: !confirmDelete
    });
  }

  //Allow the user to hit 'esc' to cancel editing
  escFunction(e){
    if (this.state.editMode) {
      if(e.keyCode === 27) {
        this.cancelEdits(e);
      }
    }
  }
  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);
  }

  render(){
    const {element} = this.state;

    return(
      <form className="SubSectionRow" onSubmit={this.handleSave}>
        {this.props.type!=='note' &&
          <div className="elementIconMain"><i className="fas fa-user-circle"></i></div>
        }
        {this.props.type==='contact' &&
          <ContactInfo element={element} editMode={this.state.editMode} updateValue={this.updateValue}/>
        }
        {this.props.type==='note' &&
          <NoteInfo element={element} editMode={this.state.editMode} updateValue={this.updateValue}/>
        }
        {this.props.type==='user' &&
          <UserInfo element={element} editMode={this.state.editMode} updateValue={this.updateValue}/>
        }

        { // ICON section //editMode determines the icons displayed (ternary operator)
          (this.state.editMode)
          ? <span>
              <a className="rightNavIcons" onClick={this.cancelEdits}><i className="far fa-times-circle"></i></a>
              <button type="submit" className="rightNavIcons"><i className="fas fa-save"></i></button>
            </span>
          : <div style={{"display": "inline-block"}} > {/* Had to put in a div otherwise react didn't recongize the change in the svg that is created from the icon/className*/}
              <a className="rightNavIcons" onClick={this.toggleConfirmDelete}><i className="fas fa-trash-alt"></i></a>
              <a className="rightNavIcons" onClick={this.toggleEditMode}><i className="fas fa-pencil-alt"></i></a>
            </div>
        }{/* End ICON section*/}

        {/* Show the ConfirmDelete display or show nothing */}
        {(this.state.confirmDelete)&&<ConfirmDelete type={this.props.type} element={element} name={element.name} onCancel={this.toggleConfirmDelete.bind(this)} onDelete={this.props.onDeleteElement}/>}
      </form>
    ); //end return
  }//end render
};//End SubSectionRow class



//This class is used to create the sub section of ClientPage/UserPage
//States:
//    elements: elements, keep track of edits
//Props:
//    elements: elements, keep track of initial values
//Parent of SubSectionRow (above)
class SubSectionForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      elements: props.elements
    }
  }

  //Function for adding a blank element to the elements
  handleAddElement = () =>{
    let updatedElements = this.state.elements || {};

    //If "updatedElements" is empty, then newID is set to 1
    const newID = (Object.keys(updatedElements).length!==0) ? Math.max(...Object.keys(updatedElements)) + 1 : 1;
    let newElement = getEmptyElement(this.props.type,newID);
    updatedElements[newID]=newElement;

    this.setState({
      elements:updatedElements
    });
  }

  handleSave = (element) => {
    let updatedElements = this.state.elements;
    updatedElements[element._id]=element;

    this.setState({
      elements:updatedElements
    });
  }

  //Function for deleting element from elements
  //  Used in SubSectionRow (above) to handle new elements that are cancelled before being saved
  //  Used in ConfirmDelete (components) to delete any element
  handleDeleteElement = (element) => {
    let updatedElements = this.state.elements;
    delete updatedElements[element._id];

    this.setState({
      elements: updatedElements
    });
  }

  render(){
    //if elements is undefined just the heading
    if(!this.state.elements || Object.keys(this.state.elements).length===0){
      return (
        <div className="SubSectionForm">
          <div className="SubSectionHeader">
            <div className="headerTitle">{this.props.type.toUpperCase() + 'S'}</div>
            <a className="addIcon" onClick={this.handleAddElement}><i className="fas fa-plus-circle"></i></a>
          </div>
        </div>
      );
    }


    const elements = Object.values(this.state.elements);
    const rows = [];

    elements.forEach((element) => {
      //newElement set to true/false based on if the element has a name
      const newElement = (element.name==='');
      //create the SubSectionRow
      rows.push(<SubSectionRow key={element._id} type={this.props.type} element={element} newElement={newElement} onSave={this.handleSave} onDeleteElement={this.handleDeleteElement.bind(this)}/>);
      //Add line breaks after each one and remove the last one after loop
      rows.push(<hr key={'hr' + element._id} />);
    });
    //remove the last line break
    rows.pop();

    return (
      <div className="SubSectionForm">
        <div className="SubSectionHeader">
          <div className="headerTitle">{this.props.type.toUpperCase() + 'S'}</div>
          <a className="addIcon" onClick={this.handleAddElement}><i className="fas fa-plus-circle"></i></a>
        </div>
        <div className="elementInfo">
          {/* Array of the elements from the above loop and pushed to the SubSectionRow (above) */}
          {rows}
        </div>
      </div>
    );//end return
  }//end render()
};//End SubSectionForm class

export default SubSectionForm;
