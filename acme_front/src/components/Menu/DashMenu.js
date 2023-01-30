import React, {useEffect, useState} from 'react';
import {useNavigate,  useParams} from "react-router-dom";
import {useAppContext} from "../../Context";
import Container from "react-bootstrap/Container";
import {getMenus, getRestaurant, getRestaurants, getUserInfo} from "../Database/DBacmeat";
import classNames from "classnames";
import '../css/Dash.css'



export default function DashMenu(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [ownerId, setOwnerId] = useState("");
    const [restaurantId, setRestaurantId] = useState(null);
    const [restaurantName, setRestaurantName] = useState("");
    const [menuList, setMenuList]  = useState([]);

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
                                    <button type="button" className="btn btn-secondary" onClick={event => {navigate("/menuregistration"); localStorage.setItem("id_menu", item.id);}}>
                                        Modifica
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}