import React, { useEffect, useState } from 'react';
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
import {useNavigate} from "react-router-dom";
import {currentUser } from './Login';
import axios from 'axios';
//axios.defaults.baseURL = '159.69.194.20:8080';


export function MyFullcalendar() {
  //initialize constants
  const navigate = useNavigate();
  const eventPath = 'http://localhost:8080/api/event/'
  const userId = currentUser.userId;
  const calendarRef = React.useRef()

  //initialize states
  const [event, setEvent] = useState([]);
  let [currentEventId, SetCurrentEventId] = useState()
  let [currentEventTitle, SetCurrentEventTitle] = useState('Arbeitszeit')
  let [currentEventStart, SetCurrentEventStart] = useState()
  let [currentEventEnd, SetCurrentEventEnd] = useState()
  let [currentEventAllDay, SetCurrentEventAllDay] = useState()
  let [isPostRequest, setIsPostRequest] = useState(true)
  const [modal, setModal] = useState(false);

//------------------------------------------------------------------------------
//------getEvent----------------------------------------------------------------
//------------------------------------------------------------------------------
  const getEvent = async () => {
      await axios.get(eventPath + userId).then(response => {
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

        setEvent(data);
      }

    }).catch((response) => {
      console.log(response)
    });
  };

//------------------------------------------------------------------------------
//------useEffect---------------------------------------------------------------
//------------------------------------------------------------------------------
  useEffect(() => {
    if (currentUser.userId === undefined) {
      navigate('login')
    }

    // initialize all user based events
         getEvent();
 
    // eslint-disable-next-line
  }, []);

//------------------------------------------------------------------------------
//------changeIsPostRequest-----------------------------------------------------
//------------------------------------------------------------------------------
  const changeIsPostRequest = (isPostReq) => {
    setIsPostRequest(isPostReq);
  };

  //------------------------------------------------------------------------------
//------changeIsPostRequest-----------------------------------------------------
//------------------------------------------------------------------------------
const releaseCurrentEventVars = () => {
  SetCurrentEventId(null);
  SetCurrentEventTitle('Arbeitszeit');
  SetCurrentEventStart(null);
  SetCurrentEventEnd(null);
  SetCurrentEventAllDay(null);
};
//------------------------------------------------------------------------------
//------toggle------------------------------------------------------------------
//--------pops up modal view----------------------------------------------------
  const toggle = () => {
    getEvent();
    //set back currentEvent variables if modal closes
    if (modal) {
      releaseCurrentEventVars();
    }
    setModal(!modal);

  };

//------------------------------------------------------------------------------
//------handleDateClick---------------------------------------------------------
//------Postrequest-------------------------------------------------------------
  const handleDateClick = arg => {
    console.log('imhandleDateclick')
    changeIsPostRequest(true);
    // Define start str which gets its value from click arg and format it with moment
    const startDateStr = moment(arg.date).format('YYYY-MM-DDTHH:mm');
    // release currentEvent in state @TODO

    SetCurrentEventStart(moment(startDateStr).format('YYYY-MM-DDTHH:mm'))
    toggle();
  }
  
//------------------------------------------------------------------------------
//------handleEventClick--------------------------------------------------------
//------------------------------------------------------------------------------
  // putRequest
  const handleEventClick = (clickInfo) => {
    console.log('imhandleEventclick')
    changeIsPostRequest(false);
 
    console.log(clickInfo.event.id)
    console.log(clickInfo.event.title)
    SetCurrentEventId(clickInfo.event.id)
    SetCurrentEventTitle(clickInfo.event.title)
    SetCurrentEventStart(moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm'))
    SetCurrentEventAllDay(clickInfo.event.allDay)
   // const currentEventObject = { id: clickInfo.event.id, title: clickInfo.event.title, allDay: clickInfo.event.allDay, start: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm'), end: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm') };
    if (clickInfo.event.end != null) {
      SetCurrentEventEnd(moment(clickInfo.event.end).format('YYYY-MM-DDTHH:mm'));
    }

    //setCurrentEvent(currentEventObject);
    toggle();
  }


//------------------------------------------------------------------------------
//------handleChangeEvent-------------------------------------------------------
//------------------------------------------------------------------------------
  const handleChangeEvent = (e, prop) => {
    console.log('im handle change')
    console.log(prop + ': ' + e.target.value)

    if (prop === "title") {
      console.log('drinnen')
      SetCurrentEventTitle(e.target.value)
    } else if (prop === "start") {
      SetCurrentEventStart(moment(e.target.value).format('YYYY-MM-DDTHH:mm'))
    } else if (prop === "end") {
      SetCurrentEventEnd(moment(e.target.value).format('YYYY-MM-DDTHH:mm'))
    } else if (prop === "allDay") {
      SetCurrentEventAllDay(true)
    } else {
      return;
    }
  }

//------------------------------------------------------------------------------
//------handlePostEvent---------------------------------------------------------
//------------------------------------------------------------------------------
  const handlePostEvent = () => {
    console.log('handlePostEvent')
    console.log(isPostRequest)
    console.log(currentEventId)
    console.log(currentEventTitle)
    console.log(currentEventStart)
    console.log(currentEventEnd)
    console.log(currentEventAllDay)
    // Post event data to backend endpoint
    axios.post(eventPath + userId, {
      eventType: currentEventTitle,
      start: currentEventStart,
      end: currentEventEnd,
      allDay: currentEventAllDay
    });

    toggle()
getEvent()
  }
//------------------------------------------------------------------------------
//------handlePutEvent----------------------------------------------------------
//------------------------------------------------------------------------------
  const handlePutEvent = () => {
    console.log('is a put')
    console.log(currentEventId)
    console.log(currentEventTitle)
    console.log(currentEventStart)
    console.log(currentEventEnd)
    console.log(currentEventAllDay)


    // Post event data to backend endpoint
    axios.put(eventPath, {
      eventId: currentEventId,
      eventType: currentEventTitle,
      start: currentEventStart,
      end: currentEventEnd,
      allDay: currentEventAllDay
    }).then((response) => {
      //handle success
      console.log(response);
      alert('Event successfully updated.')
      getEvent()
    })
      .catch((response) => {
        //handle error
        console.log(response)

        alert('Event could not be updated.')

      })
    toggle()
  }


//------------------------------------------------------------------------------
//------handleDeleteEvent-------------------------------------------------------
//------------------------------------------------------------------------------
  const handleDeleteEvent = () => {
    console.log('im handle delete event')
    console.log('currentEventId: '+currentEventId)
    let calendarApi = calendarRef.current.getApi()
    let event = calendarApi.getEventById(currentEventId)
    event.remove()
    
    axios.delete(eventPath + userId, { data: {eventId: currentEventId}  })
    toggle();
  }


//------------------------------------------------------------------------------
//------final output------------------------------------------------------------
//------------------------------------------------------------------------------
  return (
    <div className="App">

      <h1>SE Terminkalender von {currentUser.username}</h1>

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
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
      <Modal
        isOpen={modal}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>
          Edit Event: {currentEventTitle}
        </ModalHeader>
        <ModalBody>
          <div>
            <select onChange={(e) => handleChangeEvent(e, 'title')} defaultValue={currentEventTitle} className="form-select" aria-label="Default select example">
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
                placeholder={currentEventStart}
              />
              <small id="startHelp" className="form-text text-muted">Choose another start date for event.</small>
            </div>
            <br></br><br></br>

            <div className="form-group" onChange={(e) => handleChangeEvent(e, 'end')}>
              <input className="form-control" onFocus={(e) => {
                e.target.type = 'datetime-local'

              }}
                placeholder={currentEventStart}
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