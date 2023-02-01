import React from "react";
import "../css/ProgressBar.css"

export const ProgressBar = ({ min, max, value, title }) => {
    return (
        <div className="progressBarContainer ">
            <p>{title}</p>
            <input
                className="progressBar"
                type="range"
                min={min}
                max={max}
                value={value}
                // onChange={handleChange}
            />
        </div>
    );
};