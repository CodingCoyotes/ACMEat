import React from 'react';
import {Heading, Chapter, Panel} from "@steffo/bluelib-react";
import Order from "./Order";

export default function OrderPanel(props) {

    return(
        <div>
            <div style={{minWidth: "unset"}}>
                <Heading level={3}>Ordini</Heading>
                {props.deliveries.map(delivery => <Order delivery={delivery} key={delivery.id}/>)}
            </div>
        </div>
    );
}