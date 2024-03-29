import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";

import Landing from "./Landing/Landing";
import Login from "./Login/Login";
import RestaurantRegistration from "./Restaurant/RestaurantRegistration";
import CityRegistration from "./City/CityRegistration";
import DashMenu from "./Menu/DashMenu";
import MenuRegistration from "./Menu/MenuRegistration";
import RestaurantListCity from "./Restaurant/RestaurantListCity";
import DashOrder from "./Order/DashOrder";
import CheckoutOrdine from "./Order/CheckoutOrdine";
import CronologiaOrdine from "./Order/CronologiaOrdine";
import ProcessingOrder from "./Order/ProcessingOrder";
import LandingOrder from "./Order/LandingOrder";
import OrderDetails from "./Order/OrderDetails";

export default function Routing(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/restaurantregistration" element={<RestaurantRegistration/>}/>
                <Route path="/cityregistration" element={<CityRegistration/>}/>
                <Route path="/dashmenu" element={<DashMenu/>}/>
                <Route path="/menuregistration" element={<MenuRegistration/>}/>
                <Route path="/restaurantlistcity" element={<RestaurantListCity/>}/>
                <Route path="/dashorder" element={<DashOrder/>}/>
                <Route path="/checkoutordine" element={<CheckoutOrdine/>}/>
                <Route path="/cronologiaordine" element={<CronologiaOrdine/>}/>
                <Route path="/processingorder" element={<ProcessingOrder/>}/>
                <Route path="/orderdetails" element={<OrderDetails/>}/>
                <Route path="/landingorder/:order_id/:token" element={<LandingOrder/>}/>
            </Routes>
        </Router>
    )
}

