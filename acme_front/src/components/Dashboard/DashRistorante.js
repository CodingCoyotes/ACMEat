import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {getCities, getRestaurants, getUserInfo} from "../Database/DBacmeat";
import {useAppContext} from "../../Context";
import RestaurantList_owner from "./RestaurantList_owner";
import Container from "react-bootstrap/Container";



export default function DashRistorante(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [ownerId, setOwnerId] = useState("");
    const [restaurantsList, setRestaurantsList] = useState([]);
    const [hoRest, setHoRest] = useState(false);

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();

        }
    }, [])

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
            setOwnerId(values.id);
            console.log(ownerId);
            getRest(values.id);
        }
    }

    async function getRest(owner_id){
        let rest = await getRestaurants();
        if (rest.status === 200) {
            let list = await rest.json()
            getMyRest(list, owner_id);
        }
    }

    function getMyRest(restaurantsList, owner_id){
        const newList = []
        Object.entries(restaurantsList).forEach((entry) => {
            const [key, value] = entry;
            if(value.owner_id === owner_id){
                newList.push(value);
                setHoRest(true);
            }
            setRestaurantsList(newList);
        });
    }

    return((hoRest === false) ? (
        <div className='container'>
            <h2>Sembra che tu non abbia un ristorante.</h2>
            <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/restaurantregistration")}}>
                Crea un ristorante
            </button>
        </div>
        ) : (
            <div>
                <div className='container'>
                    <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/restaurantregistration")}}>
                        Crea un ristorante
                    </button>

                </div>
                <div>
                    <Container>
                        <h2>Hai {restaurantsList.length} ristoranti</h2>
                        <RestaurantList_owner
                            ownerId = {ownerId}
                        />
                    </Container>
                </div>
            </div>
        )
    );
}