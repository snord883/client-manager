import React, { Component } from 'react';
import ConfirmDelete from '../components/ConfirmDelete';

//Child of ContactForm(below) and used to loop through the each contact of a client
//States:
//    editMode: if newContact then start off in editMode, if existing contact then turn off editMode
//    confirmDelete: toggle for displaying the ConfirmDelete (component)
//    contact: contact of the client, keep track of edits
//Props:
//    contact: contact of the client, keep track of initial values
//    newContact: (T/F) is it a new contact
//    onDeleteContact: Function passed from ContactForm(below) to delete contact
//        Used in this class; also passed along to ConfirmDelete (components)
class ContactRow extends Component{
  constructor(props){
    super(props);
    this.state = {
      editMode: props.newContact,
      confirmDelete: false,
      contact: props.contact
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
    const {contact} = this.state;
    //Special value assignment since "checkbox" uses checked rather than value
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({
      contact: { ...contact, [e.target.name]: value}
    });
  }

  //cancle values (restore info with the initial contact)
  cancelEdits = (e) => {
    this.toggleEditMode(e);

    //If it's a new contact and you cancel the form, just delete the contact entirely
    if (this.props.newContact) {
      this.props.onDeleteContact(this.state.contact);
    }
    this.setState({
      contact:this.props.contact
    });
  }

  handleSave = (e) => {
    //we don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    this.toggleEditMode();

    this.props.onSave(this.state.contact);
  }

  //need a confirmation for deleted element, so include ConfirmDelete (components)
  toggleConfirmDelete = (e) => {
    const {confirmDelete} = this.state;
    this.setState({
      confirmDelete: !confirmDelete
    });
  }

  render(){
    const {contact} = this.state;
    //Used to toggle className(assigned to css) for the primary_contact
    const isChecked = contact.primary_contact ? "checked" : "";
    //Used to toggle className(assigned to css) for the inputs
    const editing = this.state.editMode ? " editing": "";

    return(
      <form className="ContactRow">
        <div className="contactIconMain"><i className="fas fa-user-circle"></i></div>
        <div className="info">

          <div>{/* Top row of the contact info (name, primary_contact) */}
            <input type="text" name="name" className={"contactName" + editing} autoFocus={this.state.editMode} value={contact.name} placeholder="Contact Name" onChange={this.updateValue} readOnly={!this.state.editMode} />
            { //editMode determines the primary contact display (ternary operator)
              (this.state.editMode)
              ? <span>
                  <label className={"primaryCheckBox_label editing"}>Primary Contact</label>
                  <input type="checkbox" name="primary_contact" className="checkmark" checked={contact.primary_contact} onChange={this.updateValue}/>
                </span>
              : <span className={"primaryCheckBox_label " + isChecked}>Primary Contact</span>
            }
          </div>{/* end Top row of the contact info (name, primary_contact) */}

          <div>{/* Second Row of contact info (position,email,phone)*/}
            <span>
              <span className="contactIcons"><i className="fas fa-user"></i></span>
              <input type="text" name="position" className={editing} value={contact.position} placeholder="Job Title" onChange={this.updateValue} readOnly={!this.state.editMode} />
            </span>
            <span>
              <span className="contactIcons"><i className="fas fa-envelope"></i></span>
              <input type="email" name="email" value={contact.email} className={editing} placeholder="Email" onChange={this.updateValue} readOnly={!this.state.editMode} />
            </span>
            <span>
              <span className="contactIcons"><i className="fas fa-phone"></i></span>
              <input type="tel" name="phone" value={contact.phone} className={editing} placeholder="Phone Number" onChange={this.updateValue} readOnly={!this.state.editMode} />
            </span>
          </div>{/* end Second Row of contact info (position,email,phone)*/}

        </div> {/* end of info */}

        { // ICON section //editMode determines the icons displayed (ternary operator)
          (this.state.editMode)
          ? <span>
              <a className="rightNavIcons" onClick={this.cancelEdits}><i className="far fa-times-circle"></i></a>
              <a className="rightNavIcons" onClick={this.handleSave}><i className="fas fa-save"></i></a>
            </span>
          : <div style={{"display": "inline-block"}} > {/* Had to put in a div otherwise react didn't recongize the change in the svg that is created from the icon/className*/}
              <a className="rightNavIcons" onClick={this.toggleConfirmDelete}><i className="fas fa-trash-alt"></i></a>
              <a className="rightNavIcons" onClick={this.toggleEditMode}><i className="fas fa-pencil-alt"></i></a>
            </div>
        }{/* End ICON section*/}

        {/* Show the ConfirmDelete display or show nothing */}
        {(this.state.confirmDelete)&&<ConfirmDelete type={'contact'} element={contact} name={contact.name} onCancel={this.toggleConfirmDelete.bind(this)} onDelete={this.props.onDeleteContact}/>}
      </form>
    ); //end return
  }//end render
};//End ContactRow class



//This class is used to create the contact section of ClientPage
//States:
//    contacts: contacts of the client, keep track of edits
//Props:
//    contacts: contacts of the client, keep track of initial values
//Parent of ContactRow (above)
class ContactForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      contacts: props.contacts
    }
  }

  //Function for adding a blank contact to the contacts
  handleAddContact = () =>{
    const {contacts} = this.state;
    //If "contacts" are "undefined" will return a falsy values, then newID is set to 1
    const newID = (contacts) ? Math.max(...Object.keys(contacts)) + 1 : 1;
    let newContact = {_id:newID, name:'', primary_contact:'', position:'',email:'',phone:''};

    this.setState({
      contacts:{
        ...contacts,
        [newID]:newContact
      }
    });
  }

  handleSave = (contact) => {
    const {contacts} = this.state;

    this.setState({
      contacts:{
        ...contacts,
        [contact._id]:contact
      }
    });


  }

  //Function for deleting contact from Contacts
  //  Used in ContactRow (above) to handle new contacts that are cancelled before being saved
  //  Used in ConfirmDelete (components) to delete any contact
  handleDeleteContact = (contact) => {
    let updatedContacts = this.state.contacts;
    //IF there is more than 1 contact delete the element
    //else if there is only 1 contact set the contacts to undefined
    if (Object.keys(updatedContacts).length>1) {
      delete updatedContacts[contact._id];
    } else{
      updatedContacts = undefined;
    }

    this.setState({
      contacts: updatedContacts
    });
  }

  render(){
    //if contacts is undefined or contacts ==={} return just the heading
    // (or was added because when all of the contacts are deleted the obeject is left as {})
    if(!this.state.contacts){
      return (
        <div className="ContactForm">
          <div className="sectionHeader">
            <div className="headerTitle">CONTACTS</div>
            <a className="addIcon" onClick={this.handleAddContact}><i className="fas fa-plus-circle"></i></a>
          </div>
        </div>
      );
    }


    const contacts = Object.values(this.state.contacts);
    const rows = [];

    contacts.forEach((contact) => {
      //newContact set to true/false based on if the contact has a name
      const newContact = (contact.name==='');
      //create the ContactRow
      rows.push(<ContactRow key={contact._id} contact={contact} newContact={newContact} onSave={this.handleSave} onDeleteContact={this.handleDeleteContact.bind(this)}/>);
      //Add line breaks after each one and remove the last one after loop
      rows.push(<hr key={'hr' + contact._id} />);
    });
    //remove the last line break
    rows.pop();

    return (
      <div className="ContactForm">
        <div className="sectionHeader">
          <div className="headerTitle">CONTACTS</div>
          <a className="addIcon" onClick={this.handleAddContact}><i className="fas fa-plus-circle"></i></a>
        </div>
        <div className="contactInfo">
          {/* Array of the contacts from the above loop and pushed to the ClientRow (above) */}
          {rows}
        </div>
      </div>
    );//end return
  }//end render()
};//End ContactForm class

export default ContactForm;
