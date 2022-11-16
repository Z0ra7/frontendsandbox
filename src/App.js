import React, { } from 'react';
import './App.css';
//Importing FullCalendar Module
import Popup from './event_utils';
import FullCalendar, { } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css'; //macht alles blau
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/js/bootstrap.min.js'
import moment from 'moment';
import "@fullcalendar/daygrid/main.css"
import "@fullcalendar/timegrid/main.css"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
//import { INITIAL_EVENTS, createEventId, getEvents } from './event_utils'
//Importing axios service
import axios from 'axios';
//import { INITIAL_EVENTS } from './event_utils';
const eventPath = '159.69.194.20:8080/api/event'//"http://localhost:8080/api/event"//"http://localhost:8080/api/event";

class App extends React.Component {
  calendarRef = React.createRef()
  //initialize array variable
  isPostRequest = false; // stands for is POSTREQUEST for modal
  changedTitle = null;
  changedStart = null;
  changedEnd = null;
  changedallDay = null;
  constructor() {
    //super is used to access the variables
    super();
    this.state = {
      event: [],
      currentEvent: {},
      user: [],
      modal: false,
      eventType: [],
      isPOST: false,
      clickedDate: '',
      onChangeEventTitle: 'Arbeitszeit', //Default "Arbeitszeit"
      onChangeEventStart: null,
      onChangeEventEnd: null,
      onChangeEventallDay: false,
    };
    //this.handleChange = this.handleChange.bind(this)
  }


