import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getCities, getRestaurants, getUserInfo} from '../Database/DBacmeat';
import '../css/Dash.css'

export default function DashUtente(){
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [allCitiesList, setAllCitiesList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [nationList, setNationList] = useState([]);
    const [currNation, setCurrNation] = useState("");
    const [currCity, setCurrCity] = useState("");
    const [orderList, setOrderList] = useState([]);
    const [cronologiaOrdini, setCronologiaOrdini] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            console.log("Sono in Dashboard");
            getInfo();
            getCity();
        }
    }, [])

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

            getCityList(values, values[0].nation);
        }
    }

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json()
            setUser(values)
            console.log("utente");
            console.log(values);
            console.log("ordini");
            console.log(values.orders);

            if((values.orders).length > 0){
                setCronologiaOrdini(true);
                setOrderList(values.orders);
                getActiveOrders(values.orders);
            }
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

    async function getActiveOrders(orders){
        console.log("ordini attivi");
        let tmpList = []
        orders.map(ord => {
            if(ord.status > 0 && ord.status < 10){
                tmpList = tmpList.concat(ord);
            }
        })
        console.log(tmpList);
        setActiveOrderList(tmpList);
    };

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
        //setCity(city);
        console.log("submit")
        console.log(currCity)
    }

    return(

        <div className='container'>
        {user ? (
            <h2>Salve {user.name}.</h2>
        ) : (<div>...</div>)}



        <form className="Auth-form-content card" onSubmit={handleSubmit}>
            <h2>Effettua subito un ordine!</h2>
            <div className="form-group mt-3">
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
                    <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/restaurantlistcity", { state:{param: currCity}});}}>
                        Cerca
                    </button>
                </div>
            </div>
        </form>
        {(cronologiaOrdini)? (
            <div className="Auth-form-content">
                <div className="d-grid gap-2 mt-3">
                    <button type="button" className="btn btn-secondary red" onClick={event => {navigate("/cronologiaordine", { state:{param: orderList}})}}>
                        Vai al riepilogo ordini
                    </button>
                </div>
            </div>
        ): (<div>...</div>)
        }
        </div>
    )
}