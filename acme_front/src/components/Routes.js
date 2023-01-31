import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import DashRistorante from "./Dashboard/DashRistorante";
import DashUtente from "./Dashboard/DashUtente";
import Landing from "./Landing/Landing";
import Login from "./Login/Login";
import RestaurantRegistration from "./Restaurant/RestaurantRegistration";
import CityRegistration from "./City/CityRegistration";
import DashMenu from "./Menu/DashMenu";
import MenuRegistration from "./Menu/MenuRegistration";
import RestaurantListCity from "./Restaurant/RestaurantListCity";
import DashOrder from "./Order/DashOrder";
import RecapOrder from "./Order/RecapOrder";
import Loading from "./Utils/Loading";

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
                <Route path="/dashmenu" element={<DashMenu/>}/>
                <Route path="/menuregistration" element={<MenuRegistration/>}/>
                <Route path="/restaurantlistcity" element={<RestaurantListCity/>}/>
                <Route path="/dashorder" element={<DashOrder/>}/>
                <Route path="/recaporder" element={<RecapOrder/>}/>
                <Route path="/loading" element={<Loading/>}/>
            </Routes>
        </Router>
    )
}

