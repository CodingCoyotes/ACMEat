import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import { getUserInfo } from '../Database/DBacmeat';
import '../css/DashUtente.css'
import { list_city } from '../Utils/Lists';

export default function DashUtente(){
    console.log("Sono in Dashboard");
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [city, setCity] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo()
        }
    }, [])

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json()
            setUser(values)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
    }

    return(
        <div className='container'>
        {user ? (
            <h2>Salve {user.name}.</h2>
        ) : (<div>...</div>)}
        <h2>Effettua subito un ordine!</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group mt-4">
                <label>Seleziona la tua città</label>
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
        </form>
    </div>
    );
}