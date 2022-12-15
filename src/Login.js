import React from "react";
//importing CSS
import './Login.css';
//importing useNavigate to navigate from login page to calendar page
import { useNavigate } from 'react-router-dom';
//importing axios for backend api
import axios from 'axios';

//define global variable
export let currentUser = {};

//define url path
const session_url = 'http://localhost:8080/login';

//login function for app.js
export function Login(props) {
  const navigate = useNavigate();
  let uname;
  let password;

  //------------------------------------------------------------------------------
  //------handleSubmit------------------------------------------------------------
  //------------------------------------------------------------------------------
  const handleSubmit = event => {
    event.preventDefault();

    //check if username and password exist
    axios.post(session_url, {
      username: uname,
      password: password
    }).then((response) => {

      //checks if backend found a user
      if (response.data) {
        //save userdata for session
        currentUser = response.data;
        //redirect to /fullcalendar
        navigate('fullcalendar');
      } else {
        alert('Wrong username or password.')
      }
    });
  }


  //------------------------------------------------------------------------------
  //------handleOnBlur------------------------------------------------------------
  //------------------------------------------------------------------------------
  const handleOnBlur = (e, prop) => {
    //saves user input in login form
    if (prop === "uname") {
      uname = e.target.value;
    } else if (prop === "password") {
      password = e.target.value;
    } else {
      return;
    }
  }


  //------------------------------------------------------------------------------
  //------final output login form-------------------------------------------------
  //--------index page------------------------------------------------------------
  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <img src={require('./FFHS_Logo.png')} alt="FFHS Logo" />
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              onBlur={(e) => handleOnBlur(e, 'uname')}
              type="email"
              className="form-control mt-1"
              placeholder="Enter username"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              onChange={(e) => handleOnBlur(e, 'password')}
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" onClick={handleSubmit} className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
export default currentUser;