import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {useAppContext} from "../../Context";
import {
    getCities,
    getMenu,
    getRestaurant,
    getUserInfo,
    modifyMenu,
    registerNewMenu,
    registerNewRestaurant
} from "../Database/DBacmeat";
import classNames from "classnames";
import '../css/Dash.css'


export default function RecapOrder() {
    console.log("Sono in MenuRegistration");
    const [user, setUser] = useState(null);
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();
    const [indirizzo, setIndirizzo] = useState();
    const [numCivico, setNumCivico] = useState();
    const [city, setCity] = useState();
    const [cityList, setCityList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const {state} = useLocation();
    const {param} = state; // Read values passed on state

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            getCity();
            setOrderList(param);
        }
    }, [])

    async function getCity(){
        let resp = await getCities();
        if (resp.status === 200) {
            let values = await resp.json();
            setCityList(values);
        }
    }

    async function getInfo() {
        console.debug(token)
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        console.log("sono in handlersub")

    }

    return (
        <div className='container'>
            <div>
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashorder")}}>
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
                <div className="form-group mt-3">
                        <h5>Indirizzo di consegna</h5>
                        <input
                            type="text"
                            className="form-control mt-1"
                            value={indirizzo}
                            placeholder="Piazza Roma"
                            onChange={e => setIndirizzo(e.target.value)}
                        />
                        <input
                            type="number"
                            className="form-control mt-1"
                            value={numCivico}
                            placeholder="6"
                            onChange={e => setNumCivico(e.target.value)}
                        />
                        <select className="form-select" aria-label="Default select example" onChange={e => setCity(e.target.value)}>
                            {cityList.map((e, key) => {
                                return <option key={key} value={e.id}>{e.name}</option>;
                            })}
                        </select>
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">
                        Ordina ora!
                    </button>
                </div>
            </form>
        </div>
    )
}