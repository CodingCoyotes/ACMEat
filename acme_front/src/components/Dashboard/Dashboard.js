import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";

export default function Dashboard() {
  console.log("Sono in Dashboard");
  const {token, setToken} = useAppContext();
  const navigate = useNavigate()

  useEffect(() => {
    if(token===null){
      navigate("/")
    }
  }, [])

  const handleLogout = async e => {
    e.preventDefault();
    console.log("handleLogout");
    setToken(null)
    navigate("/")
  }

  return(
    <nav className='navbar navbar-expand-lg navbar-light bg-light justify-content-between'>
      <h2>ACMEat</h2>
      <button type='button' className='btn btn-secondary' onClick={handleLogout}>Logout</button>
    </nav>
  );
}