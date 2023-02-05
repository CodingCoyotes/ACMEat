import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getOrder, getRestaurant, getRestaurants, getUserInfo, modifyOrder} from "../Database/DBacmeat";
import '../css/Dash.css'
import OrderCard from "./OrderCard";

const address = process.env.REACT_APP_BANK_ADDRESS

function getSteps() {
    return [
        'Ordine inviato',
        'Conferma ristorante',
        'Conferma fattorino',
        'Conferma da terzi',
        'Ordine cancellato',
        'Pagamento confermato',
        'Pagamento cancellato',
        'Preparazione ordine in atto',
        'Il tuo ordine è stato spedito',
        'In consegna',
        'Consegnato'];
}

function DateToString(info){
    const dateFormat = new Date(info * 1000)
    let string =  "Il "+dateFormat.getDate()+
        "/"+(dateFormat.getMonth()+1)+
        "/"+dateFormat.getFullYear()+
        " alle "+dateFormat.getHours()+
        ":"+dateFormat.getMinutes()+
        ":"+dateFormat.getSeconds();
  return string;
}

export default function CronologiaOrdine(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [ordersList, setOrdersList]  = useState([]);
    const steps = getSteps();
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
            console.log("userorder")
            console.log(values.orders)
            setOrdersList((values.orders).reverse());
        }
    }

    function getOrders(){
        if(state !== null){
            let {param} = state;
            setOrdersList(param.reverse());
        }
    }

    async function handleCancel (order) {
        //e.preventDefault();
        console.log("sono in handle cancel")
        console.log(order);
        let info ={
            "date_order": order.date_order,
            "delivery_time": order.delivery_time,
            "restaurant_total": order.restaurant_total,
            "deliverer_total": order.deliverer_total,
            "status": 4,
            "deliverer_id": order.deliverer_id
        }
        let response = await modifyOrder(token, info, order.id);
        if (response.status === 200) {
            let values = await response.json();
        }
        else{
            getInfo();
        }
    }

    async function handlePaga(item){
        console.log("handlepaga");
        console.log(item);
        let response = await getOrder(item.id, token);
        if (response.status === 200) {
            let values = await response.json();
            let response = await getRestaurant(((values.contents)[0].menu).restaurant_id, token);
            if (response.status === 200) {
                let values = await response.json();
                let totPrice = (item.restaurant_total + item.deliverer_total);
                window.location.href = address + (Math.round((item.restaurant_total + item.deliverer_total) * 100) / 100) + "/127.0.0.1:3002_landingorder_" + values.name;
            }
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
                        {(ordersList).slice(0, 5).map(item => (
                            <div className="card">
                                <div className="card-header">
                                    <div>{DateToString(item.date_order)+ " | Stato dell'ordine: "+ steps[item.status]}</div>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <OrderCard orderId={item.id} ></OrderCard>
                                        </li>
                                        <li className="list-group-item">
                                            Spesa ristorante: {item.restaurant_total}
                                            {(item.deliverer_total !== null)? (<div>+ {item.deliverer_total} di spedizione</div>):(<div></div>)}
                                        </li>
                                        {(item.status === 3 || item.status === 6)?(
                                            <li className="list-group-item">
                                                {(item.status === 3)?(
                                                    <button type="button" className="btn btn-primary short" onClick={event =>{handlePaga(item)}}>
                                                        Paga
                                                    </button>
                                                ): (<div></div>)}
                                                {(item.status === 6)?(
                                                    <button type="button" className="btn btn-primary short" onClick={event => {handleCancel(item) }}>
                                                        Annulla
                                                    </button>
                                                ): (<div></div>)}
                                            </li>
                                        ):(<div></div>)}
                                    </ul>
                                </div>
                            </div>
                        ))}
                        {(ordersList).slice(5, ordersList.length).map(item => (
                            <div className="card">
                                <div className="card-header">
                                    <div>{DateToString(item.date_order)+ " | Stato dell'ordine: "+ steps[item.status]}</div>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            Spesa ristorante: {item.restaurant_total}
                                            {(item.deliverer_total !== null)? (<div>+ {item.deliverer_total} di spedizione</div>):(<div></div>)}
                                        </li>
                                        <li className="list-group-item">
                                            <button type="button" className="btn btn-primary short" onClick={event => {navigate("/orderdetails", { state:item})}}>
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