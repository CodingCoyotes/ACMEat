import React from 'react';
import {Heading, Chapter, Panel} from "@steffo/bluelib-react";
import Delivery from "./Delivery";

export default function DeliveryPanel(props) {

    return(
        <div>
            <div style={{minWidth: "unset"}}>
                <Heading level={3}>Consegne assegnate</Heading>
                {props.deliveries.map(delivery => <Delivery delivery={delivery} key={delivery.id}/>)}
            </div>
        </div>
    );
}