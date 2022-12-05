import './App.css';

import {
  BrowserRouter as Router,
  Routes, // instead of "Switch"
  Route
} from "react-router-dom";

//import custom loginform and calendarform
import {Login} from './Login';
import {MyFullcalendar} from './Fullcalendar';


export default function App() {
  return (

    <Router>

      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="fullcalendar" element={<MyFullcalendar />} />
      </Routes>

    </Router>

  );
}





