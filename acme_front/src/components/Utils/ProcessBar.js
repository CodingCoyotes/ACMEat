import React, {useEffect, useState} from 'react';
import '../css/Dash.css'
import ReactLoading from "react-loading";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";

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
        'Ordine inviato', //0
        'Conferma ristorante', //1
        'Conferma fattorino', //2
        'Conferma da terzi', //3
        'Ordine cancellato', //4 non serve
        'Pagamento confermato',
        'Pagamento effettutato', //6
        'Presa in carico dell\'ordine',
        'Ordine spedito',
        'In consegna',
        'Consegnato'
    ];
}


export default function ProcessBar({activeStep}) {
    console.log("processing order")
    const steps = getSteps();

    useEffect(() => {
        console.log("processbar")
    }, [])


    return (
        <div className="form-group mt-3">
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
    )
}