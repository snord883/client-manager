import React from 'react';
import {Link} from 'react-router-dom';

//This class joins h2 and link to create a new client in the className: "MainView"
class WelcomePage extends React.Component{
  render(){
    return(
      <div className="MainView">
        <div className="welcomePage">
          <h2>Welcome to ViaForge's client database</h2>
          <Link to="/client/new" className="addClientButton">ADD CLIENT</Link>
          {/* <img class="bottom_decal" src='/css/bg-shapes.png' /> */}
        </div>
      </div>
    );
  }
}//End WelcomePage class

export default WelcomePage;
