import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getRestaurant, getRestaurants, getUserInfo} from "../Database/DBacmeat";
import '../css/Dash.css'

function DateToString(date){
    let d = Date.parse(date)
    console.log(d);

    return date
}


export default function CronologiaOrdine(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [ordersList, setOrdersList]  = useState([]);
    const {state} = useLocation();

    useEffect(() => {
        console.log("dashOrder")
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            getOrders();
        }
    }, [])

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    function getOrders(){
        if(state !== null){
            let {param} = state;
            setOrdersList(param);
            console.log("orderlist")
            console.log(param);
        }
    }

    return(
        <div className='container'>
            <div >
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashutente")}}>
                    Indietro
                </button>
            </div>
                <div>

                    <div className="fixed-nav">
                        <h3>Hai effettutato {ordersList.length} ordini</h3>
                    </div>

                    <div className="list-grid">
                        {ordersList.map(item => (
                            <div className="card">
                                <div className="card-header">
                                    <div>{(DateToString(item.date_order))}</div>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title"></h5>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    )
}