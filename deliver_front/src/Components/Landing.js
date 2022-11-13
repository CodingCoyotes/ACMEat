import React from 'react';
import Style from "./Landing.module.css";
import {Heading, Panel,} from "@steffo/bluelib-react";

export default function Landing() {

    return(
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>ACMEDeliver</Heading>
                <p className="text-muted">
                    Il frontend flessibile per la gestione delle consegne.
                </p>

            </div>
            <Panel style={{minWidth: "unset"}}>
                Per accedere alla propria istanza, si prega di visitare l'indirizzo corretto. L'utente verrà
                immediatamente redirezionato verso la schermata di login appropriata.
            </Panel>
        </div>
    );
}