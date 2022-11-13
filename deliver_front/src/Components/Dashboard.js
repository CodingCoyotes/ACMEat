import React, {useEffect, useState} from 'react';
import Style from "./Landing.module.css";
import {Button, Heading, Panel,} from "@steffo/bluelib-react";
import {useAppContext} from "../Context";
import {useNavigate} from "react-router-dom";
import schema from "../config";
import AdminPanel from "./Admin/AdminPanel";
import DeliveryPanel from "./Deliveries/DeliveryPanel";

export default function Dashboard() {
    const {address, setAddress} = useAppContext()
    const {token, setToken} = useAppContext()
    const navigator = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (address === null) {
            navigator("/")
            return
        }
        if (token === null) {
            navigator("/login")
            return
        }
        getUserData();
    }, [address, token])

    async function exit() {
        setToken(null);
    }

    async function getUserData() {
        let response = await fetch(schema + address + "/api/user/v1/me", {
            method: "GET",
            credentials: "include",
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

    return (
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>Dashboard</Heading>
                <p className="text-muted">
                    Salve {user ? (<>{user.name}</>) : (<>...</>)}
                </p>
                <Button children={"Logout"} onClick={e => exit()}></Button>
            </div>
            <Panel style={{minWidth: "unset"}}>
                {user ? (<>
                    {user.kind == 2 ? (
                        <AdminPanel/>) : (<DeliveryPanel deliveries = {user.deliveries}/>)}
                </>) : (<>Caricamento...</>)}
            </Panel>
        </div>
    );
}