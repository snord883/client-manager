import React from 'react';
//Child of StatusBar(below) and used to create the options for the dropdown menu
//States:None
//Props:
//    optionValue: Value that will be displayed
//    isSelected: Initial value displayed in the drowdown (client's status)
class OptionRow extends React.Component{
  render(){
    const optionValue = this.props.optionValue;

    return (
      <option value={optionValue._id}>{optionValue.name}</option>
    );
  }
} //End of class OptionRow

class TransferSuperAdmin extends React.Component{
  state={
    selectedUser:''
  }

  changeSelectedUser = (e) => {
    this.setState({
      selectedUser: e.target.value
    });
  }

  handleTransfer = (e) => {
      //we don't want the form to submit, so we prevent the default behavior
      e.preventDefault();

      this.props.onTransfer(this.props.users[this.state.selectedUser]);
  }

  render(){
    const optionValues = [];

    //Add the placeholder display when first loaded or no filter has been selected
    optionValues.push(<option key="Filter By...." value='' selected={true} hidden>Select a user....</option>);

    const users = Object.values(this.props.users);

    //Add all of the user options found in the props.users then passes them to the OptionRow (above)
    users.forEach((user) => {
      optionValues.push(
        <OptionRow
          optionValue={user}
          key={user._id} />
      );
    });

    return(
      <div className="confirmDelete-background">
        <div className="confirmDelete">
          <a  className="closeConfirmation" onClick={this.props.onCancel}><i className="far fa-times-circle"></i></a>
          <div className="icon"><i className="fas fa-exchange-alt"></i></div>
          <h2>are you sure?</h2>
          <p>You are about to transfer your Super Admin rights to:</p>
          <select className="StatusBar" name="status" onChange={this.changeSelectedUser} >
            {/* Array of the possible users that was created with the loop and the OptionRow (above) */}
            {optionValues}
          </select>
          <p>You will not be able to undo this action once it is complete.</p>
          <a className="cancelButton" onClick={this.props.onCancel}>CANCEL</a>
          <a className="transferButton" onClick={this.handleTransfer}>TRANSFER</a>
        </div>
      </div>
    );
  }
}

export default TransferSuperAdmin;
