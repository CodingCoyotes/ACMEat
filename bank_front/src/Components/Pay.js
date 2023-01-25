import React, {useEffect} from 'react';
import Style from "./Landing.module.css";
import {Heading, Panel,} from "@steffo/bluelib-react";
import {useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../Context";
import LoginForm from "./LoginForm";

export default function Pay() {
    const data = useParams()
    const {token} = useAppContext()

    useEffect(()=>{
        if(token!=null) {
            pay()
        }
    }, [token])

    async function pay(){
        console.debug("Pay!")
    }

    return (
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>Emissione di un pagamento a {data.uid} di {data.amount}€</Heading>
                <p className="text-muted">
                    In seguito al pagamento, verrai redirezionato automaticamente sulla piattaforma di provenienza.
                </p>

            </div>
            {token === null &&
                <Panel style={{minWidth: "unset"}}>
                    <LoginForm/>
                </Panel>
            }
            {token !== null &&
                <Panel>
                    Pagamento in corso, attendere prego...
                </Panel>
            }

        </div>
    );
}