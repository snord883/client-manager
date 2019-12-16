import React from 'react';
import {Redirect} from 'react-router-dom';
// import logo from '../vfLogo.jpg';
import bgShape from '../bg-shapes.png';

class LogInPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      loggedIn: this.props.loggedIn,
      userAttempt:{
        username:'',
        password:''
      },
      numAttempts:0
    }
  }

  updatedValue = (e) => {
    const {userAttempt} = this.state;

    this.setState({
      userAttempt:{...userAttempt, [e.target.name]: e.target.value}
    });
  }

  //Sign in function
  handleSubmit = (e) => {
    e.preventDefault();
    const {userAttempt} = this.state;
    const users = Object.values(this.props.users);
    let notFound=true;

    //loop through each user to see if they match
    users.forEach((user) => {
      //IF userName and password match
      if (user.username === userAttempt.username && user.password===userAttempt.password) {
        notFound=false;

        //function calls back to App.js to change the isAuthenticated to true (giving access to the other routes)
        this.props.onSignIn(user);

        //Setting state.loggedIn to true will lead to a Redirect in the render below
        this.setState({
          loggedIn:true
        });
      }
    });

    if(notFound){
      let {numAttempts} = this.state;

      this.setState({
        numAttempts: numAttempts + 1
      }); 
    }
  }

  render(){
    if (this.state.loggedIn) {
      return(<Redirect to='/' />)
    }

    return(
      <div className="LoginPage">
        <form className="LoginForm" onSubmit={this.handleSubmit}>
          <h2>Welcome</h2>
          <p>To access the ClientBible, please enter your information below.</p>
          <input className={(this.state.numAttempts && "error")} autoFocus={true} name='username' placeholder='username' onChange={this.updatedValue}/>
          <input className={(this.state.numAttempts && "error")} type='password' name='password' placeholder='password' onChange={this.updatedValue}/>
          <button className="logInButton" type="submit">Log in <span><i className="fas fa-lock"></i></span></button>
          {
            this.state.numAttempts>0
            && <span className='errorMessage'><i className="fas fa-exclamation-triangle"></i>Your username or password is incorrect. Please try again. (Case sensitive)</span>
          }
        </form>
        <img className="bottom_decal" src={bgShape} alt="ViaForge background decal" />
      </div>
    );
  }
}

export default LogInPage;
