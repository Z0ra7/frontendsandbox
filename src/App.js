import React from 'react';
import './App.css';
//Importing FullCalendar Module
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { INITIAL_EVENTS, createEventId, getEvents } from './event_utils'
//Importing axios service
import axios from 'axios';
class App extends React.Component {
  //initialize array variable
  constructor() {
    //super is used to access the variables
    super();
    this.state = {
       data: []
    }
 }
 componentDidMount() {
 //API request
 //console.log("1")
 //axios.get("http://localhost:8080/api/event").then(response => {
  //console.log("2")
 // getting and setting api data into variable
  //this.setState({ data : response.data });
  //console.log("hallo")
 //console.log(response.data)

 //response.data.forEach(element => {console.log(element)
  
 //});
//})
}
  
//Final output
render() {
  getEvents();
  //this.state.data.forEach(element => {console.log(element)
  
 //});
  return (
    <div className="App">
      
        <h1>Reactjs FullCalendar with dynamic events</h1>
      
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
          events = {[this.state.data]}
        />
    </div>
  );
  
}
}
export default App;