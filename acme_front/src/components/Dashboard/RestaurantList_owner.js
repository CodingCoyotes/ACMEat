import React, {useRef, useMemo, useLayoutEffect, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import classNames from "classnames";
import {getCity, getRestaurants, getUserInfo} from "../Database/DBacmeat";
import {useAppContext} from "../../Context";
import {useNavigate} from "react-router-dom";
import '../css/Dash.css'


export default function RestaurantList_owner({ownerId}) {
    const isDetailedView = "grid";
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [restaurantsList, setRestaurantsList] = useState([]);

    useEffect(() => {
        console.log(ownerId);
        getInfo();

    }, [])
    // Ref to the container with elements
    const containerRef = useRef(null);


    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
            setRestaurantsList(values.restaurants);

        }
    }

    return (
        <div>
            <div
                className={classNames("list", { "list-grid": isDetailedView })}
                ref={containerRef}
            >
                {restaurantsList.map(item => (
                    <div className="card">
                    <div className="card-header">
                       {(item.closed === false)? (<div>Aperto</div>) : (<div>Chiuso</div>)}
                    </div>
                    <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.address}</p>
                        <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/restaurantregistration", { state: { param: item.id }});}}>
                            Modifica dati
                        </button>
                        <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/dashmenu", { state: { param: item.id }});}}>
                            Gestisci menù
                        </button>

                    </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
