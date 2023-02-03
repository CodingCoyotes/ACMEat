import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getOrder, getUserInfo, payment} from "../Database/DBacmeat";
import './OrderProgress'
import '../css/Dash.css'

export default function LandingOrder(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("landingOrder")
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            redirect();
        }
    }, [])

    async function redirect(){
        let loc = window.location.pathname;
        console.log("location pathname");
        console.log(loc);
        let split = loc.split("/")
        console.log(split);
        let info = {
            "bank_id": split[3]
        }
        let response = await payment(split[2], info, token);
        if (response.status === 200) {
            let values = await response.json();
            navigate("/cronologiaordine", {state:{param: values.orders}});
        }

    }

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    return(<div></div>);
}