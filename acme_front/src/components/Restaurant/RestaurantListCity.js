import React, {useRef, useMemo, useLayoutEffect, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import classNames from "classnames";
import {getCity, getRestaurants} from "../Database/DBacmeat";
import {useLocation, useNavigate} from "react-router-dom";

function splitTime(time){
    let pran1 = ""
    let pran2 = ""
    let cen1 = ""
    let cen2 = ""
    let split = time.split("/")
    if(split[0] !== ""){
        let s = split[0].split("-")
        pran1= s[0];
        pran2= s[1];
    }
    if(split[1] !== ""){
        let s = split[1].split("-")
        cen1= s[0];
        cen2= s[1];
    }
    return [pran1, pran2, cen1, cen2];

}

function checkClosed(time){
    let today = new Date();
    let sDay ="";
    let list = [];
    switch(today.getDay()){
        case 0:
            sDay="lunedi"
            break;
        case 1:
            sDay="martedi"
            break;
        case 2:
            sDay="mercoledi"
            break;
        case 3:
            sDay="giovedi"
            break;
        case 4:
            sDay="venerdi"
            break;
        case 5:
            sDay="sabato"
            break;
        case 6:
            sDay="domenica"
            break;
    }
    let orari = [];
    let chiusura = new Date()
    time.map(item =>{
        if(item.day === sDay){
            console.log("oggi è "+ sDay);
            console.log(item.time);
            orari = splitTime(item.time)
            chiusura.setHours(orari[3])
            console.log(chiusura)
            console.log(today)
            if(chiusura < today){
                return true;
            }
        }
    })
    return false;
}

export default function RestaurantListCity() {
    const isDetailedView = "grid";
    const [restaurantsList, setRestaurantsList] = useState([]);
    const [cityName, setCityName] = useState();
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
        console.log("ho il city id")
        console.log(param);
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
                                    {(item.closed === true || checkClosed(item.open_times) === true)? (<div className="red_text">Chiuso</div>):(<div>Aperto</div>)}
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.address}</p>
                                    <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/dashorder", { state: { param: item.id }});}}>
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
