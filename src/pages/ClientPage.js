import React from 'react';
import { withRouter } from 'react-router';
import ClientForm from '../components/ClientForm';
import SubSection from '../components/SubSection';
import bgShape from '../bg-shapes.png';

//This class joins the three forms ("Client", "Contact", and "Note") together in the className: "MainView"
//States:
//    newClient: (T/F) if id key found in the clients object
//Props:
//    clients: list of ALL clients passed from App class
//    onSaveClient: Function passed from App class (pushed past this class down to child ClientForm)
//Parent of ClientForm, ContactForm, NoteForm (components)
class ClientPage extends React.Component{
  constructor(props){
    super(props);

    const getInitState = () => {
      //"this.props.match.params.id" gets the "id" portion of the url. Then get the matching id from the clients object
      let client = (this.props.clients[this.props.match.params.id]);

      //if client is undefined then it is a new client
      //create a blank client to pass
      if(!client){
        //If "updatedElements" is empty, then newID is set to 1
        const newID = (Object.keys(this.props.clients).length!==0) ? Math.max(...Object.keys(this.props.clients)) + 1 : 1;
        // const id = Math.max(...Object.keys(this.props.clients)) + 1;
        client = {_id:newID, name:'', status:'Active', clientURL:'', address1:'', address2:'', city:'', state:'', zip:'', country:'', contacts:{}, notes:{}}
      }

      return client;
    }

    this.state = {
      //"this.props.match.params.id" gets the "id" portion of the url. Then if the id matches a key from the clients object
      //If NOT then it's a new client
      newClient:(!props.clients[props.match.params.id]),
      client: getInitState()
    }
  }

  // //
  // handleSaveCollection = (collectionType, element) => {
  //   const {client} = this.state;
  //   // console.log(element);
  //
  //   this.setState({
  //     client:{
  //       ...client,
  //       [collectionType]:element //This element passed into the function is from ContactForm
  //     }
  //   }, function(){this.props.onSaveClient(this.state.client);}); //callback function to setState, because setState is async and won't immediately update the state
  // }

  render(){
    const client = this.state.client;

    return(
      <div className="MainView">
        {/* Pass "...this.props" to the ClientForm, because <Route /> passes a history prop that is used in child class ClientForm*/}
        <ClientForm {...this.props} client={client} newClient={this.state.newClient} onSaveClient={this.props.onSaveClient}/>
        <SubSection type={'contact'} elements={client.contacts} />
        <SubSection type={'note'} elements={client.notes} />
        <img className="bottom_decal" src={bgShape} alt="ViaForge background decal" />
      </div>
    );
  }
}//End ClientPage class

export default withRouter(ClientPage);
