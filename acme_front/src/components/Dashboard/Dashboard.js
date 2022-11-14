import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import { getUserInfo } from '../Database/DBacmeat';

export default function Dashboard() {
    console.log("Sono in Dashboard");
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
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

    const handleLogout = async e => {
        e.preventDefault();
        console.log("handleLogout");
        setToken(null)
        navigate("/")
    }

    return (
        <div>
            <nav className='navbar navbar-expand-lg navbar-light bg-light justify-content-between'>
                <h2>ACMEat</h2>
                <button type='button' className='btn btn-secondary' onClick={handleLogout}>Logout</button>
            </nav>
            {user ? (
                <h2>Salve {user.name}.</h2>
            ) : (<div>...</div>)}
            <button type="button" className="btn btn-secondary" onClick={event => {navigate("/restaurantregistration")}}>
                Crea un ristorante
            </button>
        </div>
    );
}