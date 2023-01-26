import React, {useState} from 'react';
import {Chapter, Panel, Button, Heading, Form} from "@steffo/bluelib-react";
import schema from "../../config";
import {useAppContext} from "../../Context";
import Delivery from "../Deliveries/Delivery";


export default function ClientEditor(props) {

    const {address} = useAppContext();
    const {token} = useAppContext();
    const [name, setName] = useState("")
    const [apiUrl, setApiUrl] = useState("")
    const [apiKey, setApiKey] = useState("")

    async function submit(){
        let response = await fetch(schema + address + "/api/client/v1/", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token,
            },
            body: JSON.stringify({
                name: name,
                api_url: apiUrl,
                remote_api_key: apiKey
            })
        });
        if (response.status === 200) {
            let values = await response.json()
            props.setReload(!props.reload)
        }
        else{
            alert("Qualcosa è andato storto.")
        }
    }


    return (
        <div>
            <Heading level={3}>Aggiunta cliente</Heading>
            <Form>
                <Form.Row>
                    <Form.Field onSimpleChange={e => setName(e)} value={name} required={true}
                                placeholder={"Nome"}>
                    </Form.Field>
                    <Form.Field onSimpleChange={e => setApiUrl(e)} value={apiUrl} required={true}
                                placeholder={"Url API"}>
                    </Form.Field>
                    <Form.Field onSimpleChange={e => setApiKey(e)} value={apiKey} required={true}
                                placeholder={"Key API"}>
                    </Form.Field>
                </Form.Row>
            </Form>
            <Chapter>
                <Button children={"Salva"} onClick={e => submit()}></Button>
            </Chapter>
        </div>
    );
}