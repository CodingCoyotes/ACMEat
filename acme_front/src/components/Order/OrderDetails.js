import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate,} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getOrder, getRestaurant, getUserInfo} from "../Database/DBacmeat";
import '../css/Dash.css'

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

export default function OrderDetails(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [menuList, setMenuList]  = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [order, setOrder] = useState();
    const [restaurantName, setRestaurantName] = useState("");
    const {state} = useLocation();
    const steps = getSteps();

    useEffect(() => {
        console.log("orderdetails")
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            getOrd();
        }
    }, [])

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
            setOrderList(values.orders);
        }
    }

    async function getOrd(){
        console.log("get Ord");
        console.log(state);
        console.log(state.id);
        let response = await getOrder(state.id, token);
        if (response.status === 200) {
            let values = await response.json();
            console.log(values);
            setOrder(values);
            setMenuList(values.contents);
            //console.log("restID")
            //console.log((values.contents)[0].menu);
            await getRest(((values.contents)[0].menu).restaurant_id)
        }
    }

    async function getRest(restaurantId){
        //console.log("get Rest")
        //console.log(restaurantId)
        let response = await getRestaurant(restaurantId, token);
        if (response.status === 200) {
            let values = await response.json();
            //console.log(values.name)
            setRestaurantName(values.name);
        }
    }

    return(
        <div className='container'>
            <div >
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/cronologiaordine", { state:{param: orderList}})}}>
                    Indietro
                </button>
            </div>
            <div>
                <div className="list-grid">
                        <div className="card">
                            <div className="card-header">
                                <div>{DateToString(state.date_order)+ " | Stato dell'ordine: "+ steps[state.status]}</div>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <h5 className="card-title">{restaurantName}</h5>
                                        <ul>
                                            {menuList.map(menu =>(
                                                <li>{menu.qty}:{(menu.menu).name}</li>
                                            ))}
                                        </ul>
                                    </li>
                                    <li className="list-group-item">
                                        Spesa ristorante: {state.restaurant_total}
                                        {(state.deliverer_total !== null)? (<div>+ {state.deliverer_total} di spedizione</div>):(<div></div>)}
                                    </li>
                                </ul>
                            </div>
                        </div>
                </div>
            </div>
        </div>

    )
}