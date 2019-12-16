import React, { Component } from 'react';

class UserInfo extends Component {

  render(){
    const user = this.props.element;
    //Used to toggle className(assigned to css) for the inputs
    const editing = this.props.editMode ? " editing": "";

    return (
      <div className="info">

        <div>{/* Top row of the user info (name */}
          <input type="text" name="name" className={"elementName" + editing} autoFocus={this.props.editMode} value={user.name} placeholder="User Name" onChange={this.props.updateValue} readOnly={!this.props.editMode} />
        </div>{/* end Top row of the user info (name) */}

        <div>{/* Second Row of user info (email,username,password)*/}
          <span>
            <span className="contactIcons"><i className="fas fa-envelope"></i></span>
            <input type="email" name="email" value={user.email} className={editing} placeholder="Email" onChange={this.props.updateValue} readOnly={!this.props.editMode} />
          </span>
          <span>
            <span className="contactIcons"><i className="fas fa-user"></i></span>
            <input type="text" name="username" className={editing} value={user.username} placeholder="Username" onChange={this.props.updateValue} readOnly={!this.props.editMode} />
          </span>
          <span>
            <span className="contactIcons"><i className="fas fa-key"></i></span>
            <input type="password" name="password" value={user.password} className={editing} placeholder="Password" onChange={this.props.updateValue} readOnly={!this.props.editMode} />
          </span>
        </div>{/* end Second Row of user info (email,username,password)*/}

      </div>
    );//end return
  }//end render()
}//End UserInfo

export default UserInfo;
