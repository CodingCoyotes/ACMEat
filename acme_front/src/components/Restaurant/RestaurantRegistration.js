import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getUserInfo, registerNewRestaurant, getCities, getRestaurant, modifyRestaurant} from "../Database/DBacmeat";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import "../css/Dash.css"
import {checkTodayAfterTen} from "../Utils/Utils";


export default function RestaurantRegistration() {
    const [user, setUser] = useState(null);
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [address, setAddress] = useState();
    const [addressNum, setAddressNum] = useState();
    const [bank_address, setBank_address] = useState();
    const [allCitiesList, setAllCitiesList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [nationList, setNationList] = useState([]);
    const [currNation, setCurrNation] = useState("");
    const [currCity, setCurrCity] = useState("");

    const [lunPra1, setLunPra1] = React.useState("12");
    const [lunPra2, setLunPra2] = React.useState("15");
    const [lunCen1, setLunCen1] = React.useState("19");
    const [lunCen2, setLunCen2] = React.useState("22");

    const [marPra1, setMarPra1] = React.useState("12");
    const [marPra2, setMarPra2] = React.useState("15");
    const [marCen1, setMarCen1] = React.useState("19");
    const [marCen2, setMarCen2] = React.useState("22");

    const [merPra1, setMerPra1] = React.useState("12");
    const [merPra2, setMerPra2] = React.useState("15");
    const [merCen1, setMerCen1] = React.useState("19");
    const [merCen2, setMerCen2] = React.useState("22");

    const [gioPra1, setGioPra1] = React.useState("12");
    const [gioPra2, setGioPra2] = React.useState("15");
    const [gioCen1, setGioCen1] = React.useState("19");
    const [gioCen2, setGioCen2] = React.useState("22");

    const [venPra1, setVenPra1] = React.useState("12");
    const [venPra2, setVenPra2] = React.useState("15");
    const [venCen1, setVenCen1] = React.useState("19");
    const [venCen2, setVenCen2] = React.useState("22");

    const [sabPra1, setSabPra1] = React.useState("12");
    const [sabPra2, setSabPra2] = React.useState("15");
    const [sabCen1, setSabCen1] = React.useState("19");
    const [sabCen2, setSabCen2] = React.useState("22");

    const [domPra1, setDomPra1] = React.useState("12");
    const [domPra2, setDomPra2] = React.useState("15");
    const [domCen1, setDomCen1] = React.useState("19");
    const [domCen2, setDomCen2] = React.useState("22");


    const [aperturaBool, setAperturaBool] = useState(true);
    const {state} = useLocation();

    function getHourString(pra1, pra2, cen1, cen2){
        let pranzo = ""
        let cena = ""
        if(!(pra1 === "" || pra2 === ""))
            pranzo = pra1+"-"+pra2;
        if(!(cen1 === "" || cen2 === ""))
            cena = cen1+"-"+cen2;
        return pranzo+"/"+cena;
    }

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

    function setHourString(day, time){
        let s = splitTime(time);
        switch(day){
            case "lunedi":
                setLunPra1(s[0]);
                setLunPra2(s[1]);
                setLunCen1(s[2]);
                setLunCen2(s[3]);
                break;
            case "martedi":
                setMarPra1(s[0]);
                setMarPra2(s[1]);
                setMarCen1(s[2]);
                setMarCen2(s[3]);
                break;
            case "mercoledi":
                setMerPra1(s[0]);
                setMerPra2(s[1]);
                setMerCen1(s[2]);
                setMerCen2(s[3]);
                break;
            case "giovedi":
                setGioPra1(s[0]);
                setGioPra2(s[1]);
                setGioCen1(s[2]);
                setGioCen2(s[3]);
                break;
            case "venerdi":
                setVenPra1(s[0]);
                setVenPra2(s[1]);
                setVenCen1(s[2]);
                setVenCen2(s[3]);
                break;
            case "sabato":
                setSabPra1(s[0]);
                setSabPra2(s[1]);
                setSabCen1(s[2]);
                setSabCen2(s[3]);
                break;
            case "domenica":
                setDomPra1(s[0]);
                setDomPra2(s[1]);
                setDomCen1(s[2]);
                setDomCen2(s[3]);
                break;
        }
    }

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            getCity();
            getRestaurantId();
        }

    }, [])

    function getRestaurantId(){
        if(state !== null){
            const {param} = state;
            console.log("getrestid")
            console.log(param)
            //console.log(restaurantId)

            getRest(param)
        }
    }

    async function getRest(restaurantId) {
        let response = await getRestaurant(restaurantId);
        if (response.status === 200) {
            let values = await response.json();
            updateData(values);
        }
    }

    function updateData(restaurant){
        console.log("restaurant");
        console.log(restaurant);
        setName(restaurant.name);
        setAddress(restaurant.address);
        setAddressNum(restaurant.number);
        setBank_address(restaurant.bank_address);
        setAperturaBool(restaurant.closed);
        let orario = restaurant.open_times;
        let day = "";
        let time = "";
        for (let i = 0; i < orario.length; i = i+1){
            setHourString(orario[i].day, orario[i].time)
        }
       setCurrCity(restaurant.city_id);
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

            getCityList(values, values[0].nation);
        }
    }

    async function getInfo() {
        console.debug(token)
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    async function getCityList(list, nation){
        let tmpList= []
        list.map(val =>{
            if(val.nation === nation)
                tmpList = tmpList.concat(val)
        });
        setCityList(tmpList);
        setCurrCity(tmpList[0].id);
    }

    const handleCurrNationChange = async e =>{
        e.preventDefault();
        let nation = e.target.value
        setCurrNation(nation);
        getCityList(allCitiesList, nation);
    }

    const handleCurrCityChange = async e =>{
        e.preventDefault();
        let nation = e.target.value
        setCurrCity(nation);
    }

    const handleSubmit = async e => {
    e.preventDefault();
        if(state !== null){
            const {param} = state;
            await modRest(param);
        }
        else {
            await newRest();
        }
    }

    async function newRest(){
        console.log("new rest")
        let obj = {

            "name": name,
            "address": address,
            "number": addressNum,
            "open_times": [
                {
                    "day": "lunedi",
                    "time": getHourString(lunPra1, lunPra2, lunCen1, lunCen2)
                },
                {
                    "day": "martedi",
                    "time": getHourString(marPra1, marPra2, marCen1, marCen2)
                },
                {
                    "day": "mercoledi",
                    "time": getHourString(merPra1, merPra2, merCen1, merCen2)
                },
                {
                    "day": "giovedi",
                    "time": getHourString(gioPra1, gioPra2, gioCen1, gioCen2)
                },
                {
                    "day": "venerdi",
                    "time": getHourString(venPra1, venPra2, venCen1, venCen2)
                },
                {
                    "day": "sabato",
                    "time": getHourString(sabPra1, sabPra2, sabCen1, sabCen2)
                },
                {
                    "day": "domenica",
                    "time": getHourString(domPra1, domPra2, domCen1, domCen2)
                }
            ],
            "closed": aperturaBool,
            "city_id": currCity,
            "bank_address": bank_address

        };
        console.log(obj);
        const response = await registerNewRestaurant(token,obj);
        if (response.status === 200) {
            let values = await response.json()
        }
        else{
            navigate("/dashboard");
        }
    }

    async function modRest(restaurantId){
        console.log("modrest")
        console.log(restaurantId)
        const response = await modifyRestaurant(token, {

            "name": name,
            "address": address,
            "number": addressNum,
            "coords": {
                "latitude": 0,
                "longitude": 0
            },
            "open_times": [
                {
                    "day": "lunedi",
                    "time": getHourString(lunPra1, lunPra2, lunCen1, lunCen2)
                },
                {
                    "day": "martedi",
                    "time": getHourString(marPra1, marPra2, marCen1, marCen2)
                },
                {
                    "day": "mercoledi",
                    "time": getHourString(merPra1, merPra2, merCen1, merCen2)
                },
                {
                    "day": "giovedi",
                    "time": getHourString(gioPra1, gioPra2, gioCen1, gioCen2)
                },
                {
                    "day": "venerdi",
                    "time": getHourString(venPra1, venPra2, venCen1, venCen2)
                },
                {
                    "day": "sabato",
                    "time": getHourString(sabPra1, sabPra2, sabCen1, sabCen2)
                },
                {
                    "day": "domenica",
                    "time": getHourString(domPra1, domPra2, domCen1, domCen2)
                }
            ],
            "closed": aperturaBool,
            "city_id": currCity,
            "owner_id": user.id,
            "bank_address": bank_address,
            "id": restaurantId

        }, restaurantId);
        if (response.status === 200) {
            console.log(response)
        }
        else {
            navigate("/dashboard");
        }
    }

    return (
        <div className='container'>
            <div>
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashboard")}}>
                    Indietro
                </button>
            </div>

          <form className="Auth-form-content card" onSubmit={handleSubmit}>
            <h3 className="Auth-form-title">{(state === null)? (<div>Registra il tuo ristorante</div>): (<div>Modifica il ristorante</div>)}</h3>
            <div className="form-group mt-3">
              <h5>Nome</h5>
              <input
                type="text"
                value={name}
                className="form-control mt-1"
                placeholder="Inserisci il nome dell'attività"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <h5>Indirizzo</h5>
              <input
                type="text"
                value={address}
                className="form-control mt-1"
                placeholder="Via Roma"
                onChange={e => setAddress(e.target.value)}
              />
                <input
                    type="number"
                    value={addressNum}
                    className="form-control mt-1"
                    placeholder="5"
                    onChange={e => setAddressNum(e.target.value)}
                />
            </div>
              <div className="form-group mt-3">
                  <h5>Coordinate bancarie</h5>
                  <input
                      type="text"
                      value={bank_address}
                      className="form-control mt-1"
                      placeholder="IT60X0542811101000000123456"
                      onChange={e => setBank_address(e.target.value)}
                  />
              </div>
            <div className="form-group mt-3">
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Stato</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={"aperto"}
                        value={aperturaBool}
                        name="radio-buttons-group"
                        onChange={e => setAperturaBool(e.target.value)}
                        renderInput={(params) => <TextField {...params} />}>
                        <FormControlLabel value="false" control={<Radio />} label="Aperto" />
                        <FormControlLabel value="true" control={<Radio />} label="Chiuso" />
                    </RadioGroup>
                </FormControl>
            </div>
              {(checkTodayAfterTen())?
                  (<div className="form-group mt-3"><h5 className="red_text">Non puoi modificare l'orario dopo le 10</h5></div>):(
                      <div className="form-group mt-3">
                          <h5>Seleziona orari apertura (pranzo/cena)</h5>
                          <div>
                              <h6>Lunedì: </h6>
                              <label className="label-margin">Pranzo </label>
                              <input
                                  type="number"
                                  value={lunPra1}
                                  className="form-control short"
                                  placeholder="12"
                                  onChange={e => setLunPra1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={lunPra2}
                                  className="form-control short"
                                  placeholder="15"
                                  onChange={e => setLunPra2(e.target.value)}
                              />
                              <label className="label-margin">Cena </label>
                              <input
                                  type="number"
                                  value={lunCen1}
                                  className="form-control mt-1 short"
                                  placeholder="19"
                                  onChange={e => setLunCen1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={lunCen2}
                                  className="form-control mt-1 short"
                                  placeholder="21"
                                  onChange={e => setLunCen2(e.target.value)}
                              />
                          </div>
                          <div>
                              <h6>Martedì: </h6>
                              <label className="label-margin">Pranzo </label>
                              <input
                                  type="number"
                                  value={marPra1}
                                  className="form-control short"
                                  placeholder="12"
                                  onChange={e => setMarPra1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={marPra2}
                                  className="form-control short"
                                  placeholder="15"
                                  onChange={e => setMarPra2(e.target.value)}
                              />
                              <label className="label-margin">Cena </label>
                              <input
                                  type="number"
                                  value={marCen1}
                                  className="form-control mt-1 short"
                                  placeholder="19"
                                  onChange={e => setMarCen1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={marCen2}
                                  className="form-control mt-1 short"
                                  placeholder="21"
                                  onChange={e => setMarCen2(e.target.value)}
                              />
                          </div>
                          <div>
                              <h6>Mercoledì: </h6>
                              <label className="label-margin">Pranzo </label>
                              <input
                                  type="number"
                                  value={merPra1}
                                  className="form-control short"
                                  placeholder="12"
                                  onChange={e => setMerPra1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={merPra2}
                                  className="form-control short"
                                  placeholder="15"
                                  onChange={e => setMerPra2(e.target.value)}
                              />
                              <label className="label-margin">Cena </label>
                              <input
                                  type="number"
                                  value={merCen1}
                                  className="form-control mt-1 short"
                                  placeholder="19"
                                  onChange={e => setMerCen1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={merCen2}
                                  className="form-control mt-1 short"
                                  placeholder="21"
                                  onChange={e => setMerCen2(e.target.value)}
                              />
                          </div>
                          <div>
                              <h6>Giovedì: </h6>
                              <label className="label-margin">Pranzo </label>
                              <input
                                  type="number"
                                  value={gioPra1}
                                  className="form-control short"
                                  placeholder="12"
                                  onChange={e => setGioPra1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={gioPra2}
                                  className="form-control short"
                                  placeholder="15"
                                  onChange={e => setGioPra2(e.target.value)}
                              />
                              <label className="label-margin">Cena </label>
                              <input
                                  type="number"
                                  value={gioCen1}
                                  className="form-control mt-1 short"
                                  placeholder="19"
                                  onChange={e => setGioCen1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={gioCen2}
                                  className="form-control mt-1 short"
                                  placeholder="21"
                                  onChange={e => setGioCen2(e.target.value)}
                              />
                          </div>
                          <div>
                              <h6>Venerdì: </h6>
                              <label className="label-margin">Pranzo </label>
                              <input
                                  type="number"
                                  value={venPra1}
                                  className="form-control short"
                                  placeholder="12"
                                  onChange={e => setVenPra1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={venPra2}
                                  className="form-control short"
                                  placeholder="15"
                                  onChange={e => setVenPra2(e.target.value)}
                              />
                              <label className="label-margin">Cena </label>
                              <input
                                  type="number"
                                  value={venCen1}
                                  className="form-control mt-1 short"
                                  placeholder="19"
                                  onChange={e => setVenCen1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={venCen2}
                                  className="form-control mt-1 short"
                                  placeholder="21"
                                  onChange={e => setVenCen2(e.target.value)}
                              />
                          </div>
                          <div>
                              <h6>Sabato: </h6>
                              <label className="label-margin">Pranzo </label>
                              <input
                                  type="number"
                                  value={sabPra1}
                                  className="form-control short"
                                  placeholder="12"
                                  onChange={e => setSabPra1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={sabPra2}
                                  className="form-control short"
                                  placeholder="15"
                                  onChange={e => setSabPra2(e.target.value)}
                              />
                              <label className="label-margin">Cena </label>
                              <input
                                  type="number"
                                  value={sabCen1}
                                  className="form-control mt-1 short"
                                  placeholder="19"
                                  onChange={e => setSabCen1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={sabCen2}
                                  className="form-control mt-1 short"
                                  placeholder="21"
                                  onChange={e => setSabCen2(e.target.value)}
                              />
                          </div>
                          <div>
                              <h6>Domenica: </h6>
                              <label className="label-margin">Pranzo </label>
                              <input
                                  type="number"
                                  value={domPra1}
                                  className="form-control short"
                                  placeholder="12"
                                  onChange={e => setDomPra1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={domPra2}
                                  className="form-control short"
                                  placeholder="15"
                                  onChange={e => setDomPra2(e.target.value)}
                              />
                              <label className="label-margin">Cena </label>
                              <input
                                  type="number"
                                  value={domCen1}
                                  className="form-control mt-1 short"
                                  placeholder="19"
                                  onChange={e => setDomCen1(e.target.value)}
                              />
                              <label className="label-margin"> - </label>
                              <input
                                  type="number"
                                  value={domCen2}
                                  className="form-control mt-1 short"
                                  placeholder="21"
                                  onChange={e => setDomCen2(e.target.value)}
                              />
                          </div>
                      </div>
                  )}
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
                Invia
              </button>
            </div>
        </form>
        </div>
    )
}