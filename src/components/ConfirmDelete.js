import React from 'react';

class ConfirmDelete extends React.Component{
  constructor(props){
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }
  handleDelete = (e) => {
    //we don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    this.props.onDelete(this.props.element);
  }

  escFunction(e){
    if(e.keyCode === 27) {
      this.props.onCancel(e);
    }
  }
  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);
  }

  render(){
    return(
      <div className="confirmDelete-background">
        <div className="confirmDelete">
          <a  className="closeConfirmation" onClick={this.props.onCancel}><i className="far fa-times-circle"></i></a>
          <div className="icon"><i className="fas fa-trash-alt"></i></div>
          <h2>are you sure?</h2>
          <p>You are about to delete {this.props.type}:</p>
          <p>{this.props.name.toUpperCase()}</p>
          <p>You will not be able to undo this action once it is complete.</p>
          <a className="cancelButton" onClick={this.props.onCancel}>CANCEL</a>
          <a className="deleteButton" onClick={this.handleDelete}>DELETE</a>
        </div>
      </div>
    );
  }
}

export default ConfirmDelete;
