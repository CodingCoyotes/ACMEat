import React, {useEffect, useState} from 'react';
import {Heading, Chapter, Box, Form, Button} from "@steffo/bluelib-react";
import schema from "../../config";
import {useAppContext} from "../../Context";
import Client from "./Client";
import User from "./User";
import Delivery from "../Deliveries/Delivery";
import Modal from "../Modal";
import UserEditor from "./UserEditor";
import ClientEditor from "./ClientEditor";

export default function AdminPanel() {
    const [users, setUsers] = useState([])
    const [clients, setClients] = useState([])
    const {address} = useAppContext()
    const {token} = useAppContext()
    const [id, setId] = useState("")
    const [result, setResult] = useState(null)
    const [addUser, setAddUser] = useState(false)
    const [addCliente, setAddCliente] = useState(false)
    const [reload, setReload] = useState(true)

    async function getClients() {
        let response = await fetch(schema + address + "/api/client/v1/", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token,
            },
        });
        if (response.status === 200) {
            let values = await response.json()
            setClients(values)
        }
    }

    async function getUsers() {
        let response = await fetch(schema + address + "/api/user/v1/", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token,
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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token,
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
        getClients()
        getUsers()
        setAddUser(false)
        setAddCliente(false)
    }, [reload])

    return (
        <div style={{minWidth: "unset"}}>
            <Heading level={3}>Pannello amministrativo</Heading>
            {result ? (
                <div>
                    <Delivery delivery={result}/>
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
                    <Box>
                        <Heading level={4}>Clienti</Heading>
                        <Button onClick={e=>{setAddCliente(true)}}>Nuovo cliente</Button>
                        <Modal show={addCliente} onClose={()=>{setAddCliente(false)}}>
                            <ClientEditor reload={reload} setReload={setReload}/>
                        </Modal>
                        {clients.map(client => <Client client={client} key={client.id}/>)}
                    </Box>
                </Chapter>
            )}
        </div>
    );
}