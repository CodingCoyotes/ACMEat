import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getOrder, getUserInfo} from "../Database/DBacmeat";
import './OrderProgress'
import '../css/Dash.css'
import OrderProgress from "./OrderProgress";
import ReactLoading from "react-loading";

const address = "http://127.0.0.1:3001/pay/5ba5f372-78af-4e1f-ad8d-9bfd82020d24/"
export default function ProcessingOrder() {
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [processState, setProcessState] = useState(0);
    const [order, setOrder] = useState(null);
    const {state} = useLocation();
    let {param} = state;

    useEffect(() => {
        console.log("processingorder")
        if (token === null) {
            navigate("/")
        } else if (user === null) {
            getInfo();
            getOrd();
            const interval = setInterval(() => pooling(), 5000)
            return () => {
                clearInterval(interval)
            }
        }
    }, [])

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    async function getOrd() {
        console.log("get ord")
        let response = await getOrder(param, token);
        if (response.status === 200) {
            let values = await response.json();
            console.log("value status")
            console.log(values.status);
            setProcessState(values.status);
            setOrder(values);
            return values.status;
        }
        return "0";
    }

    async function pooling() {
        console.log("pooling")
        status = await getOrd()
        if (status === "3") {
            let reindirizza = address + {param}.restaurant_total + {param}.deliverer_total + "/http:127.0.0.1:3000/landingorder/" + {param}.id
            window.location.href = reindirizza;
        }
        return;
    }


    return (
        <div className='container'>
            <div className="card">
                <h3 className="Auth-form-title">Informazioni sul tuo ordine</h3>
                <div className="form-group mt-3">
                    <OrderProgress orderStatus={processState}></OrderProgress>
                    <ReactLoading className="loading" type="spokes" color="#0000FF"
                                  height={100} width={50}/>
                </div>
            </div>
        </div>
    )
}