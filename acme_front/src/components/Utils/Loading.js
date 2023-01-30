import React from "react";
import ReactLoading from "react-loading";


//https://www.geeksforgeeks.org/how-to-create-loading-screen-in-reactjs/

export default function Loading() {
    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Contatto la banca</h3>
                    <div className="form-group mt-3">
                        <ReactLoading className="loading" type="spokes" color="#0000FF"
                          height={100} width={50} />
                    </div>
                </div>
            </form>
        </div>
    );
}