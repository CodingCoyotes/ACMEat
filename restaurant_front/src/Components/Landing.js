import React, {useEffect} from 'react';
import Style from "./Landing.module.css";
import {Heading, Panel,} from "@steffo/bluelib-react";
import {useAppContext} from "../Context";
import {useNavigate} from "react-router-dom";

export default function Landing() {
    const {address, setAddress} = useAppContext()
    const navigator = useNavigate()

    useEffect( () => {

        if (localStorage.getItem("address") && address == null) {
            let address = localStorage.getItem("address")
            setAddress(address)
            navigator("/login")
        }
    })

    return(
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>ACMERestaurant</Heading>
                <p className="text-muted">
                    Il frontend flessibile per la gestione delle ordinazioni.
                </p>

            </div>
            <Panel style={{minWidth: "unset"}}>
                Per accedere alla propria istanza, si prega di visitare l'indirizzo corretto. L'utente verrà
                immediatamente redirezionato verso la schermata di login appropriata.
            </Panel>
        </div>
    );
}