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
  const navigate = useNavigate();
  const eventPath = 'http://localhost:8080/api/event/'
  const userId = currentUser.userId;
  const calendarRef = React.useRef()

  //initialize array variable
  let changedTitle = null;
  let changedStart = null;
  let changedEnd = null;
  let changedallDay = null;
  //states
  const [event, setEvent] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({});
  let [isPostRequest, setIsPostRequest] = useState(true)
  const [modal, setModal] = useState(false);
  const [clickedDate, setClickedDate] = useState('');

  //@todo delete
  //const [onChangeEventTitle, setOnChangeEventTitle] = useState('Arbeitszeit');

  //const [onChangeEventStart, setOnChangeEventStart] = useState(null);
  //const [onChangeEventEnd, setOnChangeEventEnd] = useState(null);
  //const [onChangeEventallDay, setOnChangeEventallDay] = useState(false);

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
   
    getEvent();
    // eslint-disable-next-line
  }, [isPostRequest]);

//------------------------------------------------------------------------------
//------changeIsPostRequest-----------------------------------------------------
//------------------------------------------------------------------------------
  const changeIsPostRequest = (isPostReq) => {
    setIsPostRequest(isPostReq);
  };

//------------------------------------------------------------------------------
//------handleChangeEvent-------------------------------------------------------
//------------------------------------------------------------------------------
  const handleChangeEvent = (e, prop) => {
    console.log('im handle change')
    console.log(prop + ': ' + e.target.value)

    if (prop === "title") {
      changedTitle = e.target.value //richtig im put
      //setOnChangeEventTitle(e.target.value)//richtig im post
    } else if (prop === "start") {
      changedStart = e.target.value
      //setOnChangeEventStart(e.target.value)
    } else if (prop === "end") {
      changedEnd = e.target.value
     // setOnChangeEventEnd(e.target.value)
    } else if (prop === "allDay") {
      changedallDay = e.target.value
     // setOnChangeEventallDay(!this.state.onChangeEventallDay)
    } else {
      return;
    }
  }

//------------------------------------------------------------------------------
//------toggle------------------------------------------------------------------
//--------pops up modal view----------------------------------------------------
  const toggle = () => {
    //set back allDay boolean and modal state
    if (changedallDay) {
      changedallDay=!changedallDay;
      //setOnChangeEventallDay(!this.state.onChangeEventallDay)
    }
    setModal(!modal);
    changedStart=null;
    //setOnChangeEventStart(null)
  };

//------------------------------------------------------------------------------
//------handleDeleteEvent-------------------------------------------------------
//------------------------------------------------------------------------------
  const handleDeleteEvent = () => {
    let calendarApi = calendarRef.current.getApi()
    let event = calendarApi.getEventById(currentEvent.id)
    console.log(currentEvent.id)
    event.remove()
    toggle();

    axios.delete(eventPath + userId, { data: {eventId: currentEvent.id}  })

  }

//------------------------------------------------------------------------------
//------handlePutEvent----------------------------------------------------------
//------------------------------------------------------------------------------
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
        end: changedEnd,
        allDay: changedallDay
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

//------------------------------------------------------------------------------
//------handlePostEvent---------------------------------------------------------
//------------------------------------------------------------------------------
  const handlePostEvent = () => {
    console.log('handlePostEvent')
    console.log(isPostRequest)

    //let EventChangeStart = onChangeEventStart;
    //let EventChangeStart = onChangeEventStart;
    if (changedStart === null) {
      changedStart = clickedDate;
    }

    let calendarApi = calendarRef.current.getApi()
    //show event immediately in daygrid view
    calendarApi.addEvent({
      title: changedTitle,
      start: changedStart ,
      end: changedEnd,
      allDay: changedallDay
    })
    // Post event data to backend endpoint
    axios.post(eventPath + userId, {
      eventType: changedTitle,
      start: changedStart,
      end: changedEnd,
      allDay: changedallDay
    });

    toggle()

  }

//------------------------------------------------------------------------------
//------handleDateClick---------------------------------------------------------
//------Postrequest-------------------------------------------------------------
  const handleDateClick = arg => {
    console.log('imhandleDateclick')
    console.log(isPostRequest)
    changeIsPostRequest(true);
    console.log(isPostRequest)
    // Define start str which gets its value from click arg and format it with moment
    const startDateStr = moment(arg.date).format('YYYY-MM-DDTHH:mm');
    // release currentEvent in state
    setCurrentEvent('');
    setClickedDate(startDateStr);
    toggle();
  }
//------------------------------------------------------------------------------
//------handleEventClick--------------------------------------------------------
//------------------------------------------------------------------------------
 
  // putRequest
  const handleEventClick = (clickInfo) => {
    console.log('imhandleEventclick')
    console.log(isPostRequest)
    changeIsPostRequest(false);
    console.log(isPostRequest)
    const currentEventObject = { id: clickInfo.event.id, title: clickInfo.event.title, allDay: clickInfo.event.allDay, start: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm'), end: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm') };
    if (clickInfo.event.end != null) {
      currentEventObject.end = moment(clickInfo.event.end).format('YYYY-MM-DDTHH:mm');
    }

    setCurrentEvent(currentEventObject);
    setClickedDate(currentEventObject.start);
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