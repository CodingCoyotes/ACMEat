import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getOrder, getRestaurant, getUserInfo} from "../Database/DBacmeat";
import './OrderProgress'
import '../css/Dash.css'
import OrderProgress from "./OrderProgress";
import Loading from "../Utils/Loading";
import ReactLoading from "react-loading";



export default function ProcessingOrder(){
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [processState, setProcessState] =useState(0);
    const [order, setOrder] = useState(null);
    const {state} = useLocation();
    let {param} = state;

    useEffect(() => {
        console.log("processingorder")
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
        }
            pooling();
    }, [])

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    async function getOrd() {
        console.log("get ord")
        let response = await getOrder(param, token);
        if (response.status === 200) {
            let values = await response.json();
                console.log("value status")
                console.log(values.status);
                setProcessState(values.status);
                return values.status;
        }
        return 0;
    }

    async function pooling(){

        /*for(let i = 0; i < 10 ; i = i+1){
            setTimeout(() => {
                //getOrd();
                console.log("eccomi");

            }, 1000);
        }*/
    }


    return(
        <div className='container'>
            <div className="card" >
                <h3 className="Auth-form-title">Informazioni sul tuo ordine</h3>
                <div className="form-group mt-3">
                    <OrderProgress orderStatus= {processState}></OrderProgress>
                    <ReactLoading className="loading" type="spokes" color="#0000FF"
                                  height={100} width={50} />
                </div>
            </div>
        </div>
    )
}