import React from 'react';
import {useNavigate} from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate()

  return(
      <div>
        <nav className='navbar navbar-expand-lg navbar-light bg-light justify-content-between'>
          <h2>ACMEat</h2>
          <button type='button' className='btn btn-secondary' onClick={event => {navigate("/login")}}>Login</button>
        </nav>
        <h1>Acmeat Landing Page</h1>
      </div>
  );
}