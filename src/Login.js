import React from "react"
import './Login.css';
import {Link, Routes, Route, useNavigate} from 'react-router-dom';
import axios from 'axios';
const session_url = 'http://localhost:8080/api/event';
export function Login (props) {
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();

    console.log('im navigate')
    handleAuthenticate();
    // 👇️ redirect to /fullcalendar
    navigate('fullcalendar');
  };


  const handleAuthenticate = async() => {
    console.log('im handleauthe')
    let uname = 'steven';
    let pass = '$2a$12$Q5bLex45Up0WL0b2UxliIO1CvktWGcFeuQE8ZjnwjNdz6lFzxT4IK';
    await axios.post(session_url, {}, {
      auth: {
        username: uname,
        password: pass
      }
    });


console.log('im navigate')
    // 👇️ redirect to /fullcalendar
    navigate('fullcalendar');
  }


  return (
    <div className="Auth-form-container">
      
      <form className="Auth-form">
        <div className="Auth-form-content">
        <img src={require('./FFHS_Logo.png')}/>
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
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
          <p className="forgot-password text-right mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  )
}