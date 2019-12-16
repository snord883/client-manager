import React, { Component } from 'react';

//Child of StatusBar(below) and used to create the options for the dropdown menu
//States:None
//Props:
//    optionValue: Value that will be displayed
//    isSelected: Initial value displayed in the drowdown (client's status)
class OptionRow extends Component{
  render(){
    const optionValue = this.props.optionValue;
    const isSelected = (optionValue===this.props.selectedValue);

    return (
      <option value={optionValue} selected={isSelected}>{optionValue}</option>
    );
  }
} //End of class OptionRow



//This class is used to create the dropdown menu of statuses (SideBar and ClientForm)
//  Also where colors are assigned to each status (only ClientForm)
//States:
//    statuses: List of possible statuses to choose from
//    colors: Assigned colors for the respective status (needs to be the same number of colors as statuses)
//Props:
//    isReadOnly: Passed from ClientForm to toggle accessibility of the StatusBar
//    selectedStatus: Passed from ClientForm to determine the displayed value
//    onChange: Function passed from ClientForm(components folder) to update client's status if changed
//Parent of OptionRow (above)
class StatusBar extends Component{
  state = {
    statuses: ['Active',
               'Proposal Out',
               'Analysis Out',
               'Nurturing',
               'Vetting',
               'Vendor Selection',
               'Future Potential',
               'Stagnant',
               'Declined',
               'Pro Bono',
               'Internal Active',
               'Internal Stagnant'],
    colors: ['#46d4ba',
             'blue',
             'purple',
             'yellow',
             'red',
             'blue',
             'blue',
             'blue',
             'blue',
             'blue',
             'blue',
             'blue']
  } //End of state

  render(){
    const optionValues = [];

    //if set as readOnly then a the statusIcon with respective color is displayed in place of the status dropdown
    if(this.props.isReadOnly){
      let i;
      //Match the selectedStatus with the statuses array to return the index for the color array
      for(i=0; i<this.state.colors.length; i++){if(this.props.selectedStatus===this.state.statuses[i]){break;}}
      return <div className="clientStatusBar" style={{backgroundColor: this.state.colors[i]}}>{this.props.selectedStatus}</div>
    }

    ////////////////If NOT readOnly//////////////
    //filterDisplay_bool is a trigger for the filter/SideBar dropdown
    //adds the "Filter By...." display and the "ALL" option
    if (this.props.filterDisplay_bool) {
      //Add the placeholder display when first loaded or no filter has been selected
      optionValues.push(<option key="Filter By...." value='' selected={true} hidden>Filter By....</option>);

      //Add the option to filter by ALL
      optionValues.push(
        <OptionRow
          optionValue={'ALL'}
          key={'ALL'} />
      );
    }

    //Add all of the status option found in the state.statuses then passes them to the OptionRow (above)
    this.state.statuses.forEach((status) => {
      optionValues.push(
        <OptionRow
          optionValue={status}
          selectedValue={this.props.selectedStatus}
          key={status} />
      );
    });

    return (
        <select className="StatusBar" name="status" onChange={this.props.onChange} >
            {/* Array of the possible status options that was created with the loop and the OptionRow (above) */}
            {optionValues}
        </select>
    );
  } //end render()
}; //End StatusBarclass

export default StatusBar;
