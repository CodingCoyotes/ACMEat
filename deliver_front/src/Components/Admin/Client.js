import React, {useState} from 'react';
import {Chapter, Panel, Button, Anchor} from "@steffo/bluelib-react";
import {Accordion} from "react-bootstrap";
import schema from "../../config";
import {useAppContext} from "../../Context";
import Delivery from "../Deliveries/Delivery";


export default function Client(props) {

    const [hidden, setHidden] = useState(false)
    const [expand, setExpand] = useState(false)
    const {address} = useAppContext();
    const {token} = useAppContext();
    const [data, setData] = useState({})

    async function getData(){
        let response = await fetch(schema + address + "/api/client/v1/"+props.client.id, {
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
            setData(values)
        }
    }


    return (
        <Panel>
            <Chapter>
                <div>
                    {props.client.name}
                </div>
                <div>
                    <Button style={{padding:"0px"}} onClick={event => {
                        setHidden(!hidden)
                    }}>
                        ...
                    </Button>
                </div>
            </Chapter>
            {hidden ? (
                <Panel>
                    <p>UUID: {props.client.id}</p>
                    {expand ? (
                        <>
                            {data ? (
                                <div>
                                    <p>
                                    Api Key: {data.api_key}
                                    </p>
                                    <div>
                                        {data.deliveries.map(delivery => <Delivery delivery={delivery} key={delivery.id}/>)}
                                    </div>
                                </div>
                            ) : (<>...</>)}
                            <Button style={{padding:"0px"}} onClick={event => {setExpand(!expand)}}>Chiudi</Button>
                        </>
                    ) : (<Button style={{padding:"0px"}} onClick={event => {getData().then(r => setExpand(!expand))}}>Altri dettagli</Button>)}

                </Panel>
            ) : (<></>)}
        </Panel>
    );
}