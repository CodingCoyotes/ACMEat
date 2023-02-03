import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {useAppContext} from "../../Context";
import {
    getCities, getRestaurant,
    getUserInfo,
    registerNewOrder,
} from "../Database/DBacmeat";
import '../css/Dash.css'

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

function getSlots(ora1, ora2){
    let list = [];
    let time = new Date();
    let h = "";
    let now = new Date();
    if(ora1 !== ""){
        time.setHours(ora1);
        time.setMinutes(0);
        h = time.getHours();
        while (h < ora2){
            time.setMinutes(time.getMinutes() + 15);
            h = time.getHours();

            if(time > now)
                list = list.concat(time.getHours() + ":" + time.getMinutes());
        }
    }
    return list;
}

function getTimeList(time){
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
    time.map(item =>{
        if(item.day === sDay){
            console.log("oggi è "+ sDay);
            console.log(item.time);
            orari = splitTime(item.time)
            list = list.concat(getSlots(orari[0], orari[1]));
            list = list.concat(getSlots(orari[2], orari[3]));
            console.log(list);
        }
    })
    return list;
}

export default function CheckoutOrdine() {
    console.log("Sono in CheckoutOrdine");
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
    const [timeList, setTimeList] = useState([]);
    const [time, setTime] = useState("");
    const [timeDate, setTimeDate] = useState(new Date());
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
            getRest();
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

    async function getRest() {
        console.log("restaurantid");
        console.log({restaurantId});
        let response = await getRestaurant({restaurantId}.restaurantId);
        if (response.status === 200) {
            let values = await response.json();
            console.log(values);
            let list = getTimeList(values.open_times)
            setTimeList(list);
            let timeOk = new Date();
            let split = list[0].split(":");
            timeOk.setHours(split[0]);
            timeOk.setMinutes(split[1]);
            setTimeDate(timeOk);
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
        let timeOk = new Date();
        let split = time.split(":");
        timeOk.setHours(split[0]);
        timeOk.setMinutes(split[1]);
        setTimeDate(timeOk)
         let info = {

             "contents": contentList,
             "delivery_time": timeDate,
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
        else{
            console.log("response")
            console.log(response)
            navigate("/processingorder", { state: { param: response.id}});
        }
    }

    return (
        <div className='container'>
            <div>
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashorder", { state: { param: {restaurantId}.restaurantId }})}}>
                    Indietro
                </button>
            </div>
            <div className="Auth-form-content card">
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
                <div className="form-group mt-4">
                    <label>Seleziona una fascia oraria</label>
                    <select className="form-select" aria-label="Default select example" value={time} onChange={e => setTime(e.target.value)}>
                        {timeList.map(time => {
                            return <option key={time} value={time}>{time}</option>;
                        })}
                    </select>
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                        Ordina ora!
                    </button>
                </div>
            </div>
        </div>
    )
}