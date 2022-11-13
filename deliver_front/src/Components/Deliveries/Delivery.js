import React, {useState} from 'react';
import {Heading, Chapter, Panel, Button} from "@steffo/bluelib-react";

export default function Delivery(props) {

    const [hidden, setHidden] = useState(false)

    return (
        <Panel>
            <Chapter>
                <div>
                    {props.delivery.id}
                </div>
                <div>
                    {props.delivery.delivery_time}
                </div>
                <div>
                    {props.delivery.status}
                </div>
                <div>
                    <Button onClick={event => {
                        setHidden(!hidden)
                    }}>
                        ...
                    </Button>
                </div>
            </Chapter>
            {hidden ? (
                <Panel>
                    Indirizzo consegna: {props.delivery.receiver}
                </Panel>
            ) : (<></>)}
        </Panel>
    );
}