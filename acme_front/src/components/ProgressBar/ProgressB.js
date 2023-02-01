import React from "react";
import StepProgressBar from "react-step-progress";
import "react-step-progress/dist/index.css";
import "../css/ProgressBar.css"

/*created = 0
w_restaurant_ok = 1
w_deliverer_ok = 2
confirmed_by_thirds = 3
cancelled = 4
w_payment = 5
w_cancellation = 6
w_kitchen = 7
w_transport = 8
delivering = 9
delivered = 10*/

export const ProgressB = () => {
    const step1Content = <h1>Step 1 Content</h1>;
    const step2Content = <h1>Step 2 Content</h1>;
    const step3Content = <h1>Step 3 Content</h1>;
    const step4Content = <h1>Step 4 Content</h1>;
    function step2Validator() {
        // return a boolean
    }

    function step3Validator() {
        // return a boolean
    }

    function onFormSubmit() {
        // handle the submit logic here
        // This function will be executed at the last step
        // when the submit button (next button in the previous steps) is pressed
    }

    return (
        <StepProgressBar
            startingStep={0}
            onSubmit={onFormSubmit}
            steps={[
                {
                    label: "Step 1",
                    name: "step 1",
                    content: step1Content
                },
                {
                    label: "Step 2",
                    name: "step 2",
                    content: step2Content,
                    validator: step2Validator
                },
                {
                    label: "Step 3",
                    name: "step 3",
                    content: step3Content,
                    validator: step3Validator
                },
                {
                    label: "Step 4",
                    name: "Step 4",
                    content: step4Content,
                    validator: step3Validator
                }
            ]}
        />
    );
};
