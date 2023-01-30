import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {useAppContext} from "../../Context";
import {
    getCities,
    getMenu,
    getRestaurant,
    getUserInfo,
    modifyMenu,
    registerNewMenu, registerNewOrder,
    registerNewRestaurant
} from "../Database/DBacmeat";
import classNames from "classnames";
import '../css/Dash.css'


export default function RecapOrder() {
    console.log("Sono in MenuRegistration");
    const [user, setUser] = useState(null);
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();
    const [indirizzo, setIndirizzo] = useState();
    const [numCivico, setNumCivico] = useState();
    const [allCitiesList, setAllCitiesList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [nationList, setNationList] = useState([]);
    const [currNation, setCurrNation] = useState("");
    const [currCity, setCurrCity] = useState("");
    const [orderList, setOrderList] = useState([]);
    const {state} = useLocation();
    const {list} = state; // Read values passed on state
    const {restaurantId} = state;

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            getCity();
            setOrderList(list);
        }
    }, [])

    async function getInfo() {
        console.debug(token)
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    async function getCity(){
        let resp = await getCities();
        if (resp.status === 200) {
            let values = await resp.json();
            setAllCitiesList(values);
            //console.log(values);

            let tmpList = [];
            values.map(val =>(
                tmpList = tmpList.concat(val.nation)
            ));
            const withoutDuplicates = [...new Set(tmpList)];
            setNationList(withoutDuplicates);
            setCurrNation(values[0].nation);
            getCityList(values, values[0].nation);
        }
    }

    async function getCityList(list, nation){
        console.log("getCitylist");
        let tmpList= []
        list.map(val =>{
            if(val.nation === nation)
                tmpList = tmpList.concat(val)
        });
        console.log(tmpList);
        setCityList(tmpList);
        setCurrCity(tmpList[0].id);
    }

    const handleCurrNationChange = async e =>{
        e.preventDefault();
        let nation = e.target.value
        setCurrNation(nation);
        console.log(nation);
        getCityList(allCitiesList, nation);
    }

    const handleCurrCityChange = async e =>{
        e.preventDefault();
        let nation = e.target.value
        setCurrCity(nation);
        console.log(nation);
    }

    const handleSubmit = async e => {
        e.preventDefault();
        console.log("sono in handlersub")

        let contentList = [];
        orderList.map(ord =>{
           let obj = {
               menu_id: ord.id,
               qty: ord.qty
           }
           contentList = contentList.concat(obj);
        });
         let info = {

             "contents": contentList,
             "delivery_time": new Date().getTime(),
             "address": indirizzo,
             "number": numCivico,
             "city": currCity,
             "nation": currNation,

         };
         console.log(info);
        const response = await registerNewOrder(restaurantId,info, token);
        if (response.status === 200) {
            let values = await response.json()

        }
        navigate("/dashutente");

    }

    return (
        <div className='container'>
            <div>
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashorder")}}>
                    Indietro
                </button>
            </div>
            <form className="Auth-form-content card" onSubmit={handleSubmit}>
                <h3 className="Auth-form-title">Completa ordine</h3>
                <div className="form-group mt-3">
                    <h5>Menu selezionati</h5>
                    {orderList.map(item => (
                        <div className="card">
                            <div className="card-header">
                                <h6 className="card-title">{item.name}</h6>
                            </div>
                            <div className="card-body">
                                <label className="card-text">Prezzo:{item.cost}€    Quantità:{item.qty}</label>

                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-group mt-3">
                        <h5>Indirizzo di consegna</h5>
                        <input
                            type="text"
                            className="form-control mt-1"
                            value={indirizzo}
                            placeholder="Piazza Roma"
                            onChange={e => setIndirizzo(e.target.value)}
                        />
                        <input
                            type="number"
                            className="form-control mt-1"
                            value={numCivico}
                            placeholder="6"
                            onChange={e => setNumCivico(e.target.value)}
                        />
                </div>
                <div className="form-group mt-4">
                    <label>Seleziona una nazione</label>
                    <select className="form-select" aria-label="Default select example" value={currNation} onChange={handleCurrNationChange}>
                        {nationList.map(nation => {
                            return <option key={nation} value={nation}>{nation}</option>;
                        })}
                    </select>
                    <label>Seleziona una città</label>
                    <select className="form-select" aria-label="Default select example" value={currCity} onChange={handleCurrCityChange}>
                        {cityList.map(city => {
                            return <option key={city.id} value={city.id}>{city.name}</option>;
                        })}
                    </select>
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">
                        Ordina ora!
                    </button>
                </div>
            </form>
        </div>
    )
}