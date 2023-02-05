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
    let token_ls = localStorage.getItem("access_token")

    useEffect(() => {

        setToken(token_ls)
        console.log("landingOrder")
        if (token_ls === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();

        }
    }, [])

    useEffect(()=>{
        if(user===null){
            return
        }
        redirect();
    }, [user])

    async function redirect(){
        console.debug("OI")
        let loc = window.location.pathname;
        console.log("location pathname");
        console.log(loc);
        let split = loc.split("/")
        console.log(split);
        let info = {
            "token": split[3]
        }
        let response = await payment(split[2], info, token_ls);
        navigate("/cronologiaordine", {state:{param: user.orders}});
    }

    async function getInfo() {
        let response = await getUserInfo(token_ls);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
        console.debug("OI")
    }

    return(<div>Attendere prego...</div>);
}