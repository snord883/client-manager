import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import logo from '../vfLogo.jpg';
import StatusBar from './StatusBar';
import ClientList from './ClientList';

//This class creates the sidebar with a header and two components ("StatusBar", "ClientList")
//States:
//    filteredStatus: filtered status
//Props:
//    clients: list of ALL clients passed from App class
//Parent of ClientList, StatusBar (components)
//Child of App
class SideBar extends Component {
  constructor(props){
    super(props);
    this.state = {filteredStatus: 'ALL'}
  }

  //Bound to changes in the StatusBar
  //when the state changes it will trigger ClientList since it depends on the state
  updateStatusFilter = (e) => {
    this.setState({filteredStatus: e.target.value});
  }

  render() {
    return (
      <div className="sidebar">
        <div className="topSection">
          <Link className="vfLogo" to="/"><img src={logo} alt="vfLogo"/></Link>
          <div className="addClientLine">
            <h3 className="sectionTitle">CLIENTS</h3>
            <Link to="/client/new" className="addIcon"><i className="fas fa-plus-circle"></i></Link>
          </div>
        </div>
        <StatusBar filterDisplay_bool={true} onChange={this.updateStatusFilter.bind(this)}/>
        <ClientList clients={this.props.clients} selectedStatus={this.state.filteredStatus} ableToDeleteClients={this.props.ableToDeleteClients} onDeleteClient={this.props.onDeleteClient}/>
      </div>
    );
  }
};//End SideBar class

export default SideBar;
