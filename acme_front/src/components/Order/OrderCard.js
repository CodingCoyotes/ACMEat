import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate,} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getOrder, getRestaurant, getUserInfo} from "../Database/DBacmeat";
import '../css/Dash.css'


export default function OrderCard({orderId}){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [menuList, setMenuList]  = useState([]);
    const [restaurantName, setRestaurantName] = useState("");
    const {state} = useLocation();

    useEffect(() => {
        //console.log("ordercard")
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            //getInfo();
            getOrd();
        }
    }, [])

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    async function getOrd(){
        //console.log("get Ord")
        let response = await getOrder({orderId}.orderId, token);
        if (response.status === 200) {
            let values = await response.json();
            setMenuList(values.contents);
            //console.log(values.contents);
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
       <div>
            <h5 className="card-title">{restaurantName}</h5>
            <ul>
                {menuList.map(menu =>(
                   <li>{menu.qty}:{(menu.menu).name}</li>
                ))}
            </ul>
       </div>

    )
}