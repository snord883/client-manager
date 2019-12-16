import React from 'react';
import {Link} from 'react-router-dom';

//Reg Ex to ensure strong passwords
const atLeastUpperLowerCase = /(?=.*[a-z])(?=.*[A-Z])/;
const atLeast1Number = /(?=.*[0-9])/;
const atLeast1SpecialChar = /(?=.*[!@#$%^&*])/;
const atLeast8Long = /(?=.{8,})/;

const atLeast4Long = /(?=.{4,})/;
//This class is used to create the user section of UserPage
//States:
//    editMode: if newUser then start off in editMode, if existing user then turn off editMode
//    user: user passed down from UserPage
//Props:
//    user: user to display
//    newUser: (T/F) is it a new user
//    onSaveUser: Function passed from UserPage(pages folder) to update user's info if save clicked
class UserForm extends React.Component{
  constructor(props){
    super(props);
    this.escFunction = this.escFunction.bind(this);
    this.state = {
      editMode: props.newUser,
      user: props.user,
      password2:props.user.password,
      passwordCurrent:'',
      incorrectPasswordError:false
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
    this.setState({
      user: { ...user, [e.target.name]: e.target.value }
    });
  }

  //update password2 when changed
  updateValue2 = (e) => {
    //Create the object to pass along to the setState depending on the event's target name
    const stateObject = function() {
      let returnObj = {};

      returnObj[this.target.name] = this.target.value;
         return returnObj;
    }.bind(e)();

    this.setState(stateObject);
  }

  //Save current info to user
  handleSave = (e) => {
      //we don't want the form to submit, so we prevent the default behavior
      e.preventDefault();

      const isError=(this.props.user.password!==this.state.passwordCurrent);

      if (isError){
        this.setState({
          incorrectPasswordError: {isError}
        });
      }

      else {
        //Function in App.js
        this.props.onSaveUser(this.state.user, this.props.newUser);
        this.toggleEditMode();
        //history is a props passed from <Route /> found on App.js (passed through UserPage)
        //replace the end of the url and remain on the new user
        this.props.history.replace('/user/' + this.state.user._id);
      }
  }

  checkForErrors = (e) => {
    //check to ensure the username right length and doesn't start with a #
    //check to ensure the password is the right length, starts with a letter, and has at least one #
    //check if new password confirmed
  }

  //Allow the user to hit 'esc' to cancel editing
  escFunction(e){
    if (this.state.editMode) {
      if(e.keyCode === 27) {
        const cancelLink = this.props.newUser ? "/" : '/user/' + this.state.user._id;
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
    const {user} = this.state;
    const isReadOnly = !this.state.editMode;
    //Used to toggle className(assigned to css) for the inputs
    const editing = isReadOnly ? "": " editing";
    //If it's a new user, assign cancel to homepage; else assign stay on this page
    const cancelLink = this.props.newUser ? "/" : '/user/' + user._id;

    return(
      <form className= "UserForm" onSubmit={this.handleSave}>
        <div className="userIcon">{user.username.substring(0,1).toUpperCase() || ''}</div>
        <div className= "userHeader">
          {(!isReadOnly) && <label>NAME*</label>}
          <input type="text" className={"userName" + editing} name="name" value ={user.name} placeholder="Full Name" onChange={this.updateValue} readOnly={isReadOnly}/>
          {(!isReadOnly) && <label>EMAIL</label>}
          <input type="text" className={"userEmail" + editing} name="email" value ={user.email} placeholder="Email" onChange={this.updateValue} readOnly={isReadOnly}/>
          {(!isReadOnly) && <label>USERNAME*</label>}
          {(!isReadOnly && !atLeast4Long.test(user.username)) &&
            <div className='errorMessage'><i className="fas fa-exclamation-triangle"></i>Must be at least 4 characters long.</div>}
          <input type="text" className={"userUsername" + editing} name="username" value ={user.username} placeholder="Username" onChange={this.updateValue} readOnly={isReadOnly}/>
          {
            (isReadOnly)
            ? <input type="text" name="password" value ='Security measures preclude display.' readOnly={isReadOnly}/>
            : <div>
                <label className="passwordLabel">NEW PASSWORD*</label>
                {(!atLeastUpperLowerCase.test(user.password)) &&
                  <div className='errorMessage'><i className="fas fa-exclamation-triangle"></i>Must contain at least 1 uppercase and 1 lowercase letter.</div>
                }
                {(!atLeast1Number.test(user.password)) &&
                  <div className='errorMessage'><i className="fas fa-exclamation-triangle"></i>Must contain at least 1 number.</div>
                }
                {(!atLeast1SpecialChar.test(user.password)) &&
                  <div className='errorMessage'><i className="fas fa-exclamation-triangle"></i>Must contain at least 1 special character (! @ # $ % ^ & *).</div>
                }
                {(!atLeast8Long.test(user.password)) &&
                  <div className='errorMessage'><i className="fas fa-exclamation-triangle"></i>Must be at least 8 characters long.</div>
                }
                <input type="password" className={"userPassword" + editing} name="password" value={user.password} placeholder="Password" onChange={this.updateValue} readOnly={isReadOnly}/>
                <label className="passwordLabel">CONFIRM NEW PASSWORD*</label>
                {(user.password!==this.state.password2) &&
                  <span className='errorMessage'> <i className="fas fa-exclamation-triangle"></i>New passwords do NOT match.</span>
                }
                <input type="password" className={"userPassword" + editing} name="password2" value={this.state.password2} placeholder="Password" onChange={this.updateValue2} readOnly={isReadOnly}/>
                {
                  (!this.props.newUser) &&
                    <div>
                      <hr/>
                      <label className="passwordLabel">CURRENT PASSWORD</label>
                      <input type="password" className={"userPassword" + editing} name="passwordCurrent" value={this.state.passwordCurrent} placeholder="Password" onChange={this.updateValue2} readOnly={isReadOnly}/>
                    </div>
                }
              </div>
          }
          {(this.state.incorrectPasswordError) &&
            <span className='errorMessage'> <i className="fas fa-exclamation-triangle"></i>Do NOT recognize the current password. Please make sure this information is accurate and try again</span>
          }
        </div>{/*End userHeader */}
        { //editMode determines the icons displayed
          (this.state.editMode)
          ? <span>
              <button type="submit" className="saveIcon" onClick={this.handleSave}><i className="fas fa-save"></i></button>
              <Link to={cancelLink}  className="cancelIcon"  ><i className="far fa-times-circle"></i></Link>
            </span>
          : <a className="editIcon" onClick={this.toggleEditMode}><i className="fas fa-pencil-alt"></i></a>
        }
      </form>
    );
  }//end render
}//End UserForm class

export default UserForm;
