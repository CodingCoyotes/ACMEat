import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getOrder, getRestaurant, getRestaurants, getUserInfo, modifyOrder} from "../Database/DBacmeat";
import '../css/Dash.css'
import OrderCard from "./OrderCard";
import {DateToString} from "../Utils/Utils";

const address = process.env.REACT_APP_BANK_ADDRESS
const app_base_address = process.env.REACT_APP_FRONTEND_ADDRESS

function getSteps() {
    return [
        'Ordine inviato',
        'Conferma ristorante',
        'Conferma fattorino',
        'Conferma da terzi',
        'Ordine cancellato',
        'Pagamento confermato',
        'Pagamento effettutato', //6
        'Preparazione ordine in atto',
        'Il tuo ordine è stato spedito',
        'In consegna',
        'Consegnato'];
}

export default function CronologiaOrdine() {
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [ordersList, setOrdersList] = useState([]);
    const steps = getSteps();
    const {state} = useLocation();

    useEffect(() => {
        console.log("dashOrder")
        if (token === null) {
            navigate("/")
        } else if (user === null) {
            getInfo();
        }
    }, [])

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
            console.log("userorder")
            console.log(values.orders)
            setOrdersList((values.orders).reverse());
        }
    }

    async function handleCancel(order) {
        //e.preventDefault();
        console.log("sono in handle cancel")
        console.log(order);
        let info = {
            "status": 4
        }
        let response = await modifyOrder(token, info, order.id);
        if (response.status === 200) {
            let values = await response.json();
        } else {
            getInfo();
        }
    }

    return (
        <div className='container'>
            <div>
                <button type="button" className="btn btn-primary " onClick={event => {
                    navigate("/dashboard")
                }}>
                    Indietro
                </button>
            </div>
            <div>

                <div className="fixed-nav">
                    <h3>Hai effettutato {ordersList.length} ordini</h3>
                </div>

                <div className="list-grid">
                    {(ordersList).slice(0, 5).map(item => (
                        <div className="card">
                            <div className="card-header">
                                <div>{DateToString(item.date_order) + " | Stato dell'ordine: " + steps[item.status]}</div>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <OrderCard orderId={item.id}></OrderCard>
                                    </li>
                                    <li className="list-group-item">
                                        Spesa ristorante: {item.restaurant_total}
                                        {(item.deliverer_total !== null) ? (
                                            <div>+ {item.deliverer_total} di spedizione</div>) : (<div></div>)}
                                    </li>
                                    <li className="list-group-item">
                                        <button type="button" className="btn btn-primary short" onClick={event => {
                                            navigate("/orderdetails", {state: item})
                                        }}>
                                            Dettagli
                                        </button>

                                    {(item.status === 3 || item.status === 6) ? (
                                       <div>
                                            {(item.status === 3) ? (
                                                <button type="button" className="btn btn-primary short"
                                                        onClick={event => {
                                                            console.debug((item.restaurant_total + item.deliverer_total));
                                                            window.location.href = address + (Math.round((item.restaurant_total + item.deliverer_total) * 100) / 100) + "/" + app_base_address + "_landingorder_" + item.id
                                                        }}>
                                                    Paga
                                                </button>
                                            ) : (<div></div>)}
                                            {(item.status === 6) ? (
                                                <button type="button" className="btn btn-primary short"
                                                        onClick={event => {
                                                            handleCancel(item)
                                                        }}>
                                                    Annulla
                                                </button>
                                            ) : (<div></div>)}
                                       </div>
                                    ) : (<div></div>)}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                    {(ordersList).slice(5, ordersList.length).map(item => (
                        <div className="card">
                            <div className="card-header">
                                <div>{DateToString(item.date_order) + " | Stato dell'ordine: " + steps[item.status]}</div>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        Spesa ristorante: {item.restaurant_total}
                                        {(item.deliverer_total !== null) ? (
                                            <div>+ {item.deliverer_total} di spedizione</div>) : (<div></div>)}
                                    </li>
                                    {(item.status === 3 || item.status === 6) ? (
                                        <li className="list-group-item">
                                            {(item.status === 3) ? (
                                                <button type="button" className="btn btn-primary short"
                                                        onClick={event => {
                                                            console.debug((item.restaurant_total + item.deliverer_total));
                                                            window.location.href = address + (Math.round((item.restaurant_total + item.deliverer_total) * 100) / 100) + "/" + app_base_address + "_landingorder_" + item.id
                                                        }}>
                                                    Paga
                                                </button>
                                            ) : (<div></div>)}
                                            {(item.status === 6) ? (
                                                <button type="button" className="btn btn-primary short"
                                                        onClick={event => {
                                                            handleCancel(item)
                                                        }}>
                                                    Annulla
                                                </button>
                                            ) : (<div></div>)}
                                        </li>
                                    ) : (<div></div>)}
                                    <li className="list-group-item">
                                        <button type="button" className="btn btn-primary short" onClick={event => {
                                            navigate("/orderdetails", {state: item})
                                        }}>
                                            Dettagli
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}