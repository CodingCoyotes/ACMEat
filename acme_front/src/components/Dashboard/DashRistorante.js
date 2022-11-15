import React from 'react';
import {useNavigate} from "react-router-dom";



export default function DashRistorante(){
    const navigate = useNavigate()

    return(
        <div className='container'>
        <h2>Sembra che tu non abbia un ristorante.</h2>
        <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/restaurantregistration")}}>
            Crea un ristorante
        </button>
    </div>
    );
}