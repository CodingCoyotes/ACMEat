import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getOrder, getRestaurant, getRestaurants, getUserInfo} from "../Database/DBacmeat";
import '../css/Dash.css'
import OrderCard from "./OrderCard";

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
        }
    }

    function getOrders(){
        if(state !== null){
            let {param} = state;
            setOrdersList(param.reverse());
            console.log("orderlist")
            console.log(param);
        }
    }

    async function createCard(orderId){
        let response = await getOrder(orderId, token);
        if (response.status === 200) {
            let values = await response.json();
                console.log(values.contents)
            return(
                <div className="card-body">
                    <h5 className="card-title">(orderId)</h5>
                </div>
            );
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
                                    <div>{DateToString(item.date_order)+ " | Stato dell'ordine: "+ steps[item.status]}</div>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item"><OrderCard orderId={item.id} ></OrderCard></li>
                                        <li className="list-group-item">
                                            Spesa ristorante: {item.restaurant_total}
                                            {(item.deliverer_total !== null)? (<div>+ {item.deliverer_total} di spedizione</div>):(<div></div>)}
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