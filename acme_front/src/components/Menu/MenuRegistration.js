import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {
    getMenu,
    getUserInfo,
    modifyMenu,
    registerNewMenu,
} from "../Database/DBacmeat";
import '../css/Dash.css'
import {checkTodayAfterTen} from "../Utils/Utils";


export default function MenuRegistration() {
    const [user, setUser] = useState(null);
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [restaurantId, setRestaurantId] = useState("");
    const [prezzo, setPrezzo] = useState();
    const [addIngrediente, setAddIngrediente] = useState(false);
    const [listIngredienti, setListIngredienti] = useState([]);
    const [nomeIngrediente, setNomeIngrediente] = useState("");
    const [descrizioneIngrediente, setDescrizioneIngrediente] = useState("");
    const {state} = useLocation();


    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        else if (user===null){
            getInfo();
            getInfoMenu();
        }
    }, [])


    async function getInfoMenu(){
        console.log("getinfomenu")
        console.log(state)
        const {rest, menuId} = state;
        console.log("ho il restid")
        console.log(rest)
        setRestaurantId(rest);
        if(menuId !== null){
            console.log("ho il menuid")
            console.log(menuId)
            let response = await getMenu(menuId);
            if (response.status === 200) {
                let values = await response.json();
                console.log("menu")
                console.log(values)
                setName(values.name);
                setPrezzo(values.cost);
                setListIngredienti(values.contents);
                console.log("ho la lista ingredienti")
                console.log(values.contents)
            }
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

    const handleSubmit = async e => {
        e.preventDefault();
        console.log("sono in handlersub")
        console.log("ho il restid")
        console.log(restaurantId)
        if (state !== null) {
            const {rest, menuId} = state;
            console.log("ho il restid")
            console.log(rest)
            console.log("ho il token")
            console.log(token)
            let info = {
                "name": name,
                "contents": listIngredienti,
                "cost": prezzo,
                "hidden": false,
                "restaurant_id": restaurantId
            }
            console.log(info);
            if(menuId !== null){
                console.log("ho il menu id")
                const response = await modifyMenu(token,info, menuId);
                if (response.status === 200) {
                    let values = await response.json()
                    navigate("/dashmenu",{ state: { param: restaurantId }});
                }
            }
            else {
                console.log("non ho il menu id")
                const response = await registerNewMenu(restaurantId, info, token);
                if (!response.hasOwnProperty("error_code")) {
                    navigate("/dashmenu",{ state: { param: restaurantId }});
                }
                else{
                    alert("Errore, verificare i dati.")
                }
            }
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
        <div className='container'>
            <div>
                <button type="button" className="btn btn-primary " onClick={event => {navigate("/dashmenu", { state: { param: restaurantId }})}}>
                    Indietro
                </button>
            </div>
            <form className="Auth-form-content card" onSubmit={handleSubmit}>
                    <h3 className="Auth-form-title">{(name === "")?(<div>Registra un nuovo menu</div>):(<div>Modifica il menu</div>)}</h3>
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
                    {
                        (addIngrediente === false)?(
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
                        )
                    }
                    {(checkTodayAfterTen()==false)?(
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Invia
                            </button>
                        </div>
                    ):(<div className="red_text">Non puoi modificare i menu dopo le 10 di mattina</div>)}
            </form>
        </div>
    )
}