import React, {useRef, useMemo, useLayoutEffect, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import classNames from "classnames";
import {getCity, getRestaurants} from "../Database/DBacmeat";
import {useLocation, useNavigate} from "react-router-dom";


export default function RestaurantListCity() {
    const isDetailedView = "grid";
    const [restaurantsList, setRestaurantsList] = useState([]);
    const [cityName, setCityName] = useState();
    const [cityId, setCityId] = useState(null);
    const navigate = useNavigate();
    const {state} = useLocation();
    const {param} = state;

    useEffect(() => {
        console.log("sono in restaurantlistcity")
        getCityId();

    }, [])
    // Ref to the container with elements
    const containerRef = useRef(null);

    function getCityId(){
        /*if (localStorage.getItem("id_city") &&  cityId== null) {
            let restId = localStorage.getItem("id_city")
            console.log("ho il city id")
            console.log(restId)
            setCityId(restId)
            getCityFomId(restId)
            getRest(restId);
        }*/
        console.log("ho il city id")
        console.log(param);
        setCityId(param);
        getCityFomId(param)
        getRest(param);
    }

    async function getCityFomId(cityId){
        let rest = await getCity(cityId);
        if (rest.status === 200) {
            let list = await rest.json()
            setCityName(list.name);
        }
    }

    async function getRest(cityId){
        let rest = await getRestaurants();
        if (rest.status === 200) {
            let list = await rest.json()
            cleanRestaurants(list, cityId)
        }
    }

    function cleanRestaurants(restaurants, cityId){
        const newList = []
        Object.entries(restaurants).forEach((entry) => {
            const [key, value] = entry;
            console.log(value.city_id)
            if(value.city_id === cityId){
                newList.push(value);
            }
            setRestaurantsList(newList);
        });
    }


    return (
        <div className='container'>
            <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashboard")}}>
                Indietro
            </button>
            {(restaurantsList.length === 0)? (
                <div>
                    <div className="fixed-nav">
                        <h3>Non ci sono ristoranti a {cityName}</h3>
                    </div>
                </div>
            ): (
                <div>
                    <div className="fixed-nav">
                        <h3>Ci sono {restaurantsList.length} ristoranti a {cityName}</h3>
                    </div>

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
                                    <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/dashorder"); localStorage.setItem("id_restaurant", item.id);}}>
                                        Ordina
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

    );
}
