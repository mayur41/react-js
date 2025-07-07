import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './containers/Home';
import Singup from "./containers/Signup";
import { socket } from './socket';
import { useEffect, useState } from 'react';

function App() {
  let userLogin = localStorage.getItem("token");

  return (
    <Router>
      <div className="App">
        {userLogin ?
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />}></Route>
          </Routes>
          :
          <Routes>
            <Route exact path="/" element={<Singup />} />
            <Route path="*" element={<Singup />}></Route>
          </Routes>
        }
      </div>
    </Router>
  )
}

export default App
