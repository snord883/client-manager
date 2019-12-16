import React from 'react';
import UserForm from '../components/UserForm';
import SubSection from '../components/SubSection';
import bgShape from '../bg-shapes.png';

//This class joins the User form in the className: "MainView"
//States:
//    newUser: (T/F) if id key found in the users object
//Props:
//    users: list of ALL users passed from App class
//    onSaveUser: Function passed from App class (pushed past this class down to child UserForm)
//Parent of UserForm (components)
class UserPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      //"this.props.match.params.id" gets the "id" portion of the url. Then if the id matches a key from the users object
      //If NOT then it's a new user
      newUser:(!props.users[props.match.params.id])
    }
  }

  render(){
    //"this.props.match.params.id" gets the "id" portion of the url. Then get the matching id from the users object
    let user = (this.props.users[this.props.match.params.id]);

    //if user is undefined then it is a new user
    //create a blank user to pass
    if(!user){
      const id = Math.max(...Object.keys(this.props.users)) + 1;
      user = {_id:id, name:'', superAdmin:false, email:'', username:'', password:''};
    }

    return(
      <div className="MainView">
        {/* Pass "...this.props" to the UserForm, because <Route /> passes a history prop that is used in child class UserForm*/}
        <UserForm {...this.props} user={user} newUser={this.state.newUser} onSaveUser={this.props.onSaveUser}/>
        {user.superAdmin && <SubSection type={'user'} elements={this.props.users} />}
        <img className="bottom_decal" src={bgShape} alt="ViaForge background decal" />
      </div>
    );
  }
}//End UserPage class

export default UserPage;
