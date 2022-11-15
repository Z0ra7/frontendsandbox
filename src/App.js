import React, {} from 'react';
import './App.css';
//Importing FullCalendar Module
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

class App extends React.Component {
  calendarRef = React.createRef()
  //initialize array variable
  isPostRequest = false; // stands for is POSTREQUEST for modal
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
      onChangeEventTitle:'',
      onChangeEventStart:'',
      onChangeEventEnd:'',
      onChangeEventallDay:false,
    };
    //this.handleChange = this.handleChange.bind(this)
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

        var eventTypes = ['Arbeitszeit', 'Ferien', 'Militär', 'Krankheit', 'Anderes'];
        this.setState({ event: data, eventType: eventTypes }); //,user: variable für userstate
      }


    })
  }
  //componentDidUpdate(prevProps, prevState) { 
    // check whether client has changed 
    //if (prevProps.event !== this.props.event) { 
     // this.fetchData(this.props.client); 
    //} 
  //} 
  handleChangeTitel = (e, prop) => {
    if (prop === "title") {
      this.setState({ onChangeEventTitle: e.target.value })
    } else if (prop === "start") {
      this.setState({ onChangeEventStart: e.target.value })
    } else if (prop === "end") {
      this.setState({ onChangeEventEnd: e.target.value })
    } else if (prop === "allDay") {
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
    this.setState({ modal: !this.state.modal });
  };


  handleDeleteEvent = () => {
    let calendarApi = this.calendarRef.current.getApi()
    let event = calendarApi.getEventById(this.state.currentEvent.id)
    event.remove()
  

    this.toggle();

    axios.delete('http://localhost:8080/api/event', { params: { Id: this.state.currentEvent.id } })

  }

  handlePutEvent = () => {
    console.log('is a put')
    console.log(this.state.currentEvent)
    //let calendarApi = this.calendarRef.current.getApi()
    //let event = calendarApi.getEventById(this.state.currentEvent.id)
    //console.log(event.id)
    //event.remove()

    //this.toggle();

    //this.state.currentEvent.remove()

    // Post event data to backend endpoint
    axios.put('http://localhost:8080/api/event', {
    eventType: this.state.currentEvent.title,  
    start: this.state.currentEvent.start ,
    end: this.state.currentEvent.end,
    allDay: this.state.currentEvent.allDay
    }).then((response) => {
      console.log(response)
    })

  }


  handlePostEvent = () => {
    console.log('handlePostEvent')



    // Post event data to backend endpoint
   axios.post('http://localhost:8080/api/event', {
    eventType: this.state.onChangeEventTitle,
    start: this.state.onChangeEventStart,
    end:this.state.onChangeEventEnd,
    allDay: this.state.onChangeEventallDay
    });
    window.location.reload();
this.toggle();
    //reset isPost boolean
    this.setState({ isPOST: false })
  }



  // Add events on Click
  //PostRequest
  handleDateClick = arg => {
    this.isPostRequest = true;
    console.log(this.isPostRequest)
    // Define start str which gets its value from click arg and format it with moment
    const startDateStr = moment(arg.date).format('YYYY-MM-DDTHH:mm');
    // release currentEvent in state
    this.setState({ currentEvent: '', isPOST: true, clickedDate: startDateStr });



    // popup modal view
    this.toggle();
  }

  // putRequest
  handleEventClick = (clickInfo) => {
    console.log(this.isPostRequest)
    const currentEventObject = { id: clickInfo.event.id, title: clickInfo.event.title, allDay: clickInfo.event.allDay, start: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm'),end: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm') };
    if (clickInfo.event.end != null) {
      currentEventObject.end = moment(clickInfo.event.end).format('YYYY-MM-DDTHH:mm');
    }

    this.setState({ currentEvent: currentEventObject, clickedDate: currentEventObject.start, isPost: true })
    console.log(this.state.currentEvent.title)
    console.log(this.state.isPOST)
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
    console.log('module wurde geschlossen')
    console.log(this.state.onChangeEventTitle)
    this.isPostRequest = false; //set back to default
   // window.location.reload();
    console.log(this.isPostRequest)
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
              <select onChange={(e) => this.handleChangeTitel(e,'title')} defaultValue={this.state.currentEvent.title} class="form-select" aria-label="Default select example">
                <option value="Arbeitszeit">Arbeitszeit</option>
                <option value="Ferien">Ferien</option>
                <option value="Militär">Militär</option>
                <option value="Krankheit">Krankheit</option>
                <option value="Anderes">Anderes</option>
              </select>
              <br></br>
              <br></br>
              <div class="form-group" onChange={(e) => this.handleChangeTitel(e,'start')}>
                <input class="form-control" onFocus={(e) => {
                  e.target.type = 'datetime-local'
                  console.log('focused')
                }}
                  placeholder={this.state.clickedDate}
                />
                <small id="startHelp" class="form-text text-muted">Choose another start date for event.</small>
              </div>
              <br></br><br></br>

              <div class="form-group" onChange={(e) => this.handleChangeTitel(e,'end')}>
                <input class="form-control" onFocus={(e) => {
                  e.target.type = 'datetime-local'
                  console.log('focused')
                }}
                  placeholder={this.state.clickedDate}
                />
                <small id="endHelp" class="form-text text-muted">Choose another end date for event.</small>
              </div>

              <br></br>
              <div class="form-check" onChange={(e) => this.handleChangeTitel(e,'allDay')}>
                <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
                <small id="allDayHelp" class="form-text text-muted">Allday Event? If checked end date will be ignored</small>
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
            <Button variant="light" onClick={this.handleChangeTitel}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );

  }

}


export default App;