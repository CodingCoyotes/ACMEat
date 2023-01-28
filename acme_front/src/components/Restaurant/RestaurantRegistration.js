import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
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
import { format } from "date-fns";


export default function RestaurantRegistration() {
    const [user, setUser] = useState(null);
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [address, setAddress] = useState();
    const [cityId, setCityId] = useState();
    const [cityList, setCityList] = useState([]);
    const [lunTime, setLunTime] = React.useState(new Date());
    const [marTime, setMarTime] = React.useState(new Date());
    const [merTime, setMerTime] = React.useState(new Date());
    const [gioTime, setGioTime] = React.useState(new Date());
    const [venTime, setVenTime] = React.useState(new Date());
    const [sabTime, setSabTime] = React.useState(new Date());
    const [domTime, setDomTime] = React.useState(new Date());
    const [aperturaBool, setAperturaBool] = useState(true);

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
        if (localStorage.getItem("id_restaurant")) {
            let restId = localStorage.getItem("id_restaurant")
            //setRestaurantId(restId)
            console.log("getrestid")
            console.log(restId)
            //console.log(restaurantId)
            getRest(restId)
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
        setName(restaurant.name);
        setAddress(restaurant.address);
        setAperturaBool(restaurant.closed);
        let orario = restaurant.open_times;
        let day = "";
        let time = "";
        for (let i = 0; i < orario.length; i = i+1){
            day = orario[i].day;
            time = orario[i].time;
            switch(day){
                case "lunedi":
                    setLunTime(Date.parse(time.toString()))
                    break;
                case "martedi":
                    setMarTime(Date.parse(time.toString()));
                    break;
                case "mercoledi":
                    setMerTime(Date.parse(time.toString()));
                    break;
                case "giovedi":
                    setGioTime(Date.parse(time.toString()));
                    break;
                case "venerdi":
                    setVenTime(Date.parse(time.toString()));
                    break;
                case "sabato":
                    setSabTime(Date.parse(time.toString()));
                    break;
                case "domenica":
                    setDomTime(Date.parse(time.toString()));
                    break;
            }
        }
        setCityId(restaurant.city_id);
    }

    async function getCity(){
        let resp = await getCities();
        if (resp.status === 200) {
            let values = await resp.json();
            setCityList(values);
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

    const handleLunTime = (newValue) => {
        //let time = newValue.toLocaleTimeString();
        setLunTime(newValue);
    };
    const handleMarTime = (newValue) => {
        setMarTime(newValue);
    };
    const handleMerTime = (newValue) => {
        setMerTime(newValue);
    };
    const handleGioTime = (newValue) => {
        setGioTime(newValue);
    };
    const handleVenTime = (newValue) => {
        setVenTime(newValue);
    };
    const handleSabTime = (newValue) => {
        setSabTime(newValue);
    };
    const handleDomTime = (newValue) => {
        setDomTime(newValue);
    };

    const handleSubmit = async e => {
    e.preventDefault();
        if(localStorage.getItem("id_restaurant")) {
            let restId = localStorage.getItem("id_restaurant")
            await modRest(restId);
        }
        else {
            await newRest();
        }
    }

    async function newRest(){
        const response = await registerNewRestaurant(token,{

            "name": name,
            "address": address,
            "coords": {
                "latitude": 0,
                "longitude": 0
            },
            "open_times": [
                {
                    "day": "lunedi",
                    "time": lunTime
                },
                {
                    "day": "martedi",
                    "time": marTime
                },
                {
                    "day": "mercoledi",
                    "time": merTime
                },
                {
                    "day": "giovedi",
                    "time": gioTime
                },
                {
                    "day": "venerdi",
                    "time": venTime
                },
                {
                    "day": "sabato",
                    "time": sabTime
                },
                {
                    "day": "domenica",
                    "time": domTime
                }
            ],
            "closed": aperturaBool,
            "city_id": cityId,
            "owner_id": user

        });
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
            "coords": {
                "latitude": 0,
                "longitude": 0
            },
            "open_times": [
                {
                    "day": "lunedi",
                    "time": lunTime
                },
                {
                    "day": "martedi",
                    "time": marTime
                },
                {
                    "day": "mercoledi",
                    "time": merTime
                },
                {
                    "day": "giovedi",
                    "time": gioTime
                },
                {
                    "day": "venerdi",
                    "time": venTime
                },
                {
                    "day": "sabato",
                    "time": sabTime
                },
                {
                    "day": "domenica",
                    "time": domTime
                }
            ],
            "closed": aperturaBool,
            "city_id": cityId,
            "owner_id": user,
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
            <h3 className="Auth-form-title">{(name === "")? (<div>Registra il tuo ristorante</div>): (<div>Modifica il ristorante {name}</div>)}</h3>
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
                placeholder="Inserisci la Via/piazza/"
                onChange={e => setAddress(e.target.value)}
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
              <div className="form-group mt-3">
                  <h5>Seleziona orari apertura</h5>
                  <div>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={1}>
                              <TimePicker
                                  label="Lunedì"
                                  value={lunTime}
                                  onChange={e => handleLunTime(e)}
                                  renderInput={(params) => <TextField {...params} />}
                              />
                              <TimePicker
                                  label="Martedì"
                                  value={marTime}
                                  onChange={e => handleMarTime(e)}
                                  renderInput={(params) => <TextField {...params} />}
                              />
                              <TimePicker
                                  label="Mercoledì"
                                  value={merTime}
                                  onChange={e => handleMerTime(e)}
                                  renderInput={(params) => <TextField {...params} />}
                              />
                              <TimePicker
                                  label="Giovedì"
                                  value={gioTime}
                                  onChange={e => handleGioTime(e)}
                                  renderInput={(params) => <TextField {...params} />}
                              />
                              <TimePicker
                                  label="Venerdì"
                                  value={venTime}
                                  onChange={e => handleVenTime(e)}
                                  renderInput={(params) => <TextField {...params} />}
                              />
                              <TimePicker
                                  label="Sabato"
                                  value={sabTime}
                                  onChange={e => handleSabTime(e)}
                                  renderInput={(params) => <TextField {...params} />}
                              />
                              <TimePicker
                                  label="Domenica"
                                  value={domTime}
                                  onChange={e => handleDomTime(e)}
                                  renderInput={(params) => <TextField {...params} />}
                              />
                          </Stack>
                      </LocalizationProvider>
                  </div>
              </div>
            <div className="form-group mt-3">
                <h5>Città</h5>
                <select className="form-select" aria-label="Default select example" value={cityId} onChange={e => setCityId(e.target.value)}>
                    {cityList.map((e, key) => {
                        return <option key={key} value={e.id}>{e.name}</option>;
                    })}
                </select>
                <button type="button" className="btn btn-secondary bi bi-plus" onClick={event => {navigate("/cityregistration")}}>
                   + Agg. Città
                </button>
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