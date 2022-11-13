import React, {useState} from 'react';
import {Chapter, Panel, Button, Heading, Form} from "@steffo/bluelib-react";
import schema from "../../config";
import {useAppContext} from "../../Context";
import Delivery from "../Deliveries/Delivery";


export default function UserEditor(props) {

    const {address} = useAppContext();
    const {token} = useAppContext();
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function submit(){
        let response = await fetch(schema + address + "/api/user/v1/", {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token,
                'Access-Control-Allow-Origin': process.env.DOMAIN,

            },
            body: JSON.stringify({
                name: name,
                surname: surname,
                email: email,
                password: password
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
            <Heading level={3}>Aggiunta utente</Heading>
            <Form>
                <Form.Row>
                    <Form.Field onSimpleChange={e => setName(e)} value={name} required={true}
                                placeholder={"Nome"}>
                    </Form.Field>
                    <Form.Field onSimpleChange={e => setSurname(e)} value={surname} required={true}
                                placeholder={"Cognome"}>
                    </Form.Field>
                </Form.Row>
                <Form.Row>
                    <Form.Field onSimpleChange={e => setEmail(e)} value={email} required={true}
                                placeholder={"Email"}>
                    </Form.Field>
                    <Form.Field type="password" onSimpleChange={e => setPassword(e)} value={password}
                                required={true}
                                placeholder={"Password"} autoComplete={"Password"}>
                    </Form.Field>
                </Form.Row>
            </Form>
            <Chapter>
                <Button children={"Salva"} onClick={e => submit()}></Button>
            </Chapter>
        </div>
    );
}