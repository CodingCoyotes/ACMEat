import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Landing from "./Landing/Landing";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import RestaurantRegistration from "./Restaurant/RestaurantRegistration";

export default function Routing(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/restaurantregistration" element={<RestaurantRegistration/>}/>
            </Routes>
        </Router>
    )
}

