import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../../Context";
import Container from "react-bootstrap/Container";
import {getMenus, getRestaurant, getRestaurants, getUserInfo} from "../Database/DBacmeat";
import classNames from "classnames";
import '../css/Dash.css'



export default function DashOrder(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [restaurantName, setRestaurantName] = useState("");
    const [menuList, setMenuList]  = useState([]);
    const [ordersList, setOrdersList]  = useState([]);
    const [totPrice, setTotPrice] = useState(0);
    const {state} = useLocation();

    useEffect(() => {
        console.log("dashOrder")
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            getRestaurantId();
        }
    }, [])

    function getRestaurantId(){
        if (state !== null) {
            const {param} = state;
            console.log("ho il rest id")
            console.log(param)
            getRest(param)
        }
    }
    async function getRest(restaurantId) {
        let response = await getRestaurant(restaurantId);
        if (response.status === 200) {
            let values = await response.json();
            setMenuList(values.menus);
            setRestaurantName(values.name);
        }
    }

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    async function handleCounter (e, val, menu) {
        e.preventDefault();
        console.log("sono in handlercount")
        //console.log(menu)
        let presente = false;
        let tmpList = [];
        let tot = 0;
        for(let i = 0; i < ordersList.length; i = i+1){
            //console.log(ordersList[i].id)
            if(ordersList[i].id === menu.id){ //Se ho trovato l'ordine nella lista
                presente = true;
                if(val > 0){
                    let elem = {
                        qty: val,
                        id: menu.id,
                        name: menu.name,
                        cost: menu.cost
                    }
                    tmpList = tmpList.concat(elem);
                }
            }
            else{
                tmpList = tmpList.concat(ordersList[i]);
            }
        }


        if(!presente){
            let elem = {
                qty: val,
                id: menu.id,
                name: menu.name,
                cost: menu.cost
            }
            tmpList = ordersList.concat(elem);
        }
        setOrdersList(tmpList);

        for(let i = 0; i < tmpList.length; i = i+1){
            tot = tot + (tmpList[i].cost * tmpList[i].qty);
        }
        setTotPrice(tot);
    }

    return(
        <div className='container'>
            <div >
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashboard")}}>
                    Indietro
                </button>
            </div>
            {(menuList.length === 0)? (
                <div>
                    <div className="fixed-nav">
                        <h3>Non ci sono menu per il ristorante {restaurantName}</h3>
                    </div>
                </div>
            ): (
                    <div>
                        {(ordersList.length > 0)? (<div>
                            <div className="card carrello">
                                <div className="card-header">
                                    <div>Il tuo carrello</div>
                                </div>
                                <div className="card-body">
                                    <ul>
                                        {ordersList.map(item => (
                                            <li>{item.qty}: {item.name}</li>
                                        ))}
                                    </ul>
                                    <h6>Totale: {totPrice} €</h6>
                                    <button type="button" className="btn btn-primary " onClick={event => {navigate("/recaporder", { state: { param: ordersList }}) }}>
                                        Ordina
                                    </button>
                                </div>
                            </div>

                        </div>) : (<div></div>)}

                    <div className="fixed-nav">
                        <h3>Ci sono {menuList.length} menu per il ristorante {restaurantName}</h3>
                    </div>

                    <div className="list-grid">
                        {menuList.map(item => (
                            <div className="card">
                                <div className="card-header">
                                    <div>{item.cost} €</div>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    {item.contents.map(i => (
                                        <div className="card-text">{i.name} : {i.desc} </div>
                                    ))}
                                    <div className="form-group mt-3">
                                        <label>Quantità</label>
                                        <input
                                            type="number"
                                            className="form-control mt-1"
                                            placeholder="0"
                                            min={0}
                                            onChange={e => handleCounter(e, e.target.value, item)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}