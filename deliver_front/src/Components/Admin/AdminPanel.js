import React from 'react';
import {Heading, Chapter, Panel} from "@steffo/bluelib-react";

export default function AdminPanel() {

    return(
        <div>
            <div style={{minWidth: "unset"}}>
                <Heading level={3}>Pannello amministrativo</Heading>
                <Chapter>
                    <Panel></Panel>
                    <Panel></Panel>
                </Chapter>
            </div>
        </div>
    );
}