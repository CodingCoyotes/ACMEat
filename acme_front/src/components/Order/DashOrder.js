import React, {useEffect, useState} from 'react';
import {useNavigate,  useParams} from "react-router-dom";
import {useAppContext} from "../../Context";
import Container from "react-bootstrap/Container";
import {getMenus, getRestaurant, getRestaurants, getUserInfo} from "../Database/DBacmeat";
import classNames from "classnames";
import '../css/Dash.css'



export default function DashOrder(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [ownerId, setOwnerId] = useState("");
    const [restaurantId, setRestaurantId] = useState(null);
    const [restaurantName, setRestaurantName] = useState("");
    const [menuList, setMenuList]  = useState([]);
    const [ordersList, setOrdersList]  = useState([]);

    useEffect(() => {
        console.log("dashMenu")
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            getRestaurantId();
        }
    }, [])

    function getRestaurantId(){
        if (localStorage.getItem("id_restaurant") &&  restaurantId== null) {
            let restId = localStorage.getItem("id_restaurant")
            console.log("ho il rest id")
            console.log(restId)
            setRestaurantId(restId)
            getRest(restId)
        }
    }
    async function getRest(restaurantId) {
        let response = await getRestaurant(restaurantId);
        if (response.status === 200) {
            let values = await response.json();
            console.log(values);
            setMenuList(values.menus);
            setRestaurantName(values.name);
        }
    }

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
            setOwnerId(values.id);
        }
    }

    async function handleCounter (e, val, menu) {
        e.preventDefault();
        console.log("sono in handlercount")
        console.log(val)
        //console.log(menu)
        let presente = false;
        let tmpList = [];
        for(let i = 0; i < ordersList.length; i = i+1){
            //console.log(ordersList[i].id)
            if(ordersList[i].id === menu.id){ //Se ho trovato l'ordine nella lista
                presente = true;
                if(val > 0){
                    let elem = {
                        qty: val,
                        id: menu.id,
                        name: menu.name,
                    }
                    tmpList = tmpList.concat(elem);
                }
            }
            else{
                tmpList = tmpList.concat(ordersList[i]);
            }
            console.log(tmpList);

        }
        setOrdersList(tmpList);

        if(!presente){
            console.log("non è presente");
            let elem = {
                qty: val,
                id: menu.id,
                name: menu.name,
            }
            setOrdersList(ordersList.concat(elem))
            console.log(ordersList.concat(elem));
        }
        //console.log(ordersList.concat(elem));
    }

    return(
        <div className='container'>
            <div >
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashboard")}}>
                    Indietro
                </button>
                <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/menuregistration"); localStorage.removeItem("id_menu");}}>
                    Crea un nuovo menù
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