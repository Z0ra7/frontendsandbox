import React, { useEffect, useState} from 'react';
import './App.css';
//Importing FullCalendar Module
import {Login} from './Login';
import Popup from './event_utils';
import { checkToken } from './login_utils';
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
import axios from 'axios';
function Calendar(){
    const eventPath = 'http://localhost:8080/api/event'
   const calendarRef = React.useRef()
  //initialize array variable
   let isPostRequest = false; // stands for is POSTREQUEST for modal
   let changedTitle = null;
   let changedStart = null;
   let changedEnd = null;
   let changedallDay = null;
  //constructor() {
    //super is used to access the variables
    //super();
    //this.state = {
      
      //token:false,
      //event: [], 
      const[event,setEvent]=useState([]);
      //currentEvent: {},
      const[currentEvent,setCurrentEvent]=useState({});
      //user: [],
      const[user,setUser]=useState([]);
      //modal: false,
      const[modal,setModal]=useState(false);
      //eventType: [],
      const[eventType,setEventType]=useState([]);
      //isPOST: false,
      const[isPost,setIsPost]=useState(false);
      //clickedDate: '',
      const[clickedDate,setClickedDate]=useState('');
      //onChangeEventTitle: 'Arbeitszeit', //Default "Arbeitszeit"
      const[onChangeEventTitle,setOnChangeEventTitle]=useState('Arbetszeit');
      //onChangeEventStart: null,
      const[onChangeEventStart,setOnChangeEventStart]=useState(null);
      //onChangeEventEnd: null,
      const[onChangeEventEnd,setOnChangeEventEnd]=useState(null);
      //onChangeEventallDay: false,
      const[onChangeEventallDay,setOnChangeEventallDay]=useState(false);
    
      
    //this.handleChange = this.handleChange.bind(this)
  
  const getEvent = async()=> {
    await axios.get(eventPath).then(response => {
  // getting and setting api data into variable
  // get events from database
  console.log(response.data)

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

    var eventTypes = ['Arbeitszeit', 'Ferien', 'Militär', 'Krankheit', 'Anderes'];
    //this.setState({ event: data, eventType: eventTypes }); //,user: variable für userstate
    setEvent(data);
    setEventType(eventTypes);
  }
      
                              } );
};
useEffect(() => {
  getEvent();
}, []);

  

  const handleChangeEvent = (e, prop) => {
    console.log('im handle change')
    console.log(prop + ': ' + e.target.value)

    if (prop === "title") {
     changedTitle = e.target.value //richtig im put
      setOnChangeEventTitle(e.target.value)//richtig im post
    } else if (prop === "start") {
      changedStart = e.target.value
      setOnChangeEventStart(e.target.value)
    } else if (prop === "end") {
      changedEnd = e.target.value
      setOnChangeEventEnd(e.target.value)
    } else if (prop === "allDay") {
      changedallDay = e.target.value
      setOnChangeEventallDay(!this.state.onChangeEventallDay)
    } else {
      return;
    }
  }

  const toggle = () => {
    //set back allDay boolean and modal state
    if (onChangeEventallDay) {
      setOnChangeEventallDay(!this.state.onChangeEventallDay)
    }
    //this.setState({ modal: !this.state.modal, onChangeEventStart: null });
    setModal(!modal);
    setOnChangeEventStart(null)
  };


  const handleDeleteEvent = () => {
    let calendarApi = calendarRef.current.getApi()
    let event = calendarApi.getEventById(currentEvent.id)
    event.remove()
    toggle();
    axios.delete(eventPath, { params: { Id: currentEvent.id } })
  }

 const handlePutEvent = () => {
    console.log('is a put')
console.log(changedStart)
console.log(currentEvent.start)

    // Post event data to backend endpoint
    axios.put(eventPath, {
      eventId: currentEvent.id,
      eventType: changedTitle,
      start: currentEvent.start,
      end: currentEvent.end,
      allDay: currentEvent.allDay
    }).then((response) => {
      //handle success
      let calendarApi = calendarRef.current.getApi()
      let event = calendarApi.getEventById(currentEvent.id)
      //delete event immediately in daygrid view
      event.remove()
      //show event immediately in daygrid view
      calendarApi.addEvent({
        title: changedTitle,
        start: currentEvent.start,
        end: onChangeEventEnd,
        allDay: onChangeEventallDay
      })
      console.log(response);
      alert('Event successfully updated.')
    })
      .catch((response) => {
        //handle error
        console.log(response)

        alert('Event could not be updated.')

      })
    toggle()
  }


  const handlePostEvent = () => {
    console.log('handlePostEvent')

    let EventChangeStart = onChangeEventStart;
    if (onChangeEventStart === null) {
      EventChangeStart = clickedDate;
    }

    let calendarApi = calendarRef.current.getApi()
    //show event immediately in daygrid view
    calendarApi.addEvent({
      title: onChangeEventTitle,
      start: EventChangeStart,
      end: onChangeEventEnd,
      allDay: onChangeEventallDay
    })

    // Post event data to backend endpoint
    axios.post(eventPath, {
      eventType: onChangeEventTitle,
      start: EventChangeStart,
      end: onChangeEventEnd,
      allDay: onChangeEventallDay
    });
    //close modal
    toggle()
    //reset isPost boolean
    //this.setState({ isPOST: false })
    setIsPost(false);
  }



  // Add events on Click
  //PostRequest
 const  handleDateClick = arg => {
    isPostRequest = true;
    // Define start str which gets its value from click arg and format it with moment
    const startDateStr = moment(arg.date).format('YYYY-MM-DDTHH:mm');
    // release currentEvent in state
    //this.setState({ currentEvent: '', isPOST: true, clickedDate: startDateStr });
    setCurrentEvent('');
    setIsPost(true);
    setClickedDate(startDateStr);



    // popup modal view
    toggle();
  }

  // putRequest
 const  handleEventClick = (clickInfo) => {
    const currentEventObject = { id: clickInfo.event.id, title: clickInfo.event.title, allDay: clickInfo.event.allDay, start: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm'), end: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm') };
    if (clickInfo.event.end != null) {
      currentEventObject.end = moment(clickInfo.event.end).format('YYYY-MM-DDTHH:mm');
    }

    //setEvent([currentEvent: currentEventObject, clickedDate: currentEventObject.start, isPost: true ]);
