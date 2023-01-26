import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {getCities, getRestaurants, getUserInfo} from '../Database/DBacmeat';
import '../css/Dash.css'
import RestaurantList_city from "./RestaurantList_city";
import Container from "react-bootstrap/Container";
import {forEach} from "react-bootstrap/ElementChildren";

export default function DashUtente(){
    console.log("Sono in Dashboard");
    const {token, setToken} = useAppContext();
    const [user, setUser] = useState(null);
    const [city, setCity] = useState();
    const [cityList, setCityList] = useState([]);
    const [citySel, setCitySel] = useState(false);
    const [restaurantsList, setRestaurantsList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            getCity();
            getRest();
        }
    }, [])

    async function getCity(){
        let resp = await getCities();
        if (resp.status === 200) {
            let values = await resp.json();
            setCityList(values);
        }
    }

    async function getInfo() {
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json()
            setUser(values)
        }
    }

    async function getRest(){
        let rest = await getRestaurants();
        if (rest.status === 200) {
            let list = await rest.json()
            setRestaurantsList(list)
        }
    }

    function cleanRestaurants(restaurants, cityId){
        const newList = []
        Object.entries(restaurants).forEach((entry) => {
            const [key, value] = entry;
            console.log(value.city_id)
            if(value.city_id === cityId){
                newList.push(value);
            }
            setRestaurantsList(newList);
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        cleanRestaurants(restaurantsList, city);
        setCity(city);
        setCitySel(true);
    }

    return( (citySel === false) ? (

        <div className='container'>
        {user ? (
            <h2>Salve {user.name}.</h2>
        ) : (<div>...</div>)}
        <h2>Effettua subito un ordine!</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group mt-4">
                <label>Seleziona la tua città</label>
                <select className="form-select" aria-label="Default select example" onChange={e => setCity(e.target.value)}>
                    {cityList.map((e, key) => {
                        return <option key={key} value={e.id}>{e.name}</option>;
                    })}
                </select>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Invia
              </button>
            </div>
        </form>
    </div>
    ) : (
        <Container>
            <RestaurantList_city
                city = {city}
            />
        </Container>
        ));
}