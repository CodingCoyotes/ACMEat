import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Landing from "./Components/Landing";
import Pay from "./Components/Pay";
import Dashboard from "./Components/Dashboard";

export default function Routing(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/pay/:uid/:amount/:redirect" element={<Pay/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </Router>
    )
}