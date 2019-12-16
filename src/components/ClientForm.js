import React from 'react';
import {Link} from 'react-router-dom';
import StatusBar from '../components/StatusBar';

//Child of ClientForm(below) and used to loop through the address Selection
//States:None
//Props:
//    isReadOnly: toggle the readOnly attribute for the inputs
//    value: displayed value
//    name: name of the input (address1, address2, city, state, zip, country)
//    label: label for the input also the placeholder
//    onChange: Function passed from ClientForm(below) to update client's value if changed
class AddressSections extends React.Component{
  render(){
    //if readOnly then don't add a className else add "editing" to the className
    const editing = this.props.isReadOnly ? "": " editing";

    return(
      <div className="clientAddressFields">
        <label>{this.props.label}</label>
        <input className={editing} value={this.props.pValue} name={this.props.name} placeholder={this.props.label} onChange={this.props.onChange} readOnly={this.props.isReadOnly}/>
      </div>
    );
  }
}//End of AddressSections class



//This class is used to create the client section at the top of ClientPage
//States:
//    editMode: if newClient then start off in editMode, if existing client then turn off editMode
//    client: client passed down from ClientPage
//Props:
//    client: client to display
//    newClient: (T/F) is it a new client
//    onSaveClient: Function passed from ClientPage(pages folder) to update client's info if save clicked
//Parent of OptionRow (above)
class ClientForm extends React.Component{
  constructor(props){
    super(props);
    this.escFunction = this.escFunction.bind(this);
    this.state = {
      editMode: props.newClient,
      client: props.client
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
    const {client} = this.state;
    this.setState({
      client: { ...client, [e.target.name]: e.target.value }
    });
  }

  //Save current info to client
  handleSave = (e) => {
      //we don't want the form to submit, so we prevent the default behavior
      e.preventDefault();
      //Function in App.js
      this.props.onSaveClient(this.state.client);

      this.toggleEditMode();
      //history is a props passed from <Route /> found on App.js (passed through ClientPage)
      //replace the end of the url and remain on the new client
      this.props.history.replace('/client/' + this.state.client._id);
  }

  //Allow the user to hit 'esc' to cancel editing
  escFunction(e){
    if (this.state.editMode) {
      if(e.keyCode === 27) {
        const cancelLink = this.props.newClient ? "/" : '/client/' + this.state.client._id;
        this.props.history.push(cancelLink)
      }
    }
  }
  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);
  }

  render() {
    const {client} = this.state;
    const isReadOnly = !this.state.editMode;
    //Used to toggle className(assigned to css) for the inputs
    const editing = isReadOnly ? "": " editing";
    //If it's a new client, assign cancel to homepage; else assign stay on this page
    const cancelLink = this.props.newClient ? "/" : '/client/' + client._id;

    //loop through the address elements and pass them through addressSections (above)
    const addressSections = [];
    const elementName =  ["address1","address2","city","state","zip","country"];
    const elementLabel = ["Street Address 1","Street Address 2","City","State","Zip","Country"];
    const elementValue = [client.address1, client.address2, client.city, client.state, client.zip, client.country];
    for(let i=0; i<6; i++){
        addressSections.push(<AddressSections key={elementName[i]} name={elementName[i]} label={elementLabel[i]} pValue={elementValue[i]} onChange={this.updateValue.bind(this)} isReadOnly={isReadOnly}/>);
    }
    //End loop for address elements

    return(
      <form className= "ClientForm" onSubmit={this.handleSave}>
        <div className="clientIcon">{client.name.substring(0,1).toUpperCase()}</div>
        <div className= "clientHeader">
          <input type="text" className={"clientTitle" + editing} autoFocus={this.state.editMode} name="name" value ={client.name} placeholder="Client Name" onChange={this.updateValue} readOnly={isReadOnly}/>
          {//isReadOnly determines how the url is display and if it's a link (ternary operator)
            (isReadOnly)
              ? <Link to={"//" + client.clientURL} target="_blank" className="clientUrl Link">{client.clientURL}</Link>
              :<input type="text" className={"clientUrl" + editing} name="clientURL" value={client.clientURL} placeholder="Client URL"  onChange={this.updateValue} readOnly={isReadOnly} formNoValidate={true} />
          }
          <StatusBar filterDisplay_bool={false} name="status" selectedStatus={client.status} onChange={this.updateValue} isReadOnly={isReadOnly} />
        </div>
        { //editMode determines the icons displayed
          (this.state.editMode)
          ? <span>
              <button type="submit" className="saveIcon"><i className="fas fa-save"></i></button>
              <Link to={cancelLink}  className="cancelIcon"  ><i className="far fa-times-circle"></i></Link>
            </span>
          : <a className="editIcon" onClick={this.toggleEditMode}><i className="fas fa-pencil-alt"></i></a>
        }
        <div className="clientAddressSection">
          {/* Array of the address sections created with the loop and the addressSections (above) */}
          {addressSections}
        </div>
      </form>
    );
  }//end render
}//End ClientForm class

export default ClientForm;
