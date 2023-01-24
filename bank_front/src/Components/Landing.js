import React, {useEffect} from 'react';
import Style from "./Landing.module.css";
import {Heading, Panel,} from "@steffo/bluelib-react";
import {useAppContext} from "../Context";
import {useNavigate} from "react-router-dom";

export default function Landing() {
    const navigator = useNavigate()

    return(
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>ACMEBank</Heading>
                <p className="text-muted">
                    La banca che rispecchia le tue esigenze.
                </p>

            </div>
            <Panel style={{minWidth: "unset"}}>
                Crea un account oggi stesso!
            </Panel>
        </div>
    );
}