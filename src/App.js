import React, { } from 'react';
import './App.css';
//Importing FullCalendar Module
import FullCalendar,  {} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/js/bootstrap.min.js';
import "@fullcalendar/daygrid/main.css"
import "@fullcalendar/timegrid/main.css"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
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
      currentEvent: {},
      user: [],
      modal: false,
      eventType: []
    }
    //this.handleEventClick = this.handleEventClick.bind(this);

  }

  componentDidMount() {
    //API request
    axios.get("http://localhost:8080/api/event").then(response => {
     // getting and setting api data into variable
    // get events from database
      var data = [];

      for (let i = 0; i < response.data.length; i++) {
        let obj = response.data[i];
        data.push({
          id: obj.eventId,
          title: obj.eventType,
          start: new Date(obj.start),
          end: new Date(obj.end),
          allDay: obj.allDay
        });
        
    // get eventtypes from database

        var eventTypes =['Arbeitszeit', 'Ferien','Militär','Krankheit','Anderes'];
        this.setState({ event: data, eventType: eventTypes }); //,user: variable für userstate
        console.log(this.state.event)
      }


    })
  }
  toggle = () => {

    this.setState({ modal: !this.state.modal });
  };

  handleDeleteEvent = (clickInfo) => {

    console.log(clickInfo.event.id)


    this.toggle();
  }

  handleEventClick = (clickInfo) => {

    console.log(clickInfo.event.id)
    const currentEventObject = { title: clickInfo.event.title, allDay: clickInfo.event.allDay, start: clickInfo.event.start.toString() };
    if (clickInfo.event.end != null) {
      currentEventObject.end = clickInfo.event.end.toString();
    }
    console.log(clickInfo.event.end)
    //console.log(currentEventObject)
    this.setState({ currentEvent: currentEventObject})

    this.toggle();
  }

  //handleEvents = (events) => {
  // this.setState({
  //  currentEvents: events
  //})
  //}




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


    axios.post('http://localhost:8080/api/event', {
      id: null,
      eventType: 1,
      start: arg.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      end: arg.date.toISOString().replace(/T/, ' ').replace(/\..+/, '')

    })
  };

  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id:
          title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }



  //Final output
  render() {
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
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={this.state.event}
          eventsSet={this.handleEvents}
          select={this.handleDateSelect}

          eventContent={this.renderEventContent}
          dateClick={this.handleDateClick}
          eventClick={this.handleEventClick}
        />
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle}>
            Edit Event: {this.state.currentEvent.title}
          </ModalHeader>
          <ModalBody>
            <div>

            <div class="btn-group">
  <button type="button" class="btn btn-info dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
  {this.state.currentEvent.title}
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">{this.state.currentEvent.title}</a></li>
    <li><a class="dropdown-item" href="#">Arbeitszeit</a></li>
    <li><a class="dropdown-item"href="#">Militär</a></li>
    <li><a class="dropdown-item"href="#">Andere</a></li>
  </ul>
</div>

              <br></br><br></br>
              Start:
              <br></br> {this.state.currentEvent.start}
              <br></br>
              new Start:
              <br></br>
              <div class="form-group">
              <input type="datetime-local" class="form-control"></input>
              <small id="startHelp" class="form-text text-muted">Choose another date time for event.</small>
              </div>
              <br></br><br></br>
              End: {this.state.currentEvent.end}
              <br></br>
              new End:
              <br></br>
              <div class="form-group">
              <input type="datetime-local" class="form-control"></input>
              <small id="endHelp" class="form-text text-muted">Choose another end date for event.</small>
              </div>
            <br></br>
            <div class="form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
            <small id="allDayHelp" class="form-text text-muted">Allday Event? If checked end date will be ignored</small>
            </div>
            </div>
          </ModalBody>
          <ModalFooter>
          
          <Button variant="danger" onClick={this.toggle}>
              Delete event
            </Button>
            <Button variant="primary" onClick={this.toggle}>
              Save changes
            </Button>
            <Button variant="light" onClick={this.toggle}>
              Cancel
            </Button>

            


          

          </ModalFooter>
        </Modal>
      </div>
    );

  }

}


export default App;