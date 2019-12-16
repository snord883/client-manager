import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDelete from '../components/ConfirmDelete';

//Child of ClientList(below) and used to create the client row for the filtered clients
//States:None
//Props:
//    client: client
//    key: Keys help React identify which items have changed, are added, or are removed. (client._id)
class ClientRow extends Component{
  state = {
    confirmDelete: false
  }

  //need a confirmation for deleted element, so include ConfirmDelete (components)
  toggleConfirmDelete = (e) => {
    const {confirmDelete} = this.state;
    this.setState({
      confirmDelete: !confirmDelete
    });
  }

  render(){
    //first letter of the client's name
    const client = this.props.client;
    const clientLetter = client.name.substring(0,1).toUpperCase();
    const clientID = client._id;
    // console.log(this.props.ableToDeleteClients);
    if(!this.props.ableToDeleteClients){
      return(
        <Link to={'/client/' + clientID}  key={clientID}  className="filteredClientRow">
          <div className="clientIcon">{clientLetter}</div>
          <span className="clientRowName">{client.name}</span>
        </Link>
      );
    } else{
        return(
          <span key={clientID}  className="filteredClientRow" onClick={this.toggleConfirmDelete}>
            <div className="clientIcon">{clientLetter}</div>
            <span className="clientRowName">{client.name}</span>
            <span className="deleteClientIcon"><i className="far fa-times-circle"></i></span>
            {(this.state.confirmDelete)&&<ConfirmDelete type={'client'} element={client} name={client.name} onCancel={this.toggleConfirmDelete} onDelete={this.props.onDeleteClient}/>}
          </span>
        );
    }
  }
}//End ClientRow class


//This class is used to create the client list for the SideBar
//States:None
//Props:
//    clients: list of ALL clients passed from SideBar class
//    selectedStatus: Passed from SideBar to determine the filtering
//Parent of ClientRow (above)
//Child of SideBar (components)
class ClientList extends Component{
  render(){
    const clients = Object.values(this.props.clients);
    const rows = [];

    //If() is used to filter the clients based on the selectedStatus
    //if true push ALL clients to ClientRow (above)
    if(this.props.selectedStatus === 'ALL'){
      clients.forEach((client) => {
        rows.push(<ClientRow key= {client._id} client={client} ableToDeleteClients={this.props.ableToDeleteClients} onDeleteClient={this.props.onDeleteClient} />);
      });
    } else { //else push only the clients that match the selectedStatus
          clients.forEach((client) => {
            if (client.status === this.props.selectedStatus) {
              rows.push(<ClientRow key={client._id} client={client} ableToDeleteClients={this.props.ableToDeleteClients} onDeleteClient={this.props.onDeleteClient} />);
            }
          });
    }
    //end if

    return (
      <div>
        {/* Array of the clients that match the selectedStatus with the loop and pushed to the ClientRow (above) */}
        {rows}
      </div>
    );
  }
};//End ClientList class

export default ClientList;
