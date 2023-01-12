import React, {useEffect, useState} from 'react';
import {Box, Chapter, Panel, Button} from "@steffo/bluelib-react";

export default function Order(props) {

    const [hidden, setHidden] = useState(false)
    const [date, setDate] = useState(null)
    const [status, setStatus] = useState("???")

    useEffect((e)=>{
        let d = new Date(props.delivery.delivery_time)
        setDate(`${d.getDate()}/${d.getMonth()+1}/${d.getUTCFullYear()} - ${d.getHours()}:${d.getMinutes()}`)
        console.debug(props.delivery)
        switch (props.delivery.status){
            case 1:
                setStatus("In attesa")
                break;
            case 2:
                setStatus("In lavorazione")
                break;
            case 3:
                setStatus("Consegnata")
                break;
            case 4:
                setStatus("Pagata")
                break;
            default:
                setStatus("???")
        }
    }, [props.delivery])

    return (
        <Box>
            <Chapter>

                <div>
                    {date}
                </div>
                <div>
                    {status}
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
                    <p>
                        Indirizzo consegna: {props.delivery.receiver}
                    </p>
                    <p>
                        Indirizzo mittente: {props.delivery.source}
                    </p>
                    <p>
                        ID: {props.delivery.id}
                    </p>
                </Panel>
            ) : (<></>)}
        </Box>
    );
}