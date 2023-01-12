import React, {useEffect, useState} from 'react';
import {Heading, Chapter, Box, Form, Button} from "@steffo/bluelib-react";
import schema from "../../config";
import {useAppContext} from "../../Context";
import User from "./User";
import Order from "../Orders/Order";
import Modal from "../Modal";
import UserEditor from "./UserEditor";

export default function AdminPanel() {
    const [users, setUsers] = useState([])
    const {address} = useAppContext()
    const {token} = useAppContext()
    const [id, setId] = useState("")
    const [result, setResult] = useState(null)
    const [addUser, setAddUser] = useState(false)
    const [reload, setReload] = useState(true)


    async function getUsers() {
        let response = await fetch(schema + address + "/api/user/v1/", {
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
            setUsers(values)
        }
    }

    async function search() {
        let response = await fetch(schema + address + "/api/delivery/v1/" + id, {
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
            setResult(values)
        }
        else{
            alert("Impossibile trovare la richiesta.")
        }
    }

    useEffect(() => {
        getUsers()
        setAddUser(false)
    }, [reload])

    return (
        <div style={{minWidth: "unset"}}>
            <Heading level={3}>Pannello amministrativo</Heading>
            <Form>
                <Form.Row>
                    <Form.Field onSimpleChange={e => setId(e)} value={id} required={true}
                                placeholder={"UUID"}>
                    </Form.Field>
                    <Button onClick={event => {
                        search()
                    }}>Cerca</Button>
                </Form.Row>
            </Form>
            {result ? (
                <div>
                    <Order delivery={result}/>
                    <Button onClick={event => {
                        setResult(null)
                    }}>Chiudi</Button>
                </div>
            ) : (
                <Chapter>
                    <Box>
                        <Heading level={4}>Utenti</Heading>
                        <Button onClick={e=>{setAddUser(true)}}>Nuovo utente</Button>
                        <Modal show={addUser} onClose={()=>{setAddUser(false)}}>
                            <UserEditor reload={reload} setReload={setReload}/>
                        </Modal>
                        {users.map(user => <User user={user} key={user.id}/>)}
                    </Box>
                </Chapter>
            )}
        </div>
    );
}