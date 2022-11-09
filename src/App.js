import React from 'react';
import './App.css';
//Importing FullCalendar Module
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
//import timeGridPlugin from '@fullcalendar/timegrid'
//import interactionPlugin from '@fullcalendar/interaction'
//import { INITIAL_EVENTS, createEventId, getEvents } from './event_utils'
//Importing axios service
import axios from 'axios';
class App extends React.Component {
  //initialize array variable
  constructor() {
    //super is used to access the variables
    super();
    this.state = {
       event: [],
       user: []
    }
 }

 componentDidMount() {
 //API request
 //if(this.stateLoaded)
//{return;
//}


  //this.stateLoaded = 
  axios.get("http://localhost:8080/api/event").then(response => {

 // getting and setting api data into variable
  

 var data = [];

var titleSan = 'Randomness';
for (let i = 0; i<response.data.length; i++){
  let obj = response.data[i];
  data.push({
  id: obj.eventId,
  title: titleSan,
  start: new Date(obj.start).toISOString(),   //.replace(/T.*$/, '')
  end: new Date(obj.start).toISOString()+ 'T03:00:00'
});
this.setState({ event : data}); //,user: variable für userstate
//console.log('hey')
//console.log(this.jsonArr);
  //console.log(obj.eventId)
  //console.log(new Date(obj.start).toISOString().replace(/T.*$/, ''))
}


})
}
  
//Final output
render() {

 console.log(this.state.event);
  return (
    <div className="App">
      
        <h1>SSE Terminkalender</h1>
      
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="dayGridMonth"
          events = {this.state.event}
        />
    </div>
  );
  
}

}

export default App;