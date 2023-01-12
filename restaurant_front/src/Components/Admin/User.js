import React, {useState} from 'react';
import {Chapter, Panel, Button} from "@steffo/bluelib-react";
import Order from "../Orders/Order";
import {useAppContext} from "../../Context";
import schema from "../../config";
import Modal from "../Modal";
import UserEditor from "./UserEditor";

export default function User(props) {

    const [hidden, setHidden] = useState(false)
    const [expand, setExpand] = useState(false)
    const {address} = useAppContext();
    const {token} = useAppContext();
    const [data, setData] = useState({})

    async function getData(){
        let response = await fetch(schema + address + "/api/user/v1/"+props.user.id, {
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
                    {props.user.name} {props.user.surname} {props.user.kind==1 ? (<></>) : (<>(ADMIN)</>)}
                </div>
                    <Button style={{padding:"0px"}} onClick={event => {
                        setHidden(!hidden)
                    }}>
                        ...
                    </Button>
            </Chapter>
            {hidden ? (
                <Panel>
                    <p>
                        Email: {props.user.email}
                    </p>
                    <p>
                        UUID: {props.user.id}
                    </p>
                </Panel>
            ) : (<></>)}
        </Panel>
    );
}