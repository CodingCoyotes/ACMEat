import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {
    getMenu,
    getRestaurant,
    getUserInfo,
    modifyMenu,
    registerNewMenu,
    registerNewRestaurant
} from "../Database/DBacmeat";
import classNames from "classnames";
import '../css/Dash.css'


export default function MenuRegistration() {
    console.log("Sono in MenuRegistration");
    const [user, setUser] = useState(null);
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();
    const [menuId, setMenuId] = useState("");
    const [name, setName] = useState();
    const [restaurantId, setRestaurantId] = useState(null);
    const [prezzo, setPrezzo] = useState();
    const [addIngrediente, setAddIngrediente] = useState(false);
    const [listIngredienti, setListIngredienti] = useState([]);
    const [nomeIngrediente, setNomeIngrediente] = useState("");
    const [descrizioneIngrediente, setDescrizioneIngrediente] = useState("");

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();

        }
        getRestaurantId();
        getMenuId();
    }, [])


    function getMenuId(){
        if (localStorage.getItem("id_menu")) {
            let menuId = localStorage.getItem("id_menu")
            //setRestaurantId(restId)
            console.log("getmenuid")
            console.log(menuId)
            setMenuId(menuId);
            getMen(menuId);
        }
    }

    async function getMen(menuId){
        let response = await getMenu(menuId);
        if (response.status === 200) {
            let values = await response.json();
            updateData(values);
        }
    }

    function getRestaurantId(){
        if (localStorage.getItem("id_restaurant") &&  restaurantId== null) {
            let restId = localStorage.getItem("id_restaurant")
            setRestaurantId(restId);
        }
    }

    async function getInfo() {
        console.debug(token)
        let response = await getUserInfo(token);
        if (response.status === 200) {
            let values = await response.json();
            setUser(values);
        }
    }

    function updateData(menu){
        setName(menu.name);
        setPrezzo(menu.cost);
        setListIngredienti(menu.contents);
    }

    const handleSubmit = async e => {
        e.preventDefault();
        console.log("sono in handlersub")
        if(localStorage.getItem("id_menu")) {
            console.log("ho il menu id")
            let restId = localStorage.getItem("id_menu")
            await editMenu(restId);
        }
        else {
            console.log("non ho il menu id")
            await newMenu();
        }
    }

    async function newMenu(){
        const response = await registerNewMenu(restaurantId,{

            "name": name,
            "contents": listIngredienti,
            "cost": prezzo,
            "hidden": false,
            "restaurant_id": restaurantId

        }, token);
        if (response.status === 200) {
            let values = await response.json()
        }
        else {
            navigate("/dashmenu");
        }
    }

    async function editMenu(menuId){
        const response = await modifyMenu(token,{

            "name": name,
            "contents": listIngredienti,
            "cost": prezzo,
            "hidden": false,
            "restaurant_id": restaurantId

        }, menuId);
        if (response.status === 200) {
            let values = await response.json()
        }
        else {
            navigate("/dashmenu");
        }
    }

    function handleAggiungiIngrediente (e) {
        e.preventDefault();
        setAddIngrediente(true);
        console.log(listIngredienti);
    }

    function handleAddIngredienteToList (e) {
        e.preventDefault();
        listIngredienti.push({
            "name": nomeIngrediente,
            "desc": descrizioneIngrediente
        })
        setAddIngrediente(false);
        console.log(listIngredienti);
    }

    function handleCanIngredienteToList(e) {
        e.preventDefault();
        setAddIngrediente(false);
        console.log(listIngredienti);
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Registra un nuovo menu</h3>
                    <div className="form-group mt-3">
                        <h5>Nome menu</h5>
                        <input
                            type="text"
                            className="form-control mt-1"
                            value={name}
                            placeholder="Inserisci il nome del menù"
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <h5>Prezzo</h5>
                        <input
                            type="number"
                            value={prezzo}
                            className="form-control mt-1"
                            placeholder="5"
                            onChange={e => setPrezzo(e.target.value)}
                        />
                    </div>
                    {(listIngredienti.length > 0)? (
                        <div className="form-group mt-3">
                        <h5>Ingredienti</h5>
                    {listIngredienti.map(item => (
                        <div className="card">
                            <div className="card-body">
                                <label className="card-title">{item.name}</label>
                                <p className="card-text">{item.desc}</p>
                            </div>
                        </div>
                        ))}
                        </div>
                    ): (<div></div>)}
                    {(addIngrediente === false)?(
                        <div className="form-group mt-3">
                            <button onClick={handleAggiungiIngrediente} className="btn btn-secondary">
                                Aggiungi ingrediente
                            </button>
                        </div>
                    ): (
                        <div className="form-group mt-3">
                            <label>Nome ingrediente</label>
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Cheddar"
                                onChange={e => setNomeIngrediente(e.target.value)}
                            />
                            <label>Descrizione</label>
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Il cheddar è un formaggio.."
                                onChange={e => setDescrizioneIngrediente(e.target.value)}
                            />
                            <button onClick={handleAddIngredienteToList} className="btn btn-secondary">
                                +
                            </button>
                            <button onClick={handleCanIngredienteToList} className="btn btn-secondary">
                                x
                            </button>
                        </div>
                    )}
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Invia
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}