import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { removeToken } from '../Login/Token';
import App from '../App/App';
import Login from '../Login/Login';

export default function Dashboard() {
  console.log("Sono in Dashboard");

  const handleLogout = async e => {
    e.preventDefault();
    console.log("handleLogout");
    removeToken();
    return (
      <Login />
      // <BrowserRouter>
      //   <Routes>
      //     <Route path="./App/App" element={<App />}></Route>
      //   </Routes>
      // </BrowserRouter>
    );
  }

  return(
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <h2>Dashboard</h2>
      <button type='button' className='btn btn-secondary' onClick={handleLogout}>Logout</button>
    </nav>
  );
}