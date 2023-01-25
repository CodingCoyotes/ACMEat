import {AppContext} from "./Context";
import {useState} from "react";
import Routing from "./Routing";
import {Bluelib} from "@steffo/bluelib-react";
import {LayoutThreeCol} from "@steffo/bluelib-react";
import Style from "./App.css"

function App() {
    const [token, setToken] = useState(null);
    return (
        <Bluelib theme={"amber"} backgroundColor={"#C8FFD4"} accentColor={"#FFC93C"} foregroundColor={"#3D5656"}>
            <LayoutThreeCol>
                <LayoutThreeCol.Center>
                    <div className="App">
                        <AppContext.Provider value={{token, setToken}}>
                            <Routing/>
                        </AppContext.Provider>
                    </div>
                </LayoutThreeCol.Center>
            </LayoutThreeCol>
        </Bluelib>
    );
}

export default App;
