import React, { Component } from 'react';
import ConfirmDelete from '../components/ConfirmDelete';

//Child of SuperAdminForm(below) and used to loop through the each user
//States:
//    editMode: if newUser then start off in editMode, if existing user then turn off editMode
//    confirmDelete: toggle for displaying the ConfirmDelete (component)
//    user: user, keep track of edits
//Props:
//    user: user, keep track of initial values
//    newUser: (T/F) is it a new user
//    onDeleteUser: Function passed from SuperAdminForm(below) to delete user
//        Used in this class; also passed along to ConfirmDelete (components)
class UserRow extends Component{
  constructor(props){
    super(props);
    this.state = {
      editMode: props.newUser,
      confirmDelete: false,
      user: props.user
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
    const {user} = this.state;
    //Special value assignment since "checkbox" uses checked rather than value
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({
      user: { ...user, [e.target.name]: value}
    });
  }

  //cancle values (restore info with the initial user)
  cancelEdits = (e) => {
    this.toggleEditMode(e);

    //If it's a new user and you cancel the form, just delete the user entirely
    if (this.props.newUser) {
      this.props.onDeleteUser(this.state.user);
    }
    this.setState({
      user:this.props.user
    });
  }

  handleSave = (e) => {
    //we don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    this.toggleEditMode();

    this.props.onSave(this.state.user);
  }

  //need a confirmation for deleted element, so include ConfirmDelete (components)
  toggleConfirmDelete = (e) => {
    const {confirmDelete} = this.state;
    this.setState({
      confirmDelete: !confirmDelete
    });
  }

  render(){
    const {user} = this.state;
    //Used to toggle className(assigned to css) for the inputs
    const editing = this.state.editMode ? " editing": "";

    return(
      <form className="UserRow">
        <div className="userIconMain"><i className="fas fa-user-circle"></i></div>
        <div className="info">

          <div>{/* Top row of the user info (name) */}
            <input type="text" name="name" className={"userName" + editing} autoFocus={this.state.editMode} value={user.name} placeholder="User Name" onChange={this.updateValue} readOnly={!this.state.editMode} />
          </div>{/* end Top row of the user info (name) */}

          <div>{/* Second Row of user info (email,username,passward)*/}
            <span>
              <span className="userIcons"><i className="fas fa-envelope"></i></span>
              <input type="email" name="email" value={user.email} className={editing} placeholder="Email" onChange={this.updateValue} readOnly={!this.state.editMode} />
            </span>
            <span>
              <span className="userIcons"><i className="fas fa-user"></i></span>
              <input type="text" name="position" className={editing} value={user.position} placeholder="Job Title" onChange={this.updateValue} readOnly={!this.state.editMode} />
            </span>
            <span>
              <span className="userIcons"><i class="fas fa-key"></i></span>
              <input type="tel" name="phone" value={user.phone} className={editing} placeholder="Phone Number" onChange={this.updateValue} readOnly={!this.state.editMode} />
            </span>
          </div>{/* end Second Row of user info (email,username,passward)*/}

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
        {(this.state.confirmDelete)&&<ConfirmDelete type={'user'} element={user} name={user.name} onCancel={this.toggleConfirmDelete.bind(this)} onDelete={this.props.onDeleteUser}/>}
      </form>
    ); //end return
  }//end render
};//End UserRow class



//This class is used to create the user section of ClientPage
//States:
//    users: users, keep track of edits
//Props:
//    users: users, keep track of initial values
//Parent of UserRow (above)
class SuperAdminForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      users: props.users
    }
  }

  //Function for adding a blank user to the users
  handleAddUser = () =>{
    const {users} = this.state;
    //If "users" are "undefined" will return a falsy values, then newID is set to 1
    const newID = (users) ? Math.max(...Object.keys(users)) + 1 : 1;
    let newUser = {_id:newID, name:'', superAdmin:false, email:'', username:'',password:''};

    console.log(newUser);

    this.setState({
      users:{
        ...users,
        [newID]:newUser
      }
    });
  }

  handleSave = (user) => {
    const {users} = this.state;

    this.setState({
      users:{
        ...users,
        [user._id]:user
      }
    });


  }

  //Function for deleting user from Users
  //  Used in UserRow (above) to handle new users that are cancelled before being saved
  //  Used in ConfirmDelete (components) to delete any user
  handleDeleteUser = (user) => {
    let updatedUser = this.state.users;
    //IF there is more than 1 user delete the element
    //else if there is only 1 user set the user to undefined
    if (Object.keys(updatedUsers).length>1) {
      delete updatedUsers[user._id];
    } else{
      updatedUsers = undefined;
    }

    this.setState({
      users: updatedUsers
    });
  }

  render(){
    //if users is undefined or users ==={} return just the heading
    // (or was added because when all of the users are deleted the obeject is left as {})
    if(!this.state.users){
      return (
        <div className="SuperAdminForm">
          <div className="sectionHeader">
            <div className="headerTitle">USERS</div>
            <a className="addIcon" onClick={this.handleAddUser}><i className="fas fa-plus-circle"></i></a>
          </div>
        </div>
      );
    }


    const users = Object.values(this.state.users);
    const rows = [];

    users.forEach((user) => {
      //newUser set to true/false based on if the user has a name
      const newUser = (user.name==='');
      //create the UserRow
      rows.push(<UserRow key={user._id} user={user} newUser={newUser} onSave={this.handleSave} onDeleteUser={this.handleDeleteUser.bind(this)}/>);
      //Add line breaks after each one and remove the last one after loop
      rows.push(<hr key={'hr' + user._id} />);
    });
    //remove the last line break
    rows.pop();

    return (
      <div className="SuperAdminForm">
        <div className="sectionHeader">
          <div className="headerTitle">USERS</div>
          <a className="addIcon" onClick={this.handleAddUser}><i className="fas fa-plus-circle"></i></a>
        </div>
        <div className="userInfo">
          {/* Array of the users from the above loop and pushed to the ClientRow (above) */}
          {rows}
        </div>
      </div>
    );//end return
  }//end render()
};//End SuperAdminForm class

export default SuperAdminForm;
