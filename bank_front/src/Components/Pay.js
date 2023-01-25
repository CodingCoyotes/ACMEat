import React, {useEffect} from 'react';
import Style from "./Landing.module.css";
import {Heading, Panel,} from "@steffo/bluelib-react";
import {useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../Context";
import LoginForm from "./LoginForm";
import address from "../config";

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
        console.debug(data.redirect)

        const response = await fetch(address, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                action: '/paymentTo',
                xml: ` 
                <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <SOAP-ENV:Body>
                        <paymentTo>
                            <toUser xsi:type="xsd:string">${data.uid}</toUser>
                            <amount xsi:type="xsd:double">${data.amount}</amount>
                            <sid xsi:type="xsd:string">${token}</sid></paymentTo>
                    </SOAP-ENV:Body>
                </SOAP-ENV:Envelope>`})
        })
        let result = await response.json()
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(result.xml, "text/xml")
        let status = xmlDoc.getElementsByTagName("successfull")[0].innerHTML
        console.debug(status)
        if(status==="true"){
            let token = xmlDoc.getElementsByTagName("token")[0].innerHTML
            window.location.href = "http://"+data.redirect.replaceAll("_","/")+"/"+token
        }
        else{
            alert("Qualcosa è andato storto.")
        }
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