setCurrentEvent(currentEventObject);
setClickedDate(currentEventObject.start);
setIsPost(true);
    toggle(); //macht pop auf
  }




  const handleDateSelect = (selectInfo) => {
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
 const  resetParams = () => {
    isPostRequest = false; //set back to default
  };


  //Final output
    return (
      <div className="App">

        <h1>SSE Terminkalender</h1>

        <FullCalendar
          ref={calendarRef}
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
          events={event}
          //eventsSet={handleEvents}
          select={handleDateSelect}
          //eventContent={renderEventContent}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
        <Modal
          isOpen={modal}
          toggle={toggle}
          onClosed={resetParams}
        >
          <ModalHeader toggle={toggle}>
            Edit Event: {currentEvent.title}
          </ModalHeader>
          <ModalBody>
            <div>
              <select onChange={(e) => handleChangeEvent(e, 'title')} defaultValue={currentEvent.title} className="form-select" aria-label="Default select example">
                <option value="Arbeitszeit">Arbeitszeit</option>
                <option value="Ferien">Ferien</option>
                <option value="Militär">Militär</option>
                <option value="Krankheit">Krankheit</option>
                <option value="Anderes">Anderes</option>
              </select>
              <br></br>
              <br></br>
              <div className="form-group" onChange={(e) => handleChangeEvent(e, 'start')}>
                <input className="form-control" onFocus={(e) => {
                  e.target.type = 'datetime-local'

                }}
                  placeholder={clickedDate}
                />
                <small id="startHelp" className="form-text text-muted">Choose another start date for event.</small>
              </div>
              <br></br><br></br>

              <div className="form-group" onChange={(e) => handleChangeEvent(e, 'end')}>
                <input className="form-control" onFocus={(e) => {
                  e.target.type = 'datetime-local'

                }}
                  placeholder={clickedDate}
                />
                <small id="endHelp" className="form-text text-muted">Choose another end date for event.</small>
              </div>

              <br></br>
              <div className="form-check" onChange={(e) => handleChangeEvent(e, 'allDay')}>
                <input type="checkbox" className="form-check-input" id="exampleCheck1"></input>
                <small id="allDayHelp" className="form-text text-muted">Allday Event? If checked end date will be ignored</small>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {!isPostRequest && (
              <Button variant="danger" onClick={handleDeleteEvent} >
                Delete event
              </Button>)}

            <Button type="submit" variant="primary" onClick={() => {
              if (isPostRequest) {
                handlePostEvent();
              } else {
                handlePutEvent();
              }
            }}>
              Save changes
            </Button>
            <Button variant="light" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
        }