import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import { getUserInfo } from '../Database/DBacmeat';
import DashRistorante from './DashRistorante';
import DashUtente from './DashUtente';

export default function Dashboard() {
    console.log("Sono in Dashboard");
    const {token, setToken} = useAppContext();
    const [tab, setTab] = useState("personale");
    const navigate = useNavigate()

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        document.getElementById(tab).classList.add('active');
    }, [])


    const handleLogout = async e => {
        e.preventDefault();
        setToken(null)
        navigate("/")
    }

    const handleDashTab = e =>{
        e.preventDefault();
        setTab(e.target.id);
      
        // for (var i = 0; i < document.getElementById("tab").length; ++i) {
        //     var items = i.getElementsByTagName("li");
        //     items.classList.remove('active');
        // }
        // document.getElementById(tab).classList.add('active');
        
    }

    return (
        <div>
            <nav className='navbar navbar-expand-lg navbar-light bg-light justify-content-between'>
                <h2>ACMEat</h2>
                <button type='button' className='btn btn-secondary' onClick={handleLogout}>Logout</button>
            </nav>
            <ul className="nav nav-tabs nav-fill" id='tab'>
                <li className="nav-item">
                    <a className="nav-link " aria-current="page" id='personale' onClick={handleDashTab}>Profilo personale</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" aria-current="page" id='ristorante' onClick={handleDashTab}>Ristorante</a>
                </li>
            </ul>
            {(tab === "personale") ? (
                <DashUtente></DashUtente>
            ) : (<DashRistorante></DashRistorante>)}
           
        </div>
    );
}