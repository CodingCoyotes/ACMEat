import React, {useEffect} from 'react';
import Style from "./Landing.module.css";
import {Button, Heading, Panel,} from "@steffo/bluelib-react";
import {useAppContext} from "../Context";
import {useNavigate} from "react-router-dom";

export default function Dashboard() {
    const {address, setAddress} = useAppContext()
    const {token, setToken} = useAppContext()
    const navigator = useNavigate()

    useEffect(()=>{
        if(address===null){
            navigator("/")
        }
        if(token===null){
            navigator("/login")
        }
    }, [address, token])

    async function exit(){
        setToken(null);
    }

    return(
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>Dashboard</Heading>
                <p className="text-muted">
                    Salve ...
                </p>
                <Button children={"Logout"} onClick={e => exit()}></Button>
            </div>
            <Panel style={{minWidth: "unset"}}>
                Lorem ipsum dolor sit amet
            </Panel>
        </div>
    );
}