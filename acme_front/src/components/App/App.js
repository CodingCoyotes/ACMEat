import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import Routing from "../Routes";
import {AppContext} from "../../Context";
import {useState} from "react";

export function App() {
    console.log("Sono in app");
    const [token, setToken] = useState(null);


    return (
        <AppContext.Provider value={{token, setToken}}>
            <Routing/>
        </AppContext.Provider>
    )
}

export default App