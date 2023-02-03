import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "../css/ProgressBar.css"
import {useNavigate} from "react-router-dom";

//https://codesandbox.io/s/react-step-progress-ok1gy?file=/src/styles.css:0-785
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

export default function OrderProgress({orderStatus}) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("sono in order progress")
        console.log({orderStatus}.orderStatus)
        setActiveStep({orderStatus}.orderStatus);
    }, [])


    return (
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}

