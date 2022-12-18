import React, { useEffect, useState } from 'react';
//importing custom CSS
import './Fullcalendar.css';
//importing FullCalendar Module
import FullCalendar, { } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
//importing FullCalendar CSS
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
//importing modal view and bootstrap styles
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/js/bootstrap.min.js';
//importing moment for date conversions
import moment from 'moment';
//importing axios for backend api
import axios from 'axios';
//importing useNavigate to navigate from calendarpage to loginpage
import { useNavigate } from "react-router-dom";
//importing global variable from Login page
import { currentUser } from './Login';

// calendar function for app.js
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
      //getting and setting api data into variable
      //get events from database

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

    //initialize all user based events
    getEvent();

    //eslint-disable-next-line
  }, []);


  //------------------------------------------------------------------------------
  //------changeIsPostRequest-----------------------------------------------------
  //------------------------------------------------------------------------------
  const changeIsPostRequest = (isPostReq) => {
    setIsPostRequest(isPostReq);
  };

  //------------------------------------------------------------------------------
  //------logout------------------------------------------------------------------
  //------------------------------------------------------------------------------
  const logout = () => {
    navigate('login')
  };



  //------------------------------------------------------------------------------
  //------changeIsPostRequest-----------------------------------------------------
  //--------releases states of current event that is focused----------------------
  const releaseCurrentEventVars = () => {
    SetCurrentEventId(null);
    SetCurrentEventTitle('Arbeitszeit'); // Set default value "Arbeitszeit"
    SetCurrentEventStart(null);
    SetCurrentEventEnd(null);
    SetCurrentEventAllDay(false);
  };


  //------------------------------------------------------------------------------
  //------toggle------------------------------------------------------------------
  //--------pops up or closes modal view------------------------------------------
  const toggle = () => {
    //get refreshed events from backend
    getEvent();
    //set back currentEvent variables if modal closes
    if (modal) {
      releaseCurrentEventVars();
    }
    //revert modal variable to open or close modal view
    setModal(!modal);

  };


  //------------------------------------------------------------------------------
  //------handleDateClick---------------------------------------------------------
  //------for postrequest---------------------------------------------------------
  const handleDateClick = arg => {
    //set boolean to true to handle post request with axios
    changeIsPostRequest(true);

    //define start and end str which gets its value from click arg and format it with moment
    SetCurrentEventStart(moment(arg.date).format('YYYY-MM-DDTHH:mm'));
    SetCurrentEventEnd(moment(arg.date).format('YYYY-MM-DDTHH:mm'));

    toggle();
  }


  //------------------------------------------------------------------------------
  //------handleEventClick--------------------------------------------------------
  //--------for putrequest--------------------------------------------------------
  const handleEventClick = (clickInfo) => {
    //set boolean to false to handle put request with axios
    changeIsPostRequest(false);
    //set current event states with clickinfo parameters
    SetCurrentEventId(clickInfo.event.id);
    SetCurrentEventTitle(clickInfo.event.title);
    SetCurrentEventStart(moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm'));
    SetCurrentEventEnd(moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm'));
    SetCurrentEventAllDay(false)

    //prevents setting end variable to null or undefined in modal view
    if (clickInfo.event.end != null) {
      SetCurrentEventEnd(moment(clickInfo.event.end).format('YYYY-MM-DDTHH:mm'));
    }


    toggle();
  }


  //------------------------------------------------------------------------------
  //------handleChangeEvent-------------------------------------------------------
  //--------handles user inputs and changes in modal view-------------------------
  const handleChangeEvent = (e, prop) => {

    if (prop === "title") {
      SetCurrentEventTitle(e.target.value);
    } else if (prop === "start") {
      SetCurrentEventStart(moment(e.target.value).format('YYYY-MM-DDTHH:mm'));
    } else if (prop === "end") {
      SetCurrentEventEnd(moment(e.target.value).format('YYYY-MM-DDTHH:mm'));
    } else if (prop === "allDay") {
      SetCurrentEventAllDay(true);
    } else {
      return;
    }
  }


  //------------------------------------------------------------------------------
  //------handlePostEvent---------------------------------------------------------
  //------------------------------------------------------------------------------
  const handlePostEvent = () => {
    //post event data to backend endpoint
    axios.post(eventPath + userId, {
      eventType: currentEventTitle,
      start: currentEventStart,
      end: currentEventEnd,
      allDay: currentEventAllDay
    }).then((response) => {
      //handle success
      console.log(response);
      getEvent();
    })
      .catch((response) => {
        //handle error/exception
        console.log(response);
        alert('Event could not be created.');
      })

    toggle();
    getEvent();
  }


  //------------------------------------------------------------------------------
  //------handlePutEvent----------------------------------------------------------
  //------------------------------------------------------------------------------
  const handlePutEvent = () => {
    //post event data via put method to backend endpoint
    axios.put(eventPath, {
      eventId: currentEventId,
      eventType: currentEventTitle,
      start: currentEventStart,
      end: currentEventEnd,
      allDay: currentEventAllDay
    }).then((response) => {
      //handle success
      console.log(response);
      getEvent();
    })
      .catch((response) => {
        //handle error/exception
        console.log(response);
        alert('Event could not be updated.');
      })
    toggle();
  }


  //------------------------------------------------------------------------------
  //------handleDeleteEvent-------------------------------------------------------
  //--------deletes an event in gui and posts delete method in backend------------
  const handleDeleteEvent = () => {
    let calendarApi = calendarRef.current.getApi()
    let event = calendarApi.getEventById(currentEventId)
    //deletes event immediately in GUI
    event.remove();
    //send delete request in backend
    axios.delete(eventPath + userId, { 
      data: { eventId: currentEventId } 
    }).then((response) => {
      //handle success
      console.log(response);
      getEvent();
    })
      .catch((response) => {
        //handle error/exception
        console.log(response);
        alert('Event could not be deleted.');
      })
    toggle();
  }


  //------------------------------------------------------------------------------
  //------final output calendar form----------------------------------------------
  //--------homepage--------------------------------------------------------------
  return (
    <div className="App">
      <h1>SE Terminkalender von {currentUser.username} </h1>
      <div className="flex-box-2">
        <button type="button" className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
      <p></p>
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
                placeholder={currentEventEnd}
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