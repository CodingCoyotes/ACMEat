import React, {useEffect, useState} from 'react';
import Style from "./Landing.module.css";
import {Heading, Panel, Chapter, Form, Button} from "@steffo/bluelib-react";
import {useAppContext} from "../Context";
import {useNavigate} from "react-router-dom";
import address from "../config";
import Transaction from "./Transaction";

export default function Dashboard() {
    const navigator = useNavigate()
    const {token} = useAppContext()
    const [transactions, setTransactions] = useState([])
    const [deposit, setDeposit] = useState(0)
    const [withdraw, setWithdraw] = useState(0)
    useEffect(() => {
        if (token === null) {
            navigator("/")
        } else {
            report()
        }
    }, [token])

    async function report() {
        const response = await fetch(address, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                action: '/report',
                xml: ` 
                <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <SOAP-ENV:Body>
                                <report>
                                    <sid xsi:type="xsd:string">${token}</sid>
                                </report>
                    </SOAP-ENV:Body>
                </SOAP-ENV:Envelope>`
            })
        })
        let result = await response.json()
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(result.xml, "text/xml")
        let message_element = xmlDoc.getElementsByTagName("report")
        let list = []
        console.debug(message_element)
        for(let i = 0; i<message_element.length; i++){
            let elem = message_element.item(i)
            let amount = elem.getElementsByTagName("amount").item(0).innerHTML
            let src_usr = elem.getElementsByTagName("source_user").item(0).innerHTML
            let dest_usr = elem.getElementsByTagName("dest_user").item(0).innerHTML
            let type = elem.getElementsByTagName("type").item(0).innerHTML
            let token = elem.getElementsByTagName("token").item(0).innerHTML
            list.push({amount: amount, src_usr:src_usr, dest_usr:dest_usr, type:type, token:token})
        }

        setTransactions(list)
    }

    async function deposit_f(){
        const response = await fetch(address, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                action: '/deposit',
                xml: ` 
                <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <SOAP-ENV:Body>
                                <deposit>
                                    <amount xsi:type="xsd:int">${deposit}</amount>
                                    <sid xsi:type="xsd:string">${token}</sid>
                                </deposit>
                    </SOAP-ENV:Body>
                </SOAP-ENV:Envelope>`
            })
        })
        let result = await response.json()
        console.debug(result)
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(result.xml, "text/xml")
        let message_element = xmlDoc.getElementsByTagName("depositResponse")
        if(message_element === null || message_element.length === 0){
            alert("L'operazione non è andata a buon fine.")
        }
        else{
            report()
        }
    }

    async function withdraw_f(){
        const response = await fetch(address, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                action: '/withdraw',
                xml: ` 
                <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <SOAP-ENV:Body>
                                <withdraw>
                                    <amount xsi:type="xsd:int">${withdraw}</amount>
                                    <sid xsi:type="xsd:string">${token}</sid>
                                </withdraw>
                    </SOAP-ENV:Body>
                </SOAP-ENV:Envelope>`
            })
        })
        let result = await response.json()
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(result.xml, "text/xml")
        let message_element = xmlDoc.getElementsByTagName("withdrawResponse")
        if(message_element === null || message_element.length === 0){
            alert("L'operazione non è andata a buon fine.")
        }
        else{
            report()
        }
    }

    return (
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>Benvenuto nel tuo home banking.</Heading>
                <p className="text-muted">
                    Puoi visualizzare i tuoi movimenti oppure ricaricare il tuo conto.
                </p>
                <Chapter>
                    <Panel>
                        <Heading level={2}>Movimenti</Heading>
                        <div>{transactions.map(transaction =>
                            <Transaction transaction={{transaction}}/>
                        )}</div>
                    </Panel>
                    <Panel>
                        <Heading level={2}>Versamento</Heading>
                        <Form>
                            <Form.Row>
                                <Form.Field onSimpleChange={e => setDeposit(e)} value={deposit} required={true}
                                            placeholder={"0"}>
                                </Form.Field>
                            </Form.Row>
                        </Form>
                        <Chapter>
                            <Button children={"Versa"} onClick={e => deposit_f()}/>
                        </Chapter>
                        <Heading level={2}>Prelievo</Heading>
                        <Form>
                            <Form.Row>
                                <Form.Field onSimpleChange={e => setWithdraw(e)} value={withdraw} required={true}
                                            placeholder={"0"}>
                                </Form.Field>
                            </Form.Row>
                        </Form>
                        <Chapter>
                            <Button children={"Preleva"} onClick={e => withdraw_f()}/>
                        </Chapter>
                    </Panel>
                </Chapter>
            </div>
        </div>
    );
}