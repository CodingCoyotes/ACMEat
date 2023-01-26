import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import DashRistorante from "./Dashboard/DashRistorante";
import DashUtente from "./Dashboard/DashUtente";
import Landing from "./Landing/Landing";
import Login from "./Login/Login";
import RestaurantRegistration from "./Restaurant/RestaurantRegistration";
import CityRegistration from "./City/CityRegistration";

export default function Routing(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/dashutente" element={<DashUtente/>}/>
                <Route path="/dashristorante" element={<DashRistorante/>}/>
                <Route path="/restaurantregistration" element={<RestaurantRegistration/>}/>
                <Route path="/cityregistration" element={<CityRegistration/>}/>
            </Routes>
        </Router>
    )
}

