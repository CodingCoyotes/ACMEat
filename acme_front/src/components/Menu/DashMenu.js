import React, {useEffect, useState} from 'react';
import {useNavigate,  useParams} from "react-router-dom";
import {useAppContext} from "../../Context";
import Container from "react-bootstrap/Container";
import {getMenus, getRestaurant, getRestaurants, getUserInfo} from "../Database/DBacmeat";



export default function DashMenu(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [ownerId, setOwnerId] = useState("");
    const [restaurantId, setRestaurantId] = useState(null);
    const [restaurantName, setRestaurantName] = useState("");
    const [hoMenu, setHoMenu] = useState(false);
    const [listMenu, setListMenu] = useState([]);

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
            getMen();
        }
    }
    async function getRest(restaurantId) {
        let response = await getRestaurant(restaurantId);
        if (response.status === 200) {
            let values = await response.json();
            console.log("ho il rest")
            console.log(values)
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

    async function getMen(){
        let rest = await getMenus();
        if (rest.status === 200) {
            let list = await rest.json()
            getMyMenus(list);
        }
    }

    function getMyMenus(list){
        const newList = []
        Object.entries(list).forEach((entry) => {
            const [key, value] = entry;
            if(value.restaurant_id === restaurantId){
                newList.push(value);
                setHoMenu(true);
            }
            setListMenu(newList);
        });
    }

    return((hoMenu === false) ? (
            <div className='container'>
                <h2>Non ci sono menù per il ristorante {restaurantName}</h2>
                <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/menuregistration")}}>
                    Crea un nuovo menù
                </button>
            </div>
        ) : (
            <div>
                <div className='container'>
                    <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/menuregistration")}}>
                        Crea un nuovo menù
                    </button>

                </div>
                <div>
                    <Container>

                    </Container>
                </div>
            </div>
        )
    );
}