  componentDidMount() {
    //API request
    axios.get(eventPath).then(response => {
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

        var eventTypes = ['Arbeitszeit', 'Ferien', 'Militär', 'Krankheit', 'Anderes'];
        this.setState({ event: data, eventType: eventTypes }); //,user: variable für userstate
      }


    })
  }

  handleChangeEvent = (e, prop) => {
    console.log('im handle change')
    console.log(prop + ': ' + e.target.value)

    if (prop === "title") {
      this.changedTitle = e.target.value //richtig im put
      this.setState({ onChangeEventTitle: e.target.value })//richtig im post
    } else if (prop === "start") {
      this.changedStart = e.target.value
      this.setState({ onChangeEventStart: e.target.value })
    } else if (prop === "end") {
      this.changedEnd = e.target.value
      this.setState({ onChangeEventEnd: e.target.value })
    } else if (prop === "allDay") {
      this.changedallDay = e.target.value
      this.setState({ onChangeEventallDay: !this.state.onChangeEventallDay })
    } else {
      return;
    }
  }

  toggle = () => {
    //set back allDay boolean and modal state
    if (this.state.onChangeEventallDay) {
      this.setState({ onChangeEventallDay: !this.state.onChangeEventallDay })
    }
    this.setState({ modal: !this.state.modal, onChangeEventStart: null });
  };


  handleDeleteEvent = () => {
    let calendarApi = this.calendarRef.current.getApi()
    let event = calendarApi.getEventById(this.state.currentEvent.id)
    event.remove()
    this.toggle();
    axios.delete(eventPath, { params: { Id: this.state.currentEvent.id } })
  }

  handlePutEvent = () => {
    console.log('is a put')
console.log(this.changedStart)
console.log(this.state.currentEvent.start)

    // Post event data to backend endpoint
    axios.put(eventPath, {
      eventId: this.state.currentEvent.id,
      eventType: this.changedTitle,
      start: this.state.currentEvent.start,
      end: this.state.currentEvent.end,
      allDay: this.state.currentEvent.allDay
    }).then((response) => {
      //handle success
      let calendarApi = this.calendarRef.current.getApi()
      let event = calendarApi.getEventById(this.state.currentEvent.id)
      //delete event immediately in daygrid view
      event.remove()
      //show event immediately in daygrid view
      calendarApi.addEvent({
        title: this.changedTitle,
        start: this.state.currentEvent.start,
        end: this.state.onChangeEventEnd,
        allDay: this.state.onChangeEventallDay
      })
      console.log(response);
      alert('Event successfully updated.')
    })
      .catch((response) => {
        //handle error
        console.log(response)

        alert('Event could not be updated.')

      })
    this.toggle()
  }


  handlePostEvent = () => {
    console.log('handlePostEvent')

    let EventChangeStart = this.state.onChangeEventStart;
    if (this.state.onChangeEventStart === null) {
      EventChangeStart = this.state.clickedDate;
    }

    let calendarApi = this.calendarRef.current.getApi()
    //show event immediately in daygrid view
    calendarApi.addEvent({
      title: this.state.onChangeEventTitle,
      start: EventChangeStart,
      end: this.state.onChangeEventEnd,
      allDay: this.state.onChangeEventallDay
    })

    // Post event data to backend endpoint
    axios.post(eventPath, {
      eventType: this.state.onChangeEventTitle,
      start: EventChangeStart,
      end: this.state.onChangeEventEnd,
      allDay: this.state.onChangeEventallDay
    });
    //close modal
    this.toggle()
    //reset isPost boolean
    this.setState({ isPOST: false })
  }



  // Add events on Click
  //PostRequest
  handleDateClick = arg => {
    this.isPostRequest = true;
    // Define start str which gets its value from click arg and format it with moment
    const startDateStr = moment(arg.date).format('YYYY-MM-DDTHH:mm');
    // release currentEvent in state
    this.setState({ currentEvent: '', isPOST: true, clickedDate: startDateStr });



    // popup modal view
    this.toggle();
  }

  // putRequest
  handleEventClick = (clickInfo) => {
    const currentEventObject = { id: clickInfo.event.id, title: clickInfo.event.title, allDay: clickInfo.event.allDay, start: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm'), end: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm') };
    if (clickInfo.event.end != null) {
      currentEventObject.end = moment(clickInfo.event.end).format('YYYY-MM-DDTHH:mm');
    }

    this.setState({ currentEvent: currentEventObject, clickedDate: currentEventObject.start, isPost: true })

    this.toggle(); //macht pop auf
  }




  handleDateSelect = (selectInfo) => {
    //let title = prompt('Please enter a new title for your event')
    // let calendarApi = selectInfo.view.calendar

    //calendarApi.unselect() // clear date selection

    //if (title) {
    // calendarApi.addEvent({
    //   id:
    //    title,
    //   start: selectInfo.startStr,
    //  end: selectInfo.endStr,
    //  allDay: selectInfo.allDay
    //  })
    // }
  }
  resetParams = () => {
    this.isPostRequest = false; //set back to default
  };


  //Final output
  render() {
    return (
      <div className="App">

        <h1>SSE Terminkalender</h1>

        <FullCalendar
          ref={this.calendarRef}
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
          onClosed={this.resetParams}
        >
          <ModalHeader toggle={this.toggle}>
            Edit Event: {this.state.currentEvent.title}
          </ModalHeader>
          <ModalBody>
            <div>
              <select onChange={(e) => this.handleChangeEvent(e, 'title')} defaultValue={this.state.currentEvent.title} className="form-select" aria-label="Default select example">
                <option value="Arbeitszeit">Arbeitszeit</option>
                <option value="Ferien">Ferien</option>
                <option value="Militär">Militär</option>
                <option value="Krankheit">Krankheit</option>
                <option value="Anderes">Anderes</option>
              </select>
              <br></br>
              <br></br>
              <div className="form-group" onChange={(e) => this.handleChangeEvent(e, 'start')}>
                <input className="form-control" onFocus={(e) => {
                  e.target.type = 'datetime-local'

                }}
                  placeholder={this.state.clickedDate}
                />
                <small id="startHelp" className="form-text text-muted">Choose another start date for event.</small>
              </div>
              <br></br><br></br>

              <div className="form-group" onChange={(e) => this.handleChangeEvent(e, 'end')}>
                <input className="form-control" onFocus={(e) => {
                  e.target.type = 'datetime-local'

                }}
                  placeholder={this.state.clickedDate}
                />
                <small id="endHelp" className="form-text text-muted">Choose another end date for event.</small>
              </div>

              <br></br>
              <div className="form-check" onChange={(e) => this.handleChangeEvent(e, 'allDay')}>
                <input type="checkbox" className="form-check-input" id="exampleCheck1"></input>
                <small id="allDayHelp" className="form-text text-muted">Allday Event? If checked end date will be ignored</small>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {!this.isPostRequest && (
              <Button variant="danger" onClick={this.handleDeleteEvent} >
                Delete event
              </Button>)}

            <Button type="submit" variant="primary" onClick={() => {
              if (this.isPostRequest) {
                this.handlePostEvent();
              } else {
                this.handlePutEvent();
              }
            }}>
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