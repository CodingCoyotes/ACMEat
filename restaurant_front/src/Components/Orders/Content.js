import React, {useEffect, useState} from 'react';
import {Box, Chapter, Panel, Button} from "@steffo/bluelib-react";
import schema from "../../config";
import {useAppContext} from "../../Context";

export default function Content(props) {

    return (
        <Chapter>
            <p>
                {props.content.menu.name}
            </p>
            <p>
                x{props.content.qty}
            </p>
        </Chapter>
    );
}