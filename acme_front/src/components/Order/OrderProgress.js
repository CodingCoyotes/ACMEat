import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {useAppContext} from "../../Context";
import {
    getCities,
    getMenu,
    getRestaurant,
    getUserInfo,
    modifyMenu,
    registerNewMenu, registerNewOrder,
    registerNewRestaurant
} from "../Database/DBacmeat";
import classNames from "classnames";
import '../css/Dash.css'
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


export default function RecapOrder() {
    console.log("Sono in MenuRegistration");
    const [user, setUser] = useState(null);
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();
    const {state} = useLocation();


    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();

        }
    }, [])


    return (
        <div className='container'>
            <div>
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashorder", { state: { param: {restaurantId}.restaurantId }})}}>
                    Indietro
                </button>
            </div>
            <form className="Auth-form-content card" onSubmit={handleSubmit}>
                <h3 className="Auth-form-title">Completa ordine</h3>
                <div className="form-group mt-3">
                    <h5>Menu selezionati</h5>
                    {orderList.map(item => (
                        <div className="card">
                            <div className="card-header">
                                <h6 className="card-title">{item.name}</h6>
                            </div>
                            <div className="card-body">
                                <label className="card-text">Prezzo:{item.cost}€    Quantità:{item.qty}</label>

                            </div>
                        </div>
                    ))}
                </div>

            </form>
        </div>
    )
}