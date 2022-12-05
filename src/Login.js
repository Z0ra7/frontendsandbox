import React from "react"
import './Login.css';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';
const session_url = 'http://localhost:8080/login';
export let currentUser={};
export function Login(props) {
  const navigate = useNavigate();

  let uname;
  let password;

  const handleSubmit = event => {
    event.preventDefault();

    //check if username and password exist
    axios.post(session_url, {
      username: uname,
      password: password
    }).then((response) => {

      //checks if backend found a user
      if (response.data) {
        // save userdata for session
        currentUser = response.data;
        // redirect to /fullcalendar
        navigate('fullcalendar');
      } else {
        alert('Wrong username or password.')
      }
    });
  }

  const handleOnBlur = (e, prop) => {
    if (prop === "uname") {
      uname = e.target.value;
    } else if (prop === "password") {
      password = e.target.value;
    } else {
      return;
    }
  }


  return (
    <div className="Auth-form-container">

      <form className="Auth-form">
        <div className="Auth-form-content">
          <img src={require('./FFHS_Logo.png')} alt="FFHS Logo"/>
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