import React, { Component } from 'react';

class ContactInfo extends Component {

  render(){
    const contact = this.props.element;
    //Used to toggle className(assigned to css) for the primary_contact
    const isChecked = contact.primary_contact ? "checked" : "";
    //Used to toggle className(assigned to css) for the inputs
    const editing = this.props.editMode ? " editing": "";

    return (
      <div className="info">

        <div>{/* Top row of the contact info (name, primary_contact) */}
          <input type="text" name="name" className={"elementName" + editing} autoFocus={this.props.editMode} value={contact.name} placeholder="Contact Name" onChange={this.props.updateValue} readOnly={!this.props.editMode} />
          { //editMode determines the primary contact display (ternary operator)
            (this.props.editMode)
            ? <span>
                <label className={"primaryCheckBox_label editing"}>Primary Contact</label>
                <input type="checkbox" name="primary_contact" className="checkmark" checked={contact.primary_contact} onChange={this.props.updateValue}/>
              </span>
            : <span className={"primaryCheckBox_label " + isChecked}>Primary Contact</span>
          }
        </div>{/* end Top row of the contact info (name, primary_contact) */}

        <div>{/* Second Row of contact info (position,email,phone)*/}
          <span>
            <span className="contactIcons"><i className="fas fa-user"></i></span>
            <input type="text" name="position" className={editing} value={contact.position} placeholder="Job Title" onChange={this.props.updateValue} readOnly={!this.props.editMode} />
          </span>
          <span>
            <span className="contactIcons"><i className="fas fa-envelope"></i></span>
            <input type="email" name="email" value={contact.email} className={editing} placeholder="Email" onChange={this.props.updateValue} readOnly={!this.props.editMode} />
          </span>
          <span>
            <span className="contactIcons"><i className="fas fa-phone"></i></span>
            <input type="tel" name="phone" value={contact.phone} className={editing} placeholder="Phone Number" onChange={this.props.updateValue} readOnly={!this.props.editMode} />
          </span>
        </div>{/* end Second Row of contact info (position,email,phone)*/}

      </div>
    );//end return
  }//end render()
}//End ContactInfo

export default ContactInfo;
