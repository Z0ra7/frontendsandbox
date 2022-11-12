import React from 'react';
import './App.css';
//Importing FullCalendar Module
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
//import { INITIAL_EVENTS, createEventId, getEvents } from './event_utils'
//Importing axios service
import axios from 'axios';
//import { INITIAL_EVENTS } from './event_utils';
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
      for (let i = 0; i < response.data.length; i++) {
        let obj = response.data[i];

        data.push({
          id: obj.eventId,
          title: obj.eventType,
          start: new Date(obj.start),
          end: new Date(obj.end)
        });
        this.setState({ event: data }); //,user: variable für userstate
      }


    })

  }
  handleEventClick = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

 

  handleDateClick = arg => {
    if (window.confirm("Would you like to add an event to " + arg.dateStr + " ?")) {
      this.setState({
        // add new event data
        event: this.state.event.concat({
          // creates a new array
          title: "New Event",
          start: arg.date,
          allDay: arg.allDay
        })
       
      });
    }
    function subtractHours(date, hours) {
      date.setHours(date.getHours() - hours);
    
      return date;
    }
    function addHours(date, hr){
      date.setHours(hr);
      return date;
  }

  //console.log(arg.date.strftime('%d-%m-%Y %H:%M'))
    console.log(arg.date.toISOString().replace(/T/, ' '))
    var Date = addHours(arg.date,1)
    console.log(Date);
    console.log(Date.toISOString().replace(/T/, ' '));

    axios.post('http://localhost:8080/api/event', {
      id: null,
      title: 1,
      start: arg.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      end: arg.date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    //data

    })
  };

  //Final output
  render() {
console.log(this.state.event)
    return (
      <div className="App">

        <h1>SSE Terminkalender</h1>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            hour12: false

          }}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}

          initialView="dayGridMonth"
          events={this.state.event}
          eventsSet={this.handleEvents}
        
          eventContent={renderEventContent}
          dateClick={this.handleDateClick}
          eventClick={this.handleEventClick}

        />
      </div>
    );

  }

}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b><b></b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

export default App;