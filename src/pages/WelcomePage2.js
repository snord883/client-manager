import React from 'react';
import {Link} from 'react-router-dom';
import ConfirmDelete from '../components/ConfirmDelete';
import TransferSuperAdmin from '../components/TransferSuperAdmin';
import bgShape from '../bg-shapes.png';

//This class joins h2 and link to create a new client in the className: "MainView"
class WelcomePage2 extends React.Component{
  state = {
    showClientTools:this.props.ableToDeleteClients,
    showUserTools:false,
    confirmDelete: false,
    confirmTransfer: false,
    deleteType:''
  }

  toggleClientTools = (e) => {
    // const { showClientTools} = this.state;
    // this.setState({showClientTools: !showClientTools});

    if (this.props.ableToDeleteClients) {
      this.props.toggleAbleToDeleteClients(e);
    } else{
      const { showClientTools} = this.state;
      this.setState({showClientTools: !showClientTools});
    }
  }

  toggleUserTools = (e) => {
    const { showUserTools} = this.state;
    this.setState({showUserTools: !showUserTools});
  }

  //need a confirmation for deleted element, so include ConfirmDelete (components)
  toggleConfirmDelete = (e) => {
    const {confirmDelete} = this.state;
    this.setState({
      confirmDelete: !confirmDelete
    });
  }

  //need a confirmation for deleted element, so include ConfirmDelete (components)
  toggleConfirmTransfer = (e) => {
    const {confirmTransfer} = this.state;
    this.setState({
      confirmTransfer: !confirmTransfer
    });
  }

  render(){
    return(
      <div className="MainView">
        <a className="signOut" onClick={this.props.onSignOut}>Sign Out <i className="fas fa-sign-out-alt"></i></a>
        <div className="welcomePage">
          <h2>Welcome {this.props.currentUser.username.toUpperCase()} to ViaForge's ClientBible</h2>
          {
            !this.state.showUserTools && //if showUserTools is false show the ClientTools
              <a className="ClientTools" onClick={this.toggleClientTools}>CLIENT TOOLS</a>
            }
            {
              this.state.showClientTools && //if true show the next row
              <div className="toolIconRow">
                <Link to="/client/new" className="rightNavIcons"><i className="fas fa-plus-circle"></i></Link>
                <a className="rightNavIcons" onClick={this.props.toggleAbleToDeleteClients}><i className="fas fa-trash-alt"></i></a>
              </div>
            }
            {
              !this.state.showClientTools && //if showClientTools is false show the UserTools
              <a className="UserTools" onClick={this.toggleUserTools}>USER TOOLS</a>
            }
            {
              this.state.showUserTools && //if true show the next row
              <div className="toolIconRow">
                <Link to="/user/new" className="rightNavIcons"><i className="fas fa-plus-circle"></i></Link>
                <Link to={"/user/" + this.props.currentUser._id} className="rightNavIcons" onClick={this.toggleUserTools}><i className="fas fa-pencil-alt"></i></Link>
                <a className="rightNavIcons" onClick={this.toggleConfirmDelete}><i className="fas fa-trash-alt"></i></a>
                {this.props.currentUser.superAdmin && <a className="rightNavIcons" onClick={this.toggleConfirmTransfer}><i className="fas fa-exchange-alt"></i></a>}
              </div>
            }
        </div>
        <img className="bottom_decal" src={bgShape} alt="ViaForge background decal" />

        {/* Show the ConfirmDelete display or show nothing */}
        {(this.state.confirmDelete)&&<ConfirmDelete type={'user'} element={this.props.currentUser} name={this.props.currentUser.username} onCancel={this.toggleConfirmDelete.bind(this)} onDelete={this.props.onDeleteUser}/>}

        {/* Show the ConfirmTransfer display or show nothing */}
        {(this.state.confirmTransfer)&&<TransferSuperAdmin users={this.props.users} onCancel={this.toggleConfirmTransfer.bind(this)} onTransfer={this.props.onTransferUser}/>}
      </div>//End MainView
    );
  }
}//End WelcomePage2 class

export default WelcomePage2;
