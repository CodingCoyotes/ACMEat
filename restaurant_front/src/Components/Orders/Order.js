import React, {useEffect, useState} from 'react';
import {Box, Chapter, Panel, Button} from "@steffo/bluelib-react";
import schema from "../../config";
import {useAppContext} from "../../Context";
import Content from "./Content";

export default function Order(props) {

    const [hidden, setHidden] = useState(false)
    const [creationDate, setCreationDate] = useState(null)
    const [deliveryDate, setDeliveryDate] = useState(null)
    const [status, setStatus] = useState("???")
    const [details, setDetails] = useState(null)
    const {address, token} = useAppContext()

    useEffect((e) => {
        let d = new Date(props.order.date_order)
        setCreationDate(`${d.getDate()}/${d.getMonth() + 1}/${d.getUTCFullYear()} - ${d.getHours()}:${d.getMinutes()}`)
        d = new Date(props.order.delivery_time)
        setDeliveryDate(`${d.getDate()}/${d.getMonth() + 1}/${d.getUTCFullYear()} - ${d.getHours()}:${d.getMinutes()}`)
        switch (props.order.status) {
            case 1:
                setStatus("In attesa di conferma (locale)")
                break;
            case 2:
                setStatus("In attesa di conferma (corriere)")
                break;
            case 3:
                setStatus("Creazione ordine confermata")
                break;
            case 4:
                setStatus("Annullato")
                break;
            case 5:
                setStatus("In attesa di pagamento")
                break;
            case 6:
                setStatus("Pagato, in attesa dell'attivazione")
            case 7:
                setStatus("In preparazione")
                break;
            case 8:
                setStatus("In attesa del corriere")
                break;
            case 9:
                setStatus("In consegna")
                break;
            case 10:
                setStatus("Consegnato.")
                break;
            default:
                setStatus("???")
        }
    }, [props.order, details])

    async function getDetails(){
        const response = await fetch(schema + address + "/api/orders/v1/"+props.order.id, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Access-Control-Allow-Origin': process.env.DOMAIN,
                'Authorization': "Bearer " + token,
            }
        });
        if (response.status === 200) {
            let values = await response.json()
            setDetails(values)
            console.debug(values)
        }
        else{
            alert("Si è verificato un errore durante il caricamento dei dati.")
        }
    }

    async function updateStatus(status){

        const response = await fetch(schema + address + "/api/orders/v1/"+props.order.id, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.DOMAIN,
                'Authorization': "Bearer " + token,
            },
            body: JSON.stringify({
                date_order: props.order.date_order,
                delivery_time: props.order.delivery_time,
                restaurant_total: props.order.restaurant_total,
                deliverer_total: props.order.deliverer_total,
                status: status,
            })
        });
        if (response.status === 200) {
            let values = await response.json()
            setDetails(values)
            console.debug(values)
        }
    }

    return (
        <Box>
            <Chapter>
                ID: {props.order.id}
                <div>
                    {creationDate}
                </div>
                <div>
                    {status}
                </div>
                {props.order.status === 1 &&
                    <div style={{"display":"flex"}} >
                    <Button bluelibClassNames={"color-lime"} style={{padding: "0px"}} onClick={event => {updateStatus(2)}}>
                        Accetta
                    </Button>
                    <Button bluelibClassNames={"color-red"} style={{padding: "0px"}} onClick={event => {updateStatus(4)}}>
                        Declina
                    </Button>
                    </div>
                }
                {props.order.status === 7 &&
                <div style={{"display":"flex"}}>
                    <Button bluelibClassNames={"color-lime"} style={{padding: "0px"}} onClick={event => {updateStatus(8)}}>
                        Pronto
                    </Button>
                </div>
                }
                {props.order.status === 8 &&
                <div style={{"display":"flex"}}>
                    <Button bluelibClassNames={"color-lime"} style={{padding: "0px"}} onClick={event => {updateStatus(9)}}>
                        Consegnato
                    </Button>
                </div>
                }
                <div>
                    <Button style={{padding: "0px"}} onClick={event => {
                        setHidden(!hidden); getDetails()
                    }}>
                        ...
                    </Button>
                </div>
            </Chapter>
            {hidden ? (
                <Panel>
                    <p>
                        Ora creazione ordine: {creationDate}
                    </p>
                    <p>
                        Ora consegna ordine: {deliveryDate}
                    </p>
                    <p>
                        Valore ordinazione: {props.order.restaurant_total} €
                    </p>
                    {details ? (
                        <div>
                            <p>
                                Società di consegna: {details.deliverer ? (<>{details.deliverer.name}</>):(<>Non ancora selezionata</>)}
                            </p>
                            {details.contents ? (
                            <Panel>
                                    {details.contents.map(content => <Content content={content} key={props.order.id+content.menu_id}/>)}
                            </Panel> ):(<p></p>)}
                        </div>
                    ) : (<p>Caricamento dettagli...</p>)}
                </Panel>
            ) : (<></>)}
        </Box>
    );
}