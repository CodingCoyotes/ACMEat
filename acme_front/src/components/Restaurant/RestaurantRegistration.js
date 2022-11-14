import React, {useEffect, useState} from 'react';
//import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
//import { roles } from "../Utils/Lists";
import { getUserInfo, registerNewRestaurant } from "../Database/DBacmeat";
import { list_city } from "../Utils/Lists";



 
export default function RestaurantRegistration() {
  console.log("Sono in RestaurantRegistration");
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [user, setUser] = useState(null);
  const {token, setToken} = useAppContext();
  const navigate = useNavigate()

  useEffect(() => {
      if (token === null) {
          navigate("/")
      }
      else if (user===null){
          getInfo()
      }
  }, [])

  async function getInfo() {
    console.debug(token)
    let response = await getUserInfo(token);
    if (response.status === 200) {
        let values = await response.json()
        
    }
}

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("Token: "+ token);

    const response = await registerNewRestaurant({
        "name": name,
        "address": address,
        "coords": {
            "latitude": 0,
            "longitude": 0
        },
        "open_times": [
            {
            "day": "string",
            "time": "string"
            }
        ],
        "closed": false,
        "city_id": city,
        "token": token
    });
    if (response.status === 200) {
        let values = await response.json()
      console.debug(values)
        navigate("/dashboard");
    }
  }

    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Registra il tuo ristorante</h3>
            <div className="form-group mt-3">
              <label>Nome</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Inserisci il nome dell'attività"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Indirizzo</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Inserisci la Via/piazza/"
                onChange={e => setAddress(e.target.value)}
              />
            </div>
            
            <div className="form-group mt-3">
                <label>Città</label>
                <select className="form-select" aria-label="Default select example" onChange={e => setCity(e.target.value)}>
                    {list_city.map((e, key) => {
                        return <option key={key} value={e.value}>{e.name}</option>;
                    })}
                </select>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Invia
              </button>
            </div>
          </div>
        </form>
      </div>
    )
}