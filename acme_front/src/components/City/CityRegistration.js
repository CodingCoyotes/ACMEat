import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getUserInfo, registerNewCity} from "../Database/DBacmeat";


export default function CityRegistration() {
  console.log("Sono in CityRegistration");
  const [country, setCountry] = useState();
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
        setUser(values)
    }
}

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("Token: "+ token);

    const response = await registerNewCity(token,{
        "nation": country,
        "name": city,
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
            <h3 className="Auth-form-title">Aggiungi una città</h3>
            <div className="form-group mt-3">
              <label>Stato</label>
              <input
                type="text"
                className="form-control mt-1"
                onChange={e => setCountry(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Città</label>
              <input
                type="text"
                className="form-control mt-1"
                onChange={e => setCity(e.target.value)}
              />
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