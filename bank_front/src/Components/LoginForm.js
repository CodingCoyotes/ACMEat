import {Heading, Panel, Box, Button, Form, Chapter} from "@steffo/bluelib-react";
import {useParams} from "react-router-dom";
import {useAppContext} from "../Context";
import {useState} from "react";
import address from "../config";


export default function LoginForm() {
    const data = useParams()
    const {token, setToken} = useAppContext()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    async function login(){
        console.debug(address)
        const response = await fetch(address, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                action: '/login',
                xml: ` 
                <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <SOAP-ENV:Body>
                                <login>
                                    <password xsi:type="xsd:string">${password}</password>
                                    <username xsi:type="xsd:string">${username}</username>
                                </login>
                    </SOAP-ENV:Body>
                </SOAP-ENV:Envelope>`})
        })
        let result = await response.json()
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(result.xml, "text/xml")
        let sid_element = xmlDoc.getElementsByTagName("sid")
        setToken(sid_element.item(0).innerHTML)
    }

    return (
        <Box>
            <Form>
                <Form.Row>
                    <Form.Field onSimpleChange={e => setUsername(e)} value={username} required={true}
                                placeholder={"username"}>
                    </Form.Field>
                    <Form.Field onSimpleChange={e => setPassword(e)} value={password} type="password" required={true}
                                placeholder={"password"}>
                    </Form.Field>
                </Form.Row>
            </Form>
            <Chapter>
                <Button children={"Accedi"} onClick={e => login()}></Button>
            </Chapter>
        </Box>
    );
}