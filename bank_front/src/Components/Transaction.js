import React, {useEffect} from 'react';
import {Panel, Chapter} from "@steffo/bluelib-react";

export default function Transaction(props) {
    console.debug(props.transaction.transaction.src_usr)
    return (
        <Panel>
            <Chapter>
                <div>
                    Sorgente
                    {props.transaction.transaction.src_usr !== "" &&
                    <p>{props.transaction.transaction.src_usr}</p>
                    }
                    {props.transaction.transaction.src_usr === "" &&
                    <p>Esterno</p>
                    }
                </div>
                <div>
                    Quantità
                    <p>{props.transaction.transaction.amount}</p>
                </div>
                <div>
                    Destinazione
                    {props.transaction.transaction.dest_usr !== "" &&
                    <p>{props.transaction.transaction.dest_usr}</p>
                    }
                    {props.transaction.transaction.dest_usr === "" &&
                    <p>Esterno</p>
                    }
                </div>
            </Chapter>
            <Panel>
                <p>{props.transaction.transaction.type}</p>
                <p>{props.transaction.transaction.token}</p>
            </Panel>
        </Panel>
    );
}