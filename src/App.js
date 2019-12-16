import React, { Component } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
// import DB from './db';
import './scss/app2.min.css';
import SideBar from './components/SideBar';
// import WelcomePage from './pages/WelcomePage';
import WelcomePage2 from './pages/WelcomePage2';
import ClientPage from './pages/ClientPage';
import UserPage from './pages/UserPage';
import LogInPage from './pages/LogInPage';

let isAuthenticated = false;

const PrivateRoute = ({ component:Component, ...rest }) =>(
  <Route {...rest} render={(props) => (
    (isAuthenticated)
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)


class App extends Component {
  state = {
    // db: new DB('clients-react'),
    loggedIn:isAuthenticated,
    currentUser:undefined,
    ableToDeleteClients:false,
    users: {
      1:{_id:1, name:'admin', superAdmin:true, email:'admin@gmail.com', username:'admin',password:'test1234'},
      2:{_id:2, name:'Dave', superAdmin:false, email:'dave@gmail.com', username:'dave',password:'test1'},
      3:{_id:3, name:'Paul', superAdmin:false, email:'paul@AOL.com', username:'paul',password:'test2'},
      4:{_id:4, name:'Alexa', superAdmin:false, email:'alexa@Gmail.com', username:'alexa',password:'test3'}
    },

    clients: {
      1: {_id: 1,name: 'ESPN',status: 'Active',clientURL: 'www.espn.com/',address1: '444 Test Ave',address2:'',city: 'Test',state: 'MS',country: 'USA',zip: '12345',
          contacts:{
            1: {_id: 1,name: 'Dan Patrick',primary_contact: true,position: 'Anchor',email: 'DanPatrick@espn.com',phone: 5554443333},
            2: {_id: 2,name: 'Stewart Scott',primary_contact: false,email: 'StewartScott@espn.com'}
          },
          notes:{
            1: {_id: 1, name: 'Client Meeting Notes',
                content:'TEST: Lorem ipsum dolor sit amit, consectur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minum veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in.',
                update_date: "06/15/2018"},
            2: {_id: 2, name: 'billing', content:'TEST: Show me the $$$', update_date: '06/15/2018'}
          }
      },
      2: {_id: 2,name: 'Google',status: 'Vetting',clientURL: 'www.Google.com',address1:'',address2:'',city:'',state:'',zip:'',country:'',
          contacts:{
            1: {_id: 1,name: 'Larry Page',primary_contact: true,position: 'Founder',email: '',phone: ''},
            2: {_id: 2,name: 'Sergey Brin',primary_contact: false,position:'Founder',email: ''}
          },notes:{}},
      3: {_id: 3,name: 'Amazon',status: 'Vetting',clientURL: 'www.Amazon.com',address1: '',city: '',state: '',country: '',zip: '',contacts:{},notes:{}},
      4: {_id: 4,name: 'Microsoft',status: 'Vetting',clientURL: 'www.microsoft.com/',address1: '',city: '',state: '',country: '',zip: '',contacts:{},notes:{}},
      5: {_id: 5,name: 'YAHOO!!',status: 'Nurturing',clientURL: 'www.yahoo.me',address1:'',address2:'',city:'',state:'',zip:'',country:'',contacts:{},notes:{}},
    }
  } //end state

  // async componentDidMount(){
  //   const clients = await this.state.db.getAllClients();
  //
  //   this.setState({
  //     clients
  //   });
  // }

  handleSignInOut = (user) =>{
    // const {currentUser} = this.state;
    isAuthenticated=!isAuthenticated;

    this.setState({
      loggedIn:isAuthenticated,
      currentUser:user
    });
  }

  //Function to save user to the database
  //  function passed to UserPage then to UserForm
  handleSaveUser = (user,newUser) => {
    const {users} = this.state;
    //newCurrentUser = if NOT a newUser update the current user else if a newUser was just created stay on the current logged in user
    const newCurrentUser = !newUser ? user : this.state.currentUser;

    this.setState({
      users:{
        ...users,
        [user._id]:user //This user passed into the function is from UserForm
      },
      currentUser:newCurrentUser
    });
  }

  //Function to save client to the database
  //  function passed to ClientPage then to ClientForm
  handleSaveClient = (client) => {
    const {clients} = this.state;

    this.setState({
      clients:{
        ...clients,
        [client._id]:client //This client passed into the function is from ClientForm
      }
    });
  }

  //Function for deleting user from this.state.users
  //  Used in WelcomePage2 (pages)
  //  Used in ConfirmDelete (components) to delete currentUser and signOut
  handleDeleteUser = (user) => {
    const updatedUsers = this.state.users;
    delete updatedUsers[user._id];
    this.setState({
      users: updatedUsers
    });

    this.handleSignInOut();
  }

  //Function for transering Super Admin rights from currentUser to user passed from TransferSuperAdmin
  //  Used in WelcomePage2 (pages)
  //  Used in TransferSuperAdmin (components)
  handleTransferUser = (user) => {
    const updatedUsers = this.state.users;
    updatedUsers[user._id]['superAdmin'] = true;
    updatedUsers[this.state.currentUser._id]['superAdmin'] = false;

    this.setState({
      users: updatedUsers
    });
  }

  //Function for deleting client from this.state.clients
  //  Used in WelcomePage2 (pages)
  //  Used in ConfirmDelete (components)
  handleDeleteClient = (client) => {
    const updatedClients = this.state.clients;
    delete updatedClients[client._id];
    this.setState({
      users: updatedClients
    });
  }

  toggleAbleToDeleteClients = (e) => {
    e.preventDefault();

    const { ableToDeleteClients} = this.state;
    this.setState({ableToDeleteClients: !ableToDeleteClients});

  }

  render() {
    // console.log(this.state.users);
    return (
      <div className="App">
          <Route exact path='/login' component={(props) =>
            <LogInPage
              {...props}
              loggedIn={isAuthenticated}
              users={this.state.users}
              onSignIn={this.handleSignInOut.bind(this)}
            />}
          />
          {(isAuthenticated) && <SideBar clients={this.state.clients} ableToDeleteClients={this.state.ableToDeleteClients} onDeleteClient={this.handleDeleteClient}/>}

          <Switch>
            <PrivateRoute exact path='/' component={(props) =>
              <WelcomePage2
                {...props}
                currentUser={this.state.currentUser}
                users={this.state.users}
                onDeleteUser={this.handleDeleteUser}
                onTransferUser={this.handleTransferUser}
                toggleAbleToDeleteClients={this.toggleAbleToDeleteClients}
                ableToDeleteClients={this.state.ableToDeleteClients}
                onSignOut={this.handleSignInOut.bind(this)}
              />}
            />
            <PrivateRoute exact path="/client/:id" component={(props) =>
              <ClientPage
                {...props}
                clients={this.state.clients}
                onSaveClient={this.handleSaveClient}
              />}
            />
            <PrivateRoute exact path="/user/:id" component={(props) =>
              <UserPage
                {...props}
                users={this.state.users}
                onSaveUser={this.handleSaveUser}
              />}
            />
          </Switch>
      </div>
    );
  }
}; //end class App

export default App;
