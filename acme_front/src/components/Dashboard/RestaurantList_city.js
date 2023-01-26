import React, {useRef, useMemo, useLayoutEffect, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import classNames from "classnames";
import {getCity, getRestaurants} from "../Database/DBacmeat";


export default function RestaurantList_city({city}) {
    const isDetailedView = "grid";
    const [restaurantsList, setRestaurantsList] = useState([]);
    const [cityName, setCityName] = useState();

    useEffect(() => {
        console.log(city);
        getRest();
        getCityFomId();

    }, [])
    // Ref to the container with elements
    const containerRef = useRef(null);

    async function getCityFomId(){
        let rest = await getCity(city);
        if (rest.status === 200) {
            let list = await rest.json()
            setCityName(list.name);
        }
    }

    async function getRest(){
        let rest = await getRestaurants();
        if (rest.status === 200) {
            let list = await rest.json()
            cleanRestaurants(list, city)
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


    return ( (restaurantsList.length === 0)? (
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
                    //<div className="list-item" data-item="true" key={item.id}>
                      //  <h3>{item.name}</h3>
                       // {isDetailedView && (
                        //    <p className="list-item-description">{item.address}</p>
                       // )}
                    //</div>
                    <div className="card">
                    <div className="card-header">
                       {(item.closed === false)? (<div>Aperto</div>) : (<div>Chiuso</div>)}
                    </div>
                    <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.address}</p>
                    <a href="#" className="btn btn-primary">Ordina</a>
                    </div>
                    </div>
                ))}
            </div>
        </div>
    ));
}
