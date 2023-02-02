import React, {useEffect, useState} from 'react';
import Style from "./Landing.module.css";
import {Button, Heading, Chapter,} from "@steffo/bluelib-react";
import {useAppContext} from "../Context";
import {useNavigate} from "react-router-dom";
import schema from "../config";
import AdminPanel from "./Admin/AdminPanel";
import OrderPanel from "./Orders/OrderPanel";

export default function Dashboard() {
    const {address} = useAppContext()
    const {token, setToken} = useAppContext()
    const navigator = useNavigate()
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        if (address === null) {
            navigator("/")
            return
        }
        if (token === null) {
            //navigator("/login")
            return
        }
        getUserData();
    }, [address, token])

    useEffect(()=>{
        getOrders()
        const interval = setInterval(()=>getOrders(), 10000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    async function exit() {
        setToken(null);
    }

    async function getUserData() {
        let response = await fetch(schema + address + "/api/user/v1/me", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token,
                'Access-Control-Allow-Origin': process.env.DOMAIN
            },
        });
        if (response.status === 200) {
            let values = await response.json()
            setUser(values)
        }
    }

    async function getOrders(){
        console.debug("Getting latest orders...")
        let response = await fetch(schema + address + "/api/orders/v1/", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token,
                'Access-Control-Allow-Origin': process.env.DOMAIN
            },
        });
        if (response.status === 200) {
            let values = await response.json()
            setOrders(values)
        }
    }

    return (
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>Dashboard</Heading>
                <Chapter>
                <p className="text-muted">
                    Salve {user ? (<>{user.name}</>) : (<>...</>)}
                </p>
                <Button children={"Logout"} onClick={e => exit()}/>
                </Chapter>
            </div>
            {user ? (<>
                {user.kind === 2 ? (
                    <div><AdminPanel/><OrderPanel orders={orders}/></div>) : (<div><OrderPanel orders={orders}/></div>)}
            </>) : (<>Caricamento...</>)}
        </div>
    );
}