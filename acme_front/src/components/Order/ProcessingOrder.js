import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getOrder, getRestaurant, getUserInfo} from "../Database/DBacmeat";
import '../css/Dash.css'
import ReactLoading from "react-loading";
import {makeStyles} from "@material-ui/core/styles";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
const address = process.env.REACT_APP_BANK_ADDRESS
const app_base_address = process.env.REACT_APP_FRONTEND_ADDRESS

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

//     created = 0
//     w_restaurant_ok = 1
//     w_deliverer_ok = 2
//     confirmed_by_thirds = 3
//     cancelled = 4
//     w_payment = 5
//     w_cancellation = 6
//     w_kitchen = 7
//     w_transport = 8
//     delivering = 9
//     delivered = 10

function getSteps() {
    return [
        'Ordine inviato',
        'Conferma ristorante',
        'Conferma fattorino',
        'Conferma da terzi',
        'Ordine cancellato',
        'Pagamento confermato',
        'Pagamento cancellato',
        'Preparazione ordine in atto',
        'Il tuo ordine è stato spedito',
        'In consegna',
        'Consegnato'];
}


export default function ProcessingOrder() {
    console.log("processing order")
    const navigate = useNavigate()
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [order, setOrder] = useState(null);
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const {state} = useLocation();
    let {param} = state;

    useEffect(() => {
        console.log("useeffect")
        if (token === null) {
            navigate("/")
        } else if (user === null) {
            getInfo();
            const interval = setInterval(() => pooling(), 5000)
            return () => {
                clearInterval(interval)
            }
        }
    }, [])

    async function getInfo() {
        console.log("get info");
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    async function getOrd() {
        console.log("get ord");
        console.log(param);
        let response = await getOrder(param, token);
        if (response.status === 200) {
            let values = await response.json();
            setOrder(values)
            console.log("value status")
            console.log(values.status);
            setActiveStep(values.status)
            setOrder(values);
            return values;
        }
        else return "0";
    }

    async function pooling() {
        console.log("pooling")
        const order = await getOrd();
        console.debug(order)
        if (order.status === 3) {
            window.location.href = address + (Math.round((order.restaurant_total + order.deliverer_total)*100)/100) + "/"+app_base_address+"_landingorder_" + order.id;
        }
        return;
    }


    return (
        <div className='container'>
            <div className="card">
                <h3 className="Auth-form-title">Informazioni sul tuo ordine</h3>
                <div className="form-group mt-3">
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <ReactLoading className="loading" type="spokes" color="#0000FF"
                                  height={100} width={50}/>
                </div>
            </div>
        </div>
    )
}