//importing router dom to navigate multipages
import {
  BrowserRouter as Router,
  Routes, // instead of "Switch"
  Route
} from "react-router-dom";

//importting custom loginform and calendarform
import {Login} from './Login';
import {MyFullcalendar} from './Fullcalendar';

// app function for index.js
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





